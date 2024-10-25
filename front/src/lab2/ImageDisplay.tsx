import { Box, Image, Text } from '@chakra-ui/react';

interface ImageDisplayProps {
  imageUrl: string | null;
  placeholderText: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, placeholderText }) => {
  return (
    <Box
      flex="1"
      m={2}
      boxShadow="base"
      borderRadius="md"
      p={4}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="Image"
          maxW="full"
          maxH="full"
          objectFit="contain"
        />
      ) : (
        <Text color="gray.400">{placeholderText}</Text>
      )}
    </Box>
  );
};