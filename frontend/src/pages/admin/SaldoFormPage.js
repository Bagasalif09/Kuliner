import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import AdminLayout from '../../components/admin/AdminLayout';
import './SaldoFormPage.css';

const TransactionFormPage = () => {
  const navigate = useNavigate();

  const initialValues = {
    type: '', // pemasukan atau pengeluaran
    amount: '',
    description: '',
    entry_date: '',
  };

  const validationSchema = Yup.object({
    type: Yup.string().required('Pilih jenis transaksi'),
    amount: Yup.number()
      .required('Jumlah wajib diisi')
      .min(0, 'Jumlah tidak boleh negatif'),
    description: Yup.string().required('Deskripsi wajib diisi'),
    entry_date: Yup.date().required('Tanggal wajib diisi'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:3000/api/finance/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values)
      });

      if (!response.ok) throw new Error('Gagal menyimpan transaksi');

      alert('Transaksi berhasil disimpan!');
      navigate('/admin/saldo');
    } catch (err) {
      console.error(err);
      alert('Terjadi kesalahan saat menyimpan data');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="transaction-form-container">
        <h2>Catat Transaksi</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="transaction-form">
              <div className="form-group">
                <label htmlFor="type">Jenis Transaksi</label>
                <Field as="select" name="type" id="type">
                  <option value="">-- Pilih --</option>
                  <option value="pemasukan">Pemasukan</option>
                  <option value="pengeluaran">Pengeluaran</option>
                </Field>
                <ErrorMessage name="type" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="amount">Jumlah (Rp)</label>
                <Field type="number" name="amount" id="amount" />
                <ErrorMessage name="amount" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Deskripsi</label>
                <Field type="text" name="description" id="description" />
                <ErrorMessage name="description" component="div" className="error-text" />
              </div>

              <div className="form-group">
                <label htmlFor="date">Tanggal</label>
                <Field type="date" name="entry_date" id="date" />
                <ErrorMessage name="entry_date" component="div" className="error-text" />
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => navigate('/admin/saldo')}
                  className="cancel-button"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="submit-button"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Transaksi'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </AdminLayout>
  );
};

export default TransactionFormPage;
