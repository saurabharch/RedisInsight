import { Module, Type } from '@nestjs/common';
import { RdiController } from 'src/modules/rdi/rdi.controller';
import { RdiPipelineController } from 'src/modules/rdi/rdi-pipeline.controller';
import { RdiService } from 'src/modules/rdi/rdi.service';
import { RdiPipelineService } from 'src/modules/rdi/rdi-pipeline.service';
import { RdiRepository } from 'src/modules/rdi/repository/rdi.repository';
import { LocalRdiRepository } from 'src/modules/rdi/repository/local.rdi.repository';
import { RdiClientProvider } from 'src/modules/rdi/providers/rdi.client.provider';
import { RdiClientStorage } from 'src/modules/rdi/providers/rdi.client.storage';
import { RdiClientFactory } from 'src/modules/rdi/providers/rdi.client.factory';

@Module({})
export class RdiModule {
  static register(
    rdiRepository: Type<RdiRepository> = LocalRdiRepository,
  ) {
    return {
      module: RdiModule,
      controllers: [
        RdiController,
        RdiPipelineController,
      ],
      providers: [
        RdiService,
        RdiPipelineService,
        RdiClientProvider,
        RdiClientStorage,
        RdiClientFactory,
        {
          provide: RdiRepository,
          useClass: rdiRepository,
        },
      ],
    };
  }
}