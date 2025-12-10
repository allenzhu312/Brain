export interface ImageItem {
  id: string;
  url: string;
  caption: string;
}

export interface Section {
  id: string;
  title: string;
  content: string;
  images: ImageItem[];
}

export interface BrainRegionData {
  id: string;
  nameEn: string;
  nameZh: string;
  sections: Section[];
  color: string;
  position: [number, number, number]; // Used for procedural placement
  scale: [number, number, number]; // Used for procedural scaling
}

export type Language = 'en' | 'zh';

export interface InteractionState {
  hoveredPartId: string | null;
  selectedPartId: string | null;
}

export interface AppState {
  regions: BrainRegionData[];
  language: Language;
  darkMode: boolean;
}