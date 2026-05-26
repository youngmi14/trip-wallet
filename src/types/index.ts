export type Category = '식비' | '교통' | '숙박' | '쇼핑' | '관광/입장료' | '기타'

export type CurrencyCode = 'KRW' | 'USD' | 'JPY' | 'EUR' | 'GBP' | 'CNY' | 'THB' | 'VND' | 'SGD' | 'HKD' | 'AUD'

export interface Currency {
  code: CurrencyCode
  symbol: string
  name: string
  locale: string
  decimals: number
}

export interface Expense {
  id: string
  date: string
  category: Category
  place: string
  amount: number
  memo?: string
}

export const CATEGORIES: Category[] = ['식비', '교통', '숙박', '쇼핑', '관광/입장료', '기타']

export const CURRENCIES: Currency[] = [
  { code: 'KRW', symbol: '₩', name: '한국 원화', locale: 'ko-KR', decimals: 0 },
  { code: 'USD', symbol: '$', name: '미국 달러', locale: 'en-US', decimals: 2 },
  { code: 'JPY', symbol: '¥', name: '일본 엔', locale: 'ja-JP', decimals: 0 },
  { code: 'EUR', symbol: '€', name: '유로', locale: 'de-DE', decimals: 2 },
  { code: 'GBP', symbol: '£', name: '영국 파운드', locale: 'en-GB', decimals: 2 },
  { code: 'CNY', symbol: '¥', name: '중국 위안', locale: 'zh-CN', decimals: 2 },
  { code: 'THB', symbol: '฿', name: '태국 바트', locale: 'th-TH', decimals: 2 },
  { code: 'VND', symbol: '₫', name: '베트남 동', locale: 'vi-VN', decimals: 0 },
  { code: 'SGD', symbol: 'S$', name: '싱가포르 달러', locale: 'en-SG', decimals: 2 },
  { code: 'HKD', symbol: 'HK$', name: '홍콩 달러', locale: 'zh-HK', decimals: 2 },
  { code: 'AUD', symbol: 'A$', name: '호주 달러', locale: 'en-AU', decimals: 2 },
]

export const CATEGORY_COLORS: Record<Category, string> = {
  '식비': '#f97316',
  '교통': '#3b82f6',
  '숙박': '#8b5cf6',
  '쇼핑': '#ec4899',
  '관광/입장료': '#10b981',
  '기타': '#6b7280',
}

// Intl.NumberFormat 인스턴스를 통화별로 캐싱 — 매 호출마다 생성하면 비용이 높음
const formatters = new Map<CurrencyCode, Intl.NumberFormat>()

export function formatAmount(amount: number, currencyCode: CurrencyCode): string {
  let formatter = formatters.get(currencyCode)
  if (!formatter) {
    const currency = CURRENCIES.find(c => c.code === currencyCode)!
    formatter = new Intl.NumberFormat(currency.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: currency.decimals,
      maximumFractionDigits: currency.decimals,
    })
    formatters.set(currencyCode, formatter)
  }
  return formatter.format(amount)
}
