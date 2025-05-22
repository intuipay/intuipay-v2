declare namespace NodeJS {
  interface ProcessEnv {
    DB: D1Database; // Or the specific type for your binding
  }
}
