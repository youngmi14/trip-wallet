import { useState, useCallback, lazy, Suspense } from 'react'
import { Wallet, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ExpenseList } from '@/components/ExpenseList'
import { ExpenseForm } from '@/components/ExpenseForm'
import { useExpenses } from '@/hooks/useExpenses'

const SummaryPanel = lazy(() => import('@/components/SummaryPanel'))

function SummaryPanelSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card h-32 animate-pulse" />
      <div className="rounded-xl border bg-card h-72 animate-pulse" />
    </div>
  )
}
import { CURRENCIES } from '@/types'
import type { Expense, CurrencyCode } from '@/types'

export default function App() {
  const {
    expenses, currency, setCurrency,
    addExpense, updateExpense, deleteExpense, resetExpenses,
  } = useExpenses()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>()

  const handleAdd = useCallback(() => {
    setEditingExpense(undefined)
    setIsFormOpen(true)
  }, [])

  const handleEdit = useCallback((expense: Expense) => {
    setEditingExpense(expense)
    setIsFormOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsFormOpen(false)
    setEditingExpense(undefined)
  }, [])

  const handleSubmit = useCallback((data: Omit<Expense, 'id'>) => {
    if (editingExpense) {
      updateExpense(editingExpense.id, data)
    } else {
      addExpense(data)
    }
  }, [editingExpense, updateExpense, addExpense])

  const selectedCurrency = CURRENCIES.find(c => c.code === currency)

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="shrink-0 h-14 border-b bg-card shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <h1 className="text-base font-bold tracking-tight">여행 지출 관리</h1>
          </div>

          <div className="flex items-center gap-2">
            <Select value={currency} onValueChange={v => setCurrency(v as CurrencyCode)}>
              <SelectTrigger className="w-48 h-8 text-xs" aria-label="통화 선택">
                <SelectValue>
                  <span className="font-semibold">{selectedCurrency?.symbol}</span>
                  {' '}
                  <span>{selectedCurrency?.code}</span>
                  {' '}
                  <span className="text-muted-foreground">— {selectedCurrency?.name}</span>
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map(curr => (
                  <SelectItem key={curr.code} value={curr.code}>
                    <span className="font-semibold">{curr.symbol}</span>
                    {' '}
                    <span className="font-medium">{curr.code}</span>
                    {' '}
                    <span className="text-muted-foreground">— {curr.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs">
                  <RotateCcw className="h-3.5 w-3.5" />
                  초기화
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>모든 지출 내역을 초기화할까요?</AlertDialogTitle>
                  <AlertDialogDescription>
                    등록된 모든 지출 내역이 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>취소</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={resetExpenses}
                  >
                    초기화
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </header>

      {/* Main: two-column layout */}
      <main className="flex-1 overflow-hidden py-5">
        <div className="max-w-[1200px] mx-auto px-5 h-full">
          <div className="grid grid-cols-[1fr_360px] gap-5 h-full">
            {/* Left: expense list */}
            <div className="bg-card rounded-xl border shadow-sm flex flex-col overflow-hidden">
              <div className="px-5 pt-5 pb-3 shrink-0">
                <h2 className="text-sm font-semibold">지출 목록</h2>
              </div>
              <div className="flex-1 overflow-hidden px-3 pb-4 min-h-0">
                <ExpenseList
                  expenses={expenses}
                  currency={currency}
                  onAdd={handleAdd}
                  onEdit={handleEdit}
                  onDelete={deleteExpense}
                />
              </div>
            </div>

            {/* Right: summary */}
            <div className="overflow-y-auto">
              <Suspense fallback={<SummaryPanelSkeleton />}>
                <SummaryPanel expenses={expenses} currency={currency} />
              </Suspense>
            </div>
          </div>
        </div>
      </main>

      <ExpenseForm
        open={isFormOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        initialData={editingExpense}
      />
    </div>
  )
}
