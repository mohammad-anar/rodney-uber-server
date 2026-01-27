export interface IProduct {
  title: string;
  description: string;
  category: string;
  image: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
