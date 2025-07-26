---
applyTo: '**/*.ts'
---

# NestJS Best Practices & Coding Guidelines

## Project Context

This is a NestJS TypeScript application called "my-car-value" for car valuation features. Uses pnpm as package manager with modern tooling (ESLint 9, TypeScript 5.7, Jest). Current modules: `users` and `reports` for user management and car valuation reporting.

## Architecture & Module Structure

### Module Organization

- **Follow Feature-based Modules**: Each feature has its own module with controllers, services, DTOs, and tests
- **Module Structure**: `src/feature-name/` contains all related files:
  ```
  src/users/
  ├── dto/
  ├── entities/
  ├── users.controller.ts
  ├── users.service.ts
  ├── users.module.ts
  ├── *.spec.ts (tests)
  ```
- **Import Structure**: Always import feature modules in `app.module.ts`
- **Export Pattern**: Export services from modules when needed by other modules

### Dependency Injection Best Practices

- **Constructor Injection**: Always use constructor injection with `@Injectable()` decorators
  ```typescript
  @Injectable()
  export class UsersService {
    constructor(private readonly repository: Repository) {}
  }
  ```
- **Provider Registration**: Register all providers in module's `providers` array
- **Circular Dependencies**: Use `forwardRef()` for circular dependencies between modules
- **Custom Providers**: Use factory providers for complex initialization logic

## Controller Guidelines

### Route Design

- **RESTful Endpoints**: Follow REST conventions for CRUD operations
- **Path Parameters**: Use `@Param()` for resource identifiers
- **Query Parameters**: Use `@Query()` for filtering, pagination, and optional parameters
- **Request Body**: Use `@Body()` with DTOs for request validation

### Error Handling

- **HTTP Status Codes**: Use appropriate HTTP status codes (200, 201, 400, 404, 500)
- **Exception Filters**: Create custom exception filters for consistent error responses
- **Validation**: Always validate incoming data using DTOs with class-validator

### Controller Structure

```typescript
@Controller('resources')
@ApiTags('resources') // For Swagger documentation
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({ summary: 'Create resource' })
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }
}
```

## Service Layer Best Practices

### Service Responsibilities

- **Business Logic**: Keep all business logic in services, not controllers
- **Single Responsibility**: Each service should handle one domain concept
- **Stateless Design**: Services should be stateless and reusable
- **Database Abstraction**: Abstract database operations from business logic

### Service Implementation

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }
}
```

## DTO & Validation Guidelines

### DTO Design

- **Input DTOs**: Create separate DTOs for create, update operations
- **Validation**: Use class-validator decorators for all input validation
- **Type Safety**: Ensure strong typing throughout the application
- **Documentation**: Use `@ApiProperty()` decorators for Swagger documentation

### DTO Examples

```typescript
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ description: 'User name', example: 'John Doe' })
  name: string;

  @IsEmail()
  @ApiProperty({ description: 'User email', example: 'john@example.com' })
  email: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
```

## Testing Standards

### Unit Testing

- **Test Structure**: Use `describe` blocks for grouping, `it` blocks for individual tests
- **Mocking**: Mock dependencies using Jest mocking or custom mock objects
- **Coverage**: Aim for high test coverage on business logic
- **Test Isolation**: Each test should be independent and cleanup after itself

### Unit Test Template

```typescript
describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useClass: Repository },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
```

### E2E Testing

- **Full Integration**: Test complete request/response cycles
- **Database State**: Setup and teardown test database state
- **Authentication**: Test with proper authentication when required
- **Supertest**: Use supertest for HTTP request testing

## Code Quality & Conventions

### TypeScript Guidelines

- **Strict Types**: Use strict TypeScript configuration with proper type annotations
- **Interface Usage**: Define interfaces for complex data structures
- **Enum Usage**: Use enums for constants and status values
- **Null Safety**: Handle null/undefined values explicitly

### Code Style

- **File Naming**: Use kebab-case for files (e.g., `user-profile.service.ts`)
- **Class Naming**: Use PascalCase for classes (e.g., `UserProfileService`)
- **Method Naming**: Use camelCase for methods and properties
- **Constants**: Use SCREAMING_SNAKE_CASE for constants

### ESLint Configuration

- **No Explicit Any**: Avoid using `any` type, use proper types instead
- **Floating Promises**: Handle promises properly with await or void
- **Unused Variables**: Remove unused imports and variables
- **Consistent Formatting**: Use Prettier for consistent code formatting

## Database & ORM Guidelines

### Entity Design

- **Entity Relationships**: Define proper relationships between entities
- **Validation**: Use entity-level validation decorators
- **Timestamps**: Include created/updated timestamps for audit trails
- **Soft Deletes**: Implement soft delete for important data

### Repository Pattern

```typescript
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }
}
```

## Security Best Practices

### Input Validation

- **DTO Validation**: Always validate input using class-validator
- **Sanitization**: Sanitize user input to prevent injection attacks
- **Rate Limiting**: Implement rate limiting for API endpoints
- **CORS**: Configure CORS properly for cross-origin requests

### Authentication & Authorization

- **JWT Tokens**: Use JWT for stateless authentication
- **Guards**: Implement guards for route protection
- **Role-based Access**: Use decorators for role-based authorization
- **Password Security**: Hash passwords using bcrypt or similar

## Performance Guidelines

### Database Optimization

- **Query Optimization**: Use select queries to fetch only needed fields
- **Pagination**: Implement pagination for large data sets
- **Indexing**: Add database indexes on frequently queried fields
- **Connection Pooling**: Configure proper database connection pooling

### Caching Strategy

- **Redis Integration**: Use Redis for caching frequently accessed data
- **Cache Invalidation**: Implement proper cache invalidation strategies
- **Response Caching**: Cache expensive operations and API responses

## Documentation Standards

### API Documentation

- **Swagger Integration**: Use `@nestjs/swagger` for automatic API documentation
- **Comprehensive Examples**: Provide clear examples in API documentation
- **Error Documentation**: Document all possible error responses
- **Version Control**: Version your APIs properly

### Code Documentation

- **JSDoc Comments**: Use JSDoc for complex business logic
- **README Updates**: Keep README.md updated with setup instructions
- **Architecture Documentation**: Document major architectural decisions

## Development Workflow

### Git Practices

- **Commit Messages**: Use conventional commit format
- **Branch Strategy**: Use feature branches for new development
- **Pre-commit Hooks**: Use Husky and lint-staged for code quality checks
- **Code Reviews**: Require code reviews for all changes

### Build & Deployment

- **Environment Variables**: Use proper environment configuration
- **Health Checks**: Implement health check endpoints
- **Logging**: Use structured logging with proper log levels
- **Monitoring**: Implement application monitoring and metrics

## Common Anti-patterns to Avoid

### Architecture Anti-patterns

- **Fat Controllers**: Don't put business logic in controllers
- **God Services**: Avoid services that do too many things
- **Tight Coupling**: Don't create tight dependencies between modules
- **Magic Numbers**: Use named constants instead of magic numbers

### Code Anti-patterns

- **Silent Failures**: Always handle errors explicitly
- **Callback Hell**: Use async/await instead of nested callbacks
- **Mutable Globals**: Avoid global mutable state
- **Copy-Paste Code**: Extract common functionality into shared services

## Project-Specific Guidelines

### Car Valuation Domain

- **User Management**: Handle user registration, authentication, and profiles
- **Report Generation**: Create structured reports for car valuations
- **Data Validation**: Validate car data (make, model, year, mileage)
- **Location Services**: Handle geographic data for car locations

### Module Integration

- **Users Module**: Manages user accounts and authentication
- **Reports Module**: Handles car valuation reports and analytics
- **Shared Services**: Create shared utilities for common functionality
- **Cross-module Communication**: Use events or shared services for module communication
