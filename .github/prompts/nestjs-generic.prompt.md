````prompt
---
mode: agent
---

# NestJS Application - Swagger/OpenAPI Documentation Implementation Guide

This guide provides comprehensive instructions for implementing Swagger/OpenAPI documentation for any NestJS application.

## 1. Installation & Setup

Install the required Swagger dependencies:

```bash
npm install --save @nestjs/swagger
# or with pnpm
pnpm add @nestjs/swagger
# or with yarn
yarn add @nestjs/swagger
````

## 2. Bootstrap Configuration

Update your `src/main.ts` file to configure Swagger:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Your API Title')
    .setDescription('Your API description')
    .setVersion('1.0')
    .addTag('resources', 'Resource management operations')
    .addTag('items', 'Item management operations')
    .addBearerAuth() // Optional: Add Bearer token authentication
    .addBasicAuth() // Optional: Add Basic authentication
    .addCookieAuth('session-id') // Optional: Add Cookie authentication
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth tokens across page refreshes
    },
  });

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation: ${await app.getUrl()}/api`);
}
bootstrap();
```

## 3. Controller Documentation

### Generic Resource Controller Example

```typescript
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ResourcesService } from './resources.service';
import { CreateResourceDto } from './dto/create-resource.dto';
import { UpdateResourceDto } from './dto/update-resource.dto';
import { Resource } from './entities/resource.entity';

@ApiTags('resources')
@Controller('resources')
@ApiBearerAuth() // Optional: Require authentication for all endpoints
export class ResourcesController {
  constructor(private readonly resourcesService: ResourcesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new resource',
    description: 'Creates a new resource with the provided data',
  })
  @ApiBody({ type: CreateResourceDto })
  @ApiResponse({
    status: 201,
    description: 'Resource created successfully',
    type: Resource,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Body() createResourceDto: CreateResourceDto) {
    return this.resourcesService.create(createResourceDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all resources',
    description: 'Retrieves a list of all resources with optional filtering',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    type: 'string',
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: 'string',
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    description: 'Number of items per page',
  })
  @ApiResponse({
    status: 200,
    description: 'List of resources retrieved successfully',
    type: [Resource],
  })
  findAll(
    @Query('category') category?: string,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.resourcesService.findAll({ category, status, page, limit });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get resource by ID',
    description: 'Retrieves a specific resource by its unique identifier',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Resource unique identifier',
    example: '123',
  })
  @ApiResponse({
    status: 200,
    description: 'Resource found and retrieved successfully',
    type: Resource,
  })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  findOne(@Param('id') id: string) {
    return this.resourcesService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update resource',
    description: 'Updates an existing resource with new data',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Resource unique identifier',
    example: '123',
  })
  @ApiBody({ type: UpdateResourceDto })
  @ApiResponse({
    status: 200,
    description: 'Resource updated successfully',
    type: Resource,
  })
  @ApiResponse({ status: 400, description: 'Bad Request - Invalid input data' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  update(
    @Param('id') id: string,
    @Body() updateResourceDto: UpdateResourceDto,
  ) {
    return this.resourcesService.update(+id, updateResourceDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete resource',
    description: 'Permanently deletes a resource',
  })
  @ApiParam({
    name: 'id',
    type: 'string',
    description: 'Resource unique identifier',
    example: '123',
  })
  @ApiResponse({ status: 200, description: 'Resource deleted successfully' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  remove(@Param('id') id: string) {
    return this.resourcesService.remove(+id);
  }
}
```

## 4. DTO Documentation

### Create Resource DTO Example

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  MinLength,
  MaxLength,
  IsArray,
  IsBoolean,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

export enum ResourceStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  ARCHIVED = 'archived',
}

export enum ResourceCategory {
  TECHNOLOGY = 'technology',
  BUSINESS = 'business',
  EDUCATION = 'education',
  ENTERTAINMENT = 'entertainment',
}

export class CreateResourceDto {
  @ApiProperty({
    description: 'Resource name or title',
    example: 'My Awesome Resource',
    minLength: 3,
    maxLength: 100,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the resource',
    example:
      'This is a comprehensive description of what this resource provides',
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiProperty({
    description: 'Resource category',
    example: ResourceCategory.TECHNOLOGY,
    enum: ResourceCategory,
    enumName: 'ResourceCategory',
  })
  @IsEnum(ResourceCategory)
  category: ResourceCategory;

  @ApiProperty({
    description: 'Current status of the resource',
    example: ResourceStatus.ACTIVE,
    enum: ResourceStatus,
    enumName: 'ResourceStatus',
    default: ResourceStatus.ACTIVE,
  })
  @IsEnum(ResourceStatus)
  status: ResourceStatus = ResourceStatus.ACTIVE;

  @ApiPropertyOptional({
    description: 'Contact email for the resource',
    example: 'contact@example.com',
    format: 'email',
  })
  @IsOptional()
  @IsEmail()
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the resource',
    example: ['web', 'api', 'backend'],
    type: [String],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Whether the resource is featured',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @ApiPropertyOptional({
    description: 'Priority level (1-10, where 10 is highest)',
    example: 5,
    minimum: 1,
    maximum: 10,
    default: 5,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  priority?: number = 5;
}
```

### Update Resource DTO Example

```typescript
import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateResourceDto } from './create-resource.dto';

export class UpdateResourceDto extends PartialType(
  OmitType(CreateResourceDto, ['status'] as const),
) {
  // All properties from CreateResourceDto are now optional, except 'status'
  // You can add additional update-specific properties here if needed
}
```

## 5. Entity Documentation

### Resource Entity Example

```typescript
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ResourceStatus, ResourceCategory } from '../dto/create-resource.dto';

export class Resource {
  @ApiProperty({
    description: 'Resource unique identifier',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'Resource name or title',
    example: 'My Awesome Resource',
  })
  name: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the resource',
    example:
      'This is a comprehensive description of what this resource provides',
  })
  description?: string;

  @ApiProperty({
    description: 'Resource category',
    example: ResourceCategory.TECHNOLOGY,
    enum: ResourceCategory,
  })
  category: ResourceCategory;

  @ApiProperty({
    description: 'Current status of the resource',
    example: ResourceStatus.ACTIVE,
    enum: ResourceStatus,
  })
  status: ResourceStatus;

  @ApiPropertyOptional({
    description: 'Contact email for the resource',
    example: 'contact@example.com',
  })
  contactEmail?: string;

  @ApiPropertyOptional({
    description: 'Tags associated with the resource',
    example: ['web', 'api', 'backend'],
    type: [String],
  })
  tags?: string[];

  @ApiPropertyOptional({
    description: 'Whether the resource is featured',
    example: false,
  })
  featured?: boolean;

  @ApiPropertyOptional({
    description: 'Priority level (1-10, where 10 is highest)',
    example: 5,
  })
  priority?: number;

  @ApiProperty({
    description: 'Resource creation timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Resource last update timestamp',
    example: '2024-01-15T10:30:00.000Z',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Resource deletion timestamp (soft delete)',
    example: '2024-01-16T10:30:00.000Z',
  })
  deletedAt?: Date;
}
```

## 6. Advanced Swagger Features

### Multiple API Specifications

```typescript
// main.ts - Multiple API documentation
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Public API Documentation
  const publicConfig = new DocumentBuilder()
    .setTitle('Public API')
    .setDescription('Public endpoints for external consumers')
    .setVersion('1.0')
    .addTag('public')
    .build();

  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [PublicModule], // Only include public modules
  });
  SwaggerModule.setup('api/public', app, publicDocument);

  // Admin API Documentation
  const adminConfig = new DocumentBuilder()
    .setTitle('Admin API')
    .setDescription('Administrative endpoints')
    .setVersion('1.0')
    .addTag('admin')
    .addBearerAuth()
    .build();

  const adminDocument = SwaggerModule.createDocument(app, adminConfig, {
    include: [AdminModule], // Only include admin modules
  });
  SwaggerModule.setup('api/admin', app, adminDocument);

  await app.listen(3000);
}
```

### Custom Decorators

```typescript
// custom-swagger.decorators.ts
import { applyDecorators } from '@nestjs/common';
import { ApiResponse, ApiOperation } from '@nestjs/swagger';

export function ApiStandardResponses() {
  return applyDecorators(
    ApiResponse({ status: 400, description: 'Bad Request' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden' }),
    ApiResponse({ status: 500, description: 'Internal Server Error' }),
  );
}

export function ApiCrudOperation(operationType: 'create' | 'read' | 'update' | 'delete', resource: string) {
  const operations = {
    create: `Create a new ${resource}`,
    read: `Retrieve ${resource} information`,
    update: `Update existing ${resource}`,
    delete: `Delete ${resource}`,
  };

  return applyDecorators(
    ApiOperation({ summary: operations[operationType] }),
    ApiStandardResponses(),
  );
}

// Usage in controller
@Post()
@ApiCrudOperation('create', 'resource')
@ApiResponse({ status: 201, description: 'Resource created successfully', type: Resource })
create(@Body() createResourceDto: CreateResourceDto) {
  return this.resourcesService.create(createResourceDto);
}
```

### Complex Schema Examples

```typescript
// For handling oneOf, anyOf, allOf schemas
import { ApiProperty, getSchemaPath, ApiExtraModels } from '@nestjs/swagger';

class BaseEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  type: string;
}

class ResourceA extends BaseEntity {
  @ApiProperty()
  resourceAProperty: string;
}

class ResourceB extends BaseEntity {
  @ApiProperty()
  resourceBProperty: number;
}

@ApiExtraModels(ResourceA, ResourceB)
export class PolymorphicDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(ResourceA) },
      { $ref: getSchemaPath(ResourceB) },
    ],
  })
  data: ResourceA | ResourceB;

  @ApiProperty({
    type: 'array',
    items: {
      oneOf: [
        { $ref: getSchemaPath(ResourceA) },
        { $ref: getSchemaPath(ResourceB) },
      ],
    },
  })
  items: (ResourceA | ResourceB)[];
}
```

## 7. CLI Plugin Configuration

Add to your `nest-cli.json` for automatic decorators:

```json
{
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "plugins": [
      {
        "name": "@nestjs/swagger",
        "options": {
          "classValidatorShim": true,
          "introspectComments": true,
          "dtoFileNameSuffix": [".dto.ts", ".entity.ts"],
          "controllerFileNameSuffix": ".controller.ts"
        }
      }
    ]
  }
}
```

With the CLI plugin enabled, you can simplify your DTOs:

```typescript
// Before (without plugin)
export class CreateResourceDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;
}

// After (with plugin)
export class CreateResourceDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;
}
```

## 8. Testing Swagger Integration

```typescript
// test/swagger.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Swagger Documentation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should serve Swagger UI', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('swagger-ui');
      });
  });

  it('should serve OpenAPI JSON spec', () => {
    return request(app.getHttpServer())
      .get('/api-json')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('openapi');
        expect(res.body).toHaveProperty('info');
        expect(res.body).toHaveProperty('paths');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

## Best Practices

1. **Use Descriptive Examples**: Always provide realistic examples in your `@ApiProperty` decorators
2. **Group Related Endpoints**: Use `@ApiTags` to organize your API documentation
3. **Document Error Cases**: Include common error responses like 400, 401, 404, 500
4. **Leverage Enums**: Use TypeScript enums for better API contract definition
5. **Use PartialType and OmitType**: Reduce code duplication in DTOs
6. **Enable CLI Plugin**: Reduces boilerplate code significantly
7. **Version Your APIs**: Use proper versioning strategy and document breaking changes
8. **Security Documentation**: Document authentication requirements clearly
9. **Validate DTOs**: Use class-validator decorators alongside Swagger decorators
10. **Test Documentation**: Include e2e tests to ensure documentation endpoints work correctly

This guide provides a solid foundation for implementing comprehensive Swagger documentation in any NestJS application. Customize the examples based on your specific domain and requirements.

```

```
