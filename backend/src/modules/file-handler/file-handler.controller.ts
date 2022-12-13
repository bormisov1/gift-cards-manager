import { Controller, Get, Param, StreamableFile, Res } from '@nestjs/common';
import type { Response } from 'express';
import { readFileSync, createReadStream } from 'fs';
import { join } from 'path';

@Controller('file-handler')
export class FileHandlerController {
  @Get(':id')
  buffer(@Res() res: Response, @Param('id') id: string) {
    const pathToFile = join(process.cwd(), 'codes', id + '.png');
    const file = readFileSync(pathToFile)
    res.contentType('image/png');
    res.send(file);
    /* const file = createReadStream(pathToFile);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="${id + '.png'}"`,
    });
    return new StreamableFile(file); */
  }
}
