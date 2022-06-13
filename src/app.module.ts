import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommentAnalyzerModule } from './comment-analyser/comment-analyzer.module';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: 'redis-0.redis.redis.svc.cluster.local',
        port: 6379,
        password: "a-very-complex-password-here"
      },
    }),
    CommentAnalyzerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
