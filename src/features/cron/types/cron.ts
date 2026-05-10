import type { CronFieldDescription } from '../lib/cronFieldDescriber'

export type CronFields = {
  minute: string
  hour: string
  dayOfMonth: string
  month: string
  dayOfWeek: string
}

export type CronFieldKey = keyof CronFields

export type CronErrorCode = 'empty' | 'field-count' | 'invalid-field'

export type CronResult =
  | {
      ok: true
      normalized: string
      fields: CronFields
      fieldDescriptions: CronFieldDescription[]
    }
  | {
      ok: false
      errorCode: CronErrorCode
      message: string
    }
