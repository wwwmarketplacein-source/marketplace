DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Company'
          AND column_name = 'industry'
          AND data_type = 'ARRAY'
    ) THEN
        ALTER TABLE "Company"
        ALTER COLUMN "industry"
        TYPE TEXT
        USING array_to_string("industry", ',');
    END IF;

    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'Project'
          AND column_name = 'skills'
          AND data_type = 'ARRAY'
    ) THEN
        ALTER TABLE "Project"
        ALTER COLUMN "skills"
        TYPE TEXT
        USING array_to_string("skills", ',');
    END IF;
END $$;
