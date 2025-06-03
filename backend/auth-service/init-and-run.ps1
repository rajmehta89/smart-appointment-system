# Create the database
Write-Host "Creating database..."
psql -U postgres -f create-db.sql

# Initialize the database schema and data
Write-Host "Initializing database schema and data..."
psql -U postgres -d appointment_db -f init-db.sql

# Run the Spring Boot application
Write-Host "Starting Spring Boot application..."
mvn spring-boot:run 