import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getAllTenants, getMenuById, addMenu, updateMenu } from '../../services/api';
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

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateMenu(id, values);
      } else {
        await addMenu(values);
      }
      
      alert(isEditMode 
        ? 'Menu berhasil diperbarui!' 
        : 'Menu berhasil ditambahkan!');
      
      navigate('/admin/menus');
    } catch (err) {
      alert(isEditMode 
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
        <div className="loading-spinner">Loading...</div>
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