// AppKit 组件类型声明
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'appkit-button': {
        balance?: 'show' | 'hide'
        size?: 'sm' | 'md' | 'lg'
        label?: string
        loadingLabel?: string
        disabled?: boolean
        border?: boolean
      }
      'appkit-network-button': {
        disabled?: boolean
      }
    }
  }
}

export {}
