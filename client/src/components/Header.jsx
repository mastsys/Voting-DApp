import React from "react"
import { Box, Heading } from "@chakra-ui/react"

function Header() {
  return (
    <Box bg="gray.200" p={4}>
      <Heading as="h1" size="lg" textAlign="left">
        Voting DApp
      </Heading>
    </Box>
  );
}

export default Header