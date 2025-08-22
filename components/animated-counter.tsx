'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCounterAnimation } from './counter-animation-context';

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
  const [count, setCount] = useState(0);
  const [isLocallyHovered, setIsLocallyHovered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  // 使用全局动画控制状态
  const { isGloballyPaused, pauseAllAnimations, resumeAllAnimations } = useCounterAnimation();

  // 生成随机数值的函数
  const generateRandomCount = useCallback(() => {
    const range = Math.floor(end * rollRange);
    const min = Math.max(0, end - range);
    const max = end + range;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, [end, rollRange]);

  // 启动随机滚动
  const startRolling = useCallback(() => {
    // 如果全局暂停或者本地暂停，则不启动滚动
    if (isGloballyPaused || isLocallyHovered || intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setCount(generateRandomCount());
    }, rollInterval);
  }, [generateRandomCount, rollInterval, isGloballyPaused, isLocallyHovered]);

  // 停止随机滚动
  const stopRolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // 鼠标进入时暂停所有动画并显示目标值
  const handleMouseEnter = useCallback(() => {
    setIsLocallyHovered(true);
    pauseAllAnimations(); // 暂停所有计数器的动画
    stopRolling();
    setCount(end);
  }, [end, stopRolling, pauseAllAnimations]);

  // 鼠标离开时恢复所有动画
  const handleMouseLeave = useCallback(() => {
    setIsLocallyHovered(false);
    resumeAllAnimations(); // 恢复所有计数器的动画
  }, [resumeAllAnimations]);

  // 监听全局暂停状态变化
  useEffect(() => {
    if (isGloballyPaused) {
      stopRolling();
      setCount(end); // 显示目标值
    } else if (isInView && !isLocallyHovered) {
      // 延迟一点时间后开始滚动
      const timeout = setTimeout(() => {
        startRolling();
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [isGloballyPaused, isInView, end, isLocallyHovered, startRolling, stopRolling]);

  useEffect(() => {
    if (!isInView) return;

    // 初始显示目标值
    setCount(end);

    // 延迟一点时间后开始滚动，让用户先看到目标值
    const timeout = setTimeout(() => {
      if (!isGloballyPaused && !isLocallyHovered) {
        startRolling();
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
      stopRolling();
    };
  }, [isInView, end, isGloballyPaused, isLocallyHovered, startRolling, stopRolling]);

  // 清理定时器
  useEffect(() => {
    return () => {
      stopRolling();
    };
  }, [stopRolling]);

  const formatNumber = (num: number) => {
    if (end >= 1000) {
      return num.toLocaleString();
    }
    return num.toString();
  };

  return (
    <motion.span
      ref={ref}
      className={`${className} ${isLocallyHovered || isGloballyPaused ? 'cursor-pointer' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: isLocallyHovered || isGloballyPaused ? 'all 0.2s ease-out' : 'none',
        transform: isLocallyHovered || isGloballyPaused ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      {prefix}{formatNumber(count)}{suffix}
    </motion.span>
  );
}
