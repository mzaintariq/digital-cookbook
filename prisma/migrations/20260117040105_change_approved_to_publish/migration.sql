-- Update all "approved" status values to "publish"
UPDATE "recipes" SET "status" = 'publish' WHERE "status" = 'approved';

