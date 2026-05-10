import { Box, Grid, Heading, Stack, Text } from '@chakra-ui/react'

import { cronDisplayFieldOrder } from '../constants'
import type { CronResult } from '../types/cron'

type CronResultViewProps = {
  result: CronResult
}

export function CronResultView({ result }: CronResultViewProps) {
  if (!result.ok) {
    return (
      <Stack gap={3}>
        <Heading size="md">解析結果</Heading>
        <Box
          role="alert"
          borderWidth="1px"
          borderColor="red.300"
          borderRadius="md"
          p={5}
          bg="red.50"
          _dark={{
            bg: 'red.950',
            borderColor: 'red.700',
          }}
        >
          <Text color="red.600" fontWeight="semibold" _dark={{ color: 'red.200' }}>
            {result.message}
          </Text>
        </Box>
      </Stack>
    )
  }

  const sortedFieldDescriptions = cronDisplayFieldOrder.map((fieldKey) => {
    const fieldDescription = result.fieldDescriptions.find(
      (field) => field.field === fieldKey,
    )

    if (fieldDescription === undefined) {
      throw new Error(`解析結果が見つかりません: ${fieldKey}`)
    }

    return fieldDescription
  })

  return (
    <Stack gap={3}>
      <Heading size="md">解析結果</Heading>
      <Box
        bg="white"
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="md"
        p={{ base: 3, md: 4 }}
        _dark={{
          bg: 'gray.800',
          borderColor: 'whiteAlpha.200',
        }}
      >
        <Stack gap={4} aria-live="polite">
        <Stack gap={0} maxW="3xl" w="100%">
          <Grid
            borderBottomWidth="1px"
            borderColor="gray.200"
            color="fg.muted"
            fontSize="sm"
            fontWeight="semibold"
            gap={3}
            pb={2}
            templateColumns={{
              base: '4.5rem minmax(4rem, 5rem) 1fr',
              md: '7rem 8rem 1fr',
            }}
            _dark={{
              borderColor: 'whiteAlpha.200',
              color: 'gray.300',
            }}
          >
            <Text textAlign="center">項目</Text>
            <Text textAlign="center">Cron値</Text>
            <Text textAlign="center">説明</Text>
          </Grid>
          {sortedFieldDescriptions.map((field) => (
            <Grid
              key={field.field}
              borderBottomWidth="1px"
              borderColor="gray.100"
              gap={3}
              py={3}
              templateColumns={{
                base: '4.5rem minmax(4rem, 5rem) 1fr',
                md: '7rem 8rem 1fr',
              }}
              _dark={{ borderColor: 'whiteAlpha.100' }}
            >
              <Text
                color="fg.muted"
                fontSize="sm"
                textAlign="center"
                _dark={{ color: 'gray.300' }}
              >
                {field.label}
              </Text>
              <Text fontFamily="mono" fontWeight="bold" textAlign="center">
                {field.raw}
              </Text>
              <Stack align="center" gap={1}>
                <Text fontSize="sm" fontWeight="semibold">
                  {field.description}
                </Text>
              </Stack>
            </Grid>
          ))}
        </Stack>
        </Stack>
      </Box>
    </Stack>
  )
}
