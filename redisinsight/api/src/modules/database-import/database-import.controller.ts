import {
  BadRequestException,
  Controller, HttpCode, Post, UploadedFile,
  UseInterceptors, UsePipes, ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody, ApiConsumes, ApiResponse, ApiTags,
} from '@nestjs/swagger';
import { DatabaseImportService } from 'src/modules/database-import/database-import.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DatabaseImportResponse } from 'src/modules/database-import/dto/database-import.response';

@UsePipes(new ValidationPipe({ transform: true }))
@ApiTags('Database')
@Controller('/databases')
export class DatabaseImportController {
  constructor(private readonly service: DatabaseImportService) {}

  @Post('import')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  @ApiResponse({ type: DatabaseImportResponse })
  async import(
    @UploadedFile() file: any,
  ): Promise<DatabaseImportResponse> {
    // todo: create FileValidation class
    if (!file) {
      throw new BadRequestException('No import file provided');
    }
    if (file?.size > 1024 * 1024 * 10) {
      throw new BadRequestException('Import file is too big. Maximum 10mb allowed');
    }

    return this.service.import(file);
  }
}