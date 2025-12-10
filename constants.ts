import { BrainRegionData } from './types';

const createDefaultSections = (context: string) => [
  { 
    id: 'function', 
    title: 'Function / 功能介绍', 
    content: `Primary physiological functions of this region. \n${context}`,
    images: []
  },
  { 
    id: 'diseases', 
    title: 'Related Diseases / 相关疾病', 
    content: 'Pathologies, clinical conditions, or disorders associated with damage to this area.',
    images: []
  },
  { 
    id: 'behavior', 
    title: 'Behavioral Impact / 行为影响', 
    content: 'How this region influences daily behavior, personality, and emotional regulation.',
    images: []
  },
  { 
    id: 'criminal_psych', 
    title: 'Criminal Psychology / 犯罪心理学关联', 
    content: 'Associations with aggression, impulse control, anti-social behavior, or lack of empathy.',
    images: []
  },
  { 
    id: 'cases', 
    title: 'Classic Cases / 经典案例', 
    content: 'Famous medical cases (e.g., Phineas Gage) relevant to this specific brain region.',
    images: []
  }
];

export const INITIAL_BRAIN_REGIONS: BrainRegionData[] = [
  {
    id: 'frontal-lobe',
    nameEn: 'Frontal Lobe',
    nameZh: '额叶',
    color: '#FF6B6B',
    position: [0, 0.5, 1.2],
    scale: [1.4, 1.2, 1.4],
    sections: createDefaultSections('Executive functions, decision making, voluntary motor control.')
  },
  {
    id: 'parietal-lobe',
    nameEn: 'Parietal Lobe',
    nameZh: '顶叶',
    color: '#4ECDC4',
    position: [0, 1.5, -0.5],
    scale: [1.3, 1, 1.5],
    sections: createDefaultSections('Sensory perception, spatial awareness, navigation.')
  },
  {
    id: 'temporal-lobe',
    nameEn: 'Temporal Lobe',
    nameZh: '颞叶',
    color: '#FFE66D',
    position: [1.2, -0.2, 0], 
    scale: [0.8, 1, 1.8],
    sections: createDefaultSections('Auditory processing, language comprehension, memory formation.')
  },
  {
    id: 'occipital-lobe',
    nameEn: 'Occipital Lobe',
    nameZh: '枕叶',
    color: '#1A535C',
    position: [0, 0.2, -2],
    scale: [1.1, 1, 1.1],
    sections: createDefaultSections('Visual processing center.')
  },
  {
    id: 'cerebellum',
    nameEn: 'Cerebellum',
    nameZh: '小脑',
    color: '#F7FFF7',
    position: [0, -1.2, -1.8],
    scale: [1.2, 0.8, 1],
    sections: createDefaultSections('Motor control, coordination, precision, timing.')
  },
  {
    id: 'brainstem',
    nameEn: 'Brainstem',
    nameZh: '脑干',
    color: '#8A817C',
    position: [0, -1.8, -0.2],
    scale: [0.6, 1.5, 0.6],
    sections: createDefaultSections('Basic life functions: heart rate, breathing, sleeping.')
  },
  {
    id: 'hippocampus',
    nameEn: 'Hippocampus',
    nameZh: '海马体',
    color: '#9D4EDD',
    position: [0, -0.2, 0],
    scale: [0.5, 0.4, 0.8],
    sections: createDefaultSections('Memory consolidation, spatial navigation, emotional regulation.')
  }
];