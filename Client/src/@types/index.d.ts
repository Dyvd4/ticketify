declare global {
  interface GlobalEventHandlersEventMap {
    "CustomError": CustomEvent
  }
  namespace Tailwind {
    interface Color {
      value: string
      hover?: string
      darkMode?: {
        value: string
        hover?: string
      }
    }
  }
  namespace React {
    interface PropsWithColor {
      twColor?: Tailwind.Color
      twBackgroundColor?: Tailwind.Color
    }
  }
}
export { };

