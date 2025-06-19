import { NextResponse } from 'next/server';
import { LoansApiResponse } from '../../types/loans';
import { generateMockLoans } from '../../utils/generateMockLoans';

const allLoans = generateMockLoans(50000);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  await new Promise((resolve) => setTimeout(resolve, 300));

  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);

  const status = searchParams.get('status');
  const minAmount = searchParams.get('minAmount');
  const maxAmount = searchParams.get('maxAmount');
  const applicantName = searchParams.get('applicantName');

  let filteredLoans = [...allLoans];

  if (status) {
    filteredLoans = filteredLoans.filter((loan) => loan.status === status);
  }

  if (minAmount) {
    filteredLoans = filteredLoans.filter((loan) => loan.amount >= parseInt(minAmount, 10));
  }

  if (maxAmount) {
    filteredLoans = filteredLoans.filter((loan) => loan.amount <= parseInt(maxAmount, 10));
  }

  if (applicantName) {
    filteredLoans = filteredLoans.filter((loan) =>
      loan.applicantName.toLowerCase().includes(applicantName.toLowerCase())
    );
  }

  const startIndex = (page - 1) * pageSize;
  const paginatedLoans = filteredLoans.slice(startIndex, startIndex + pageSize);

  const response: LoansApiResponse = {
    loans: paginatedLoans,
    total: filteredLoans.length,
  };

  return NextResponse.json(response);
}
