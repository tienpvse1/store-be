import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query
} from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { Role } from '@common/roles';
import { HasRole } from '@decorators/has-role.decorator';
import { IsPublic } from '@decorators/is-public.decorator';
import { UserInfo } from '@decorators/user';
import { ErrorResponse } from 'error/error-response';
import {
    ActivateCustomerDto,
    DeactivateCustomerDto,
} from './dto/activate-customer.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterCustomerDto } from './dto/filter-customer.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiBearerAuth('Authorization')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch('update-user-profile/:id')
  @HasRole(Role.Admin)
  @ApiOperation({
    summary: 'Update user profile',
    description: 'Update user profile by their id, for admin only',
  })
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User profile has been updated',
    type: User,
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'User do not has admin role',
    type: ErrorResponse(403),
  })
  updateUserProfile(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() dto: UpdateUserDto,
  ) {
    return this.userService.updateUserProfile(id, dto);
  }

  @Post('create-admin')
  @ApiOperation({
    summary: 'Create admin',
    description: 'Create a new admin for bootstrap purpose',
  })
  @IsPublic()
  createAdmin(@Body() dto: CreateUserDto) {
    return this.userService.bootstrapAdmin(dto);
  }

  @Post('create-customer')
  @ApiOperation({
    summary: 'Create customer',
    description:
      'Create a new customer, email need to be unique,password is hashed before insert to database',
  })
  @ApiBadRequestResponse({
    description: 'Bad request',
    type: ErrorResponse(400),
  })
  @ApiInternalServerErrorResponse({
    description: 'Something went wrong',
    type: ErrorResponse(500),
  })
  @ApiCreatedResponse({ description: 'Customer has been created', type: User })
  createCustomer(@Body() dto: CreateUserDto) {
    return this.userService.createCustomer(dto);
  }

  @Post('activate-customer')
  @ApiOperation({
    summary: 'Activate customer',
    description: 'Activate customer by their id',
  })
  activateCustomer(@Body() dto: ActivateCustomerDto) {
    return this.userService.activateCustomer(dto.id);
  }

  @Post('deactivate-customer')
  @ApiOperation({
    summary: 'Deactivate customer',
    description: 'Deactivate customer by their id',
  })
  deactivateCustomer(@Body() dto: DeactivateCustomerDto) {
    return this.userService.deactivateCustomer(dto.id);
  }

  @Get('customer')
  @ApiOperation({
    summary: 'Filter customer',
    description: 'Filter customer by name or email',
  })
  searchCustomer(@Query() query: FilterCustomerDto) {
    return this.userService.filterCustomer(query);
  }

  @Get('profile')
  @ApiOperation({
    summary: 'View own profile',
    description: 'View own profile for authenticated user',
  })
  @ApiOkResponse({ description: 'Profile found', type: User })
  @ApiInternalServerErrorResponse({ description: 'something went wrong' })
  viewProfile(@UserInfo('id') userId: number) {
    return this.userService.findById(userId);
  }
}
