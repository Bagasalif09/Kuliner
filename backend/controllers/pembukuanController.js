const db = require('../db');

// GET /api/finance/summary
const getFinanceSummary = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        COALESCE(SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END), 0) AS total_pemasukan,
        COALESCE(SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0) AS total_pengeluaran,
        COALESCE(
          SUM(CASE WHEN type = 'pemasukan' THEN amount ELSE 0 END) - 
          SUM(CASE WHEN type = 'pengeluaran' THEN amount ELSE 0 END), 0
        ) AS saldo
      FROM pembukuan
    `);

    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error getting finance summary:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// POST /api/finance/manual-entry
const createManualEntry = async (req, res) => {
  const { type, amount, description } = req.body;

  if (!['pemasukan', 'pengeluaran'].includes(type)) {
    return res.status(400).json({ error: 'Tipe harus "pemasukan" atau "pengeluaran"' });
  }

  if (!amount || isNaN(amount)) {
    return res.status(400).json({ error: 'Jumlah tidak valid' });
  }

  try {
    await db.query(
      `INSERT INTO pembukuan (type, amount, description) VALUES ($1, $2, $3)`,
      [type, amount, description || null]
    );

    res.status(201).json({ message: 'Entry keuangan berhasil ditambahkan' });
  } catch (err) {
    console.error('Error creating finance entry:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// GET /api/finance/entries
const getAllEntries = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, type, amount, description, entry_date
      FROM pembukuan
      ORDER BY entry_date DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching entries:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getFinanceSummary,
  createManualEntry,
  getAllEntries,
};
