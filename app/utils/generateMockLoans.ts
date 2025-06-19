import { LoanApplication, LoanStatus } from '../types/loans';

const STATUSES: LoanStatus[] = ['pending', 'approved', 'rejected', 'defaulted', 'paid'];
const PURPOSES = ['Home', 'Car', 'Education', 'Business', 'Personal', 'Medical'];
const NAMES = [
  'Alex Johnson',
  'Maria Garcia',
  'James Smith',
  'Sarah Williams',
  'David Brown',
  'Emily Davis',
  'Michael Miller',
];

export function generateMockLoans(count: number): LoanApplication[] {
  const loans: LoanApplication[] = [];

  for (let i = 0; i < count; i++) {
    const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
    const applicantName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const email = `${applicantName.split(' ')[0].toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;

    loans.push({
      id: `loan-${10000 + i}`,
      applicantName,
      applicantEmail: email,
      amount: Math.floor(Math.random() * 90000) + 1000,
      status,
      applicationDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
      purpose: PURPOSES[Math.floor(Math.random() * PURPOSES.length)],
      creditScore: Math.floor(Math.random() * 350) + 300,
      loanTerm: Math.floor(Math.random() * 84) + 12,
    });
  }

  return loans;
}
