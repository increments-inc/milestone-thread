-- CreateTable
CREATE TABLE "skin_donors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "nearbyHospital" TEXT NOT NULL,
    "isAbove18" BOOLEAN NOT NULL DEFAULT true,
    "voluntaryConsent" BOOLEAN NOT NULL DEFAULT true,
    "hasDiabetes" BOOLEAN NOT NULL DEFAULT false,
    "hasHypertension" BOOLEAN NOT NULL DEFAULT false,
    "hasCancer" BOOLEAN NOT NULL DEFAULT false,
    "hasSevereIllness" BOOLEAN NOT NULL DEFAULT false,
    "medicalNotes" TEXT,
    "donationStatus" TEXT NOT NULL DEFAULT 'registered',
    "available" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skin_donors_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skin_donors_phoneNumber_key" ON "skin_donors"("phoneNumber");
