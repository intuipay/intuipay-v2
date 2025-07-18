'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion, useInView } from 'framer-motion'

interface AnimatedCounterProps {
  end: number
  suffix?: string
  prefix?: string
  className?: string
  rollInterval?: number // 滚动间隔时间（毫秒）
  rollRange?: number // 随机滚动的范围比例（相对于end值）
}

export function AnimatedCounter({
  end,
  suffix = '',
  prefix = '',
  className = '',
  rollInterval = 150, // 默认150ms滚动一次
  rollRange = 0.4 // 默认在目标值的±40%范围内随机滚动
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const ref = useRef<HTMLSpanElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // 生成随机数值的函数
  const generateRandomCount = useCallback(() => {
    const range = Math.floor(end * rollRange)
    const min = Math.max(0, end - range)
    const max = end + range
    return Math.floor(Math.random() * (max - min + 1)) + min
  }, [end, rollRange])

  // 启动随机滚动
  const startRolling = useCallback(() => {
    if (intervalRef.current) return

    intervalRef.current = setInterval(() => {
      setCount(generateRandomCount())
    }, rollInterval)
  }, [generateRandomCount, rollInterval])

  // 停止随机滚动
  const stopRolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  // 鼠标进入时暂停滚动并显示目标值
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true)
    stopRolling()
    setCount(end)
  }, [end, stopRolling])

  // 鼠标离开时继续滚动
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false)
    if (isInView) {
      startRolling()
    }
  }, [isInView, startRolling])

  useEffect(() => {
    if (!isInView) return

    // 初始显示目标值
    setCount(end)

    // 延迟一点时间后开始滚动，让用户先看到目标值
    const timeout = setTimeout(() => {
      if (!isHovered) {
        startRolling()
      }
    }, 1000)

    return () => {
      clearTimeout(timeout)
      stopRolling()
    }
  }, [isInView, end, isHovered, startRolling, stopRolling])

  // 清理定时器
  useEffect(() => {
    return () => {
      stopRolling()
    }
  }, [stopRolling])

  const formatNumber = (num: number) => {
    if (end >= 1000) {
      return num.toLocaleString()
    }
    return num.toString()
  }

  return (
    <motion.span
      ref={ref}
      className={`${className} ${isHovered ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: isHovered ? 'all 0.2s ease-out' : 'none',
        transform: isHovered ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  )
}
