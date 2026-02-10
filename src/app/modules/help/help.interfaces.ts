export interface IHelpRequest {
  fullName: string;
  email: string;
  description: string;
  helpAmount: number;
  supportingDocument?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}
