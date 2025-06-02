declare namespace NodeJS {
  interface ProcessEnv {
    DB: D1Database; // Or the specific type for your binding
  }
}

declare global {
  interface Window {
    ethereum?: any; // 或者更具体的类型
  }
}
