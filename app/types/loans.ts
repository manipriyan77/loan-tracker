export type LoanStatus = 'pending' | 'approved' | 'rejected' | 'defaulted' | 'paid';

export interface LoanApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  amount: number;
  status: LoanStatus;
  applicationDate: Date;
  purpose: string;
  creditScore: number;
  loanTerm: number; // in months
}

export interface LoansApiResponse {
  loans: LoanApplication[];
  total: number;
}

export interface FilterOptions {
  status?: LoanStatus;
  minAmount?: number;
  maxAmount?: number;
  applicantName?: string;
}
