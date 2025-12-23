-- Migration: 01_patch_products_colors_quantity.sql

-- 1. Add has_quantity column (defaulting to true)
ALTER TABLE products
ADD COLUMN has_quantity BOOLEAN NOT NULL DEFAULT TRUE;

-- 2. Convert colors column from TEXT[] to JSONB
-- First, drop the GIN index on the old array column
DROP INDEX IF EXISTS ix_products_colors_gin;

-- Convert data: transform native array ['#A', '#B'] -> JSONB [{'name': '#A', 'hex': '#A'}, {'name': '#B', 'hex': '#B'}]
-- We utilize a temporary function or just complex casting. Since we can't easily iterate arrays in simple ALTER TABLE USING, 
-- we will do it in step:
ALTER TABLE products
  ALTER COLUMN colors TYPE JSONB
  USING (
    SELECT jsonb_agg(
      jsonb_build_object('name', elem, 'hex', elem)
    )
    FROM unnest(colors) AS elem
  );

-- Handle cases where colors was empty array or null during conversion
UPDATE products SET colors = '[]'::jsonb WHERE colors IS NULL;

-- 3. Re-create index on new JSONB column
CREATE INDEX ix_products_colors_gin ON products USING gin (colors);
