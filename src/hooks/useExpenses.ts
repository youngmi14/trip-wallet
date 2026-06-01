import { useState, useEffect, useCallback } from 'react'
import type { Expense, CurrencyCode } from '@/types'

const STORAGE_KEY = 'travel-money-expenses'
const CURRENCY_KEY = 'travel-money-currency'
const RATES_KEY = 'travel-money-rates'

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? (JSON.parse(stored) as Expense[]) : []
    } catch {
      return []
    }
  })

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem(CURRENCY_KEY) as CurrencyCode) || 'KRW'
  })

  const [exchangeRates, setExchangeRatesState] = useState<Partial<Record<CurrencyCode, number>>>(() => {
    try {
      const stored = localStorage.getItem(RATES_KEY)
      return stored ? (JSON.parse(stored) as Partial<Record<CurrencyCode, number>>) : {}
    } catch {
      return {}
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  useEffect(() => {
    localStorage.setItem(RATES_KEY, JSON.stringify(exchangeRates))
  }, [exchangeRates])

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code)
    localStorage.setItem(CURRENCY_KEY, code)
  }, [])

  const setExchangeRate = useCallback((rate: number | null) => {
    setExchangeRatesState(prev => {
      const next = { ...prev }
      if (rate === null) delete next[currency]
      else next[currency] = rate
      return next
    })
  }, [currency])

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID() }])
  }, [])

  const updateExpense = useCallback((id: string, updates: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...updates, id } : e)))
  }, [])

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }, [])

  const resetExpenses = useCallback(() => {
    setExpenses([])
  }, [])

  const exchangeRate = currency === 'KRW' ? null : (exchangeRates[currency] ?? null)

  return {
    expenses, currency, setCurrency,
    exchangeRate, setExchangeRate,
    addExpense, updateExpense, deleteExpense, resetExpenses,
  }
}
