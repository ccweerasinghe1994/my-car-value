#!/bin/bash
set -e

# Create the main database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Database is already created by POSTGRES_DB environment variable
    -- Create extensions if needed
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
    -- You can add initial data or additional setup here
    -- For example:
    -- INSERT INTO your_table (column1, column2) VALUES ('value1', 'value2');
EOSQL

echo "Database initialization completed!"
