import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': API_KEY
  }
});

// Fungsi untuk menambahkan token ke request
const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete apiClient.defaults.headers.common['x-auth-token'];
  }
};

// API Autentikasi
export const loginAdmin = async (username, password) => {
  try {
    const response = await apiClient.post('/auth/login', { username, password });
    const { token } = response.data;

    localStorage.setItem('token', token);
    
    setAuthToken(token);
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    
    const response = await apiClient.put('/auth/change-password', {
      currentPassword,
      newPassword
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Otomatis set token jika tersedia di localStorage
if (localStorage.token) {
  setAuthToken(localStorage.token);
}

// API Admin
export const getAllTenants = async () => {
  try {
    const response = await apiClient.get('/admin/tenants');
    return response.data;
  } catch (error) {
    console.error('Error mengambil tenant:', error);
    throw error;
  }
};

export const getAdminMenus = async () => {
  try {
    const response = await apiClient.get('/admin/menus');
    return response.data;
  } catch (error) {
    console.error('Error mengambil menu admin:', error);
    throw error;
  }
};

export const getMenuById = async (id) => {
  try {
    const response = await apiClient.get(`/admin/menus/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error mengambil menu dengan ID ${id}:`, error);
    throw error;
  }
};

export const addMenu = async (menuData) => {
  try {
    const response = await apiClient.post('/admin/menus', menuData);
    return response.data;
  } catch (error) {
    console.error('Error menambah menu:', error);
    throw error;
  }
};

export const updateMenu = async (id, menuData) => {
  try {
    const response = await apiClient.put(`/admin/menus/${id}`, menuData);
    return response.data;
  } catch (error) {
    console.error(`Error memperbarui menu dengan ID ${id}:`, error);
    throw error;
  }
};

export const deleteMenu = async (id) => {
  try {
    const response = await apiClient.delete(`/admin/menus/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error menghapus menu dengan ID ${id}:`, error);
    throw error;
  }
};

// API Menu Reguler
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

export const getAllTenantsPublic = async () => {
  try {
    const response = await apiClient.get('/public/tenants');
    return response.data;
  } catch (error) {
    console.error('Error mengambil data tenant:', error);
    return [];
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

// API untuk Upload Gambar
export const uploadMenuImage = async (menuId, imageFile) => {
  try {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(`/images/menu/${menuId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error mengupload gambar menu:`, error);
    throw error;
  }
};

export const uploadTenantImage = async (tenantId, imageFile) => {
  try {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await apiClient.post(`/images/tenant/${tenantId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error mengupload gambar tenant:`, error);
    throw error;
  }
};

export const updateTenantInfo = async (tenantId, data) => {
  try {
    const token = localStorage.getItem('token');
    setAuthToken(token);
    
    const response = await apiClient.put(`/images/tenant/${tenantId}/info`, data);
    return response.data;
  } catch (error) {
    console.error(`Error memperbarui informasi tenant:`, error);
    throw error;
  }
};

export const getTenantInfo = async (tenantId) => {
  try {
    const response = await apiClient.get(`/images/tenant/${tenantId}`);
    return response.data;
  } catch (error) {
    console.error(`Error mendapatkan informasi tenant:`, error);
    throw error;
  }
}; 