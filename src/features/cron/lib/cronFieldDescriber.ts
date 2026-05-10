import type { CronFieldPart, ParsedCronField } from './cronFieldParser'

export type CronFieldKind =
  | 'minute'
  | 'hour'
  | 'dayOfMonth'
  | 'month'
  | 'dayOfWeek'

export type CronFieldPartDescription = {
  raw: string
  kind: CronFieldPart['kind']
  description: string
}

export type CronFieldDescription = {
  field: CronFieldKind
  label: string
  raw: string
  description: string
  parts: CronFieldPartDescription[]
}

type CronFieldDefinition = {
  label: string
  wildcardLabel: string
  min: number
  max: number
  intervalUnit: string
  unit?: string
  formatValue?: (value: number) => string
}

const fieldDefinitions: Record<CronFieldKind, CronFieldDefinition> = {
  minute: {
    label: '分',
    wildcardLabel: '毎分',
    min: 0,
    max: 59,
    intervalUnit: '分',
    unit: '分',
  },
  hour: {
    label: '時',
    wildcardLabel: '毎時',
    min: 0,
    max: 23,
    intervalUnit: '時間',
    unit: '時',
  },
  dayOfMonth: {
    label: '日',
    wildcardLabel: '毎日',
    min: 1,
    max: 31,
    intervalUnit: '日',
    unit: '日',
  },
  month: {
    label: '月',
    wildcardLabel: '毎月',
    min: 1,
    max: 12,
    intervalUnit: 'か月',
    unit: '月',
  },
  dayOfWeek: {
    label: '曜日',
    wildcardLabel: '曜日に関係なく',
    min: 0,
    max: 7,
    intervalUnit: '日',
    formatValue: formatDayOfWeek,
  },
}

export function describeCronField(
  parsedField: ParsedCronField,
  field: CronFieldKind,
): CronFieldDescription {
  const definition = fieldDefinitions[field]
  const parts = parsedField.parts.map((part) =>
    describePart(part, definition),
  )

  return {
    field,
    label: definition.label,
    raw: parsedField.raw,
    description: parts.map((part) => part.description).join('、'),
    parts,
  }
}

function describePart(
  part: CronFieldPart,
  definition: CronFieldDefinition,
): CronFieldPartDescription {
  switch (part.kind) {
    case 'wildcard':
      return {
        raw: part.raw,
        kind: part.kind,
        description: definition.wildcardLabel,
      }
    case 'value':
      assertInRange(part.value, definition)
      return {
        raw: part.raw,
        kind: part.kind,
        description: formatValue(part.value, definition),
      }
    case 'range':
      assertInRange(part.start, definition)
      assertInRange(part.end, definition)
      return {
        raw: part.raw,
        kind: part.kind,
        description: `${formatValue(part.start, definition)}から${formatValue(
          part.end,
          definition,
        )}まで`,
      }
    case 'interval':
      return {
        raw: part.raw,
        kind: part.kind,
        description: `${part.step}${definition.intervalUnit}ごと`,
      }
    case 'rangeInterval':
      assertInRange(part.start, definition)
      assertInRange(part.end, definition)
      return {
        raw: part.raw,
        kind: part.kind,
        description: `${formatValue(part.start, definition)}から${formatValue(
          part.end,
          definition,
        )}まで${part.step}${definition.intervalUnit}ごと（${formatIntervalValues(
          part.start,
          part.end,
          part.step,
          definition,
        )}）`,
      }
  }
}

function assertInRange(value: number, definition: CronFieldDefinition) {
  if (value < definition.min || value > definition.max) {
    throw new Error(
      `${definition.label}の値は${definition.min}-${definition.max}で指定してください。`,
    )
  }
}

function formatValue(value: number, definition: CronFieldDefinition): string {
  if (definition.formatValue !== undefined) {
    return definition.formatValue(value)
  }

  return `${value}${definition.unit ?? ''}`
}

function formatIntervalValues(
  start: number,
  end: number,
  step: number,
  definition: CronFieldDefinition,
): string {
  const values = []

  for (let value = start; value <= end; value += step) {
    values.push(formatValue(value, definition))
  }

  return values.join('、')
}

function formatDayOfWeek(value: number): string {
  const normalizedValue = value === 7 ? 0 : value
  const labels = [
    '日曜日',
    '月曜日',
    '火曜日',
    '水曜日',
    '木曜日',
    '金曜日',
    '土曜日',
  ]

  return labels[normalizedValue]
}
