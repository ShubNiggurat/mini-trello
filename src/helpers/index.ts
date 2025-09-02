import type { Card, Column } from '@/types'

function arrayOfCardFromMap(columnMap: Column): Card[] {
  return Array.from(columnMap, ([id, value]) => ({ id, ...value }))
}

function generateUID() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export { arrayOfCardFromMap, generateUID }
