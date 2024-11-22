import { ChakraProvider, Flex, Box, defaultSystem } from '@chakra-ui/react';
import Sidebar from './components/Sidebar'
import { useState } from 'react'
import Lab1Window from './lab1/Lab1Window'
import Lab2Window from './lab2/Lab2Window'
import Lab3Window from './lab3/Lab3Window';

function App() {
  const [activeTab, setActiveTab] = useState<string>('lab1')

  return (
    <ChakraProvider value={defaultSystem}>
      <Flex h="100vh">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box flex="1" p={4}>
          {activeTab === 'lab1' && <Lab1Window />}
          {activeTab === 'lab2' && <Lab2Window />}
          {activeTab === 'lab3' && <Lab3Window />}
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default App
