'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AccordionItem {
  question: string
  answer:   string
}

interface AccordionProps {
  items: AccordionItem[]
  variant?: 'light' | 'dark'
}

function AccordionRow({ item, isOpen, onToggle, variant }: {
  item:     AccordionItem
  isOpen:   boolean
  onToggle: () => void
  variant:  'light' | 'dark'
}) {
  const borderClass = variant === 'dark' ? 'border-white/10' : 'border-dark/8'
  const questionClass = variant === 'dark' ? 'text-white' : 'text-dark'
  const answerClass = variant === 'dark' ? 'text-white/60' : 'text-dark/60'

  return (
    <div className={`border-b ${borderClass} last:border-b-0`}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-6 py-6 text-left min-h-[44px]"
      >
        <span className={`font-display text-lg leading-snug ${questionClass}`}>
          {item.question}
        </span>

        {/* Plus icon rotates 45° to form an × when open */}
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="shrink-0 flex items-center justify-center w-6 h-6 text-primary"
          aria-hidden="true"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <line x1="8" y1="1" x2="8" y2="15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="1" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className={`leading-relaxed pb-6 text-base ${answerClass}`}>
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Accordion({ items, variant = 'light' }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {items.map((item, i) => (
        <AccordionRow
          key={item.question}
          item={item}
          variant={variant}
          isOpen={openIndex === i}
          onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
        />
      ))}
    </div>
  )
}
