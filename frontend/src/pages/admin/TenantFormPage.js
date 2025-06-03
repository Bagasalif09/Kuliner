import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getTenantInfo, updateTenantInfo, uploadTenantImage } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import '../admin/TenantFormPage.css';

const TenantFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (id) {
          const tenantData = await getTenantInfo(id);
          setTenant(tenantData);
          if (tenantData.tenant_image) {
            setImagePreview(process.env.REACT_APP_API_URL?.replace('/api', '') + tenantData.tenant_image);
            // Extract filename from path
            const imagePath = tenantData.tenant_image;
            const fileName = imagePath.split('/').pop();
            setFileName(fileName || 'Gambar saat ini');
          }
        }
      } catch (err) {
        setError('Error mengambil data tenant');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const initialValues = {
    description: tenant?.description || '',
    tenant_image: tenant?.tenant_image || '',
  };

  const validationSchema = Yup.object({
    description: Yup.string()
      .max(500, 'Deskripsi maksimal 500 karakter'),
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
      await updateTenantInfo(id, values);

      if (imageFile) {
        await uploadTenantImage(id, imageFile);
      }
      
      navigate('/admin/tenants');
    } catch (err) {
      setError('Gagal memperbarui tenant');
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
      <div className="tenant-form-container">
        <h2>Edit Informasi Tenant</h2>
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="tenant-form">
              <div className="form-group">
                <label htmlFor="description">Deskripsi Tenant</label>
                <Field as="textarea" name="description" id="description" rows="4" />
                <ErrorMessage name="description" component="div" className="error-text" />
              </div>
              
              <div className="form-group">
                <label htmlFor="image">Gambar Tenant</label>
                <div className="image-hint">
                  Rekomendasi ukuran gambar: <b>800 x 400 px</b> (2:1), ukuran maksimal <b>5MB</b>
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
                  onClick={() => navigate('/admin/tenants')}
                  className="cancel-button"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Perbarui Tenant'}
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