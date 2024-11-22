import axios from 'axios';
import { ImageData } from './types';
import { API_BASE_URL } from '../../utils/defines';
import { decodeBase64ToBlob } from './utils';

export const fetchRawImages = async (page: number, limit: number): Promise<ImageData[]> => {
  try {
    const response = await axios.get<{ id: number; name: string; image: string }[]>(
      `${API_BASE_URL}/lab2/images/raw`,
      {
        params: { page, limit },
        headers: { Accept: 'application/json' },
      }
    );

    if (!Array.isArray(response.data)) {
      throw new Error('Invalid response format: expected an array');
    }

    const images = response.data.map(item => {
      if (!item.image) {
        throw new Error(`Invalid image data for id ${item.id}`);
      }

      const blob = decodeBase64ToBlob(item.image);
      const url = URL.createObjectURL(blob);

      return {
        id: item.id,
        name: item.name,
        blob, // Keep the Blob object
        url,  // Generated URL for easy access
      };
    });

    return images;
  } catch (error) {
    console.error('Error fetching images:', error);
    throw new Error('Failed to fetch images');
  }
};


/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////

interface ApplyFilterResponse {
  image: string; // Base64 
}

export const applyImageFilter = async (
  selectedImageBlob: Blob | null,
  selectedFunction: string,
  activeTab: string
): Promise<string> => {
  if (!selectedImageBlob) {
    throw new Error("No image selected to apply the filter.");
  }

  const formData = new FormData();
  formData.append("file", selectedImageBlob, "image.png");

  const endpoint = `${API_BASE_URL}/lab2/${activeTab}/${selectedFunction}`;

  try {
    const response = await axios.post<ApplyFilterResponse>(endpoint, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data && response.data.image) {
      const blob = decodeBase64ToBlob(response.data.image);
      const url = URL.createObjectURL(blob);
      return url;
    } else {
      throw new Error("Invalid response data: no image received.");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error applying filter:", error.message);
      throw error;
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred.");
    }
  }
};