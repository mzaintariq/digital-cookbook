-- AlterTable
-- Convert steps from text[] to jsonb
-- Step 1: Add a temporary jsonb column
ALTER TABLE "recipes" ADD COLUMN IF NOT EXISTS "steps_jsonb" jsonb;

-- Step 2: Convert existing string array to JSON array of step objects
UPDATE "recipes" 
SET "steps_jsonb" = (
  SELECT jsonb_agg(
    jsonb_build_object(
      'id', 'step-' || idx::text || '-' || gen_random_uuid()::text,
      'description', step_value,
      'category', null,
      'subSteps', '[]'::jsonb
    )
  )
  FROM unnest("steps") WITH ORDINALITY AS t(step_value, idx)
)
WHERE "steps" IS NOT NULL AND array_length("steps", 1) > 0;

-- Step 3: Set default for empty arrays
UPDATE "recipes" 
SET "steps_jsonb" = '[]'::jsonb
WHERE "steps_jsonb" IS NULL;

-- Step 4: Drop the old column
ALTER TABLE "recipes" DROP COLUMN IF EXISTS "steps";

-- Step 5: Rename the new column
ALTER TABLE "recipes" RENAME COLUMN "steps_jsonb" TO "steps";
