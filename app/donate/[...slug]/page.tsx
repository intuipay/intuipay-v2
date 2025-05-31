"use client"

import { useState } from "react"
import { ChevronLeft, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

// Step types
type Step = "initialization" | "contracts" | "payment" | "complete"

export default function DonationPage() {
  // State
  const [currentStep, setCurrentStep] = useState<Step>("initialization")
  const [slideDirection, setSlideDirection] = useState<"right" | "left">("right")

  // Form state
  const [paymentMethod, setPaymentMethod] = useState("crypto")
  const [amount, setAmount] = useState("1.0")
  const [isCompany, setIsCompany] = useState(false)
  const [sendInvoice, setSendInvoice] = useState(false)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)

  // Step navigation
  const goToNextStep = () => {
    setSlideDirection("right")
    if (currentStep === "initialization") setCurrentStep("contracts")
    else if (currentStep === "contracts") setCurrentStep("payment")
    else if (currentStep === "payment") setCurrentStep("complete")
  }

  const goToPreviousStep = () => {
    setSlideDirection("left")
    if (currentStep === "contracts") setCurrentStep("initialization")
    else if (currentStep === "payment") setCurrentStep("contracts")
    else if (currentStep === "complete") setCurrentStep("payment")
  }

  const connectWallet = () => {
    setWalletConnected(true)
  }

  const resetForm = () => {
    setSlideDirection("left")
    setCurrentStep("initialization")
    setWalletConnected(false)
    setAmount("1.0")
    setIsCompany(false)
    setSendInvoice(false)
    setIsAnonymous(false)
  }

  // Steps configuration
  const steps = [
    { id: "initialization", label: "Initialization" },
    { id: "contracts", label: "Contracts" },
    { id: "payment", label: "Payment" },
    { id: "complete", label: "Complete" },
  ]

  // Get current step index
  const currentStepIndex = steps.findIndex((step) => step.id === currentStep)

  // Slide animation variants
  const slideVariants = {
    enterFromRight: {
      x: 300,
      opacity: 0,
    },
    enterFromLeft: {
      x: -300,
      opacity: 0,
    },
    center: {
      x: 0,
      opacity: 1,
    },
    exitToLeft: {
      x: -300,
      opacity: 0,
    },
    exitToRight: {
      x: 300,
      opacity: 0,
    },
  }

  return (
    <div className="min-h-screen bg-gray-50 lg:bg-gray-100">
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-white lg:bg-gray-50">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-sm text-gray-600">Donating to</p>
            <p className="font-medium text-gray-900">NeuroBridge: The si...</p>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full">Sign In</Button>
      </header>

      {/* Main Content */}
      <main className="lg:flex lg:items-center lg:justify-center lg:min-h-[calc(100vh-80px)]">
        <div className="w-full max-w-md mx-auto bg-white lg:rounded-2xl lg:shadow-lg lg:p-8 p-4">
          {/* Hero Image */}
          <div className="mb-8">
            <div className="relative w-full h-48 lg:h-56 rounded-2xl overflow-hidden">
              <Image
                src="/hero-image.png"
                alt="Lion King inspired scene with lions silhouetted against full moon"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className="relative">
                    {index <= currentStepIndex ? (
                      <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          index <= currentStepIndex ? "bg-blue-600" : "bg-blue-600 border-2 border-blue-600"
                        }`}
                      >
                        {index <= currentStepIndex && (
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </motion.div>
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white border-2 border-gray-300" />
                    )}
                  </div>
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

          {/* Step Content */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentStep}
              initial={slideDirection === "right" ? "enterFromRight" : "enterFromLeft"}
              animate="center"
              exit={slideDirection === "right" ? "exitToLeft" : "exitToRight"}
              variants={slideVariants}
              transition={{ type: "tween", duration: 0.3 }}
              className="min-h-[400px]"
            >
              {/* Initialization Step */}
              {currentStep === "initialization" && (
                <div className="space-y-6">
                  <h1 className="text-xl font-semibold text-center text-gray-900">Make your donation today</h1>

                  {/* Payment Method Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={paymentMethod === "crypto" ? "default" : "outline"}
                      className={`flex-1 ${
                        paymentMethod === "crypto"
                          ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setPaymentMethod("crypto")}
                    >
                      <span className="mr-2">💳</span>
                      Crypto
                    </Button>
                    <Button
                      variant={paymentMethod === "cash" ? "default" : "outline"}
                      className={`flex-1 ${
                        paymentMethod === "cash"
                          ? "bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                          : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
                      }`}
                      onClick={() => setPaymentMethod("cash")}
                    >
                      <span className="mr-2">💵</span>
                      Cash
                    </Button>
                  </div>

                  {/* Currency Selection */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Donate with</Label>
                    <Select defaultValue="usdc">
                      <SelectTrigger className="w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">$</span>
                          </div>
                          <SelectValue placeholder="USD Coin (USDC) ERC-20" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usdc">USD Coin (USDC) ERC-20</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Amount Input */}
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-600">Amount</Label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="pr-24"
                        step="0.1"
                        min="0"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        USDC = $ {amount}
                      </div>
                    </div>
                  </div>

                  {/* Next Button */}
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-full text-base font-medium"
                    onClick={goToNextStep}
                  >
                    Donate
                  </Button>
                </div>
              )}

              {/* Contracts Step */}
              {currentStep === "contracts" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-center relative mb-4">
                    <button onClick={goToPreviousStep} className="absolute left-0 p-1 lg:hidden">
                      <ArrowLeft className="h-5 w-5" />
                    </button>
                    <h1 className="text-xl font-semibold text-center text-gray-900">Leave your contract information</h1>
                  </div>

                  {/* Company/Institution Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="company"
                      checked={isCompany}
                      onCheckedChange={(checked) => setIsCompany(checked as boolean)}
                    />
                    <Label htmlFor="company" className="text-sm font-medium">
                      Company / Institution
                    </Label>
                  </div>

                  {/* Name Fields */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm text-gray-600">
                        First Name
                      </Label>
                      <Input id="firstName" placeholder="First name *" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm text-gray-600">
                        Last Name
                      </Label>
                      <Input id="lastName" placeholder="Last name *" />
                    </div>
                  </div>

                  {/* Address Fields */}
                  <div className="space-y-2">
                    <Label htmlFor="address1" className="text-sm text-gray-600">
                      Address
                    </Label>
                    <Input id="address1" placeholder="Line 1*" className="mb-2" />
                    <Input id="address2" placeholder="Line 2" />
                  </div>

                  {/* Country and State */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm text-gray-600">
                        Country
                      </Label>
                      <Input id="country" placeholder="Country *" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-sm text-gray-600">
                        State
                      </Label>
                      <Input id="state" placeholder="State *" />
                    </div>
                  </div>

                  {/* City and Zip */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-sm text-gray-600">
                        City
                      </Label>
                      <Input id="city" placeholder="City *" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode" className="text-sm text-gray-600">
                        Zip Code
                      </Label>
                      <Input id="zipCode" placeholder="Zip code *" />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-600">
                      Email Address
                    </Label>
                    <Input id="email" type="email" placeholder="Email address *" />
                  </div>

                  {/* Tax Invoice Checkbox */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="taxInvoice"
                      checked={sendInvoice}
                      onCheckedChange={(checked) => setSendInvoice(checked as boolean)}
                    />
                    <Label htmlFor="taxInvoice" className="text-sm font-medium">
                      Send me the tax invoice
                    </Label>
                  </div>

                  {/* Anonymous Donation Checkbox */}
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Checkbox
                      id="anonymous"
                      checked={isAnonymous}
                      onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                    />
                    <Label htmlFor="anonymous" className="text-sm font-medium">
                      Make my donation anonymous
                    </Label>
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex gap-4 mt-8 lg:justify-end">
                    <Button
                      variant="outline"
                      className="flex-1 lg:flex-none lg:px-8 rounded-full"
                      onClick={goToPreviousStep}
                    >
                      Back
                    </Button>
                    <Button
                      className="flex-1 lg:flex-none lg:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                      onClick={goToNextStep}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}

              {/* Payment Step */}
              {currentStep === "payment" && (
                <div className="space-y-6">
                  {!walletConnected ? (
                    <>
                      <div className="flex items-center justify-center relative mb-4">
                        <button onClick={goToPreviousStep} className="absolute left-0 p-1 lg:hidden">
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-center text-gray-900">Connect with your wallet</h1>
                      </div>

                      {/* Switch Network */}
                      <div className="space-y-2">
                        <Label htmlFor="network" className="text-sm text-gray-600">
                          Switch Network
                        </Label>
                        <Select defaultValue="ethereum">
                          <SelectTrigger className="w-full">
                            <div className="flex items-center gap-2">
                              <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-700 text-xs">Ξ</span>
                              </div>
                              <SelectValue placeholder="Ethereum" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ethereum">Ethereum</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Wallet Options */}
                      <div className="space-y-3 mt-4">
                        {/* MetaMask */}
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">M</span>
                            </div>
                            <span className="font-medium">MetaMask</span>
                          </div>
                          <span className="text-sm text-gray-500">Detected</span>
                        </div>

                        {/* WalletConnect */}
                        <div className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">W</span>
                            </div>
                            <span className="font-medium">WalletConnect</span>
                          </div>
                          <span className="text-sm text-gray-500">Detected</span>
                        </div>

                        {/* Phantom */}
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">P</span>
                            </div>
                            <span className="font-medium">Phantom</span>
                          </div>
                        </div>

                        {/* Coinbase */}
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs">C</span>
                            </div>
                            <span className="font-medium">Coinbase</span>
                          </div>
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-8 lg:justify-center">
                        <Button
                          variant="outline"
                          className="flex-1 lg:flex-none lg:px-8 rounded-full"
                          onClick={goToPreviousStep}
                        >
                          Back
                        </Button>
                        <Button
                          className="flex-1 lg:flex-none lg:px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                          onClick={connectWallet}
                        >
                          Connect
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center relative mb-4">
                        <button onClick={() => setWalletConnected(false)} className="absolute left-0 p-1 lg:hidden">
                          <ArrowLeft className="h-5 w-5" />
                        </button>
                        <h1 className="text-xl font-semibold text-center text-gray-900">Finish your donation</h1>
                      </div>

                      <div className="flex flex-col items-center justify-center py-8 space-y-2">
                        <p className="text-gray-600">Your are donating</p>
                        <p className="text-2xl font-semibold text-blue-600">100,016.00256041 USDC</p>
                        <p className="text-gray-600">~ 100,000 USD</p>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-4 mt-8 lg:justify-center">
                        {/* Only show Back button on mobile */}
                        <div className="lg:hidden flex-1">
                          <Button
                            variant="outline"
                            className="w-full rounded-full"
                            onClick={() => setWalletConnected(false)}
                          >
                            Back
                          </Button>
                        </div>
                        <Button
                          className="flex-1 lg:w-full lg:max-w-xs bg-blue-600 hover:bg-blue-700 text-white rounded-full"
                          onClick={goToNextStep}
                        >
                          Donate
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Complete Step */}
              {currentStep === "complete" && (
                <div className="space-y-6 flex flex-col items-center">
                  <div className="py-8">
                    <Image src="/success-icon.png" alt="Success" width={120} height={120} />
                  </div>

                  <div className="text-center space-y-2">
                    <h1 className="text-xl font-semibold text-gray-900">
                      Thank you for your support! Your are the 145 backer now.
                    </h1>
                  </div>

                  <div className="w-full mt-8">
                    <Button
                      variant="outline"
                      className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 rounded-full"
                      onClick={resetForm}
                    >
                      Make new donation
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <footer className="flex items-center justify-between mt-8 pt-6 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <span>Powered by</span>
              <span className="font-medium text-gray-700">🔷 Intuipay</span>
            </div>
            <Link href="/support" className="text-gray-500 hover:text-gray-700 transition-colors">
              Terms & Conditions
            </Link>
          </footer>
        </div>
      </main>
    </div>
  )
}
