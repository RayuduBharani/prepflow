#!/bin/bash

# Clear Database Script for PrepFlow
# This script removes all data from tables while keeping the schema intact

echo "⚠️  PrepFlow Database Clear Script"
echo "=================================="
echo ""
echo "This will DELETE ALL DATA from the following tables:"
echo "  - Problem (and all related data)"
echo "  - ProblemCompany"
echo "  - ProblemTopic"
echo "  - ProblemMainTopic"
echo "  - ProblemTopicSlug"
echo "  - SimilarProblem"
echo "  - Sheets"
echo "  - SheetCategory"
echo "  - UserProgress"
echo "  - All relationship tables"
echo ""
echo "⚠️  WARNING: This action CANNOT be undone!"
echo ""
read -p "Are you sure you want to continue? (type 'yes' to confirm): " CONFIRM

if [ "$CONFIRM" != "yes" ]; then
    echo "❌ Operation cancelled."
    exit 0
fi

echo ""
read -p "Type 'DELETE ALL DATA' to proceed: " FINAL_CONFIRM

if [ "$FINAL_CONFIRM" != "DELETE ALL DATA" ]; then
    echo "❌ Operation cancelled."
    exit 0
fi

# Get database connection
if [ -z "$DATABASE_URL" ]; then
    echo ""
    echo "DATABASE_URL not found in environment."
    echo ""
    read -p "Database URL (postgresql://...): " DB_URL
    if [ -z "$DB_URL" ]; then
        echo "❌ Database URL is required!"
        exit 1
    fi
    PSQL_CMD="psql $DB_URL"
else
    echo ""
    echo "Using DATABASE_URL from environment..."
    PSQL_CMD="psql $DATABASE_URL"
fi

echo ""
echo "🗑️  Clearing database tables..."
echo ""

# Execute truncate commands
$PSQL_CMD << 'EOF'
-- Disable foreign key checks temporarily for faster truncation
BEGIN;

-- Truncate all tables in correct order (respecting foreign keys)
TRUNCATE TABLE "UserProgress" CASCADE;
TRUNCATE TABLE "SimilarProblem" CASCADE;
TRUNCATE TABLE "Problem" CASCADE;
TRUNCATE TABLE "ProblemCompany" CASCADE;
TRUNCATE TABLE "ProblemTopic" CASCADE;
TRUNCATE TABLE "ProblemMainTopic" CASCADE;
TRUNCATE TABLE "ProblemTopicSlug" CASCADE;
TRUNCATE TABLE "ProblemCategory" CASCADE;
TRUNCATE TABLE "SheetCategory" CASCADE;
TRUNCATE TABLE "Sheets" CASCADE;

-- Reset sequences
ALTER SEQUENCE "Problem_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ProblemCompany_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ProblemTopic_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ProblemMainTopic_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ProblemTopicSlug_id_seq" RESTART WITH 1;
ALTER SEQUENCE "ProblemCategory_id_seq" RESTART WITH 1;
ALTER SEQUENCE "SimilarProblem_id_seq" RESTART WITH 1;
ALTER SEQUENCE "Sheets_id_seq" RESTART WITH 1;
ALTER SEQUENCE "SheetCategory_id_seq" RESTART WITH 1;

COMMIT;

-- Verify tables are empty
\echo ''
\echo 'Verification - All counts should be 0:'
SELECT 'Problem' as table_name, COUNT(*) as count FROM "Problem";
SELECT 'ProblemCompany' as table_name, COUNT(*) as count FROM "ProblemCompany";
SELECT 'ProblemTopic' as table_name, COUNT(*) as count FROM "ProblemTopic";
SELECT 'Sheets' as table_name, COUNT(*) as count FROM "Sheets";
SELECT 'UserProgress' as table_name, COUNT(*) as count FROM "UserProgress";
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Database cleared successfully!"
    echo ""
    echo "All tables have been emptied and sequences reset."
    echo "You can now import fresh data using:"
    echo "  ./scripts/import-sql-dump.sh"
    echo "  or"
    echo "  psql \$DATABASE_URL -f seed-data.sql"
else
    echo ""
    echo "❌ Failed to clear database!"
    echo "Please check the error messages above."
    exit 1
fi
