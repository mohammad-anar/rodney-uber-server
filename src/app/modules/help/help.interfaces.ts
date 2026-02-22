export interface IHelpRequest {
  fullName: string;
  email: string;
  description: string;
  helpAmount: number;
  supportingDocument?: string[];

  createdAt?: Date;
  updatedAt?: Date;
}
export enum HelpRequestStatus {
  APPROVED = 'Approved',
  REJECTED = 'Rejected',
  UNDER_REVIEW = 'UnderReview',
}