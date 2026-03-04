"use client"

import React, { useRef, useCallback, useEffect, useState } from "react"
import { motion, useMotionValue, useTransform, animate } from "framer-motion"
import { ChevronsRight, Check } from "lucide-react"

interface SlideToVerifyProps {
  onVerified: () => void
  isVerified: boolean
  className?: string
}

export const SlideToVerify: React.FC<SlideToVerifyProps> = ({
  onVerified,
  isVerified,
  className = "",
}) => {
  const trackRef = useRef<HTMLDivElement>(null)
  const [maxDrag, setMaxDrag] = useState(300)
  const x = useMotionValue(0)

  // Calculate max drag distance on mount and resize
  useEffect(() => {
    const update = () => {
      if (trackRef.current) {
        setMaxDrag(trackRef.current.offsetWidth - 48 - 4)
      }
    }
    update()
    window.addEventListener("resize", update)
    return () => window.removeEventListener("resize", update)
  }, [])

  // Progress 0-1 based on drag position
  const progress = useTransform(x, [0, maxDrag], [0, 1])

  // Fill width in pixels - tracks exactly to the right edge of the thumb
  const fillWidth = useTransform(x, (xVal) => `${xVal + 48 + 2}px`)

  // Text opacity fades as thumb passes center
  const textOpacity = useTransform(progress, [0, 0.5], [0.5, 0])

  const getTrackWidth = useCallback(() => {
    if (!trackRef.current) return 300
    return trackRef.current.offsetWidth - 48 - 4
  }, [])

  const handleDragEnd = () => {
    const max = getTrackWidth()
    if (x.get() >= max * 0.85) {
      animate(x, max, { type: "spring", stiffness: 300, damping: 30 })
      onVerified()
    } else {
      animate(x, 0, { type: "spring", stiffness: 300, damping: 30 })
    }
  }

  return (
    <div className={className}>
      <label className="block text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-2">
        Human Verification
      </label>
      {/* Outer border wrapper */}
      <div
        className="rounded-full transition-colors duration-300"
        style={{
          border: isVerified
            ? "2px solid var(--primary)"
            : "2px solid var(--border)",
        }}
      >
        {/* Inner clipping container */}
        <div
          ref={trackRef}
          className="relative h-[52px] rounded-full overflow-hidden select-none bg-card"
        >
          {/* Green fill that follows the thumb */}
          <motion.div
            className="absolute top-0 left-0 bottom-0 rounded-full bg-primary"
            style={{
              width: isVerified ? "100%" : fillWidth,
              opacity: isVerified ? 0.9 : 0.85,
            }}
          />

          {/* Label text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[5]">
            {isVerified ? (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm font-semibold tracking-wider text-primary-foreground"
              >
                <Check className="w-4 h-4" strokeWidth={3} />
                Verified
              </motion.span>
            ) : (
              <motion.span
                className="text-sm tracking-wider text-muted-foreground"
                style={{ opacity: textOpacity }}
              >
                Slide to verify
              </motion.span>
            )}
          </div>

          {/* Draggable thumb */}
          {!isVerified && (
            <motion.div
              className="absolute top-[2px] left-[2px] w-12 h-12 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-10 bg-primary"
              style={{ x }}
              drag="x"
              dragConstraints={{ left: 0, right: maxDrag }}
              dragElastic={0}
              dragMomentum={false}
              onDragEnd={handleDragEnd}
            >
              <ChevronsRight
                className="w-5 h-5 text-primary-foreground"
                strokeWidth={2.5}
              />
            </motion.div>
          )}

          {/* Verified thumb pinned to the right */}
          {isVerified && (
            <motion.div
              className="absolute top-[2px] right-[2px] w-12 h-12 rounded-full flex items-center justify-center z-10 bg-primary"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ChevronsRight
                className="w-5 h-5 text-primary-foreground"
                strokeWidth={2.5}
              />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SlideToVerify
