import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import {
  cleanup,
  render,
  screen,
  waitForElementToBeRemoved,
} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, expect, test, vi } from 'vitest'

import App from '../App'

afterEach(() => {
  document.documentElement.classList.remove('dark', 'light')
  window.localStorage.clear()
  vi.useRealTimers()
  cleanup()
})

function renderApp() {
  return render(
    <ChakraProvider value={defaultSystem}>
      <App />
    </ChakraProvider>,
  )
}

test('Heading に cron-translator が表示されている', () => {
  renderApp()

  expect(
    screen.getByRole('heading', { name: /cron-translator/i }),
  ).toBeInTheDocument()
})

test('テーマ切替ボタンでダークモードに切り替わる', async () => {
  const user = userEvent.setup()
  renderApp()

  await user.click(screen.getByRole('button', { name: 'テーマを切り替える' }))

  expect(document.documentElement).toHaveClass('dark')
  expect(
    screen.getByRole('button', { name: 'テーマを切り替える' }),
  ).toHaveTextContent('☀️')
})

test('Cron式を入力すると日本語説明と分解結果が表示される', async () => {
  const user = userEvent.setup()
  renderApp()

  await user.clear(screen.getByRole('textbox', { name: '分' }))
  await user.type(screen.getByRole('textbox', { name: '分' }), '0')
  await user.clear(screen.getByRole('textbox', { name: '時' }))
  await user.type(screen.getByRole('textbox', { name: '時' }), '9')
  await user.clear(screen.getByRole('textbox', { name: '曜日' }))
  await user.type(screen.getByRole('textbox', { name: '曜日' }), '1')

  expect(screen.queryByText('正規化したCron式')).not.toBeInTheDocument()
  expect(screen.getByText('月曜日')).toBeInTheDocument()
  expect(screen.getAllByText('曜日').length).toBeGreaterThan(0)
})

test('5フィールドCron式を貼り付けると各入力欄に分配される', async () => {
  const user = userEvent.setup()
  renderApp()

  const minuteInput = screen.getByRole('textbox', { name: '分' })
  await user.clear(minuteInput)
  await user.click(minuteInput)
  await user.paste('*/10 5-22 * * 1-5')

  expect(screen.getByRole('textbox', { name: '分' })).toHaveValue('*/10')
  expect(screen.getByRole('textbox', { name: '時' })).toHaveValue('5-22')
  expect(screen.getByRole('textbox', { name: '日' })).toHaveValue('*')
  expect(screen.getByRole('textbox', { name: '月' })).toHaveValue('*')
  expect(screen.getByRole('textbox', { name: '曜日' })).toHaveValue('1-5')
  expect(screen.getByText('10分ごと')).toBeInTheDocument()
  expect(screen.getByText('5時から22時まで')).toBeInTheDocument()
  expect(screen.getByText('月曜日から金曜日まで')).toBeInTheDocument()
})

test('コピーボタンで入力中のCron式をクリップボードにコピーする', async () => {
  const user = userEvent.setup()
  const writeText = vi.fn().mockResolvedValue(undefined)
  Object.defineProperty(navigator, 'clipboard', {
    configurable: true,
    value: { writeText },
  })
  renderApp()

  await user.clear(screen.getByRole('textbox', { name: '分' }))
  await user.type(screen.getByRole('textbox', { name: '分' }), '*/10')
  await user.clear(screen.getByRole('textbox', { name: '時' }))
  await user.type(screen.getByRole('textbox', { name: '時' }), '5-22')
  await user.clear(screen.getByRole('textbox', { name: '曜日' }))
  await user.type(screen.getByRole('textbox', { name: '曜日' }), '1-5')

  await user.click(screen.getByRole('button', { name: 'Cron式をコピー' }))

  expect(writeText).toHaveBeenCalledWith('*/10 5-22 * * 1-5')
  expect(screen.getByRole('status')).toHaveTextContent('Copied!')

  await waitForElementToBeRemoved(() => screen.queryByRole('status'), {
    timeout: 3000,
  })
})

test('不正なCron式ではエラーを表示する', async () => {
  const user = userEvent.setup()
  renderApp()

  await user.clear(screen.getByRole('textbox', { name: '曜日' }))

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Cron式は5つのフィールドで入力してください。',
  )
  expect(screen.queryByText('正規化したCron式')).not.toBeInTheDocument()
})
