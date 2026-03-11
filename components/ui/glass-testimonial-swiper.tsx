"use client";

import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import type { CSSProperties, MouseEvent, TouchEvent } from "react";

export interface Testimonial {
  id: string | number;
  initials: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  avatarGradient: string;
}

export interface TestimonialStackProps {
  testimonials: Testimonial[];
  visibleBehind?: number;
}

export const TestimonialStack = ({
  testimonials,
  visibleBehind = 2,
}: TestimonialStackProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartRef = useRef(0);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const totalCards = testimonials.length;

  const navigate = useCallback(
    (newIndex: number) => {
      setActiveIndex((newIndex + totalCards) % totalCards);
    },
    [totalCards],
  );

  const handleDragStart = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>,
    index: number,
  ) => {
    if (index !== activeIndex) {
      return;
    }

    setIsDragging(true);
    const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
    dragStartRef.current = clientX;
    cardRefs.current[activeIndex]?.classList.add("is-dragging");
  };

  const handleWindowDragMove = useEffectEvent(
    (event: globalThis.MouseEvent | globalThis.TouchEvent) => {
      if (!isDragging) {
        return;
      }

      const clientX = "touches" in event ? event.touches[0].clientX : event.clientX;
      setDragOffset(clientX - dragStartRef.current);
    },
  );

  const handleWindowDragEnd = useEffectEvent(() => {
    if (!isDragging) {
      return;
    }

    cardRefs.current[activeIndex]?.classList.remove("is-dragging");

    if (Math.abs(dragOffset) > 50) {
      navigate(activeIndex + (dragOffset < 0 ? 1 : -1));
    }

    setIsDragging(false);
    setDragOffset(0);
  });

  useEffect(() => {
    if (!isDragging) {
      return undefined;
    }

    const onMouseMove = (event: globalThis.MouseEvent) => {
      handleWindowDragMove(event);
    };
    const onTouchMove = (event: globalThis.TouchEvent) => {
      handleWindowDragMove(event);
    };
    const onMouseUp = () => {
      handleWindowDragEnd();
    };
    const onTouchEnd = () => {
      handleWindowDragEnd();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [isDragging]);

  if (!testimonials.length) {
    return null;
  }

  return (
    <section className="testimonials-stack relative">
      {testimonials.map((testimonial, index) => {
        const displayOrder = (index - activeIndex + totalCards) % totalCards;
        const style: CSSProperties = {};

        if (displayOrder === 0) {
          style.transform = `translateX(${dragOffset}px)`;
          style.opacity = 1;
          style.zIndex = totalCards;
        } else if (displayOrder <= visibleBehind) {
          const scale = 1 - 0.05 * displayOrder;
          const translateY = -2 * displayOrder;
          style.transform = `scale(${scale}) translateY(${translateY}rem)`;
          style.opacity = 1 - 0.2 * displayOrder;
          style.zIndex = totalCards - displayOrder;
        } else {
          style.transform = "scale(0)";
          style.opacity = 0;
          style.zIndex = 0;
        }

        return (
          <div
            ref={(element) => {
              cardRefs.current[index] = element;
            }}
            key={testimonial.id}
            className="testimonial-card glass-effect"
            style={style}
            onMouseDown={(event) => handleDragStart(event, index)}
            onTouchStart={(event) => handleDragStart(event, index)}
          >
            <div className="relative flex h-full flex-col p-7 md:p-9">
              <span className="absolute top-5 left-6 select-none font-serif text-5xl leading-none text-primary/20">
                &rdquo;
              </span>

              <blockquote className="flex-1 pt-6 text-base leading-relaxed italic text-card-foreground/85 md:text-lg">
                {testimonial.quote}
              </blockquote>

              <div className="mt-auto border-t border-border/50 pt-6">
                <p className="font-medium tracking-wide text-primary">
                  {testimonial.name}
                </p>
                <p className="mt-1.5 text-[11px] uppercase tracking-widest text-muted-foreground">
                  {testimonial.role}
                </p>
                <p className="text-[11px] uppercase tracking-widest text-muted-foreground/70">
                  {testimonial.company}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="pagination absolute bottom-0 left-0 right-0 flex justify-center gap-2">
        {testimonials.map((testimonial, index) => (
          <button
            key={testimonial.id}
            type="button"
            aria-label={`Go to testimonial ${index + 1}`}
            onClick={() => navigate(index)}
            className={`pagination-dot ${activeIndex === index ? "active" : ""}`}
          />
        ))}
      </div>
    </section>
  );
};
