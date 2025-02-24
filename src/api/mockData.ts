import {HospitalCategory} from "@/types/api";
import {Department, Hospital, Message} from "@/types/models";

export const mockHospitals: Hospital[] = [
    {
        id: '1',
        name: '毕节市第一人民医院',
        level: '三级甲等',
        address: '贵州省毕节市七星关区久长路',
        latitude: 27.3019,
        longitude: 105.2877,
        rating: 4.7,
        distance: 2.1,
        tags: ['综合医院', '三甲医院', '省级医院'],
        description: '毕节市第一人民医院是西部地区重要的综合性医院，拥有先进的医疗设备和专业的医疗团队，为当地居民提供全面的医疗服务。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '2',
        name: '毕节地区中医院',
        level: '二级甲等',
        address: '贵州省毕节市七星关区桂花路',
        latitude: 27.3044,
        longitude: 105.2902,
        rating: 4.5,
        distance: 3.2,
        tags: ['中医医院', '地区医院', '传统医疗'],
        description: '专注于中医药传统治疗和现代医疗技术相结合的综合性中医医院，致力于发扬中医药文化，提供独特的诊疗服务。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '3',
        name: '毕节市妇幼保健院',
        level: '二级甲等',
        address: '贵州省毕节市七星关区开发区',
        latitude: 27.2998,
        longitude: 105.2933,
        rating: 4.6,
        distance: 1.8,
        tags: ['妇科', '儿科', '专科医院', '妇幼健康'],
        description: '专注于妇女儿童健康的专科医院，提供全面的妇科和儿科医疗服务，是当地妇女儿童健康的守护者。',
        workingHours: '周一至周五 8:00-17:00，周六周日 8:00-12:00'
    },
    {
        id: '4',
        name: '毕节市第二人民医院',
        level: '二级乙等',
        address: '贵州省毕节市大方县城关镇',
        latitude: 27.1743,
        longitude: 105.6122,
        rating: 4.4,
        distance: 4.5,
        tags: ['综合医院', '县级医院', '急救中心'],
        description: '大方县重要的医疗机构，提供全面的医疗服务，是当地群众看病就医的主要选择。',
        workingHours: '24小时急诊，普通门诊 8:00-18:00'
    },
    {
        id: '5',
        name: '毕节市骨科医院',
        level: '二级乙等',
        address: '贵州省毕节市七星关区',
        latitude: 27.3078,
        longitude: 105.2941,
        rating: 4.5,
        distance: 2.7,
        tags: ['专科医院', '骨科', '创伤治疗'],
        description: '专业的骨科医疗机构，拥有先进的骨科诊疗技术，擅长骨科疾病和创伤治疗。',
        workingHours: '周一至周五 8:00-17:00，周六 8:00-12:00'
    },
    {
        id: '6',
        name: '毕节市中医骨伤医院',
        level: '二级乙等',
        address: '贵州省毕节市七星关区',
        latitude: 27.3033,
        longitude: 105.2912,
        rating: 4.6,
        distance: 3.0,
        tags: ['中医', '骨科', '中西医结合'],
        description: '结合中医传统疗法和现代骨科治疗技术，为患者提供独特的骨科诊疗服务。',
        workingHours: '周一至周五 8:00-17:00，周六 8:00-12:00'
    },
    {
        id: '7',
        name: '毕节市传染病医院',
        level: '二级乙等',
        address: '贵州省毕节市七星关区',
        latitude: 27.2988,
        longitude: 105.2954,
        rating: 4.3,
        distance: 4.2,
        tags: ['传染病', '公共卫生', '疫情防控'],
        description: '专门应对传染性疾病的医疗机构，在疫情防控中发挥重要作用，提供专业的传染病诊疗服务。',
        workingHours: '24小时急诊，普通门诊 8:00-18:00'
    }
];

export const mockCategories: HospitalCategory[] = [
    {
        id: '1',
        name: '综合医院',
        hospitals: [
            mockHospitals[0],
            mockHospitals[3]
        ]
    },
    {
        id: '2',
        name: '专科医院',
        hospitals: [
            mockHospitals[2],
            mockHospitals[4],
            mockHospitals[5]
        ]
    },
    {
        id: '3',
        name: '中医医院',
        hospitals: [
            mockHospitals[1],
            mockHospitals[5]
        ]
    },
    {
        id: '4',
        name: '专科和特殊医院',
        hospitals: [
            mockHospitals[6]
        ]
    }
];

export const mockDepartments: Department[] = [
    {
        id: '1',
        hospitalId: '1',
        name: '内科',
        description: '诊治内科常见病、多发病，包括心血管、呼吸、消化等系统疾病'
    },
    {
        id: '2',
        hospitalId: '1',
        name: '外科',
        description: '开展各类手术治疗，涵盖普通外科、神经外科等专业'
    },
    {
        id: '3',
        hospitalId: '2',
        name: '中医科',
        description: '传统中医诊疗和养生，包括中药治疗、针灸、推拿等'
    },
    {
        id: '4',
        hospitalId: '3',
        name: '妇产科',
        description: '提供妇女生殖健康、孕产期保健等专业服务'
    },
    {
        id: '5',
        hospitalId: '3',
        name: '儿科',
        description: '专业儿童疾病诊疗，从新生儿到青少年全年龄段服务'
    },
    {
        id: '6',
        hospitalId: '4',
        name: '急诊科',
        description: '24小时提供急危重症救治服务'
    },
    {
        id: '7',
        hospitalId: '5',
        name: '骨科',
        description: '骨科疾病诊断与治疗，包括创伤骨科、关节疾病等'
    },
    {
        id: '8',
        hospitalId: '6',
        name: '中医骨伤科',
        description: '结合中医传统疗法和现代骨科技术的特色诊疗'
    },
    {
        id: '9',
        hospitalId: '7',
        name: '传染病科',
        description: '传染性疾病诊断、隔离和治疗'
    }
];

export const mockFavorites: Hospital[] = [mockHospitals[0], mockHospitals[2], mockHospitals[4]];

export const mockMessages: Message[] = [
    {
        id: '1',
        type: 'assistant',
        content: '您好！我是您的智能医疗助手。请描述您的症状，我将为您推荐合适的医院。\n\n您可以这样描述：\n"我最近感觉身体不适，想找一家附近的医院看诊..."',
        timestamp: Date.now() - 1000
    },
    {
        id: '2',
        type: 'user',
        content: '我最近膝盖总是隐隐作痛，不知道该找哪家医院看看。',
        timestamp: Date.now() - 500
    },
    {
        id: '3',
        type: 'assistant',
        content: '根据您描述的症状，建议您可以考虑毕节市骨科医院或毕节市中医骨伤医院。这两家医院都专门从事骨科疾病的诊疗，可以为您提供专业的诊断和治疗建议。',
        timestamp: Date.now()
    }
];