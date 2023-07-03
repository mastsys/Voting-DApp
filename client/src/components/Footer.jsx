import React from "react"
import { Box, Heading } from "@chakra-ui/react"

function Footer() {
  return (
    <Box
      bg="gray.200"
      p={4}
      bottom={0}
      left={0}
      width="100%"
    >
      <Heading size="sm" textAlign="center">
        © 2023 VotinDApp 
      </Heading>
    </Box>
  );
}

export default Footer;
