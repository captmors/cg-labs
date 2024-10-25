import { Box, Button, Grid, Image, VStack } from '@chakra-ui/react';
import { ImageData } from './etc/types';

interface ImageGalleryProps {
  images: ImageData[];
  onImageSelect: (url: string) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageSelect }) => {
  return (
    <Box flex="1" m={2} boxShadow="base" borderRadius="md" p={4}>
      <VStack h="full" gap={4}>
        <Button w="full" colorScheme="blue">
          Images
        </Button>
        <Box overflowY="auto" h="calc(100vh - 200px)" w="full">
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            {images.map((image) => (
              <Image
                key={image.id}
                src={image.url}
                alt={`Sample ${image.id}`}
                cursor="pointer"
                _hover={{ opacity: 0.8 }}
                onClick={() => onImageSelect(image.url)}
              />
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};