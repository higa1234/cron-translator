export type CronFieldPart =
  | {
      kind: 'wildcard'
      raw: string
    }
  | {
      kind: 'value'
      raw: string
      value: number
    }
  | {
      kind: 'range'
      raw: string
      start: number
      end: number
    }
  | {
      kind: 'interval'
      raw: string
      step: number
    }
  | {
      kind: 'rangeInterval'
      raw: string
      start: number
      end: number
      step: number
    }

export type ParsedCronField = {
  raw: string
  parts: CronFieldPart[]
}

export function parseCronField(field: string): ParsedCronField {
  const raw = field.trim()

  if (raw.length === 0) {
    throw new Error('Cronフィールドが空です。')
  }

  if (/\s/.test(raw)) {
    throw new Error('Cronフィールドに空白は使用できません。')
  }

  const segments = raw.split(',')

  if (segments.some((segment) => segment.length === 0)) {
    throw new Error('カンマ区切りの指定が不正です。')
  }

  return {
    raw,
    parts: segments.map(parseCronFieldPart),
  }
}

function parseCronFieldPart(part: string): CronFieldPart {
  if (part === '*') {
    return {
      kind: 'wildcard',
      raw: part,
    }
  }

  const intervalMatch = part.match(/^\*\/(\d+)$/)
  if (intervalMatch !== null) {
    const step = parsePositiveInteger(intervalMatch[1], '間隔')

    return {
      kind: 'interval',
      raw: part,
      step,
    }
  }

  const rangeIntervalMatch = part.match(/^(\d+)-(\d+)\/(\d+)$/)
  if (rangeIntervalMatch !== null) {
    const start = parseNonNegativeInteger(rangeIntervalMatch[1], '範囲の開始値')
    const end = parseNonNegativeInteger(rangeIntervalMatch[2], '範囲の終了値')
    const step = parsePositiveInteger(rangeIntervalMatch[3], '間隔')
    assertValidRange(start, end)

    return {
      kind: 'rangeInterval',
      raw: part,
      start,
      end,
      step,
    }
  }

  const rangeMatch = part.match(/^(\d+)-(\d+)$/)
  if (rangeMatch !== null) {
    const start = parseNonNegativeInteger(rangeMatch[1], '範囲の開始値')
    const end = parseNonNegativeInteger(rangeMatch[2], '範囲の終了値')
    assertValidRange(start, end)

    return {
      kind: 'range',
      raw: part,
      start,
      end,
    }
  }

  if (/^\d+$/.test(part)) {
    return {
      kind: 'value',
      raw: part,
      value: parseNonNegativeInteger(part, '数値'),
    }
  }

  throw new Error(`Cronフィールドの形式が不正です: ${part}`)
}

function parseNonNegativeInteger(value: string, label: string): number {
  if (!/^\d+$/.test(value)) {
    throw new Error(`${label}は0以上の整数で指定してください。`)
  }

  return Number(value)
}

function parsePositiveInteger(value: string, label: string): number {
  const number = parseNonNegativeInteger(value, label)

  if (number < 1) {
    throw new Error(`${label}は1以上の整数で指定してください。`)
  }

  return number
}

function assertValidRange(start: number, end: number) {
  if (start > end) {
    throw new Error('範囲指定の開始値は終了値以下にしてください。')
  }
}
