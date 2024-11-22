import React, { useState } from 'react';
import { Box, Image, Text } from '@chakra-ui/react';

interface ImageDisplayProps {
  imageUrl: string | null;
  placeholderText: string;
}

export const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageUrl, placeholderText }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  const handleZoomToggle = () => {
    if (!isZoomed) {
      setIsZoomed(true);
      setZoomLevel(1.5);
    } else {
      if (zoomLevel === 1.5) setZoomLevel(2);
      else if (zoomLevel === 2) setZoomLevel(3);
      else {
        setIsZoomed(false);
        setZoomLevel(1);
      }
    }
  };

  return (
    <>
      <Box
        flex="1"
        m={2}
        boxShadow="base"
        borderRadius="md"
        p={4}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
        height="100%"
        minHeight="300px"
        overflow="auto"
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt="Image"
            objectFit="contain"
            maxWidth="100%"
            height="auto"
            cursor="zoom-in"
            onClick={handleZoomToggle}
            style={{ minWidth: 'auto' }}
          />
        ) : (
          <Text color="gray.400">{placeholderText}</Text>
        )}
      </Box>

      {isZoomed && imageUrl && (
        <Box
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="rgba(0, 0, 0, 0.7)"
          zIndex="modal"
          display="flex"
          alignItems="center"
          justifyContent="center"
          onClick={handleZoomToggle}
          cursor="zoom-in"
        >
          <Image
            src={imageUrl}
            alt="Zoomed Image"
            maxHeight="95vh"
            maxWidth="95vw"
            objectFit="contain"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
              transition: 'transform 0.2s ease-in-out',
            }}
            onClick={(e) => {
              e.stopPropagation();
              handleZoomToggle();
            }}
          />
          <Text
            position="absolute"
            top="10px"
            right="10px"
            color="white"
            bg="rgba(0, 0, 0, 0.5)"
            px={2}
            py={1}
            borderRadius="md"
          >
            {Math.round(zoomLevel * 100)}%
          </Text>
        </Box>
      )}
    </>
  );
};