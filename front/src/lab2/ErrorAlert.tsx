import { Box, Text } from '@chakra-ui/react';

interface ErrorAlertProps {
  open: boolean;
  onClose: () => void;
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ 
  open, 
  onClose, 
  message 
}) => {
  if (!open) return null;

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
      <Text 
        position="absolute" 
        top="4px" 
        right="4px" 
        cursor="pointer"
        onClick={onClose}
      >
        ✕
      </Text>
    </Box>
  );
};