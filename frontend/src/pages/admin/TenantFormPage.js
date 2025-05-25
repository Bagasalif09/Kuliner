import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getTenantById, createTenant, updateTenant } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './TenantFormPage.css';

const TenantFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;
  
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  
  useEffect(() => {
    if (isEditMode) {
      const fetchTenant = async () => {
        setLoading(true);
        try {
          const tenantData = await getTenantById(id);
          setTenant(tenantData);
          
          if (tenantData.banner_url) {
            setBannerPreview(tenantData.banner_url);
          }
        } catch (err) {
          setError('Error mengambil data tenant');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchTenant();
    } else {
      setLoading(false);
    }
  }, [isEditMode, id]);

  const initialValues = {
    name: tenant?.name || '',
    description: tenant?.description || '',
    banner: null
  };

  const validationSchema = Yup.object({
    name: Yup.string().required('Nama tenant wajib diisi')
  });

  const handleBannerChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue('banner', file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setBannerPreview(tenant?.banner_url || null);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (isEditMode) {
        await updateTenant(id, values);
      } else {
        await createTenant(values);
      }
      navigate('/admin/tenants');
    } catch (err) {
      setError(isEditMode 
        ? 'Gagal memperbarui tenant' 
        : 'Gagal membuat tenant baru');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="tenant-form-container">
          <h2>{isEditMode ? 'Edit Tenant' : 'Tambah Tenant Baru'}</h2>
          <div className="loading-spinner">Memuat data...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="tenant-form-container">
        <h2>{isEditMode ? 'Edit Tenant' : 'Tambah Tenant Baru'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form className="tenant-form">
              <div className="form-group">
                <label htmlFor="name">Nama Tenant</label>
                <Field type="text" id="name" name="name" />
                <ErrorMessage name="name" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="description">Deskripsi</label>
                <Field as="textarea" id="description" name="description" rows="3" />
                <ErrorMessage name="description" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="banner">Banner</label>
                <input
                  type="file"
                  id="banner"
                  name="banner"
                  className="image-input"
                  onChange={(e) => handleBannerChange(e, setFieldValue)}
                  accept=".jpg,.jpeg,.png,.webp"
                />
                <div className="image-help-text">
                  Format: JPG, JPEG, PNG, WEBP. Ukuran maksimal: 10MB
                  <br />
                  Rekomendasi ukuran: 1200 x 400 pixel (rasio 3:1) untuk tampilan optimal
                </div>
                
                {bannerPreview && (
                  <div className="image-preview-container">
                    <img 
                      src={bannerPreview} 
                      alt="Banner Preview" 
                      className="image-preview" 
                    />
                  </div>
                )}
              </div>
              
              <div className="form-actions">
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => navigate('/admin/tenants')}
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="submit-button" 
                  disabled={isSubmitting}
                >
                  {isSubmitting 
                    ? 'Menyimpan...' 
                    : (isEditMode ? 'Simpan Perubahan' : 'Tambah Tenant')}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default TenantFormPage; 