-- CreateTable
CREATE TABLE "SiteProfile" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "avatar" TEXT,
    "ctaText" TEXT NOT NULL,
    "ctaLink" TEXT NOT NULL,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ProfileSkill" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "siteProfileId" INTEGER NOT NULL,
    CONSTRAINT "ProfileSkill_siteProfileId_fkey" FOREIGN KEY ("siteProfileId") REFERENCES "SiteProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "ProfileSkill_siteProfileId_sortOrder_idx" ON "ProfileSkill"("siteProfileId", "sortOrder");
