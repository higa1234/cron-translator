import { Box, Button, Input, SimpleGrid, Stack, Text } from '@chakra-ui/react'
import type { ClipboardEvent } from 'react'

import { cronFieldConfigs } from '../constants'
import type { CronFieldKey, CronFields } from '../types/cron'

type CronFieldFormProps = {
  fields: CronFields
  cronExpression: string
  isCronExpressionCopied: boolean
  onFieldChange: (key: CronFieldKey, value: string) => void
  onCronExpressionPaste: (fields: CronFields) => void
  onCopyCronExpression: () => void
}

export function CronFieldForm({
  fields,
  cronExpression,
  isCronExpressionCopied,
  onFieldChange,
  onCronExpressionPaste,
  onCopyCronExpression,
}: CronFieldFormProps) {
  function handlePaste(event: ClipboardEvent<HTMLInputElement>) {
    const pastedText = event.clipboardData.getData('text').trim()
    const parts = pastedText.split(/\s+/)

    if (parts.length !== 5) {
      return
    }

    event.preventDefault()
    onCronExpressionPaste({
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4],
    })
  }

  return (
    <Stack gap={3}>
      <Stack
        align={{ base: 'stretch', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
        justify="space-between"
        gap={3}
      >
        <Text fontWeight="semibold">Cron式</Text>
        <Stack
          align="center"
          direction="row"
          gap={2}
          minH="2rem"
        >
          {isCronExpressionCopied && (
            <Text
              role="status"
              aria-live="polite"
              color="green.600"
              fontSize="sm"
              fontWeight="semibold"
              _dark={{ color: 'green.300' }}
            >
              Copied!
            </Text>
          )}
          <Button
            aria-label="Cron式をコピー"
            title="Cron式をコピー"
            onClick={onCopyCronExpression}
            size="sm"
            variant="outline"
            borderColor="gray.300"
            minW={9}
            px={0}
            _dark={{
              borderColor: 'whiteAlpha.300',
              color: 'gray.100',
              _hover: { bg: 'gray.700' },
            }}
          >
            ⧉
          </Button>
        </Stack>
      </Stack>
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        overflowX="auto"
        p={{ base: 3, md: 4 }}
        _dark={{
          bg: 'gray.800',
          borderColor: 'whiteAlpha.200',
        }}
      >
        <Text
          color="fg.muted"
          fontFamily="mono"
          fontSize="sm"
          mb={3}
          _dark={{ color: 'gray.300' }}
        >
          {cronExpression}
        </Text>
        <SimpleGrid columns={5} gap={3} minW="lg">
          {cronFieldConfigs.map(({ key, label, placeholder }) => {
            const id = `cron-${key}`

            return (
              <Box key={key}>
                <Stack gap={2}>
                  <label htmlFor={id}>
                    <Text
                      as="span"
                      fontSize="sm"
                      color="fg.muted"
                      _dark={{ color: 'gray.300' }}
                    >
                      {label}
                    </Text>
                  </label>
                  <Input
                    id={id}
                    size="sm"
                    bg="white"
                    borderColor="gray.300"
                    value={fields[key]}
                    onChange={(event) =>
                      onFieldChange(key, event.target.value)
                    }
                    onPaste={handlePaste}
                    placeholder={placeholder}
                    _dark={{
                      bg: 'gray.900',
                      borderColor: 'whiteAlpha.300',
                      color: 'gray.100',
                      _placeholder: { color: 'gray.500' },
                    }}
                  />
                </Stack>
              </Box>
            )
          })}
        </SimpleGrid>
      </Box>
    </Stack>
  )
}
