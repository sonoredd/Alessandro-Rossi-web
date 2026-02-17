
export interface VideoProject {
  id: string;
  url: string;
  title: string;
}

export interface PortfolioData {
  name: string;
  role: string;
  bio: string;
  email: string;
  linkedin: string;
  github: string;
  projects: VideoProject[];
  profileImage: string | null;
  logoUrl: string | null;
}

export enum Section {
  HERO = 'hero',
  WORK = 'work',
  ABOUT = 'about',
  CONTACT = 'contact'
}
