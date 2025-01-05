//src/api/assistant.ts
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

// Mock聊天记录
const mockMessages: Message[] = [welcomeMessage];

// 模拟AI响应生成
const generateAIResponse = (userInput: string): Message => {
    // 模拟处理用户输入，抽取关键词
    const keywords = userInput.includes('胃') ? ['消化科', '胃病']
        : userInput.includes('心') ? ['心内科', '心血管']
            : userInput.includes('骨') ? ['骨科', '关节']
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
};

// API 实现
export const getChatHistory = async (): Promise<Message[]> => {
    if (config.useMock) {
        return mockMessages;
    }
    const response = await http.get<Message[]>('/api/v1/assistant/history');
    return response.data;
};

export const sendMessage = async (content: string): Promise<Message> => {
    if (config.useMock) {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 1000));
        const response = generateAIResponse(content);
        // mockMessages.push(response);
        return response;
    }
    const response = await http.post<Message>('/api/v1/assistant/message', { content });
    return response.data;
};