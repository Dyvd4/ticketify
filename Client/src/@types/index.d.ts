import { HandleErrorOptions } from "src/utils/error";

declare global {
  interface GlobalEventHandlersEventMap {
    "CustomError": CustomEvent<{
      error: Error,
      options?: HandleErrorOptions
    }>
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

