declare module 'react-grid-layout' {
  import { ComponentType, ReactNode } from 'react'

  export interface Layout {
    i: string
    x: number
    y: number
    w: number
    h: number
    minW?: number
    maxW?: number
    minH?: number
    maxH?: number
    static?: boolean
    isDraggable?: boolean
    isResizable?: boolean
  }

  export interface GridLayoutProps {
    className?: string
    style?: React.CSSProperties
    layout: Layout[]
    cols: number
    rowHeight: number
    width: number
    onLayoutChange?: (layout: Layout[]) => void
    isDraggable?: boolean
    isResizable?: boolean
    compactType?: 'vertical' | 'horizontal' | null
    preventCollision?: boolean
    children?: ReactNode
  }

  const GridLayout: ComponentType<GridLayoutProps>
  export default GridLayout
}
