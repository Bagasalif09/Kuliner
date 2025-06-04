import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import './AdminSaldoPage.css';

const AdminSaldoPage = () => {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [typeFilter, setTypeFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [entries, typeFilter, monthFilter, yearFilter]);

  const fetchEntries = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/finance/all');
      if (!response.ok) throw new Error('Gagal fetch data');
      const data = await response.json();
      if (Array.isArray(data)) {
        setEntries(data);
      } else {
        setEntries([]);
        setError('Data keuangan tidak valid');
      }
    } catch (err) {
      console.error(err);
      setError('Gagal memuat data keuangan');
      setEntries([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...entries];

    if (typeFilter !== 'all') {
      filtered = filtered.filter((e) => e.type === typeFilter);
    }

    if (monthFilter) {
      filtered = filtered.filter((e) => {
        const date = new Date(e.entry_date);
        return (date.getMonth() + 1).toString() === monthFilter;
      });
    }

    if (yearFilter) {
      filtered = filtered.filter((e) => {
        const date = new Date(e.entry_date);
        return date.getFullYear().toString() === yearFilter;
      });
    }

    setFilteredEntries(filtered);
  };

  const formatRupiah = (number) => {
    if (!number) return 'Rp0';
    return 'Rp' + Number(number).toLocaleString('id-ID');
  };

  const totalIncome = filteredEntries
    .filter((e) => e.type === 'pemasukan')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const totalExpense = filteredEntries
    .filter((e) => e.type === 'pengeluaran')
    .reduce((acc, curr) => acc + Number(curr.amount), 0);

  const saldo = totalIncome - totalExpense;

  return (
    <AdminLayout>
      <div className="admin-saldo-conntainer">
        <div className="admin-saldo-header">
            <h2>Pembukuan Keuangan</h2>
            <Link to="/admin/saldo/add" className="add-saldo-button">Tambah Transaksi Baru</Link>
        </div>

        {/* Filter */}
        <div className="filter-container">
        <label>
            Jenis:
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
            <option value="all">Semua</option>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
            </select>
        </label>

        <label>
            Bulan:
            <select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)}>
            <option value="">Semua</option>
            {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>
                {new Date(0, i).toLocaleString('id-ID', { month: 'long' })}
                </option>
            ))}
            </select>
        </label>

        <label>
            Tahun:
            <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
                <option value="">Semua</option>
                {[...new Set(entries.map((e) => new Date(e.entry_date).getFullYear()))]
                .sort()
                .map((year) => (
                    <option key={year} value={year}>{year}</option>
                ))}
            </select>
            </label>
        </div>

        {loading && <p>Memuat data keuangan...</p>}
        {error && !loading && <p className="error">{error}</p>}
        {!loading && !error && filteredEntries.length === 0 && (
          <p className="no-entries">Tidak ada data sesuai filter.</p>
        )}

        {!loading && !error && filteredEntries.length > 0 && (
          <>
            <div className="dashboard-cards finance-summary">
              <div className="dashboard-card">
                <h3>Saldo</h3>
                <p className="stat-number">{formatRupiah(saldo)}</p>
              </div>
              <div className="dashboard-card">
                <h3>Total Pemasukan</h3>
                <p className="stat-number">{formatRupiah(totalIncome)}</p>
              </div>
              <div className="dashboard-card">
                <h3>Total Pengeluaran</h3>
                <p className="stat-number">{formatRupiah(totalExpense)}</p>
              </div>
            </div>

            <table className="saldo-table">
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Jenis</th>
                  <th>Jumlah</th>
                  <th>Deskripsi</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td>{new Date(entry.entry_date).toLocaleDateString('id-ID')}</td>
                    <td style={{ color: entry.type === 'pemasukan' ? 'green' : 'red' }}>
                      {entry.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'}
                    </td>
                    <td>{formatRupiah(entry.amount)}</td>
                    <td>{entry.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSaldoPage;
