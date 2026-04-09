-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SiteProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "heroIntro" TEXT NOT NULL DEFAULT '',
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_SiteProfile" ("avatar", "bio", "ctaLink", "ctaText", "id", "name", "title", "updatedAt") SELECT "avatar", "bio", "ctaLink", "ctaText", "id", "name", "title", "updatedAt" FROM "SiteProfile";
DROP TABLE "SiteProfile";
ALTER TABLE "new_SiteProfile" RENAME TO "SiteProfile";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
