-- Add servings column
ALTER TABLE "recipes" ADD COLUMN "servings" INTEGER;

-- Convert ingredients from TEXT[] to JSONB
-- First, create a temporary column for JSONB
ALTER TABLE "recipes" ADD COLUMN "ingredients_new" JSONB DEFAULT '[]'::jsonb;

-- Convert existing string array ingredients to structured JSON format
-- Each string becomes: {"quantity": 1, "unit": "pcs", "name": "<original string>"}
UPDATE "recipes" SET "ingredients_new" = (
  SELECT COALESCE(
    jsonb_agg(
      jsonb_build_object(
        'quantity', 1,
        'unit', 'pcs',
        'name', value
      )
    ),
    '[]'::jsonb
  )
  FROM unnest("ingredients") AS value
)
WHERE array_length("ingredients", 1) IS NOT NULL;

-- Set default for rows with null ingredients
UPDATE "recipes" SET "ingredients_new" = '[]'::jsonb WHERE "ingredients_new" IS NULL;

-- Drop old column and rename new one
ALTER TABLE "recipes" DROP COLUMN "ingredients";
ALTER TABLE "recipes" RENAME COLUMN "ingredients_new" TO "ingredients";

-- Make ingredients NOT NULL
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "ingredients" SET DEFAULT '[]'::jsonb;

