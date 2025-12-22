import './App.css'

import {
  Heading,
  Box,
  Container,
  Stack,
} from "@chakra-ui/react";

function App() {

  return (
    <>
    <Container maxW="container.lg" centerContent>
      <Box w="100%" p={8}>
      <Stack gap={4}>
      <Heading size={{ base: "xl", md: "2xl" }} textAlign={"center"}>
              cron-translator
            </Heading>
      </Stack>

      </Box>
    </Container>
    </>
  )
}

export default App
