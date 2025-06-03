@echo off
echo Initializing database...
psql -U postgres -f init-db.sql
if %ERRORLEVEL% NEQ 0 (
    echo Failed to initialize database
    exit /b %ERRORLEVEL%
)

echo Starting Spring Boot application...
mvn spring-boot:run 