"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean
  tilt?: boolean
  isGlass?: boolean
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, hover = true, tilt = false, isGlass, children, ...props }, ref) => {
    const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 })
    const [isHovered, setIsHovered] = React.useState(false)
    const [rotateX, setRotateX] = React.useState(0)
    const [rotateY, setRotateY] = React.useState(0)
    const cardRef = React.useRef<HTMLDivElement>(null)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return
      const rect = cardRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      setRotateX((y - centerY) / centerY * -6)
      setRotateY((x - centerX) / centerX * 6)
    }

    const handleMouseLeave = () => {
      if (!tilt) return
      setRotateX(0)
      setRotateY(0)
    }

    const glassClasses = isGlass ? "glass-card backdrop-blur-xl" : ""
    const style = tilt ? {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: 'transform 0.1s ease-out',
    } as React.CSSProperties : {}

    const baseClasses = cn(
      "group relative rounded-2xl border bg-card text-card-foreground shadow-sm transition-all duration-500",
      glassClasses,
      hover && "hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 hover:border-primary/20",
      className
    )

    if (hover && !tilt) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          whileHover={{ y: -4 }}
          className={baseClasses}
          onMouseMove={(e) => { const r = (e.target as HTMLDivElement).getBoundingClientRect(); setMousePos({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }); setIsHovered(true) }}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isHovered && (
            <div className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, hsl(var(--primary) / 0.06), transparent 40%)`,
                }}
              />
            </div>
          )}
          {children}
        </motion.div>
      )
    }

    if (tilt) {
      return (
        <motion.div
          ref={cardRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={style}
          className={baseClasses}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
