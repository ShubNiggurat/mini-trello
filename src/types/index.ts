import type { columnNames } from '@/enums'

interface CardBase {
  title: string
  message: string
}

interface Card extends CardBase {
  id: string
}

type Column = Map<string, CardBase>

interface Board {
  [columnNames.TODO]: Column
  [columnNames.IN_PROGRESS]: Column
  [columnNames.DONE]: Column
}

export type { Card, Board, Column }
