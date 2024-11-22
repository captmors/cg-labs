import { Box, Flex, useDisclosure, Button } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { TabHeader } from './TabHeader';
import ImageGallery from './ImageGallery';
import { ImageDisplay } from './ImageDisplay';
import { ErrorAlert } from './ErrorAlert';
import { TabType } from './utils/types';
import { fetchRawImages } from './utils/api';
import { ImageData } from './utils/types';
import { applyImageFilter } from './utils/api'; 

const Lab2Window = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedImageBlob, setSelectedImageBlob] = useState<Blob | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('morph');
  const { open: showError, onOpen: showErrorAlert, onClose: hideErrorAlert } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);

  const [rawImages, setRawImages] = useState<ImageData[]>([]);

  const handleImageSelect = (imageUrl: string, imageBlob: Blob) => {
    setSelectedImage(imageUrl); 
    setSelectedImageBlob(imageBlob);
    setProcessedImage(null);
    hideErrorAlert();
  };

  const handleFunctionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFunction(event.target.value);
  };

  useEffect(() => {
    const loadRawImages = async () => {
      try {
        const images = await fetchRawImages(1, 10);
        setRawImages(images);
      } catch (error) {
        console.error('Error loading images:', error);
      }
    };

    loadRawImages();
  }, []);

  useEffect(() => {
    setSelectedImage(null);
    setProcessedImage(null);
  }, [activeTab]);

  const handleApplyFilter = async () => {
    if (!selectedImage || !selectedFunction) {
      showErrorAlert();
      return;
    }
  
    setIsLoading(true);
  
    try {
      const result = await applyImageFilter(selectedImageBlob, selectedFunction, activeTab);
      setProcessedImage(result);
    } catch (error) {
      console.error('Error applying filter:', error);
      showErrorAlert();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box 
      h="100vh" 
      display="flex" 
      flexDirection="column" 
      overflow="hidden"  
    >
      <Flex width="100%" alignItems="flex-start" direction="column">
        <Button
          colorScheme="teal"
          onClick={handleApplyFilter}
          disabled={!selectedImage || !selectedFunction}
          height="40px"  
          ml={4}         
          mt={2}         
        >
          Apply Filter
        </Button>

        <Box flex="1">
          <TabHeader
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedFunction={selectedFunction}
            handleFunctionSelect={handleFunctionSelect}
            isLoading={isLoading}
          />
        </Box>
      </Flex>

      <Flex 
        flex="1" 
        width="100%" 
        height="100%" 
        minHeight="0"
        overflow="hidden"  
      >
        <ImageGallery
          onImageSelect={handleImageSelect}
          selectedImage={selectedImage}
          images={rawImages}
        />

        <Flex flex="2" minHeight="0">
          <ImageDisplay
            imageUrl={selectedImage}
            placeholderText="Select an image from the gallery"
          />

          <ImageDisplay
            imageUrl={processedImage}
            placeholderText="Processed image will appear here"
          />
        </Flex>
      </Flex>

      <ErrorAlert
        open={showError}
        onClose={hideErrorAlert}
        message="Please select both an image and a function to proceed."
      />
    </Box>
  );
};

export default Lab2Window;
