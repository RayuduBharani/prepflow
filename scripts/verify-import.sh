#!/bin/bash

# Verification script to check if SQL dump was imported correctly
# This script connects to your database and verifies the data

echo "PrepFlow Database Verification Script"
echo "====================================="
echo ""

# Get database connection
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not found in environment."
    echo ""
    read -p "Database URL (postgresql://...): " DB_URL
    if [ -z "$DB_URL" ]; then
        echo "❌ Database URL is required!"
        exit 1
    fi
    PSQL_CMD="psql $DB_URL"
else
    echo "Using DATABASE_URL from environment..."
    PSQL_CMD="psql $DATABASE_URL"
fi

echo ""
echo "🔍 Checking database contents..."
echo ""

# Run verification queries
$PSQL_CMD << EOF
-- Check Problems
SELECT 'Problems' as table_name, COUNT(*) as count FROM "Problem";

-- Check Companies
SELECT 'Companies' as table_name, COUNT(*) as count FROM "ProblemCompany";

-- Check Topics
SELECT 'Topics' as table_name, COUNT(*) as count FROM "ProblemTopic";

-- Check Main Topics
SELECT 'Main Topics' as table_name, COUNT(*) as count FROM "ProblemMainTopic";

-- Check Topic Slugs
SELECT 'Topic Slugs' as table_name, COUNT(*) as count FROM "ProblemTopicSlug";

-- Check Sheets
SELECT 'Sheets' as table_name, COUNT(*) as count FROM "Sheets";

-- Check Sheet Categories
SELECT 'Sheet Categories' as table_name, COUNT(*) as count FROM "SheetCategory";

-- Check Similar Problems
SELECT 'Similar Problems' as table_name, COUNT(*) as count FROM "SimilarProblem";

-- Check Problem-Topic relationships
SELECT 'Problem-Topic Links' as table_name, COUNT(*) as count FROM "_ProblemTopicProblems";

-- Check Problem-Company relationships
SELECT 'Problem-Company Links' as table_name, COUNT(*) as count FROM "_ProblemCompanyProblems";

-- Check Problem-MainTopic relationships
SELECT 'Problem-MainTopic Links' as table_name, COUNT(*) as count FROM "_ProblemMainTopicProblems";

-- Check Problem-TopicSlug relationships
SELECT 'Problem-TopicSlug Links' as table_name, COUNT(*) as count FROM "_ProblemTopicSlugProblems";

-- Check Problem-SheetCategory relationships
SELECT 'Problem-Sheet Links' as table_name, COUNT(*) as count FROM "_SheetCategoryProblems";

-- Sample data check
\echo ''
\echo 'Sample Problems:'
SELECT id, title, difficulty, platform FROM "Problem" LIMIT 5;

\echo ''
\echo 'Sample Companies:'
SELECT id, name, slug FROM "ProblemCompany" LIMIT 5;

\echo ''
\echo 'Expected Counts:'
\echo 'Problems: 6399'
\echo 'Companies: 305'
\echo 'Topics: 157'
\echo 'Main Topics: 38'
\echo 'Topic Slugs: 141'
\echo 'Sheets: 6'
\echo 'Sheet Categories: 27'
\echo 'Similar Problems: 4946'
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Verification complete!"
    echo ""
    echo "If the counts match the expected values, your import was successful!"
else
    echo ""
    echo "❌ Verification failed!"
    echo "Please check your database connection and try again."
fi
