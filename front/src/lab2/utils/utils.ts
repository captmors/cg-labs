/**
 * Decodes a base64 image string to a Blob.
 * @param base64Image - Base64 encoded image string.
 * @returns A Blob object for the image.
 */
export const decodeBase64ToBlob = (base64Image: string): Blob => {
    const byteCharacters = atob(base64Image);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
  
    return new Blob([byteArray], { type: 'image/png' });
  };