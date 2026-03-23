"use client"

import React, { useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"
import emailjs from "@emailjs/browser"
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Mail,
  MapPin,
} from "lucide-react"
import { ChevronDown } from "lucide-react"
import { SlideToVerify } from "@/components/contact/slide-to-verify"
import { Boxes } from "@/components/ui/background-boxes"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const contactDetails = [
  {
    label: "Email",
    value: "service@midpointverified.com",
    href: "mailto:service@midpointverified.com",
    icon: Mail,
  },
  {
    label: "Office",
    value: "111 E Monroe Ave, Buckeye, AZ 85396",
    icon: MapPin,
  },
] as const

function Field({
  id,
  label,
  error,
  optional,
  children,
}: {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm">
        {label}
        {optional ? (
          <span className="ml-1.5 text-muted-foreground font-normal">(optional)</span>
        ) : (
          <span className="ml-0.5 text-destructive">*</span>
        )}
      </Label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setStatus("sending")

    try {
      if (formRef.current) {
        await emailjs.sendForm(
          process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
          process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
          formRef.current,
          process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
        )
      }

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

  const isFormValid = Boolean(
    formData.name &&
      formData.email &&
      formData.subject &&
      formData.message.length >= 10 &&
      isHumanVerified
  )

  if (status === "success") {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background text-foreground">
          <div className="min-h-[60vh] flex items-center justify-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center max-w-md"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground"
              >
                <Check className="h-8 w-8" />
              </motion.div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Message sent
              </h2>
              <p className="mt-3 text-muted-foreground">
                Thanks for reaching out. Our team will review your message and respond within 24 hours on business days.
              </p>
              <Button
                variant="outline"
                onClick={() => setStatus("idle")}
                className="mt-8"
              >
                Send another message
              </Button>
            </motion.div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background text-foreground">
        {/* Hero */}
        <section className="min-h-svh flex flex-col items-center justify-center relative px-6 overflow-hidden">
          {/* Interactive Grid Background */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Boxes />
            <div className="absolute inset-0 w-full h-full bg-background z-[1] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,transparent_40%,black_80%)] pointer-events-none" />
          </motion.div>

          {/* Gradient overlays */}
          <div className="absolute inset-0 z-[4] bg-gradient-to-b from-background/30 via-transparent to-background/60 pointer-events-none" />

          {/* Background shadow behind text */}
          <div
            className="absolute inset-0 z-[5] pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 35% 25% at 50% 50%, var(--background) 0%, var(--background) 50%, transparent 100%)",
            }}
          />

          {/* Centered content */}
          <div className="text-center relative z-10">
            <p className="text-[11px] sm:text-[12px] uppercase tracking-[0.25em] mb-6">
              <span className="text-muted-foreground">We&apos;d Love to </span>
              <span className="text-primary">Hear From You</span>
            </p>

            <h1 className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl lg:text-8xl xl:text-[112px] font-extrabold leading-[0.9] tracking-tight">
              <span className="block text-foreground">GET IN</span>
              <span className="block text-primary">TOUCH</span>
            </h1>

            <p className="max-w-[28rem] mx-auto text-sm sm:text-[15px] text-muted-foreground mt-8 leading-relaxed">
              Request a demo, ask a coverage question, or start an onboarding conversation. We respond within 24 hours.
            </p>
          </div>

          {/* Scroll indicator */}
          <button
            onClick={() => {
              const content = document.getElementById("contact-content")
              if (content) content.scrollIntoView({ behavior: "smooth" })
            }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-30 hover:opacity-50 transition-opacity cursor-pointer"
            aria-label="Scroll to content"
          >
            <div className="w-5 h-8 rounded-full border border-current flex items-start justify-center pt-1.5">
              <div className="w-1 h-1 rounded-full bg-current animate-bounce" />
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>
        </section>

        {/* Two-column content */}
        <div id="contact-content" className="mx-auto max-w-6xl px-6">
          <div className="grid gap-16 py-16 md:grid-cols-[1fr_1.5fr] md:gap-24 md:py-24">
            {/* Left: Contact details + What to expect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h2 className="text-sm font-medium text-foreground">Contact details</h2>

              <div className="mt-6 space-y-6">
                {contactDetails.map(({ label, value, icon: Icon, ...rest }) => {
                  const href = "href" in rest ? rest.href : undefined
                  return (
                    <div key={label} className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-secondary/50">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            className="group mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-primary"
                          >
                            {value}
                            <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                          </a>
                        ) : (
                          <p className="mt-0.5 text-sm font-medium text-foreground">
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="my-8 h-px bg-border" />

              <h2 className="text-sm font-medium text-foreground">What to expect</h2>
              <ul className="mt-4 space-y-3">
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  Share your workflow, use case, or the question you need answered.
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  Our team reviews every request and replies within 24 hours on business days.
                </li>
                <li className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  If a walkthrough makes sense, we follow up with the right next step.
                </li>
              </ul>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field id="name" label="Name" error={errors.name}>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="h-11"
                    />
                  </Field>
                  <Field id="email" label="Email" error={errors.email}>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      required
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? "email-error" : undefined}
                      className="h-11"
                    />
                  </Field>
                </div>

                <Field id="company" label="Company" optional>
                  <Input
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="Your company name"
                    className="h-11"
                  />
                </Field>

                <Field id="subject" label="Subject" error={errors.subject}>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="What can we help with?"
                    required
                    aria-invalid={Boolean(errors.subject)}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                    className="h-11"
                  />
                </Field>

                <Field id="message" label="Message" error={errors.message}>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your workflow, team, or what you want to solve."
                    required
                    rows={5}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : undefined}
                    className="resize-none"
                  />
                </Field>

                <div className="rounded-xl border border-border bg-secondary/30 p-3">
                  <SlideToVerify
                    onVerified={() => setIsHumanVerified(true)}
                    isVerified={isHumanVerified}
                  />
                </div>

                {status === "error" ? (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-destructive/20 bg-destructive/5 p-4"
                    role="alert"
                  >
                    <p className="text-sm text-destructive">
                      Something went wrong. Try again or email us directly at{" "}
                      <a
                        href="mailto:service@midpointverified.com"
                        className="font-medium underline underline-offset-4"
                      >
                        service@midpointverified.com
                      </a>
                      .
                    </p>
                  </motion.div>
                ) : null}

                <Button
                  type="submit"
                  disabled={!isFormValid || status === "sending"}
                  className="h-11 w-full sm:w-auto"
                >
                  {status === "sending" ? (
                    <>
                      <motion.span
                        className="h-4 w-4 rounded-full border-2 border-current border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
