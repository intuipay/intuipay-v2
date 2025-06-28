import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

// doc: https://nextjs.org/docs/app/guides/testing/vitest
export default defineConfig({
    plugins: [tsconfigPaths(), react()],
    test: {
        testTimeout: 10000, // 设置测试超时时间为10秒
    }
})
