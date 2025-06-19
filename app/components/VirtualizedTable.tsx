'use client';

import React, { useState, useRef } from 'react';
import { LoanApplication } from '../types/loans';

interface VirtualizedTableProps {
  data: LoanApplication[];
  rowHeight?: number;
  visibleRows?: number;
  header: React.ReactNode;
  renderRow: (loan: LoanApplication, index: number) => React.ReactNode;
  className?: string;
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  data,
  rowHeight = 50,
  visibleRows = 10,
  header,
  renderRow,
  className = '',
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const totalHeight = data.length * rowHeight;

  const endIndex = Math.min(startIndex + visibleRows, data.length - 1);

  const handleScroll = () => {
    if (!tableRef.current) return;

    const scrollTop = tableRef.current.scrollTop;
    const newStartIndex = Math.floor(scrollTop / rowHeight);

    if (newStartIndex !== startIndex) {
      setStartIndex(newStartIndex);
    }
  };

  const visibleData = data.slice(startIndex, endIndex + 1);

  const offset = startIndex * rowHeight;

  return (
    <div
      ref={tableRef}
      className={`overflow-y-auto ${className}`}
      style={{ height: `${visibleRows * rowHeight}px` }}
      onScroll={handleScroll}
    >
      <div style={{ height: `${totalHeight}px`, position: 'relative' }}>
        <div style={{ position: 'sticky', top: 0, zIndex: 10 }}>{header}</div>

        <div style={{ position: 'absolute', top: `${offset}px`, width: '100%' }}>
          {visibleData.map((loan, index) => (
            <div key={loan.id} style={{ height: `${rowHeight}px` }}>
              {renderRow(loan, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
