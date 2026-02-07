export interface IUser {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profilePhoto: string;
  address?: string;
  authentication?: any;
}
