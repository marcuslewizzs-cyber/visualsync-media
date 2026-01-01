export interface Service {
  id: string;
  title: string;
  description: string;
  category: 'Video' | 'Audio' | 'Photo' | 'Social';
  image: string;
}

export interface PortfolioItem {
  id: string;
  client: string;
  project: string;
  type: string;
  image: string;
  span?: string; // Tailwind col-span class
}

export enum UserRole {
  CLIENT = 'CLIENT',
  EDITOR = 'EDITOR',
  GUEST = 'GUEST'
}