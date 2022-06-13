import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { FILE_READER_DIRECTORY, FILE_READER_EXTENSION } from './comment-analyzer.constant';
import { CommentAnalyzerController } from './comment-analyzer.controller';
import { CommentAnalyzerConsumerService } from './services/comment-analyzer.consumer.service';
import { CommentAnalyzerProducerService } from './services/comment-analyzer.producer.service';
import { FileReaderService } from './services/file-reader.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'comment-queue',
    }),
  ],
  controllers: [CommentAnalyzerController],
  providers: [CommentAnalyzerConsumerService,CommentAnalyzerProducerService, { provide: FILE_READER_DIRECTORY, useValue: './docs' }, { provide: FILE_READER_EXTENSION, useValue: '.txt' }, FileReaderService],
})
export class CommentAnalyzerModule { }
