-- Aktifkan Realtime (Publication) untuk tabel tasks agar event INSERT/UPDATE/DELETE bisa diterima oleh frontend
begin;
  -- Hapus tabel tasks dari publication jika sebelumnya sudah ada untuk mencegah duplikasi (opsional)
  -- alter publication supabase_realtime drop table if exists tasks;
  
  -- Tambahkan tabel tasks ke publication supabase_realtime
  alter publication supabase_realtime add table tasks;
commit;
