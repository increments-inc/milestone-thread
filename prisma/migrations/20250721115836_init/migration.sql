-- CreateTable
CREATE TABLE "blood_donors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "bloodGroup" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "lastDonation" TIMESTAMP(3),
    "available" BOOLEAN NOT NULL DEFAULT true,
    "socialMedia" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_donors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blood_donors_phoneNumber_key" ON "blood_donors"("phoneNumber");
