import React, { useId } from 'react'

interface FieldProps {
  label: string
  id?: string
  error?: string
  helpText?: string
  children: React.ReactNode
}

export default function Field({ label, id, error, helpText, children }: FieldProps) {
  const generatedId = useId()
  const fieldId = id || generatedId

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label htmlFor={fieldId} className="t-meta text-muted">
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id: fieldId })
        : children}
      {helpText && !error && <p className="t-meta text-muted normal-case">{helpText}</p>}
      {error && <p className="t-meta text-urgent normal-case">{error}</p>}
    </div>
  )
}
