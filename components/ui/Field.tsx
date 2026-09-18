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
      <label htmlFor={fieldId} className="t-label">
        {label}
      </label>
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<{ id?: string }>, { id: fieldId })
        : children}
      {helpText && !error && <p className="t-meta">{helpText}</p>}
      {error && (
        <p className="t-meta text-urgent" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
