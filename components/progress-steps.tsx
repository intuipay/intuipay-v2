"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"

export function ProgressSteps() {
  const pathname = usePathname()

  const steps = [
    { id: "initialization", label: "Initialization", path: "/" },
    { id: "contracts", label: "Contracts", path: "/contracts" },
    { id: "payment", label: "Payment", path: "/payment" },
    { id: "complete", label: "Complete", path: "/complete" },
  ]

  const currentStepIndex =
    steps.findIndex((step) => step.path === pathname) !== -1 ? steps.findIndex((step) => step.path === pathname) : 0

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <Link href={step.path} className="relative">
              {index <= currentStepIndex ? (
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    index < currentStepIndex ? "bg-blue-600" : "bg-blue-600 border-2 border-blue-600"
                  }`}
                >
                  {index < currentStepIndex ? (
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : null}
                </motion.div>
              ) : (
                <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
              )}
            </Link>
            {index < steps.length - 1 && (
              <div className="relative w-16 lg:w-20 h-0.5 bg-gray-300 mx-2">
                {index < currentStepIndex && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    className="absolute top-0 left-0 h-full bg-blue-600"
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs">
        {steps.map((step, index) => (
          <span
            key={step.id}
            className={`${index <= currentStepIndex ? "text-blue-600 font-medium" : "text-gray-500"}`}
          >
            {step.label}
          </span>
        ))}
      </div>
    </div>
  )
}
