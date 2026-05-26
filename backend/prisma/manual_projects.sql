DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ProjectStatus') THEN
        CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'CLOSED');
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'BidStatus') THEN
        CREATE TYPE "BidStatus" AS ENUM ('SUBMITTED', 'ACCEPTED', 'REJECTED');
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "minBudget" DOUBLE PRECISION NOT NULL,
    "maxBudget" DOUBLE PRECISION NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "ndaRequired" BOOLEAN NOT NULL DEFAULT false,
    "status" "ProjectStatus" NOT NULL DEFAULT 'PUBLISHED',
    "skills" TEXT[],
    "buyerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Bid" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "proposal" TEXT NOT NULL,
    "status" "BidStatus" NOT NULL DEFAULT 'SUBMITTED',
    "projectId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Bid_pkey" PRIMARY KEY ("id")
);

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Project_buyerId_fkey'
    ) THEN
        ALTER TABLE "Project"
        ADD CONSTRAINT "Project_buyerId_fkey"
        FOREIGN KEY ("buyerId") REFERENCES "User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Bid_projectId_fkey'
    ) THEN
        ALTER TABLE "Bid"
        ADD CONSTRAINT "Bid_projectId_fkey"
        FOREIGN KEY ("projectId") REFERENCES "Project"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'Bid_vendorId_fkey'
    ) THEN
        ALTER TABLE "Bid"
        ADD CONSTRAINT "Bid_vendorId_fkey"
        FOREIGN KEY ("vendorId") REFERENCES "User"("id")
        ON DELETE RESTRICT ON UPDATE CASCADE;
    END IF;
END $$;
