import { SimpleGrid, Box, Image } from '@chakra-ui/react';
import { ImageData } from './etc/types';

interface ImageGalleryProps {
  images: ImageData[];
  onImageSelect: (imageUrl: string, imageBlob: Blob) => void;
  selectedImage: string | null;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, onImageSelect, selectedImage }) => {
  return (
    <Box 
      flexShrink={0} 
      maxW={{ base: '100%', sm: '250px' }}
      p={2}
    >
      <SimpleGrid 
        columns={{ base: 2, sm: 3, md: 4 }} 
        gap={4}
      >
        {images.map((image) => (
          <Box
            key={image.id}
            boxShadow="md"
            borderRadius="md"
            cursor="pointer"
            onClick={() => onImageSelect(image.url, image.blob)} 
            _hover={{ transform: 'scale(1.05)', transition: 'transform 0.2s' }}
            border={selectedImage === image.url ? '2px solid #3182ce' : 'none'}
            p={2}
          >
            <Image
              src={image.url}
              alt={image.name}
              width="100%"
              height="auto"
              objectFit="cover"
              borderRadius="md"
            />
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default ImageGallery;
