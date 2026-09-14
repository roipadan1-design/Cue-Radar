/**
 * Minimal CSV parser for RFC 4180 formatted CSV strings.
 * Handles quoted fields, escaped quotes, and newlines inside quotes.
 */
export function parseCsv(text: string): Record<string, string>[] {
  const lines: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const nextChar = text[i + 1]

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"'
        i++ // skip quote
      } else {
        inQuotes = !inQuotes
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim())
      currentField = ''
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++ // skip \n
      }
      currentRow.push(currentField.trim())
      currentField = ''
      if (currentRow.some((f) => f.length > 0)) {
        lines.push(currentRow)
      }
      currentRow = []
    } else {
      currentField += char
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim())
    if (currentRow.some((f) => f.length > 0)) {
      lines.push(currentRow)
    }
  }

  if (lines.length < 2) return []

  const headers = lines[0]
  const rows: Record<string, string>[] = []

  for (let r = 1; r < lines.length; r++) {
    const rowValues = lines[r]
    const record: Record<string, string> = {}
    for (let c = 0; c < headers.length; c++) {
      const header = headers[c]
      record[header] = rowValues[c] !== undefined ? rowValues[c] : ''
    }
    rows.push(record)
  }

  return rows
}
