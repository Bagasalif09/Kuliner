import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllTenants, getMenuById, addMenu, updateMenu, uploadMenuImage } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './MenuFormPage.css';

const MenuFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [menu, setMenu] = useState(null);
  const [tenants, setTenants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');
  
  const kategori = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'paket', label: 'Paket' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tenantsData = await getAllTenants();
        setTenants(tenantsData);

        if (isEditMode) {
          const menuData = await getMenuById(id);
          setMenu(menuData);
          if (menuData.image_url) {
            setImagePreview(process.env.REACT_APP_API_URL?.replace('/api', '') + menuData.image_url || menuData.image_url);
            // Extract filename from path
            const imagePath = menuData.image_url;
            const fileName = imagePath.split('/').pop();
            setFileName(fileName || 'Gambar saat ini');
          }
        }
      } catch (err) {
        setError(isEditMode 
          ? 'Error mengambil data menu' 
          : 'Error mengambil data tenant');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const initialValues = {
    tenant_id: menu?.tenant_id || '',
    name: menu?.name || '',
    price: menu?.price || '',
    description: menu?.description || '',
    category: menu?.category || '',
    image_url: menu?.image_url || '',
  };

  const validationSchema = Yup.object({
    tenant_id: Yup.number()
      .required('Tenant wajib dipilih'),
    name: Yup.string()
      .required('Nama menu wajib diisi')
      .max(100, 'Nama menu maksimal 100 karakter'),
    price: Yup.number()
      .required('Harga wajib diisi')
      .min(0, 'Harga tidak boleh negatif'),
    description: Yup.string(),
    category: Yup.string()
      .required('Kategori wajib dipilih'),
  });

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      let result;
      
      if (isEditMode) {
        result = await updateMenu(id, values);
      } else {
        result = await addMenu(values);
      }

      if (imageFile) {
        const menuId = isEditMode ? id : result.id;
        await uploadMenuImage(menuId, imageFile);
      }
      
      navigate('/admin/menus');
    } catch (err) {
      setError(isEditMode 
        ? 'Gagal memperbarui menu' 
        : 'Gagal menambahkan menu');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-spinner">Memuat data...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="error-message">{error}</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="menu-form-container">
        <h2>{isEditMode ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, values }) => (
            <Form className="menu-form">
              <div className="form-group">
                <label htmlFor="tenant_id">Tenant</label>
                <Field as="select" name="tenant_id" id="tenant_id">
                  <option value="">-- Pilih Tenant --</option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>
                      {tenant.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="tenant_id" component="div" className="error-text" />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nama Menu</label>
                  <Field type="text" name="name" id="name" />
                  <ErrorMessage name="name" component="div" className="error-text" />
                </div>
                
                <div className="form-group">
                  <label htmlFor="price">Harga (Rp)</label>
                  <Field type="number" name="price" id="price" />
                  <ErrorMessage name="price" component="div" className="error-text" />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="category">Kategori</label>
                <Field as="select" name="category" id="category">
                  <option value="">-- Pilih Kategori --</option>
                  {kategori.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="category" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Deskripsi</label>
                <Field as="textarea" name="description" id="description" rows="4" />
                <ErrorMessage name="description" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Gambar Menu</label>
                <div className="image-hint">
                  Rekomendasi ukuran gambar: <b>400 x 320 px</b> (5:4), ukuran maksimal <b>5MB</b>
                </div>
                
                <div className="file-input-container">
                  <label htmlFor="image" className="file-input-label">
                    Pilih Gambar
                  </label>
                  <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="file-input"
                  />
                  {fileName && <div className="file-name">File: {fileName}</div>}
                </div>
                
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => navigate('/admin/menus')}
                  className="cancel-button"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting 
                    ? 'Menyimpan...' 
                    : isEditMode ? 'Perbarui Menu' : 'Tambah Menu'
                  }
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default MenuFormPage; 