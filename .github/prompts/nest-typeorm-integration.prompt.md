---
mode: agent
---

# NestJS TypeORM Integration Prompt

## Task Definition

Integrate TypeORM database ORM with a NestJS application to provide robust database connectivity, entity management, repository patterns, and transaction support. This integration should follow NestJS dependency injection patterns while leveraging TypeORM's powerful features for database operations.

## Requirements

### Functional Requirements

- Database connection management with connection pooling
- Entity definition using TypeORM decorators (@Entity, @Column, @PrimaryGeneratedColumn)
- Repository pattern implementation with custom repositories
- Database migrations and schema synchronization
- Support for multiple database types (PostgreSQL, MySQL, SQLite, MongoDB)
- Query builder integration for complex queries
- Relationship management (One-to-One, One-to-Many, Many-to-Many)
- Transaction support with proper error handling
- Database seeding capabilities
- Soft delete functionality

### Technical Requirements

- TypeScript strict mode compatibility
- Decorator metadata reflection enabled in tsconfig.json
- Environment-based configuration management
- Connection validation and health checks
- Proper error handling and logging
- Type-safe database operations
- Performance optimization with lazy loading
- Database connection retry logic

### Integration Requirements

- Seamless integration with NestJS modules system
- Dependency injection for repositories and services
- Configuration service integration for database settings
- Testing support with in-memory databases
- Docker containerization compatibility
- CI/CD pipeline integration with database migrations

## Constraints

### Technical Constraints

- Must maintain TypeScript type safety throughout database operations
- Database schema changes must be versioned through migrations
- Connection pool size limited by database server configuration
- Cross-database transactions not supported (when using multiple databases)
- Circular dependencies between entities must be avoided
- Database-specific features may limit portability

### Performance Considerations

- Query optimization required for large datasets (use QueryBuilder for complex queries)
- Lazy loading vs eager loading trade-offs must be evaluated per use case
- Connection pooling configuration must match application load patterns
- Indexing strategy required for frequently queried columns
- Bulk operations preferred over individual entity saves for large datasets
- Database connection limits must be respected in high-concurrency scenarios

### Compatibility Requirements

- Node.js version compatibility with TypeORM and NestJS versions
- Database version compatibility matrix adherence
- TypeScript version alignment between NestJS and TypeORM
- Decorator experimental features must be enabled
- Reflect-metadata polyfill required for older environments

## Success Criteria

### Measurable Outcomes

- Database connection established successfully on application startup
- All entities properly mapped to database tables with correct column types
- Repository methods perform CRUD operations without data corruption
- Migration scripts execute successfully in all environments (dev, staging, prod)
- Query performance meets acceptable response time requirements (< 100ms for simple queries)
- Application handles database connection failures gracefully with proper error messages
- Type safety maintained with zero `any` types in database-related code
- Test coverage > 80% for all database-related services and repositories

### Acceptance Criteria

- [ ] **Database Connection**: Application connects to database on startup with proper error handling
- [ ] **Entity Mapping**: All entities correctly map to database tables with proper column types and constraints
- [ ] **Repository Pattern**: Custom repositories implement business logic with proper dependency injection
- [ ] **Migrations**: Database schema changes managed through versioned migration files
- [ ] **Relationships**: Entity relationships (1:1, 1:M, M:M) work correctly with proper cascade options
- [ ] **Transactions**: Database transactions handle complex operations with rollback on errors
- [ ] **Configuration**: Database configuration managed through environment variables and ConfigService
- [ ] **Error Handling**: Proper error handling for connection failures, constraint violations, and query errors
- [ ] **Performance**: Query optimization through proper indexing and QueryBuilder usage
- [ ] **Testing**: Unit and integration tests cover all database operations with test database setup

### Testing Requirements

- Unit tests for all repository methods using mocked database connections
- Integration tests with real database instances (preferably containerized)
- End-to-end tests covering complete request-response cycles with database operations
- Migration testing in isolated environments to ensure schema changes work correctly
- Performance testing for query optimization and connection pooling under load
- Error scenario testing for database failures, network issues, and constraint violations
- Cross-platform testing if supporting multiple database types
- Automated testing in CI/CD pipeline with database provisioning

### Code Quality Standards

```typescript
// Example entity definition following best practices
@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index()
  email: string;

  @Column({ type: 'varchar', length: 100 })
  firstName: string;

  @Column({ type: 'varchar', length: 100 })
  lastName: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;

  @BeforeInsert()
  setId() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

// Example repository implementation
@Injectable()
export class UsersRepository extends Repository<User> {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {
    super(User, dataSource.createEntityManager());
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    const user = this.create(userData);
    return this.save(user);
  }
}
```

### Environment Setup

- Development environment with local database instance
- Testing environment with isolated test database
- Staging environment mirroring production database schema
- Production environment with proper backup and monitoring
- Docker containerization for consistent development environments
- Database migration pipeline integrated with deployment process
