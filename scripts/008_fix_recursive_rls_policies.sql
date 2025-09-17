-- Fix infinite recursion in RLS policies for users table
-- Use auth.jwt() to check role instead of querying users table

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Admins can view all users" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can update users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;

-- Disable RLS temporarily to avoid issues
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Create a function to check if user is admin using auth metadata
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() ->> 'user_metadata' ->> 'role')::text = 'admin',
    false
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simple policy: Allow all operations for service role (for server-side operations)
CREATE POLICY "Service role can do everything" ON users
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to read their own profile
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT
  USING (auth.uid() = id);

-- Allow admins to read all users (using function to avoid recursion)
CREATE POLICY "Admins can read all users" ON users
  FOR SELECT
  USING (is_admin());

-- Allow admins to insert users
CREATE POLICY "Admins can insert users" ON users
  FOR INSERT
  WITH CHECK (is_admin());

-- Allow admins to update users
CREATE POLICY "Admins can update users" ON users
  FOR UPDATE
  USING (is_admin());

-- Allow admins to delete users
CREATE POLICY "Admins can delete users" ON users
  FOR DELETE
  USING (is_admin());

-- Grant permissions
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO service_role;
