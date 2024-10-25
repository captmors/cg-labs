import { useState } from 'react';
import { Box, Flex, useDisclosure } from '@chakra-ui/react';
import { TabHeader } from './TabHeader';
import { ImageGallery } from './ImageGallery';
import { ImageDisplay } from './ImageDisplay';
import { ErrorAlert } from './ErrorAlert';
import { TabType } from './etc/types';
import { BASE_IMAGES } from './etc/constants';


const Lab2Window = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [selectedFunction, setSelectedFunction] = useState<string>('');
  const [activeTab, setActiveTab] = useState<TabType>('morph');
  const { open: showError, onOpen: showErrorAlert } = useDisclosure();

  const handleImageSelect = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setProcessedImage(null);
  };

  const handleFunctionSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFunction(event.target.value);
  };

  const handleApplyFilter = () => {
    if (!selectedImage || !selectedFunction) {
      showErrorAlert();
      return;
    }
    setProcessedImage('/api/placeholder');
  };

  return (
    <Box h="100vh" display="flex" flexDirection="column">
      <TabHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedFunction={selectedFunction}
        handleApplyFilter={handleApplyFilter}
        handleFunctionSelect={handleFunctionSelect}
      />

      <Flex flex="1">
        <ImageGallery
          images={BASE_IMAGES}
          onImageSelect={handleImageSelect}
        />
        
        <ImageDisplay
          imageUrl={selectedImage}
          placeholderText="Select an image from the gallery"
        />
        
        <ImageDisplay
          imageUrl={processedImage}
          placeholderText="Processed image will appear here"
        />
      </Flex>

      <ErrorAlert
        isVisible={showError}
        message="Please select both an image and a function to proceed."
      />
    </Box>
  );
};

export default Lab2Window;