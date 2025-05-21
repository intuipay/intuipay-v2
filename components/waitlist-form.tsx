'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TriangleAlert } from 'lucide-react'
import ConfirmationDialog from './confirmation-dialog'

export default function WaitlistForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
  }>({})
  const [touched, setTouched] = useState<{
    name: boolean
    email: boolean
  }>({
    name: false,
    email: false,
  })
  const [showConfirmation, setShowConfirmation] = useState(false)

  // Validate form fields
  useEffect(() => {
    const newErrors: { name?: string; email?: string } = {}

    if (touched.name && !name) {
      newErrors.name = 'Name is required'
    }

    if (touched.email) {
      if (!email) {
        newErrors.email = 'Email is required'
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'This is not a valid email format'
      }
    }

    setErrors(newErrors)
  }, [name, email, touched])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Mark all fields as touched to show validation errors
    setTouched({ name: true, email: true })

    // Check if there are any validation errors
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return
    }

    setIsSubmitting(true)

    try {
      // This would be replaced with an actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show confirmation dialog instead of message
      setShowConfirmation(true)

      // Reset form
      setName('')
      setEmail('')
      setTouched({ name: false, email: false })
      setMessage('')
    } catch (error) {
      setMessage('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              className={`w-full bg-gray-50 py-5 px-8 rounded-lg ${
                errors.name ? 'border-red-500 text-red-500 placeholder-red-300' : ''
              }`}
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {errors.name && (
            <p id="name-error" className="mt-3 text-red-500 text-sm flex items-center">
              <TriangleAlert className="h-4 w-4 mr-2.5" />
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <div className="relative">
            <Input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              className={`w-full bg-gray-50 py-6 px-4 rounded-lg ${
                errors.email ? 'border-red-500 text-red-500 placeholder-red-300' : ''
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-3 text-red-500 text-sm flex items-center">
              <TriangleAlert className="h-4 w-4 mr-2.5" />
              {errors.email}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-16 bg-blue-500 hover:bg-blue-600 text-white py-6 rounded-full text-xl font-semibold"
          disabled={isSubmitting}
          aria-label="Join Waitlist"
        >
          {isSubmitting ? 'Processing...' : 'Join Waitlist'}
        </Button>

        {message && (
          <div className="text-center text-green-600" role="status" aria-live="polite">
            {message}
          </div>
        )}
      </form>

      <ConfirmationDialog open={showConfirmation} onOpenChange={setShowConfirmation} email={email} />
    </>
  )
}
