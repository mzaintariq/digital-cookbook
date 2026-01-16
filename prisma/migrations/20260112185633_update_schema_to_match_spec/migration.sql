-- Add new columns with defaults
ALTER TABLE "recipes" ADD COLUMN "slug" TEXT;
ALTER TABLE "recipes" ADD COLUMN "cookTimeMinutes" INTEGER;
ALTER TABLE "recipes" ADD COLUMN "spiceLevel" INTEGER;
ALTER TABLE "recipes" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "recipes" ADD COLUMN "notes" TEXT;
ALTER TABLE "recipes" ADD COLUMN "rating" INTEGER;
ALTER TABLE "recipes" ADD COLUMN "approvedBy" TEXT;
ALTER TABLE "recipes" ADD COLUMN "status" TEXT DEFAULT 'draft';

-- Migrate existing data
-- Generate slugs from titles (lowercase, replace spaces with hyphens)
UPDATE "recipes" SET "slug" = LOWER(REGEXP_REPLACE("title", '[^a-zA-Z0-9]+', '-', 'g'));
-- Set cookTimeMinutes from cookTime or prepTime (whichever exists, default to 0)
UPDATE "recipes" SET "cookTimeMinutes" = COALESCE("cookTime", "prepTime", 0);
-- Set defaults for required fields
UPDATE "recipes" SET "spiceLevel" = 1 WHERE "spiceLevel" IS NULL;
UPDATE "recipes" SET "rating" = 3 WHERE "rating" IS NULL;
UPDATE "recipes" SET "approvedBy" = 'System' WHERE "approvedBy" IS NULL;

-- Convert ingredients from JSONB to TEXT[]
ALTER TABLE "recipes" ADD COLUMN "ingredients_new" TEXT[];
UPDATE "recipes" SET "ingredients_new" = (
  SELECT ARRAY_AGG(value::TEXT)
  FROM jsonb_array_elements_text("ingredients")
);
ALTER TABLE "recipes" DROP COLUMN "ingredients";
ALTER TABLE "recipes" RENAME COLUMN "ingredients_new" TO "ingredients";

-- Convert instructions from JSONB to TEXT[] (rename to steps)
ALTER TABLE "recipes" ADD COLUMN "steps" TEXT[];
UPDATE "recipes" SET "steps" = (
  SELECT ARRAY_AGG(value::TEXT)
  FROM jsonb_array_elements_text("instructions")
);
ALTER TABLE "recipes" DROP COLUMN "instructions";

-- Make required columns NOT NULL
ALTER TABLE "recipes" ALTER COLUMN "slug" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "cookTimeMinutes" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "spiceLevel" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "tags" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "rating" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "approvedBy" SET NOT NULL;
ALTER TABLE "recipes" ALTER COLUMN "status" SET NOT NULL;

-- Add unique constraint on slug
CREATE UNIQUE INDEX "recipes_slug_key" ON "recipes"("slug");

-- Drop old columns
ALTER TABLE "recipes" DROP COLUMN "description";
ALTER TABLE "recipes" DROP COLUMN "prepTime";
ALTER TABLE "recipes" DROP COLUMN "cookTime";
ALTER TABLE "recipes" DROP COLUMN "servings";

