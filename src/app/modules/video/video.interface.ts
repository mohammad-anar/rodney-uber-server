export interface IVideo {
  title: string;
  description?: string;
  thumbnail?: string;
  url: string;
  duration: number;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
