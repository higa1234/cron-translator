import { Box } from '@chakra-ui/react'

export type ColorMode = 'light' | 'dark'

type ThemeToggleProps = {
  colorMode: ColorMode
  onToggle: () => void
}

export function ThemeToggle({ colorMode, onToggle }: ThemeToggleProps) {
  const nextColorMode = colorMode === 'light' ? 'dark' : 'light'

  return (
    <Box
      as="button"
      aria-label="テーマを切り替える"
      onClick={onToggle}
      position="absolute"
      right={{ base: 4, md: 6 }}
      top={{ base: 4, md: 6 }}
      zIndex="docked"
      px={3}
      py={1.5}
      borderWidth="1px"
      borderRadius="md"
      borderColor="gray.300"
      color="gray.700"
      bg="white"
      cursor="pointer"
      fontSize="sm"
      fontWeight="semibold"
      lineHeight="1.2"
      _hover={{ bg: 'gray.50' }}
      _focusVisible={{
        outline: '2px solid',
        outlineColor: 'blue.500',
        outlineOffset: '2px',
      }}
      _dark={{
        bg: 'gray.800',
        borderColor: 'whiteAlpha.300',
        color: 'gray.100',
        _hover: { bg: 'gray.700' },
      }}
    >
      {nextColorMode === 'dark' ? '🌙' : '☀️'}
    </Box>
  )
}
