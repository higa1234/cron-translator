import { Box, Heading, SimpleGrid, Stack, Text } from '@chakra-ui/react'

import { cronExamples } from '../constants'

export function CronExamples() {
  return (
    <Stack gap={3}>
      <Heading size="md">対応例</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} gap={3}>
        {cronExamples.map((example) => (
          <Box
            key={example.expression}
            bg="white"
            borderWidth="1px"
            borderColor="gray.200"
            borderRadius="md"
            p={4}
            _dark={{
              bg: 'gray.800',
              borderColor: 'whiteAlpha.200',
            }}
          >
            <Stack gap={1}>
              <Text fontFamily="mono">{example.expression}</Text>
              <Text color="fg.muted" _dark={{ color: 'gray.300' }}>
                {example.description}
              </Text>
            </Stack>
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  )
}
