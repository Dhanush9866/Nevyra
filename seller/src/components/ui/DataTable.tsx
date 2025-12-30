import React from 'react';
import { cn } from '@/lib/utils';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  isLoading?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({ 
  columns, 
  data, 
  keyExtractor, 
  emptyMessage = 'No data available',
  isLoading = false,
  onRowClick
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-border p-12">
        <div className="empty-state">
          <p className="empty-state-description">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key} className={col.className}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr 
                key={keyExtractor(item)}
                onClick={() => onRowClick?.(item)}
                className={cn(onRowClick && "cursor-pointer")}
              >
                {columns.map((col) => (
                  <td key={col.key} className={col.className}>
                    {col.render 
                      ? col.render(item) 
                      : (item as Record<string, unknown>)[col.key] as React.ReactNode
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
