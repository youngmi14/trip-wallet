import { memo } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Expense, CurrencyCode, Category } from '@/types'
import { CATEGORY_COLORS, formatAmount } from '@/types'

interface ExpenseItemProps {
  expense: Expense
  currency: CurrencyCode
  onEdit: (expense: Expense) => void
  onDelete: (id: string) => void
}

const CATEGORY_STYLE: Record<Category, string> = {
  '식비': 'bg-orange-100 text-orange-700 border-orange-200',
  '교통': 'bg-blue-100 text-blue-700 border-blue-200',
  '숙박': 'bg-purple-100 text-purple-700 border-purple-200',
  '쇼핑': 'bg-pink-100 text-pink-700 border-pink-200',
  '관광/입장료': 'bg-emerald-100 text-emerald-700 border-emerald-200',
  '기타': 'bg-gray-100 text-gray-600 border-gray-200',
}

export const ExpenseItem = memo(function ExpenseItem({
  expense,
  currency,
  onEdit,
  onDelete,
}: ExpenseItemProps) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-muted/50 group transition-colors">
      <span
        className="w-1.5 h-6 rounded-full shrink-0"
        style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
      />
      <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold whitespace-nowrap shrink-0 ${CATEGORY_STYLE[expense.category]}`}>
        {expense.category}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm truncate">{expense.place}</p>
        {expense.memo && (
          <p className="text-xs text-muted-foreground truncate">{expense.memo}</p>
        )}
      </div>
      <span className="font-semibold text-sm tabular-nums shrink-0">
        {formatAmount(expense.amount, currency)}
      </span>
      <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(expense)}
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(expense.id)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
})
