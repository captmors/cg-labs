import { Box, VStack, Button } from '@chakra-ui/react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  return (
    <Box w="200px" bg="gray.100" p={4}>
      <VStack>
        <Button
          w="full"
          colorScheme={activeTab === 'lab1' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('lab1')}
        >
          Lab 1
        </Button>
        <Button
          w="full"
          colorScheme={activeTab === 'lab2' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('lab2')}
        >
          Lab 2
        </Button>
        <Button
          w="full"
          colorScheme={activeTab === 'lab3' ? 'blue' : 'gray'}
          onClick={() => setActiveTab('lab3')}
        >
          Lab 3
        </Button>
      </VStack>
    </Box>
  )
}

export default Sidebar
