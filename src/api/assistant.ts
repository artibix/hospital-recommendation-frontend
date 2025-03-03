import { Message } from '@/types/models';
import { http } from '@/utils/request';
import { config } from './config';
import { mockHospitals } from './mockData';

// 初始欢迎消息
const welcomeMessage: Message = {
    id: '1',
    type: 'assistant',
    content: '您好！我是您的智能医疗助手。请详细描述您的症状，我将为您推荐最合适的医院。\n\n例如：\n"最近胃部不适，经常感觉胃痛和反酸，想找一家专业的消化科医院。"',
    timestamp: Date.now()
};

// 会话ID管理
let currentSessionId: string | null = null;

// API 实现
export const getChatHistory = async (): Promise<Message[]> => {
    if (config.useMock) {
        return [welcomeMessage];
    }
    try {
        // 使用当前会话ID（如果有）
        const url = '/api/v1/assistant/history' + (currentSessionId ? `?session_id=${currentSessionId}` : '');
        const response = await http.get<{messages: Message[], session_id: string}>(url);

        // 保存会话ID
        if (response.data && response.data.session_id) {
            currentSessionId = response.data.session_id;
        }

        return response.data.messages || [];
    } catch (error) {
        console.error('获取聊天历史失败:', error);
        return [welcomeMessage];
    }
};

export const sendMessage = async (content: string): Promise<Message> => {
    if (config.useMock) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 模拟处理用户输入，抽取关键词
        const keywords = content.includes('胃') ? ['消化科', '胃病']
            : content.includes('心') ? ['心内科', '心血管']
                : content.includes('骨') ? ['骨科', '关节']
                    : ['综合医院'];

        // 基于关键词筛选医院
        const recommendedHospitals = mockHospitals
            .filter(hospital => {
                return hospital.tags?.some(tag =>
                    keywords.some(keyword => tag.includes(keyword))
                );
            })
            .slice(0, 3);

        // 生成回复内容
        const response: Message = {
            id: Date.now().toString(),
            type: 'assistant',
            content: `根据您的描述，我建议您去以下几家专业医院就医：`,
            timestamp: Date.now(),
            recommendations: recommendedHospitals
        };

        return response;
    }

    try {
        // 发送消息，使用当前会话ID（如果有）
        const requestData = {
            content,
            session_id: currentSessionId
        };

        const response = await http.post<Message>('/api/v1/assistant/message', requestData);
        return response.data;
    } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
    }
};

// 流式响应
type MessageChunk = {
    type: 'start' | 'text' | 'recommendation' | 'end';
    message_id?: string;
    content?: string;
    hospital?: any;
    timestamp?: number;
};

type StreamResponseHandler = {
    onStart?: (messageId: string) => void;
    onText?: (chunk: string) => void;
    onRecommendation?: (hospital: any) => void;
    onEnd?: (messageId: string, timestamp: number) => void;
    onError?: (error: any) => void;
};

export const sendMessageStreaming = async (
    content: string,
    handlers: StreamResponseHandler
): Promise<void> => {
    if (config.useMock) {
        // 模拟流式响应
        const mockMessageId = Date.now().toString();

        // 开始事件
        if (handlers.onStart) {
            handlers.onStart(mockMessageId);
        }

        // 文本内容
        const responseText = "根据您的描述，我建议您去以下几家专业医院就医：";

        // 逐字发送
        for (let i = 0; i < responseText.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            if (handlers.onText) {
                handlers.onText(responseText[i]);
            }
        }

        // 模拟处理用户输入，抽取关键词
        const keywords = content.includes('胃') ? ['消化科', '胃病']
            : content.includes('心') ? ['心内科', '心血管']
                : content.includes('骨') ? ['骨科', '关节']
                    : ['综合医院'];

        // 基于关键词筛选医院
        const recommendedHospitals = mockHospitals
            .filter(hospital => {
                return hospital.tags?.some(tag =>
                    keywords.some(keyword => tag.includes(keyword))
                );
            })
            .slice(0, 3);

        // 发送医院推荐
        for (const hospital of recommendedHospitals) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (handlers.onRecommendation) {
                handlers.onRecommendation(hospital);
            }
        }

        // 结束事件
        if (handlers.onEnd) {
            handlers.onEnd(mockMessageId, Date.now());
        }

        return;
    }

    try {
        // 发送请求并获取完整响应
        const requestData = {
            content,
            session_id: currentSessionId
        };

        // 不再使用SSE，直接获取完整响应
        const response = await http.post('/api/v1/assistant/stream', requestData);
        const responseData = response.data;

        // 获取消息ID、内容和推荐
        const messageId = responseData.message_id;
        const messageContent = responseData.content;
        const recommendations = responseData.recommendations || [];
        const timestamp = responseData.timestamp;

        // 模拟流式体验
        // 1. 开始事件
        if (handlers.onStart) {
            handlers.onStart(messageId);
        }

        // 2. 逐字显示文本
        for (let i = 0; i < messageContent.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 50));
            if (handlers.onText) {
                handlers.onText(messageContent[i]);
            }
        }

        // 3. 逐个显示推荐
        for (const hospital of recommendations) {
            await new Promise(resolve => setTimeout(resolve, 500));
            if (handlers.onRecommendation) {
                handlers.onRecommendation(hospital);
            }
        }

        // 4. 结束事件
        if (handlers.onEnd) {
            handlers.onEnd(messageId, timestamp);
        }
    } catch (error) {
        console.error('流式发送失败:', error);
        if (handlers.onError) {
            handlers.onError(error);
        }
        throw error;
    }
};