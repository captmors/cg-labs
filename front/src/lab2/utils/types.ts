export interface ImageData {
  id: number;
  name: string;
  blob: Blob;  
  url: string; 
}


export type TabType = 'morph' | 'nonlinear';
