import { EthProvider } from "./contexts/EthContext"
import { ChakraProvider } from '@chakra-ui/react'
import Header from "./components/Header"
import Footer from "./components/Footer"
import Intro from "./components/Intro"

function App() {
  return (
    <ChakraProvider>
      <EthProvider>
      <div id="App">
        <Header/>
        <hr/>
        <Intro/>
        <Footer/>
      </div>
    </EthProvider>
  </ChakraProvider>
  );
}

export default App;
