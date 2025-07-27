# Docker Setup for My Car Value API

This document explains how to set up and run the My Car Value NestJS application with PostgreSQL using Docker Compose.

## Prerequisites

- Docker and Docker Compose installed on your system
- pnpm package manager (for local development)

## Quick Start

### 1. Environment Configuration

Copy the environment example file and configure your settings:

```bash
cp .env.example .env
```

The default configuration will work with the Docker setup:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=my_car_value

# Application Configuration
NODE_ENV=development
PORT=3000
```

### 2. Database Only (Recommended for Development)

To run only the PostgreSQL database with Docker while running the NestJS app locally:

```bash
# Start only the PostgreSQL database
docker-compose up postgres

# In a separate terminal, install dependencies and run the app
pnpm install
pnpm run start:dev
```

### 3. Full Stack with Docker

To run both the database and the NestJS application in containers:

```bash
# Run the full stack
docker-compose --profile full-stack up --build
```

### 4. Database Only (Production-like)

For production-like database setup:

```bash
# Run in detached mode
docker-compose up -d postgres
```

## Docker Compose Services

### PostgreSQL Database

- **Container Name**: `my-car-value-postgres`
- **Port**: `5432` (mapped to host)
- **Database**: `my_car_value`
- **Username**: `postgres`
- **Password**: `postgres`
- **Volume**: `postgres_data` (persistent storage)

### NestJS Application (Optional)

- **Container Name**: `my-car-value-app`
- **Port**: `3000` (mapped to host)
- **Profile**: `full-stack` (only runs when specified)

## Useful Commands

```bash
# Start only the database
docker-compose up postgres

# Start the full stack
docker-compose --profile full-stack up

# Run in background
docker-compose up -d postgres

# Stop all services
docker-compose down

# Remove volumes (careful: this deletes all data)
docker-compose down -v

# View logs
docker-compose logs postgres
docker-compose logs app

# Connect to the database
docker-compose exec postgres psql -U postgres -d my_car_value
```

## Database Management

### Connecting to the Database

You can connect to the PostgreSQL database using any PostgreSQL client:

- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `my_car_value`
- **Username**: `postgres`
- **Password**: `postgres`

### Database Initialization

The database is automatically initialized with:

- The main database (`my_car_value`)
- UUID extension for generating UUIDs
- Custom initialization scripts in `init-db/` directory

### TypeORM Configuration

The application uses TypeORM with:

- **Entities**: Auto-loaded from `src/**/*.entity.ts`
- **Migrations**: Stored in `src/database/migrations/`
- **Synchronize**: Enabled in development (automatically creates tables)
- **Logging**: Enabled in development

## Volumes

### postgres_data

Persistent volume for PostgreSQL data storage. This ensures your data persists between container restarts.

To backup the database:

```bash
docker-compose exec postgres pg_dump -U postgres my_car_value > backup.sql
```

To restore from backup:

```bash
docker-compose exec -T postgres psql -U postgres my_car_value < backup.sql
```

## Troubleshooting

### Port Already in Use

If port 5432 is already in use, modify the docker-compose.yml:

```yaml
ports:
  - '5433:5432' # Use different host port
```

Then update your `.env` file:

```env
DB_PORT=5433
```

### Database Connection Issues

1. Ensure the database container is running:

   ```bash
   docker-compose ps
   ```

2. Check database logs:

   ```bash
   docker-compose logs postgres
   ```

3. Test database connectivity:
   ```bash
   docker-compose exec postgres pg_isready -U postgres
   ```

### Permission Issues (Linux/Mac)

If you encounter permission issues with volumes:

```bash
# Fix ownership
sudo chown -R $USER:$USER postgres_data/
```

## Production Considerations

For production deployment:

1. **Environment Variables**:
   - Use strong passwords
   - Set `NODE_ENV=production`
   - Configure proper SSL settings

2. **Database Security**:
   - Change default passwords
   - Use environment secrets
   - Enable SSL connections
   - Restrict network access

3. **Volume Management**:
   - Use named volumes or bind mounts
   - Implement backup strategies
   - Monitor disk usage

4. **Health Checks**:
   - The PostgreSQL service includes health checks
   - Monitor container health in production

## Development Workflow

Recommended development workflow:

1. Start the database with Docker:

   ```bash
   docker-compose up postgres
   ```

2. Run the NestJS application locally:

   ```bash
   pnpm run start:dev
   ```

3. Use TypeORM CLI for database operations:

   ```bash
   # Generate migration
   pnpm run typeorm:migration:generate -- -n MigrationName

   # Run migrations
   pnpm run typeorm:migration:run
   ```

This setup provides the best of both worlds: containerized database for consistency and local app development for fast iteration.
