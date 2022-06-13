import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { CommentAnalyzerProducerService } from './services/comment-analyzer.producer.service';
import { FileReaderService } from './services/file-reader.service';

@Controller('comment-analyser')
export class CommentAnalyzerController {
    constructor(private readonly commentAnalyzerProducerService: CommentAnalyzerProducerService, private readonly fileReaderService: FileReaderService) { }
    @Get()
    async getStartJob(@Query('id') id:string) {
        if (id) {
            return this.commentAnalyzerProducerService.offloadFileToQueue(id);
        }
        throw new HttpException('Please include a Id for this job to identify it in the queue.', HttpStatus.UNPROCESSABLE_ENTITY)
    }
}