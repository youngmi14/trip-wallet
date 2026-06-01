import { useState, useEffect } from 'react'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import type { Expense, Category } from '@/types'
import { CATEGORIES } from '@/types'

interface ExpenseFormProps {
  open: boolean
  onClose: () => void
  onSubmit: (expense: Omit<Expense, 'id'>) => void
  initialData?: Expense
}

const todayStr = () => new Date().toISOString().split('T')[0]

const defaultState = () => ({
  date: todayStr(),
  category: '식비' as Category,
  place: '',
  amount: '',
  memo: '',
})

export function ExpenseForm({ open, onClose, onSubmit, initialData }: ExpenseFormProps) {
  const [fields, setFields] = useState(defaultState())

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFields({
          date: initialData.date,
          category: initialData.category,
          place: initialData.place,
          amount: String(initialData.amount),
          memo: initialData.memo ?? '',
        })
      } else {
        setFields(defaultState())
      }
    }
  }, [open, initialData])

  const set = <K extends keyof typeof fields>(key: K, value: typeof fields[K]) =>
    setFields(prev => ({ ...prev, [key]: value }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseFloat(fields.amount)
    if (!fields.place.trim() || isNaN(amount) || amount <= 0) return
    onSubmit({
      date: fields.date,
      category: fields.category,
      place: fields.place.trim(),
      amount,
      memo: fields.memo.trim() || undefined,
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={o => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initialData ? '지출 수정' : '지출 추가'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="date">날짜</Label>
              <Input
                id="date"
                type="date"
                value={fields.date}
                onChange={e => set('date', e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>카테고리</Label>
              <Select value={fields.category} onValueChange={v => set('category', v as Category)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="place">사용처</Label>
            <Input
              id="place"
              placeholder="예) 라멘집, 지하철, 호텔"
              value={fields.place}
              onChange={e => set('place', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="amount">금액</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="any"
              placeholder="0"
              value={fields.amount}
              onChange={e => set('amount', e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="memo">메모 <span className="text-muted-foreground font-normal">(선택)</span></Label>
            <Textarea
              id="memo"
              placeholder="간단한 메모를 입력하세요"
              rows={2}
              value={fields.memo}
              onChange={e => set('memo', e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>취소</Button>
            <Button type="submit">{initialData ? '수정 완료' : '추가'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
