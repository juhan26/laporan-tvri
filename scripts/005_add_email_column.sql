-- Simplified script to just add email column without referencing auth.users
-- Add email column to users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Add some demo emails for existing users if they don't have email yet
UPDATE public.users 
SET email = CASE 
    WHEN username = 'admin' THEN 'admin@tvri.co.id'
    WHEN username = 'reporter1' THEN 'reporter1@tvri.co.id'
    WHEN username = 'reporter2' THEN 'reporter2@tvri.co.id'
    WHEN username = 'editor1' THEN 'editor1@tvri.co.id'
    WHEN username = 'viewer1' THEN 'viewer1@tvri.co.id'
    ELSE username || '@tvri.co.id'
END
WHERE email IS NULL;

-- Make email column NOT NULL after updating existing records
ALTER TABLE public.users ALTER COLUMN email SET NOT NULL;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
