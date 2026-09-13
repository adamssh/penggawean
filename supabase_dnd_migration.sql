-- Tambahkan kolom position untuk menyimpan urutan task (drag and drop)
-- Tipe DOUBLE PRECISION digunakan untuk Fractional Indexing
ALTER TABLE tasks ADD COLUMN position DOUBLE PRECISION;

-- Set nilai default untuk task yang sudah ada menggunakan epoch timestamp
UPDATE tasks SET position = EXTRACT(EPOCH FROM created_at) WHERE position IS NULL;

-- Jadikan NOT NULL setelah diisi
ALTER TABLE tasks ALTER COLUMN position SET NOT NULL;
