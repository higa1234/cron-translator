import type { CronFieldKey, CronFields } from './types/cron'

export type CronFieldConfig = {
  key: CronFieldKey
  label: string
  placeholder: string
}

export const defaultCronFields: CronFields = {
  minute: '*',
  hour: '*',
  dayOfMonth: '*',
  month: '*',
  dayOfWeek: '*',
}

export const cronFieldConfigs: CronFieldConfig[] = [
  { key: 'minute', label: '分', placeholder: '例: 30' },
  { key: 'hour', label: '時', placeholder: '例: 12' },
  { key: 'dayOfMonth', label: '日', placeholder: '例: *' },
  { key: 'month', label: '月', placeholder: '例: *' },
  { key: 'dayOfWeek', label: '曜日', placeholder: '例: *' },
]

export const cronExpressionFieldOrder: CronFieldKey[] = [
  'minute',
  'hour',
  'dayOfMonth',
  'month',
  'dayOfWeek',
]

export const cronDisplayFieldOrder: CronFieldKey[] = [
  'month',
  'dayOfMonth',
  'dayOfWeek',
  'hour',
  'minute',
]

export const cronExamples = [
  { expression: '*', description: 'すべての値' },
  { expression: '30', description: '指定した値' },
  { expression: '1,15,30', description: '複数の指定値' },
  { expression: '9-17', description: '指定範囲の値' },
  { expression: '*/5', description: '全範囲で指定間隔ごと' },
  { expression: '9-17/2', description: '指定範囲内で指定間隔ごと' },
  { expression: '1,5-10,*/15', description: '複数ルールの組み合わせ' },
]
