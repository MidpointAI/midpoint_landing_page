"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import emailjs from "@emailjs/browser"
import { Send, Mail, ArrowUpRight, CheckCircle, AlertCircle, MapPin, Phone } from "lucide-react"
import { SlideToVerify } from "@/components/contact/slide-to-verify"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

function LabelBlock({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1.5 text-xs text-destructive">{error}</p>
      )}
    </div>
  )
}

export default function ContactPage() {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [isHumanVerified, setIsHumanVerified] = useState(false)

  // Form validation
  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Minimum 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setStatus("sending")

    try {
      // Send email via EmailJS
      if (formRef.current) {
        await emailjs.sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        )
      }

      // Also save to Google Sheets as backup
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      setStatus("success")
      setFormData({ name: "", email: "", company: "", subject: "", message: "" })
      setIsHumanVerified(false)
    } catch (error) {
      setStatus("error")
      console.error("Error sending message:", error)
    }
  }

  const isFormValid = formData.name && formData.email && formData.subject && formData.message.length >= 10 && isHumanVerified

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        <section className="relative py-24 md:py-32">
          <div className="mx-auto max-w-6xl px-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-center mb-16"
            >
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-primary mb-4">
                Contact Us
              </p>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight">
                Let&apos;s Start a{" "}
                <span className="text-primary">Conversation</span>
              </h1>
              <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
                Have questions about Midpoint? Want to see a demo? We&apos;d love to hear from you.
                Fill out the form below and we&apos;ll get back to you within 24 hours.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
              {/* Contact Info Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2 space-y-8"
              >
                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Email</p>
                        <a href="mailto:hello@midpoint.com" className="text-foreground hover:text-primary transition-colors">
                          hello@midpoint.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Phone</p>
                        <a href="tel:1-800-123-4567" className="text-foreground hover:text-primary transition-colors">
                          1-800-123-4567
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-primary/10">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1">Office</p>
                        <p className="text-foreground">
                          548 Market Street<br />
                          Suite 95673<br />
                          San Francisco, CA 94104
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border">
                  <h3 className="text-lg font-semibold mb-3">Response Time</h3>
                  <p className="text-muted-foreground text-sm">
                    We typically respond within 24 hours during business days.
                    For urgent matters, please call us directly.
                  </p>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-3"
              >
                {/* Success State */}
                {status === "success" ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 px-8 rounded-2xl bg-card border border-border"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                    >
                      <CheckCircle className="w-16 h-16 mx-auto text-primary" />
                    </motion.div>
                    <h3 className="text-2xl font-semibold mt-6">Message Sent!</h3>
                    <p className="mt-3 text-muted-foreground max-w-md mx-auto">
                      Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
                    </p>
                    <button
                      onClick={() => setStatus("idle")}
                      className="mt-8 text-sm text-primary hover:underline"
                    >
                      Send another message
                    </button>
                  </motion.div>
                ) : (
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="p-8 rounded-2xl bg-card border border-border space-y-6"
                  >
                    {/* Name & Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <LabelBlock label="Name" error={errors.name}>
                        <input
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Your name"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </LabelBlock>
                      <LabelBlock label="Email" error={errors.email}>
                        <input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="your@email.com"
                          required
                          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                        />
                      </LabelBlock>
                    </div>

                    {/* Company (Optional) */}
                    <LabelBlock label="Company (Optional)">
                      <input
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </LabelBlock>

                    {/* Subject */}
                    <LabelBlock label="Subject" error={errors.subject}>
                      <input
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="What's this about?"
                        required
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                      />
                    </LabelBlock>

                    {/* Message */}
                    <LabelBlock label="Message" error={errors.message}>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your needs..."
                        required
                        rows={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
                      />
                    </LabelBlock>

                    {/* Error Message */}
                    {status === "error" && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/30"
                      >
                        <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                        <span className="text-sm text-destructive">
                          Failed to send. Please try again or email us directly.
                        </span>
                      </motion.div>
                    )}

                    {/* Slide to Verify */}
                    <SlideToVerify
                      onVerified={() => setIsHumanVerified(true)}
                      isVerified={isHumanVerified}
                    />

                    {/* Submit Button */}
                    <motion.button
                      type="submit"
                      disabled={!isFormValid || status === "sending"}
                      className={`
                        w-full flex items-center justify-center gap-2 py-4 rounded-xl
                        text-sm font-medium uppercase tracking-wider
                        transition-all duration-300
                        ${isFormValid && status !== "sending"
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-border text-muted-foreground cursor-not-allowed"
                        }
                      `}
                      whileHover={isFormValid ? { scale: 1.01 } : {}}
                      whileTap={isFormValid ? { scale: 0.99 } : {}}
                    >
                      {status === "sending" ? (
                        <>
                          <motion.div
                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Send Message
                        </>
                      )}
                    </motion.button>
                  </form>
                )}

                {/* Direct Email Link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-6 text-center"
                >
                  <p className="text-sm text-muted-foreground">
                    Prefer email?{" "}
                    <Link
                      href="mailto:hello@midpoint.com"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      hello@midpoint.com
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </p>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
