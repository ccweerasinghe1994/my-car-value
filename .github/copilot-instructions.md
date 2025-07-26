# Copilot Instructions

## Project Overview

This is a NestJS TypeScript application called "my-car-value" - currently a starter template ready for car valuation feature development. Uses pnpm as package manager with modern tooling (ESLint 9, TypeScript 5.7, Jest).

## Architecture Patterns

- **Module Structure**: Follow NestJS module pattern - each feature should have its own module with controllers, services, and DTOs
- **Dependency Injection**: Use constructor injection with `@Injectable()` decorators, as seen in `src/app.service.ts`
- **Controller Pattern**: Controllers handle HTTP requests, delegate business logic to services (`src/app.controller.ts`)
- **Service Layer**: Business logic lives in services with `@Injectable()` decorator

## Development Workflow

```bash
# Development server with hot reload
pnpm run start:dev

# Run unit tests with watch mode
pnpm run test:watch

# Run e2e tests
pnpm run test:e2e

# Lint and format code
pnpm run lint
pnpm run format
```

## Code Conventions

- **TypeScript Config**: Strict type checking disabled (`noImplicitAny: false`), decorators enabled
- **ESLint Rules**: Custom rules in `eslint.config.mjs` - `@typescript-eslint/no-explicit-any` disabled, floating promises as warnings
- **File Naming**: Use kebab-case for files, PascalCase for classes (`app.controller.ts`, `AppController`)
- **Test Files**: Unit tests as `*.spec.ts` in `src/`, e2e tests as `*.e2e-spec.ts` in `test/`

## Testing Patterns

- **Unit Tests**: Use `@nestjs/testing` with `Test.createTestingModule()` for dependency injection testing
- **E2E Tests**: Use `supertest` with full application bootstrap, test actual HTTP endpoints
- **Test Structure**: Standard Jest describe/it blocks, `beforeEach` for test setup

## Key Files

- `src/main.ts`: Application bootstrap (port 3000 default)
- `src/app.module.ts`: Root module configuration
- `nest-cli.json`: NestJS CLI configuration with `deleteOutDir: true`
- `tsconfig.json`: TypeScript config optimized for NestJS with decorators

## When Adding Features

1. Generate modules with NestJS CLI: `nest generate module feature-name`
2. Create controller, service, and DTO files following existing patterns
3. Import new modules in `app.module.ts`
4. Add corresponding unit and e2e tests
5. Use proper TypeScript types and NestJS decorators
