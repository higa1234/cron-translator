import {
  describeCronField,
  type CronFieldDescription,
  type CronFieldKind,
} from './cronFieldDescriber'
import { parseCronField } from './cronFieldParser'

import type { CronFieldKey, CronFields, CronResult } from '../types/cron'

type CronFieldTranslatorConfig = {
  key: CronFieldKey
  kind: CronFieldKind
  label: string
}

const translatorConfigs: CronFieldTranslatorConfig[] = [
  { key: 'minute', kind: 'minute', label: '分' },
  { key: 'hour', kind: 'hour', label: '時' },
  { key: 'dayOfMonth', kind: 'dayOfMonth', label: '日' },
  { key: 'month', kind: 'month', label: '月' },
  { key: 'dayOfWeek', kind: 'dayOfWeek', label: '曜日' },
]

export function translateCron(input: string): CronResult {
  const trimmed = input.trim()

  if (trimmed.length === 0) {
    return {
      ok: false,
      errorCode: 'empty',
      message: 'Cron式を入力してください。',
    }
  }

  const parts = trimmed.split(/\s+/)

  if (parts.length !== 5) {
    return {
      ok: false,
      errorCode: 'field-count',
      message: 'Cron式は5つのフィールドで入力してください。',
    }
  }

  const fields: CronFields = {
    minute: parts[0],
    hour: parts[1],
    dayOfMonth: parts[2],
    month: parts[3],
    dayOfWeek: parts[4],
  }

  const fieldDescriptions: CronFieldDescription[] = []

  for (const { key, kind, label } of translatorConfigs) {
    try {
      fieldDescriptions.push(
        describeCronField(parseCronField(fields[key]), kind),
      )
    } catch (error) {
      return {
        ok: false,
        errorCode: 'invalid-field',
        message: `${label}: ${buildInvalidFieldMessage(error)}`,
      }
    }
  }

  return {
    ok: true,
    normalized: parts.join(' '),
    fields,
    fieldDescriptions,
  }
}

function buildInvalidFieldMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }

  return 'Cronフィールドの解析に失敗しました。'
}
