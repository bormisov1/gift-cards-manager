import { Module } from '@nestjs/common';
import { FileHandlerController } from './file-handler.controller';

@Module({
  controllers: [FileHandlerController],
})
export class FileHandlerModule {}
