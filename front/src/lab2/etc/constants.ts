import { ImageData } from "./types";

export const MORPH_FUNCTIONS = ["erosion", "dilation", "opening", "closure"];
export const NONLINEAR_FUNCTIONS = ["median", "minimum", "maximum"];
export const BASE_IMAGES: ImageData[] = [
  { url: "/api/placeholder", id: 1 },
  { url: "/api/placeholder", id: 2 },
  { url: "/api/placeholder", id: 3 },
  { url: "/api/placeholder", id: 4 },
  { url: "/api/placeholder", id: 5 },
  { url: "/api/placeholder", id: 6 },
];
