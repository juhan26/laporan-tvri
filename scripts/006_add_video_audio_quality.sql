-- Add separate video and audio quality columns
ALTER TABLE broadcast_reports 
ADD COLUMN kualitas_video text,
ADD COLUMN kualitas_audio text;

-- Migrate existing data (set both video and audio to current kualitas_siaran value)
UPDATE broadcast_reports 
SET kualitas_video = kualitas_siaran,
    kualitas_audio = kualitas_siaran
WHERE kualitas_siaran IS NOT NULL;

-- Optional: Remove old column after migration (uncomment if needed)
-- ALTER TABLE broadcast_reports DROP COLUMN kualitas_siaran;
