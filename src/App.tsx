import './App.css'

import { Box, Container, Heading, Stack, Text, Theme } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

import { ThemeToggle, type ColorMode } from './components/common/ThemeToggle'
import { CronTranslator } from './features/cron'

const storageKey = 'cron-translator-color-mode'

function getInitialColorMode(): ColorMode {
  if (typeof window === 'undefined') {
    return 'light'
  }

  const savedColorMode = window.localStorage.getItem(storageKey)

  if (savedColorMode === 'light' || savedColorMode === 'dark') {
    return savedColorMode
  }

  if (typeof window.matchMedia !== 'function') {
    return 'light'
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

function applyColorMode(colorMode: ColorMode) {
  document.documentElement.classList.toggle('dark', colorMode === 'dark')
  document.documentElement.classList.toggle('light', colorMode === 'light')
  document.documentElement.style.colorScheme = colorMode
}

function App() {
  const [colorMode, setColorMode] = useState<ColorMode>(getInitialColorMode)

  useEffect(() => {
    applyColorMode(colorMode)
    window.localStorage.setItem(storageKey, colorMode)
  }, [colorMode])

  function toggleColorMode() {
    setColorMode((current) => (current === 'light' ? 'dark' : 'light'))
  }

  return (
    <Theme appearance={colorMode} hasBackground={false}>
      <Box
        minH="100vh"
        bg="#f7fafc"
        color="#172033"
        position="relative"
        _dark={{
          bg: 'gray.900',
          color: 'gray.100',
        }}
      >
        <ThemeToggle colorMode={colorMode} onToggle={toggleColorMode} />
        <Container maxW="container.lg" py={{ base: 8, md: 12 }}>
          <Stack gap={8}>
            <Stack gap={3} pr={{ base: 24, md: 0 }}>
              <Heading size={{ base: 'xl', md: '2xl' }}>cron-translator</Heading>
              <Text color="fg.muted" _dark={{ color: 'gray.300' }}>
                5フィールドのCron式を分解し、各フィールドの指定内容を表示します。
              </Text>
            </Stack>

            <CronTranslator />
          </Stack>
        </Container>
      </Box>
    </Theme>
  )
}

export default App
