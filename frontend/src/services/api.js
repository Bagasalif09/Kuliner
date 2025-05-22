import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const API_KEY = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

export const checkApiKeyValid = async () => {
  try {
    await apiClient.get('/emak');
    return true;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      return false;
    }
    return true;
  }
};

export const getEmakMenu = async () => {
  try {
    const response = await apiClient.get('/emak');
    return response.data;
  } catch (error) {
    console.error('Error mengambil menu Emak:', error);
    return [];
  }
};

export const getGeprekMenu = async () => {
  try {
    const response = await apiClient.get('/geprek');
    return response.data;
  } catch (error) {
    console.error('Error mengambil menu Geprek:', error);
    return [];
  }
};

export const getTempuraMenu = async () => {
  try {
    const response = await apiClient.get('/tempura');
    return response.data;
  } catch (error) {
    console.error('Error mengambil menu Tempura:', error);
    return [];
  }
};

export const getSedepMenu = async () => {
  try {
    const response = await apiClient.get('/sedep');
    return response.data;
  } catch (error) {
    console.error('Error mengambil menu Sedep:', error);
    return [];
  }
};

export const getAllMenus = async () => {
  try {
    const [emakData, geprekData, tempuraData, sedepData] = await Promise.all([
      getEmakMenu(),
      getGeprekMenu(),
      getTempuraMenu(),
      getSedepMenu()
    ]);
    
    return {
      emak: emakData,
      geprek: geprekData,
      tempura: tempuraData,
      sedep: sedepData
    };
  } catch (error) {
    console.error('Error mengambil semua menu:', error);
    return {
      emak: [],
      geprek: [],
      tempura: [],
      sedep: []
    };
  }
}; 