import { Box, Button } from '@chakra-ui/react'

function Lab1Window() {
  const openTkinterApp = async () => {
    try {
      const response = await fetch('http://localhost:8000/lab1', {
        method: 'POST'
      })
      if (!response.ok) {
        throw new Error('Failed to open Lab1')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <Box>
      <Button onClick={openTkinterApp}>Open Lab 1</Button>
    </Box>
  )
}

export default Lab1Window
