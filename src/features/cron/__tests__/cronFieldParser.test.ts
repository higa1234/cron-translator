import { describe, expect, test } from 'vitest'

import { parseCronField } from '../lib/cronFieldParser'

describe('parseCronField', () => {
  test('ワイルドカードを解析する', () => {
    expect(parseCronField('*')).toEqual({
      raw: '*',
      parts: [
        {
          kind: 'wildcard',
          raw: '*',
        },
      ],
    })
  })

  test('数値を解析する', () => {
    expect(parseCronField('30')).toEqual({
      raw: '30',
      parts: [
        {
          kind: 'value',
          raw: '30',
          value: 30,
        },
      ],
    })
  })

  test('カンマ区切りを解析する', () => {
    expect(parseCronField('1,15,30')).toEqual({
      raw: '1,15,30',
      parts: [
        {
          kind: 'value',
          raw: '1',
          value: 1,
        },
        {
          kind: 'value',
          raw: '15',
          value: 15,
        },
        {
          kind: 'value',
          raw: '30',
          value: 30,
        },
      ],
    })
  })

  test('範囲指定を解析する', () => {
    expect(parseCronField('9-17')).toEqual({
      raw: '9-17',
      parts: [
        {
          kind: 'range',
          raw: '9-17',
          start: 9,
          end: 17,
        },
      ],
    })
  })

  test('間隔指定を解析する', () => {
    expect(parseCronField('*/5')).toEqual({
      raw: '*/5',
      parts: [
        {
          kind: 'interval',
          raw: '*/5',
          step: 5,
        },
      ],
    })
  })

  test('範囲つき間隔指定を解析する', () => {
    expect(parseCronField('9-17/2')).toEqual({
      raw: '9-17/2',
      parts: [
        {
          kind: 'rangeInterval',
          raw: '9-17/2',
          start: 9,
          end: 17,
          step: 2,
        },
      ],
    })
  })

  test('複数記法の混在を解析する', () => {
    expect(parseCronField('1,5-10,*/15,20-30/2')).toEqual({
      raw: '1,5-10,*/15,20-30/2',
      parts: [
        {
          kind: 'value',
          raw: '1',
          value: 1,
        },
        {
          kind: 'range',
          raw: '5-10',
          start: 5,
          end: 10,
        },
        {
          kind: 'interval',
          raw: '*/15',
          step: 15,
        },
        {
          kind: 'rangeInterval',
          raw: '20-30/2',
          start: 20,
          end: 30,
          step: 2,
        },
      ],
    })
  })

  test.each(['', '   '])('空文字をエラーにする', (field) => {
    expect(() => parseCronField(field)).toThrow('Cronフィールドが空です。')
  })

  test.each(['1,,2', ',1', '1,'])(
    '不正なカンマ区切りをエラーにする',
    (field) => {
      expect(() => parseCronField(field)).toThrow(
        'カンマ区切りの指定が不正です。',
      )
    },
  )

  test('空白を含むフィールドをエラーにする', () => {
    expect(() => parseCronField('1, 2')).toThrow(
      'Cronフィールドに空白は使用できません。',
    )
  })

  test('逆順の範囲指定をエラーにする', () => {
    expect(() => parseCronField('17-9')).toThrow(
      '範囲指定の開始値は終了値以下にしてください。',
    )
  })

  test.each(['*/0', '9-17/0'])(
    '0間隔指定をエラーにする',
    (field) => {
      expect(() => parseCronField(field)).toThrow(
        '間隔は1以上の整数で指定してください。',
      )
    },
  )

  test.each(['abc', '1/5', '*-5', '5-', '1..5'])(
    '未定義の記法をエラーにする',
    (field) => {
      expect(() => parseCronField(field)).toThrow(
        `Cronフィールドの形式が不正です: ${field}`,
      )
    },
  )
})
