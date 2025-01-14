import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from 'src/common/roles';
import { HasRole } from 'src/custom-decorators/has-role.decorator';
import { IsPublic } from 'src/custom-decorators/is-public.decorator';
import { UserInfo } from 'src/custom-decorators/user';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductService } from './product.service';

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new product',
    description: 'Create a new product, available for admin only',
  })
  @ApiCreatedResponse({ description: 'Product created' })
  @ApiInternalServerErrorResponse({ description: 'Unable to create product' })
  @HasRole(Role.Admin)
  create(@UserInfo('id') adminId: number, @Body() dto: CreateProductDto) {
    return this.productService.create(adminId, dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all products',
    description: 'Get all products, filter are accepted',
  })
  @IsPublic()
  findAll(
    @Query() filter: FilterProductDto,
    @UserInfo('roles') roles?: Role[],
  ) {
    return this.productService.findAll(
      roles && roles.includes(Role.Admin),
      filter,
    );
  }

  @Get(':id')
  @IsPublic()
  @ApiOperation({
    summary: 'Get a product by ID',
    description: 'Get a product by ID, use for detail page',
  })
  findOne(@Param('id', new ParseIntPipe()) id: number) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a product',
    description: 'Update a product, available for admin only',
  })
  @HasRole(Role.Admin)
  update(
    @UserInfo('id', new ParseIntPipe()) adminId: number,
    @Param('id', new ParseIntPipe()) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(adminId, id, updateProductDto);
  }

  @Patch(':id/activate')
  @HasRole(Role.Admin)
  @ApiOperation({
    summary: 'Activate a product',
    description: 'Activate product, customer can see this product',
  })
  activateProduct(
    @UserInfo('id', new ParseIntPipe()) adminId: number,
    @Param('id', new ParseIntPipe()) id: number,
  ) {
    return this.productService.activateProduct(adminId, id);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Deactivate a product',
    description:
      'Deactivate product, customer can not see this product anymore',
  })
  @HasRole(Role.Admin)
  remove(
    @Param('id', new ParseIntPipe()) id: number,
    @UserInfo('id') adminId: number,
  ) {
    return this.productService.deactivateProduct(adminId, id);
  }
}
