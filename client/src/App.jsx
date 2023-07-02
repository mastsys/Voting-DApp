import { EthProvider } from "./contexts/EthContext"
import { ChakraProvider } from '@chakra-ui/react'
import Header from "./components/Header"
import AdminBoard from "./components/AdminBoard"
import UserBoard from "./components/UserBoard"
import Intro from "./components/Intro"

function App() {
  return (
    <ChakraProvider>
      <EthProvider>
      <div id="App">
        <Header />
        <hr />
        <Intro />
      </div>
    </EthProvider>
  </ChakraProvider>
  );
}

export default App;
