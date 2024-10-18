import { Module } from '@nestjs/common';
import { EstateService } from './estate.service';
import { EstateController } from './estate.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estate } from './estate.entity';
import { DatabaseModule } from '@app/common';

@Module({
  imports: [DatabaseModule.forFeature([Estate])],
  controllers: [EstateController],
  providers: [EstateService],
  exports: [EstateService]
})
export class EstateModule {}
