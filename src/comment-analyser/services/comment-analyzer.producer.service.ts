import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { FileReaderService } from './file-reader.service';
 
@Injectable()
export class CommentAnalyzerProducerService {
  private readonly logger = new Logger(CommentAnalyzerProducerService.name)
  constructor(@InjectQueue('comment-queue') private queue: Queue, private readonly fileReader: FileReaderService) {}
  async offloadFileToQueue(id: string){
    for (const file of await this.fileReader.readDirectory()) {
      this.logger.debug(file)
      await this.queue.add('comment-job', {
        fileName: file, jobId: id
      });
      this.logger.debug('offloaded process')
    }
    return {
      message: `The files have been offloaded for processing.`,
      jobId: id
    }
  }
}