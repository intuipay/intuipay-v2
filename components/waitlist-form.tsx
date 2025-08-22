'use client';

import React, { useRef } from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Warning } from '@phosphor-icons/react';
import ConfirmationDialog from './confirmation-dialog';
import { APIResponse } from '@/types';
import { clsx } from 'clsx';

const LOCAL_KEY = 'intuipay_ref_id';

type Props = {
  className?: string;
}
export default function WaitlistForm({
  className,
}: Props) {
  const referEmail = useRef<string>('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [myEmail, setMyEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<{
    name?: string
    email?: string
  }>({});
  const [touched, setTouched] = useState<{
    name: boolean
    email: boolean
  }>({
    name: false,
    email: false,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Validate form fields
  useEffect(() => {
    const newErrors: { name?: string; email?: string } = {};

    if (touched.name && !name) {
      newErrors.name = 'Name is required';
    }

    if (touched.email) {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'This is not a valid email format';
      }
    }

    setErrors(newErrors);
  }, [name, email, touched]);
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref_id') || '';
    if (refId) {
      localStorage.setItem(LOCAL_KEY, refId);
    }
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      referEmail.current = local;
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Mark all fields as touched to show validation errors
    setTouched({ name: true, email: true });

    // Check if there are any validation errors
    if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }

    setIsSubmitting(true);

    try {
      // This would be replaced with an actual API call
      const response = await fetch('/api/submit', {
        method: 'POST',
        body: JSON.stringify({
          email,
          name,
          refer: referEmail.current, // This would be replaced with the actual referral ID
        }),
      });
      const data = await response.json() as APIResponse<number>;

      // Show confirmation dialog instead of message
      setShowConfirmation(true);

      // Reset form
      setMyEmail(email);
      setName('');
      setEmail('');
      setTouched({ name: false, email: false });
      setMessage('');
    } catch (error) {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={clsx('space-y-8', className)}
      >
        <div>
          <div className="relative">
            <Input
              id="name"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <Warning size={16} className="mr-2.5" />
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
              className={`w-full bg-gray-50 py-6 px-8 rounded-lg ${
                errors.email ? 'border-red-500 text-red-500 placeholder-red-300' : ''
              }`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
              disabled={isSubmitting}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="mt-3 text-red-500 text-sm flex items-center">
              <Warning size={16} className="mr-2.5" />
              {errors.email}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-13 sm:h-15 bg-primary hover:bg-primary/90 text-white rounded-full text-base font-semibold"
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

      <ConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        email={myEmail}
      />
    </>
  );
}
