import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { changePassword } from '../../services/api';
import AdminLayout from '../../components/admin/AdminLayout';
import './ChangePasswordPage.css';

const ChangePasswordPage = () => {
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const initialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    currentPassword: Yup.string()
      .required('Password saat ini wajib diisi'),
    newPassword: Yup.string()
      .required('Password baru wajib diisi')
      .min(6, 'Password minimal 6 karakter'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Password tidak cocok')
      .required('Konfirmasi password wajib diisi'),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setError('');
    setSuccess('');

    try {
      await changePassword(values.currentPassword, values.newPassword);
      setSuccess('Password berhasil diubah');
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengubah password');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="change-password-container">
        <h2>Ubah Password</h2>
        
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="change-password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Password Saat Ini</label>
                <Field 
                  type="password" 
                  name="currentPassword" 
                  id="currentPassword" 
                />
                <ErrorMessage 
                  name="currentPassword" 
                  component="div" 
                  className="error-text" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="newPassword">Password Baru</label>
                <Field 
                  type="password" 
                  name="newPassword" 
                  id="newPassword" 
                />
                <ErrorMessage 
                  name="newPassword" 
                  component="div" 
                  className="error-text" 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                <Field 
                  type="password" 
                  name="confirmPassword" 
                  id="confirmPassword" 
                />
                <ErrorMessage 
                  name="confirmPassword" 
                  component="div" 
                  className="error-text" 
                />
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Ubah Password'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default ChangePasswordPage; 