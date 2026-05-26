import { useState, useEffect } from 'react'
import type { Expense, CurrencyCode } from '@/types'

const STORAGE_KEY = 'travel-money-expenses'
const CURRENCY_KEY = 'travel-money-currency'

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

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses))
  }, [expenses])

  const setCurrency = (code: CurrencyCode) => {
    setCurrencyState(code)
    localStorage.setItem(CURRENCY_KEY, code)
  }

  const addExpense = (expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [...prev, { ...expense, id: crypto.randomUUID() }])
  }

  const updateExpense = (id: string, updates: Omit<Expense, 'id'>) => {
    setExpenses(prev => prev.map(e => (e.id === id ? { ...updates, id } : e)))
  }

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id))
  }

  const resetExpenses = () => {
    setExpenses([])
  }

  return { expenses, currency, setCurrency, addExpense, updateExpense, deleteExpense, resetExpenses }
}
