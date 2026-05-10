import { describe, expect, test } from 'vitest'

import { describeCronField } from '../lib/cronFieldDescriber'
import { parseCronField } from '../lib/cronFieldParser'

describe('describeCronField', () => {
  test('ワイルドカードを説明する', () => {
    expect(describeCronField(parseCronField('*'), 'minute')).toMatchObject({
      field: 'minute',
      label: '分',
      raw: '*',
      description: '毎分',
      parts: [
        {
          raw: '*',
          kind: 'wildcard',
          description: '毎分',
        },
      ],
    })
  })

  test('数値を説明する', () => {
    expect(describeCronField(parseCronField('30'), 'minute')).toMatchObject({
      description: '30分',
      parts: [
        {
          raw: '30',
          kind: 'value',
          description: '30分',
        },
      ],
    })
  })

  test('範囲指定を説明する', () => {
    expect(describeCronField(parseCronField('9-17'), 'hour')).toMatchObject({
      description: '9時から17時まで',
      parts: [
        {
          raw: '9-17',
          kind: 'range',
          description: '9時から17時まで',
        },
      ],
    })
  })

  test('間隔指定を説明する', () => {
    expect(describeCronField(parseCronField('*/5'), 'minute')).toMatchObject({
      description: '5分ごと',
      parts: [
        {
          raw: '*/5',
          kind: 'interval',
          description: '5分ごと',
        },
      ],
    })
  })

  test('範囲つき間隔指定を説明する', () => {
    expect(describeCronField(parseCronField('9-17/2'), 'hour')).toMatchObject({
      description: '9時から17時まで2時間ごと（9時、11時、13時、15時、17時）',
      parts: [
        {
          raw: '9-17/2',
          kind: 'rangeInterval',
          description:
            '9時から17時まで2時間ごと（9時、11時、13時、15時、17時）',
        },
      ],
    })
  })

  test('範囲つき間隔指定に該当値を表示する', () => {
    expect(describeCronField(parseCronField('1-12/3'), 'month')).toMatchObject({
      description: '1月から12月まで3か月ごと（1月、4月、7月、10月）',
    })
    expect(describeCronField(parseCronField('5-22/3'), 'hour')).toMatchObject({
      description: '5時から22時まで3時間ごと（5時、8時、11時、14時、17時、20時）',
    })
    expect(describeCronField(parseCronField('0-59/10'), 'minute')).toMatchObject({
      description: '0分から59分まで10分ごと（0分、10分、20分、30分、40分、50分）',
    })
    expect(describeCronField(parseCronField('1-5/2'), 'dayOfWeek')).toMatchObject({
      description: '月曜日から金曜日まで2日ごと（月曜日、水曜日、金曜日）',
    })
  })

  test('カンマ区切りの混在指定を説明する', () => {
    expect(
      describeCronField(parseCronField('1,5-10,*/15'), 'minute'),
    ).toMatchObject({
      description: '1分、5分から10分まで、15分ごと',
      parts: [
        {
          raw: '1',
          kind: 'value',
          description: '1分',
        },
        {
          raw: '5-10',
          kind: 'range',
          description: '5分から10分まで',
        },
        {
          raw: '*/15',
          kind: 'interval',
          description: '15分ごと',
        },
      ],
    })
  })

  test('フィールド別のワイルドカードと間隔指定を自然な文言で説明する', () => {
    expect(describeCronField(parseCronField('*'), 'month')).toMatchObject({
      description: '毎月',
    })
    expect(describeCronField(parseCronField('*'), 'dayOfMonth')).toMatchObject({
      description: '毎日',
    })
    expect(describeCronField(parseCronField('*'), 'dayOfWeek')).toMatchObject({
      description: '曜日に関係なく',
    })
    expect(describeCronField(parseCronField('*'), 'hour')).toMatchObject({
      description: '毎時',
    })
    expect(describeCronField(parseCronField('*/2'), 'hour')).toMatchObject({
      description: '2時間ごと',
    })
    expect(describeCronField(parseCronField('*/3'), 'month')).toMatchObject({
      description: '3か月ごと',
    })
    expect(describeCronField(parseCronField('*/2'), 'dayOfMonth')).toMatchObject({
      description: '2日ごと',
    })
    expect(describeCronField(parseCronField('*/2'), 'dayOfWeek')).toMatchObject({
      description: '2日ごと',
    })
  })

  test('曜日の数値を曜日名で説明する', () => {
    expect(describeCronField(parseCronField('1-5'), 'dayOfWeek')).toMatchObject({
      description: '月曜日から金曜日まで',
    })
    expect(describeCronField(parseCronField('7'), 'dayOfWeek')).toMatchObject({
      description: '日曜日',
    })
  })

  test('フィールドの範囲外値をエラーにする', () => {
    expect(() => describeCronField(parseCronField('60'), 'minute')).toThrow(
      '分の値は0-59で指定してください。',
    )
  })
})
