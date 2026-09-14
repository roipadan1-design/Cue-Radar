import React from 'react'

interface FieldProps {
  label: string
  error?: string
  helpText?: string
  children: React.ReactNode
}

export default function Field({ label, error, helpText, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="t-meta text-muted">{label}</label>
      {children}
      {helpText && !error && <p className="t-meta text-muted normal-case">{helpText}</p>}
      {error && <p className="t-meta text-urgent normal-case">{error}</p>}
    </div>
  )
}
