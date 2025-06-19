'use client';

import React, { useState, useEffect } from 'react';
import { VirtualizedTable } from './components/VirtualizedTable';
import { FilterDropdown } from './components/FilterDropdown';
import { LoanApplication, LoanStatus, FilterOptions } from './types/loans';
import { useDebounce } from './hooks/useDebounce';

const statusOptions: { value: LoanStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'defaulted', label: 'Defaulted' },
  { value: 'paid', label: 'Paid' },
];

export default function LoanDashboard() {
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [totalLoans, setTotalLoans] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(100); // Larger page size for virtualized table

  // Filter states
  const [filters, setFilters] = useState<FilterOptions>({});
  const debouncedFilters = useDebounce(filters, 500);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      if (debouncedFilters.status) {
        queryParams.append('status', debouncedFilters.status);
      }

      if (debouncedFilters.minAmount !== undefined) {
        queryParams.append('minAmount', debouncedFilters.minAmount.toString());
      }

      if (debouncedFilters.maxAmount !== undefined) {
        queryParams.append('maxAmount', debouncedFilters.maxAmount.toString());
      }

      if (debouncedFilters.applicantName) {
        queryParams.append('applicantName', debouncedFilters.applicantName);
      }

      const response = await fetch(`/api/loans?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch loans');
      }

      const data = await response.json();
      setLoans(data.loans);
      setTotalLoans(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching loans:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [page, pageSize, debouncedFilters]);

  const handleFilterChange = (newFilters: Partial<FilterOptions>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Loan Applications Dashboard</h1>

      {/* Filters */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <FilterDropdown
            options={statusOptions}
            value={filters.status || ''}
            onChange={(status) => handleFilterChange({ status: status || undefined })}
            placeholder="All statuses"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Min Amount</label>
          <input
            type="number"
            placeholder="Min amount"
            className="p-2 border rounded w-full"
            value={filters.minAmount || ''}
            onChange={(e) =>
              handleFilterChange({
                minAmount: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Max Amount</label>
          <input
            type="number"
            placeholder="Max amount"
            className="p-2 border rounded w-full"
            value={filters.maxAmount || ''}
            onChange={(e) =>
              handleFilterChange({
                maxAmount: e.target.value ? parseInt(e.target.value) : undefined,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Applicant Name</label>
          <input
            type="text"
            placeholder="Search names"
            className="p-2 border rounded w-full"
            value={filters.applicantName || ''}
            onChange={(e) =>
              handleFilterChange({
                applicantName: e.target.value || undefined,
              })
            }
          />
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        {loading && <div className="text-blue-500">Loading...</div>}
        {error && <div className="text-red-500">Error: {error}</div>}
        {!loading && !error && (
          <div className="text-gray-600">
            Showing {loans.length} of {totalLoans} loans
          </div>
        )}
      </div>

      {/* Virtualized Table */}
      <div className="border rounded-lg overflow-hidden">
        <VirtualizedTable
          data={loans}
          rowHeight={60}
          visibleRows={10}
          header={
            <div className="grid grid-cols-12 gap-4 p-3 bg-gray-100 font-semibold">
              <div className="col-span-2">Applicant</div>
              <div className="col-span-1">Amount</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-2">Date</div>
              <div className="col-span-2">Purpose</div>
              <div className="col-span-1">Credit Score</div>
              <div className="col-span-1">Term (mos)</div>
              <div className="col-span-2">Email</div>
            </div>
          }
          renderRow={(loan, index) => (
            <div
              className={`grid grid-cols-12 gap-4 p-3 border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
            >
              <div className="col-span-2">{loan.applicantName}</div>
              <div className="col-span-1">{formatCurrency(loan.amount)}</div>
              <div className="col-span-1">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    loan.status === 'approved'
                      ? 'bg-green-100 text-green-800'
                      : loan.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : loan.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : loan.status === 'defaulted'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {loan.status}
                </span>
              </div>
              <div className="col-span-2">{formatDate(loan.applicationDate)}</div>
              <div className="col-span-2">{loan.purpose}</div>
              <div className="col-span-1">{loan.creditScore}</div>
              <div className="col-span-1">{loan.loanTerm}</div>
              <div className="col-span-2 text-sm text-gray-600 truncate">{loan.applicantEmail}</div>
            </div>
          )}
        />
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div>Page {page}</div>

        <button
          onClick={() => setPage((p) => p + 1)}
          disabled={loans.length < pageSize || loading}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
