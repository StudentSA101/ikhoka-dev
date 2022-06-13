import { Process, Processor } from "@nestjs/bull";
import { Job } from "bull";
import { Logger } from '@nestjs/common';
import { FileReaderService } from './file-reader.service'

@Processor('comment-queue')
export class CommentAnalyzerConsumerService {
    private readonly logger = new Logger(CommentAnalyzerConsumerService.name)
    constructor(private readonly fileReader: FileReaderService) { }
    @Process({ name: 'comment-job', concurrency: 1 })
    async readOperationJob(job: Job<{ fileName: string, jobId: string }>) {
        this.logger.debug('Start processing...');
        this.logger.debug(JSON.stringify(await this.fileReader.read(job.data.fileName, job.data.jobId)));
        this.logger.debug('processing file completed');
    }
}