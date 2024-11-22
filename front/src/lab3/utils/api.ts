import axios from "axios";
import { API_BASE_URL } from "../../utils/defines";
import { LineRequest, CircleRequest, AlgorithmResponse } from "./schemas";

export const postBresenhamLine = async (data: LineRequest): Promise<AlgorithmResponse> => {
  const response = await axios.post(`${API_BASE_URL}/lab3/bresenham_line`, data);
  return response.data;
};

export const postDDA = async (data: LineRequest): Promise<AlgorithmResponse> => {
  const response = await axios.post(`${API_BASE_URL}/lab3/dda`, data);
  return response.data;
};

export const postBresenhamCircle = async (data: CircleRequest): Promise<AlgorithmResponse> => {
  const response = await axios.post(`${API_BASE_URL}/lab3/bresenham_circle`, data);
  return response.data;
};

export const postStep = async (data: LineRequest): Promise<AlgorithmResponse> => {
  const response = await axios.post(`${API_BASE_URL}/lab3/step`, data);
  return response.data;
};
