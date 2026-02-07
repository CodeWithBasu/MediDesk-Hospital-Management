import React from 'react';
import { cn } from '../../utils/cn';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TableColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
}

interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  onRowClick?: (item: T) => void;
  className?: string;
  pagination?: boolean; // simple mock pagination prop
}

export function Table<T>({ data, columns, onRowClick, className, pagination = true }: TableProps<T>) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50/50">
              {columns.map((column, index) => (
                <th
                  key={index}
                  className={cn(
                    "px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider",
                    column.className
                  )}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-50">
            {data.length === 0 ? (
                <tr>
                    <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400 text-sm">
                        No records found
                    </td>
                </tr>
            ) : (
                data.map((item, rowIndex) => (
                <tr
                    key={rowIndex}
                    onClick={() => onRowClick && onRowClick(item)}
                    className={cn(
                    "transition-all duration-200 group hover:bg-blue-50/50",
                    onRowClick ? "cursor-pointer" : ""
                    )}
                >
                    {columns.map((column, colIndex) => (
                    <td
                        key={colIndex}
                        className={cn("px-6 py-4 whitespace-nowrap text-sm text-gray-700", column.className)}
                    >
                        {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? (item[column.accessorKey] as React.ReactNode)
                        : null}
                    </td>
                    ))}
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Footer / Pagination Mock */}
      {pagination && data.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
                Showing <span className="font-bold text-gray-900">1</span> to <span className="font-bold text-gray-900">{Math.min(data.length, 10)}</span> of <span className="font-bold text-gray-900">{data.length}</span> results
            </span>
            <div className="flex items-center space-x-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-all" disabled>
                    <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>
                <div className="flex items-center space-x-1">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-600 text-white text-xs font-bold shadow-sm">1</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white text-gray-600 text-xs font-medium transition-all">2</button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-white text-gray-600 text-xs font-medium transition-all">3</button>
                </div>
                <button className="p-2 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all">
                    <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
            </div>
          </div>
      )}
    </div>
  );
}
