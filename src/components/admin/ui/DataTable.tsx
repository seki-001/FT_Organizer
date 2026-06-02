import { cn } from '@/lib/utils'

export interface DataTableColumn<T> {
  key: string
  header: string
  className?: string
  hideOnMobile?: boolean
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  rows: T[]
  rowKey: (row: T) => string
  emptyMessage?: string
  compact?: boolean
}

export default function DataTable<T>({
  columns,
  rows,
  rowKey,
  emptyMessage = 'No records yet.',
  compact,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <p className="px-6 py-8 text-center text-dark/40 text-sm">{emptyMessage}</p>
  }

  const py = compact ? 'py-3' : 'py-3.5'

  return (
    <>
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark/6 bg-muted/40">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-left px-5 py-3 text-[11px] font-semibold text-dark/50 uppercase tracking-wider',
                    col.hideOnMobile && 'hidden md:table-cell',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={rowKey(row)}
                className={cn(
                  'border-b border-dark/5 hover:bg-primary/[0.02] transition-colors',
                  i % 2 !== 0 && 'bg-muted/15',
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-5', py, col.hideOnMobile && 'hidden md:table-cell', col.className)}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col divide-y divide-dark/5">
        {rows.map((row) => (
          <div key={rowKey(row)} className="px-5 py-4 flex flex-col gap-2">
            {columns.slice(0, 3).map((col) => (
              <div key={col.key} className="flex justify-between gap-3 text-sm">
                <span className="text-dark/45 text-xs">{col.header}</span>
                <span className="text-dark text-right">{col.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}
