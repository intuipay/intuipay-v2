import { createAuthClient } from 'better-auth/react'

// 根据环境变量决定使用模拟还是真实的 authClient
export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000'
})
