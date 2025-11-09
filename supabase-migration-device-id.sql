-- Migration: Add device_id column to fridge_items table
-- This enables device-specific data isolation without authentication

-- Step 1: Add device_id column (nullable initially)
ALTER TABLE fridge_items 
ADD COLUMN IF NOT EXISTS device_id TEXT;

-- Step 2: Update existing rows with a default device_id
-- This migrates existing data to a "legacy" device
UPDATE fridge_items 
SET device_id = 'legacy-device-' || SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8)
WHERE device_id IS NULL;

-- Step 3: Make device_id NOT NULL
ALTER TABLE fridge_items 
ALTER COLUMN device_id SET NOT NULL;

-- Step 4: Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_fridge_items_device_id 
ON fridge_items(device_id);

-- Step 5: Update RLS (Row Level Security) policy if you have it enabled
-- This ensures users can only see their own device's data
DROP POLICY IF EXISTS "Enable all operations for device" ON fridge_items;

CREATE POLICY "Enable all operations for device" 
ON fridge_items 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Note: Since we're not using auth, we allow all operations
-- The device_id filtering happens in the application layer

COMMENT ON COLUMN fridge_items.device_id IS 'Unique identifier for the device/user, enables data isolation without authentication';
