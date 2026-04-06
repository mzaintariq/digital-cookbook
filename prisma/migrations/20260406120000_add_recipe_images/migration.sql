-- CreateTable
CREATE TABLE "recipe_images" (
    "id" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,
    "storagePath" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isThumbnail" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "recipe_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "recipe_images_recipeId_idx" ON "recipe_images"("recipeId");

-- AddForeignKey
ALTER TABLE "recipe_images" ADD CONSTRAINT "recipe_images_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "recipes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- At most one thumbnail per recipe
CREATE UNIQUE INDEX "recipe_images_one_thumbnail_per_recipe" ON "recipe_images" ("recipeId") WHERE "isThumbnail" = true;
