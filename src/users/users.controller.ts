import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { GetUserByIdParamDto } from './dtos/get-user-by-id-param.dto';
import { GetUserByIdResponseDto } from './dtos/get-user-by-id-response.dto';
import { GetUsersByEmailParamDto } from './dtos/get-users-by-email-param.dto';
import { UsersService } from './users.service';

@Controller('auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/signup')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async createUser(@Body() body: CreateUserDto): Promise<void> {
    const { email, password } = body;
    await this.usersService.createUser(email, password);
  }
  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Retrieve a user by their unique ID.',
  })
  async getUserById(
    @Param() params: GetUserByIdParamDto,
  ): Promise<GetUserByIdResponseDto> {
    const user = await this.usersService.findUserById(params.id);

    return new GetUserByIdResponseDto(user);
  }

  @Get('/users/:email')
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users.',
  })
  @ApiResponse({
    status: 200,
    description: 'A list of users has been successfully retrieved.',
  })
  @ApiResponse({ status: 404, description: 'No users found.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error.' })
  async getAllUsers(
    @Param() params: GetUsersByEmailParamDto,
  ): Promise<GetUserByIdResponseDto[]> {
    const users = await this.usersService.findUsersByEmail(params.email);
    return users.map((user) => new GetUserByIdResponseDto(user));
  }
}
