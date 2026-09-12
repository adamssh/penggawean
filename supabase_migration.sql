-- Buat tabel tasks
CREATE TABLE tasks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    category text NOT NULL,
    completed boolean DEFAULT false NOT NULL,
    starred boolean DEFAULT false NOT NULL,
    due_date timestamptz,
    created_at timestamptz DEFAULT now() NOT NULL,
    updated_at timestamptz DEFAULT now() NOT NULL
);

-- Aktifkan Row Level Security (RLS)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: User hanya dapat melihat task miliknya sendiri
CREATE POLICY "Users can view their own tasks" ON tasks
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: User hanya dapat memasukkan task untuk dirinya sendiri
CREATE POLICY "Users can insert their own tasks" ON tasks
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: User hanya dapat mengubah task miliknya sendiri
CREATE POLICY "Users can update their own tasks" ON tasks
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: User hanya dapat menghapus task miliknya sendiri
CREATE POLICY "Users can delete their own tasks" ON tasks
    FOR DELETE USING (auth.uid() = user_id);
