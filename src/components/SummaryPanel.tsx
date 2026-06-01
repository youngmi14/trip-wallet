import { useMemo, useCallback, useState, useEffect } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { TooltipProps } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Expense, CurrencyCode, Category } from '@/types'
import { CATEGORIES, CATEGORY_COLORS, formatAmount } from '@/types'

interface SummaryPanelProps {
  expenses: Expense[]
  currency: CurrencyCode
  exchangeRate: number | null
  onExchangeRateChange: (rate: number | null) => void
}

export default function SummaryPanel({ expenses, currency, exchangeRate, onExchangeRateChange }: SummaryPanelProps) {
  const { total, byCategory, chartData, activeCategories } = useMemo(() => {
    const byCategory: Partial<Record<Category, number>> = {}
    let total = 0
    for (const e of expenses) {
      byCategory[e.category] = (byCategory[e.category] ?? 0) + e.amount
      total += e.amount
    }
    const activeCategories = CATEGORIES.filter(cat => (byCategory[cat] ?? 0) > 0)
    const chartData = activeCategories.map(cat => ({
      name: cat,
      value: byCategory[cat]!,
      color: CATEGORY_COLORS[cat],
    }))
    return { total, byCategory, chartData, activeCategories }
  }, [expenses])

  const renderTooltip = useCallback(
    ({ active, payload }: TooltipProps<number, string>) => {
      if (!active || !payload?.length) return null
      const { name, value } = payload[0]
      if (value === undefined) return null
      return (
        <div className="bg-background border rounded-lg px-3 py-2 shadow-md text-xs space-y-0.5">
          <p className="font-semibold">{name}</p>
          <p>{formatAmount(value, currency)}</p>
          <p className="text-muted-foreground">
            {total > 0 ? Math.round((value / total) * 100) : 0}%
          </p>
        </div>
      )
    },
    [total, currency],
  )

  const [rateInput, setRateInput] = useState(() =>
    exchangeRate != null ? String(exchangeRate) : ''
  )
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState(false)

  useEffect(() => {
    setRateInput(exchangeRate != null ? String(exchangeRate) : '')
    setFetchError(false)
  }, [currency])

  const handleRateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setRateInput(raw)
    const val = parseFloat(raw)
    if (!isNaN(val) && val > 0) onExchangeRateChange(val)
    else if (raw === '') onExchangeRateChange(null)
  }

  const fetchCurrentRate = useCallback(async () => {
    setFetching(true)
    setFetchError(false)
    try {
      const res = await fetch(
        'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/krw.json'
      )
      if (!res.ok) throw new Error()
      const data = await res.json() as { krw: Record<string, number> }
      const krwToForeign = data.krw[currency.toLowerCase()]
      if (!krwToForeign) throw new Error()
      const krwPerUnit = Math.round((1 / krwToForeign) * 100) / 100
      onExchangeRateChange(krwPerUnit)
      setRateInput(String(krwPerUnit))
    } catch {
      setFetchError(true)
    } finally {
      setFetching(false)
    }
  }, [currency, onExchangeRateChange])

  const rateDisplayLabel = exchangeRate != null
    ? `1 ${currency} = ${Number.isInteger(exchangeRate) ? exchangeRate.toLocaleString('ko-KR') : exchangeRate.toFixed(2)}원`
    : null

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            총 지출
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold tabular-nums tracking-tight">
            {formatAmount(total, currency)}
          </p>
          {currency !== 'KRW' && exchangeRate != null && total > 0 && (
            <p className="text-sm text-muted-foreground mt-1 tabular-nums">
              ≈ {formatAmount(total * exchangeRate, 'KRW')}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1.5">
            {expenses.length > 0
              ? `총 ${expenses.length}건의 지출`
              : '아직 지출 내역이 없습니다'}
          </p>
        </CardContent>
      </Card>

      {currency !== 'KRW' && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
              원화 환산
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rateDisplayLabel && (
              <p className="text-xs text-muted-foreground">{rateDisplayLabel}</p>
            )}
            <div className="space-y-1.5">
              <p className="text-xs text-muted-foreground">1 {currency} = ? 원</p>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="환율 직접 입력"
                  value={rateInput}
                  onChange={handleRateInputChange}
                  className="flex-1 h-8 text-sm"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCurrentRate}
                  disabled={fetching}
                  className="shrink-0 h-8 text-xs whitespace-nowrap"
                >
                  {fetching ? '불러오는 중…' : '현재 환율'}
                </Button>
              </div>
              {fetchError && (
                <p className="text-xs text-destructive">
                  환율을 불러오지 못했어요. 직접 입력해 주세요.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
            카테고리별 지출
          </CardTitle>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={56}
                    outerRadius={82}
                    paddingAngle={2}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={renderTooltip} />
                </PieChart>
              </ResponsiveContainer>

              <div className="space-y-2.5 mt-3">
                {activeCategories.map(cat => {
                  const amount = byCategory[cat] ?? 0
                  const pct = total > 0 ? Math.round((amount / total) * 100) : 0
                  return (
                    <div key={cat} className="flex items-center gap-2.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: CATEGORY_COLORS[cat] }}
                      />
                      <span className="text-sm flex-1 text-foreground">{cat}</span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatAmount(amount, currency)}
                      </span>
                      <span className="text-xs text-muted-foreground w-9 text-right tabular-nums">
                        {pct}%
                      </span>
                    </div>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-muted-foreground">
              <p className="text-sm">지출을 추가하면 차트가 표시됩니다</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
