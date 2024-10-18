import { Module } from '@nestjs/common';
import { ServerRegistryService } from './serverRegistry.service';

@Module({
    providers: [ServerRegistryService],
    exports: [ServerRegistryService],
  })
export class ServerRegistryModule {}