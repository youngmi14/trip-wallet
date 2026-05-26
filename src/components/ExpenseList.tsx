import { useMemo } from 'react'
import { Plus, Receipt } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ExpenseItem } from './ExpenseItem'
import type { Expense, CurrencyCode } from '@/types'

interface ExpenseListProps {
  expenses: Expense[]
  currency: CurrencyCode
  onAdd: () => void
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

function formatDateHeader(dateStr: string) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  })
}

export function ExpenseList({ expenses, currency, onAdd, onEdit, onDelete }: ExpenseListProps) {
  const grouped = useMemo(() => {
    const map = new Map<string, Expense[]>()
    expenses.forEach(expense => {
      const arr = map.get(expense.date) ?? []
      arr.push(expense)
      map.set(expense.date, arr)
    })
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a))
  }, [expenses])

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto min-h-0 pr-1">
        {grouped.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground py-16">
            <Receipt className="h-10 w-10 opacity-30" />
            <div className="text-center">
              <p className="text-sm font-medium">지출 내역이 없습니다</p>
              <p className="text-xs mt-1">아래 버튼으로 첫 지출을 추가해보세요</p>
            </div>
          </div>
        ) : (
          <div className="space-y-5 pb-2">
            {grouped.map(([date, items]) => (
              <div key={date}>
                <div className="flex items-center gap-2 px-3 mb-1">
                  <span className="text-xs font-semibold text-muted-foreground">
                    {formatDateHeader(date)}
                  </span>
                  <div className="flex-1 h-px bg-border" />
                </div>
                <div>
                  {items.map(expense => (
                    <ExpenseItem
                      key={expense.id}
                      expense={expense}
                      currency={currency}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="shrink-0 pt-3 mt-3 border-t">
        <Button onClick={onAdd} className="w-full gap-2">
          <Plus className="h-4 w-4" />
          지출 추가
        </Button>
      </div>
    </div>
  )
}
