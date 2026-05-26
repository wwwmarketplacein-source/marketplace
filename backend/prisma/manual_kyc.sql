CREATE TABLE IF NOT EXISTS "KYCRecord" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "idType" TEXT NOT NULL,
    "idNumber" TEXT NOT NULL,
    "selfieFileName" TEXT,
    "selfieUrl" TEXT,
    "userId" TEXT NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "KYCRecord_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "KYCRecord_userId_key" ON "KYCRecord"("userId");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'KYCRecord_userId_fkey'
    ) THEN
        ALTER TABLE "KYCRecord"
        ADD CONSTRAINT "KYCRecord_userId_fkey"
        FOREIGN KEY ("userId") REFERENCES "User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
