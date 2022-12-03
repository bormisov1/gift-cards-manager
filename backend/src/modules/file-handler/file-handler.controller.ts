import { Controller, Get, Param, StreamableFile, Res } from '@nestjs/common';
import type { Response } from 'express';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('file-handler')
export class FileHandlerController {
  @Get(':giftCardId?')
  buffer(@Res() res: Response, @Param() giftCardId: string): StreamableFile {
    const pathToFile = join(process.cwd(), 'codes', giftCardId + '.png');
    const file = createReadStream(pathToFile);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${pathToFile}"`,
    });
    return new StreamableFile(file);
  }
}
