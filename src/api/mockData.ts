import {HospitalCategory} from "@/types/api";
import {Department, Hospital, Message} from "@/types/models";

export const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: '北京协和医院',
        level: '三级甲等',
        address: '北京市东城区帅府园一号',
        latitude: 39.9138,
        longitude: 116.4124,
        rating: 4.8,
        distance: 2.1,
        tags: ['综合医院', '三甲医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '2',
        name: '北京大学第一医院',
        level: '三级甲等',
        address: '北京市西城区西什库大街8号',
        latitude: 39.9289,
        longitude: 116.3744,
        rating: 4.7,
        distance: 3.2,
        tags: ['综合医院', '教学医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '3',
        name: '北京同仁医院',
        level: '三级甲等',
        address: '北京市东城区东交民巷1号',
        latitude: 39.9067,
        longitude: 116.4073,
        rating: 4.6,
        distance: 1.8,
        tags: ['眼科专科', '三甲医院'],
        description: '北京协和医院是中国最早的西医院之一，是一所集医疗、教学、科研为一体的大型综合性医院。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    }
];

export const mockCategories: HospitalCategory[] = [
    {
        id: '1',
        name: '综合医院',
        hospitals: [
            mockHospitals[0],
            mockHospitals[1]
        ]
    },
    {
        id: '2',
        name: '专科医院',
        hospitals: [
            mockHospitals[2]
        ]
    }
];

export const mockDepartments: Department[] = [
    {
        id: '1',
        hospitalId: '1',
        name: '内科',
        description: '诊治内科常见病、多发病'
    },
    {
        id: '2',
        hospitalId: '2',
        name: '外科',
        description: '开展各类手术治疗'
    },
    {
        id: '3',
        hospitalId: '3',
        name: '儿科',
        description: '专注儿童健康'
    },
    // Add more mock departments as needed
];

export const mockFavorites: Hospital[] = [mockHospitals[0], mockHospitals[2]];


export const mockMessages: Message[] = [
    {
        id: '1',
        type: 'assistant',
        content: '您好！我是您的智能医疗助手。请描述您的症状，我将为您推荐合适的医院。\n\n您可以这样描述：\n"我最近感觉胃部不适，经常出现胃痛和反酸..."',
        timestamp: Date.now() - 1000
    }
];