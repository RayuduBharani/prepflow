#!/bin/bash

# Import SQL dump script for PrepFlow database
# This script helps import the generated SQL dump into PostgreSQL

echo "PrepFlow SQL Import Script"
echo "=========================="
echo ""

# Check if SQL file exists
SQL_FILE="seed-data.sql"
if [ ! -f "$SQL_FILE" ]; then
    echo "❌ Error: $SQL_FILE not found!"
    echo "Please run 'npm run generate-sql' first to generate the SQL dump."
    exit 1
fi

# Get database URL from environment or prompt user
if [ -z "$DATABASE_URL" ]; then
    echo "DATABASE_URL not found in environment."
    echo ""
    read -p "Enter your PostgreSQL database URL: " DB_URL
    if [ -z "$DB_URL" ]; then
        echo "❌ Database URL is required!"
        echo "Format: postgresql://username:password@host:port/database"
        exit 1
    fi
    PSQL_CMD="psql $DB_URL"
else
    echo "Using DATABASE_URL from environment..."
    PSQL_CMD="psql $DATABASE_URL"
fi

echo ""
echo "🔄 Starting import..."
echo "This may take a few minutes depending on the data size..."
echo ""

# Import the SQL file
if $PSQL_CMD -f "$SQL_FILE"; then
    echo ""
    echo "✅ Import completed successfully!"
    echo ""
    echo "Database is now seeded with:"
    echo "  - Problem topics and companies"
    echo "  - Problems with all relationships"
    echo "  - Sheets and categories"
    echo ""
else
    echo ""
    echo "❌ Import failed!"
    echo "Please check the error messages above."
    exit 1
fi

# Unset password
unset PGPASSWORD
