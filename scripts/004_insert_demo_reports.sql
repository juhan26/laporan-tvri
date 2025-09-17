-- Insert sample broadcast reports for demonstration
-- This script should be run after demo users are created

-- First, let's check if users exist and get their IDs
DO $$
DECLARE
    bagus_id UUID;
    alan_id UUID;
    hafiz_id UUID;
BEGIN
    -- Get user IDs
    SELECT id INTO bagus_id FROM public.users WHERE username = 'bagus' LIMIT 1;
    SELECT id INTO alan_id FROM public.users WHERE username = 'alan' LIMIT 1;
    SELECT id INTO hafiz_id FROM public.users WHERE username = 'hafiz' LIMIT 1;
    
    -- Using variables instead of subqueries to ensure valid user IDs
    -- Insert sample reports only if users exist
    IF bagus_id IS NOT NULL AND alan_id IS NOT NULL AND hafiz_id IS NOT NULL THEN
        INSERT INTO public.broadcast_reports (
            tanggal,
            jam_mulai,
            jam_selesai,
            program,
            kualitas_siaran,
            petugas,
            kendala,
            penanganan,
            keterangan,
            created_by
        ) VALUES 
        (
            '2024-01-15',
            '08:00',
            '12:00',
            'Selamat Pagi Indonesia',
            'Tidak Baik',
            ARRAY['Bagus', 'Alan'],
            'Audio sempat terputus 2 menit',
            'Reset mixer audio dan ganti kabel',
            'Siaran kembali normal setelah penanganan',
            bagus_id
        ),
        (
            '2024-01-15',
            '19:00',
            '21:00',
            'Berita Malam',
            'Tidak Baik',
            ARRAY['Hafiz'],
            'Camera 2 mati total',
            'Ganti dengan camera backup',
            'Perlu service camera 2',
            hafiz_id
        ),
        (
            '2024-01-16',
            '06:00',
            '08:00',
            'Indonesia Pagi',
            'Baik',
            ARRAY['Alan', 'Bagus'],
            '',
            '',
            'Siaran berjalan lancar tanpa kendala',
            bagus_id
        ),
        (
            '2024-01-16',
            '12:00',
            '13:00',
            'Berita Siang',
            'Baik',
            ARRAY['Hafiz'],
            '',
            '',
            'Kualitas siaran sangat baik',
            hafiz_id
        ),
        (
            '2024-01-17',
            '20:00',
            '22:00',
            'Drama Seri Indonesia',
            'Tidak Baik',
            ARRAY['Alan'],
            'Gangguan sinyal satelit',
            'Koordinasi dengan provider satelit',
            'Siaran sempat terganggu 15 menit',
            alan_id
        ),
        (
            '2024-01-18',
            '07:00',
            '09:00',
            'Morning Show',
            'Baik',
            ARRAY['Bagus', 'Hafiz'],
            '',
            '',
            'Siaran lancar dengan rating tinggi',
            bagus_id
        ),
        (
            '2024-01-18',
            '18:00',
            '19:00',
            'Berita Petang',
            'Tidak Baik',
            ARRAY['Alan'],
            'Masalah pada teleprompter',
            'Restart sistem teleprompter',
            'Presenter sempat kesulitan membaca naskah',
            alan_id
        ),
        (
            '2024-01-19',
            '21:00',
            '23:00',
            'Film Indonesia',
            'Baik',
            ARRAY['Hafiz', 'Alan'],
            '',
            '',
            'Kualitas gambar dan suara excellent',
            hafiz_id
        );
        
        RAISE NOTICE 'Demo broadcast reports inserted successfully!';
    ELSE
        RAISE NOTICE 'Users not found. Please run the demo users script first.';
    END IF;
END $$;
