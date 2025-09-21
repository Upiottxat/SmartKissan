export interface User {
  id: string;
  username: string;
  name: string;
  language: string;
  location?: string;
  farmSize?: string;
  primaryCrop?: string;
  phone?: string;
  isVerified: boolean;
  isExpert: boolean;
  createdAt: Date;
}

export interface Weather {
  id: string;
  location: string;
  date: Date;
  temperature?: number;
  humidity?: number;
  rainfall?: number;
  condition?: string;
  icon?: string;
}

export interface MarketPrice {
  id: string;
  cropId?: string;
  location: string;
  price: string;
  unit?: string;
  change?: string;
  changePercent?: string;
  date?: Date;
}

export interface Advisory {
  id: string;
  userId?: string;
  title: string;
  content: string;
  type?: string;
  priority?: string;
  isRead: boolean;
  createdAt?: Date;
}

export interface CommunityPost {
  id: string;
  userId?: string;
  content: string;
  type?: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  createdAt?: Date;
  user?: {
    name: string;
    isExpert: boolean;
    isVerified: boolean;
  };
}

export interface UserProgress {
  id: string;
  userId?: string;
  tasksCompleted: number;
  totalTasks: number;
  badges?: string[];
  lastActivity?: Date;
}