import axios from 'axios';

export const loginRequest = async (data) => {
  const response = await axios.post(
    'http://localhost:8002/login',
    data
  );

  return response.data;
};