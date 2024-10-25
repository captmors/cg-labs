import { ChakraProvider, Flex, Box, defaultSystem } from '@chakra-ui/react';
import Sidebar from './components/lab2/Sidebar'
import { useState } from 'react'
import Lab1Window from './components/lab1/Lab1Window'
import Lab2Window from './components/lab2/Lab2Window'

function App() {
  const [activeTab, setActiveTab] = useState<string>('lab1')

  return (
    <ChakraProvider value={defaultSystem}>
      <Flex h="100vh">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <Box flex="1" p={4}>
          {activeTab === 'lab1' && <Lab1Window />}
          {activeTab === 'lab2' && <Lab2Window />}
        </Box>
      </Flex>
    </ChakraProvider>
  )
}

export default App
