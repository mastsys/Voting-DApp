import { EthProvider } from "./contexts/EthContext";
import { ChakraProvider } from '@chakra-ui/react'
import Header from "./components/Header";

function App() {
  return (

    <ChakraProvider>
      <EthProvider>
          
      <div id="App">
        <Header />

        {/* <Intro />
        <hr />
        <Setup />
        <hr />
        <Demo />
        <hr /> */}


      </div>
    </EthProvider>
  </ChakraProvider>
  );
}

export default App;
