import { describe, expect, test } from 'vitest'

import { translateCron } from '../lib/translateCron'

describe('translateCron', () => {
  test('5フィールド全体をフィールド別解析結果に変換する', () => {
    const result = translateCron('*/5 9-17 1,15 * 1-5')

    expect(result.ok).toBe(true)
    expect(result).toMatchObject({
      normalized: '*/5 9-17 1,15 * 1-5',
      fields: {
        minute: '*/5',
        hour: '9-17',
        dayOfMonth: '1,15',
        month: '*',
        dayOfWeek: '1-5',
      },
      fieldDescriptions: [
        {
          field: 'minute',
          label: '分',
          raw: '*/5',
          description: '5分ごと',
        },
        {
          field: 'hour',
          label: '時',
          raw: '9-17',
          description: '9時から17時まで',
        },
        {
          field: 'dayOfMonth',
          label: '日',
          raw: '1,15',
          description: '1日、15日',
        },
        {
          field: 'month',
          label: '月',
          raw: '*',
          description: '毎月',
        },
        {
          field: 'dayOfWeek',
          label: '曜日',
          raw: '1-5',
          description: '月曜日から金曜日まで',
        },
      ],
    })
  })

  test('前後空白と連続スペースを正規化する', () => {
    const result = translateCron('  0   9   *   *   1  ')

    expect(result.ok).toBe(true)
    expect(result).toMatchObject({
      normalized: '0 9 * * 1',
      fieldDescriptions: [
        {
          field: 'minute',
          description: '0分',
        },
        {
          field: 'hour',
          description: '9時',
        },
        {
          field: 'dayOfMonth',
          description: '毎日',
        },
        {
          field: 'month',
          description: '毎月',
        },
        {
          field: 'dayOfWeek',
          description: '月曜日',
        },
      ],
    })
  })

  test.each(['', '   '])('空入力をエラーにする', (expression) => {
    const result = translateCron(expression)

    expect(result).toEqual({
      ok: false,
      errorCode: 'empty',
      message: 'Cron式を入力してください。',
    })
  })

  test.each(['0 9 * *', '0 9 * * * *'])(
    'フィールド数が5つではない入力をエラーにする',
    (expression) => {
      const result = translateCron(expression)

      expect(result).toEqual({
        ok: false,
        errorCode: 'field-count',
        message: 'Cron式は5つのフィールドで入力してください。',
      })
    },
  )

  test('フィールドの不正形式をエラーにする', () => {
    expect(translateCron('*/0 * * * *')).toEqual({
      ok: false,
      errorCode: 'invalid-field',
      message: '分: 間隔は1以上の整数で指定してください。',
    })
  })

  test('フィールドの範囲外値をエラーにする', () => {
    expect(translateCron('60 * * * *')).toEqual({
      ok: false,
      errorCode: 'invalid-field',
      message: '分: 分の値は0-59で指定してください。',
    })
  })
})
