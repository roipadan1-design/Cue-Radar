'use client'

import React, { useEffect, useRef } from 'react'

interface SheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function Sheet({ isOpen, onClose, children, title }: SheetProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (isOpen) {
      if (!dialog.open) {
        dialog.showModal()
      }
    } else {
      if (dialog.open) {
        dialog.close()
      }
    }
  }, [isOpen])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    const handleCancel = (e: Event) => {
      e.preventDefault()
      onClose()
    }

    dialog.addEventListener('cancel', handleCancel)
    return () => {
      dialog.removeEventListener('cancel', handleCancel)
    }
  }, [onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onClose()
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 m-0 h-full w-full max-w-none max-h-none p-0 bg-transparent flex [&:not([open])]:hidden flex-col justify-end border-none transition-all duration-200 ease-out backdrop:bg-backdrop ${
        isOpen
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="w-full bg-surface border-t border-line rounded-t-[var(--radius)] p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="w-8 h-[3px] bg-line-strong mx-auto rounded-[var(--radius)] flex-shrink-0" />
        {title && <h2 className="t-row text-fg">{title}</h2>}
        <div>{children}</div>
      </div>
    </dialog>
  )
}
