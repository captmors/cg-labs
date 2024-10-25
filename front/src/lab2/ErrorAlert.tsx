import { Box, Text } from '@chakra-ui/react';

interface ErrorAlertProps {
  isVisible: boolean;
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ isVisible, message }) => {
  if (!isVisible) return null;

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      bg="red.500"
      color="white"
      p={4}
      borderRadius="md"
      boxShadow="lg"
    >
      <Text fontWeight="bold" mb={1}>Error</Text>
      <Text>{message}</Text>
    </Box>
  );
};