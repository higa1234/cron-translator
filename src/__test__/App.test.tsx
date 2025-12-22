import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { ChakraProvider, defaultSystem } from "@chakra-ui/react";

test("Heading に cron-translator が表示されている", () => {
  render(
  <ChakraProvider value={defaultSystem}>
    <App />
  </ChakraProvider>
  );

  // 見出しテキストの存在確認
  expect(
    screen.getByRole("heading", { name: /cron-translator/i })
  ).toBeInTheDocument();
});
