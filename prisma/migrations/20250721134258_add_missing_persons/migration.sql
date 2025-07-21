-- CreateTable
CREATE TABLE "missing_persons" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "class" TEXT,
    "code" TEXT,
    "section" TEXT,
    "parentContacts" JSONB,
    "photo" BYTEA,
    "photoMimeType" TEXT,
    "status" TEXT NOT NULL DEFAULT 'missing',
    "reportedBy" TEXT,
    "lastSeen" TIMESTAMP(3),
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "missing_persons_pkey" PRIMARY KEY ("id")
);
