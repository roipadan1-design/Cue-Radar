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

  if (!isOpen) return null

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 m-0 h-full w-full max-w-none max-h-none bg-black/60 p-0 flex flex-col justify-end border-none backdrop:bg-transparent"
    >
      <div className="w-full bg-surface border-t border-line rounded-t-lg p-5 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        <div className="w-8 h-[3px] bg-line-strong mx-auto rounded-full flex-shrink-0" />
        {title && <h2 className="t-row text-fg">{title}</h2>}
        <div>{children}</div>
      </div>
    </dialog>
  )
}
