import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://dahua.metcfire.com.tw/api/CRUDTest',
});

axiosInstance.interceptors.request.use((config) => {
  config.headers['Content-Type'] = 'application/json';
  return config;
});

axiosInstance.interceptors.response.use((response) => {
  return response.data;
});
