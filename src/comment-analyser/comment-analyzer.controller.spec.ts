import { Test, TestingModule } from '@nestjs/testing';
import { CommentAnalyserController } from './comment-analyzer.controller';

describe('CommentAnalyserController', () => {
  let controller: CommentAnalyserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentAnalyserController],
    }).compile();

    controller = module.get<CommentAnalyserController>(CommentAnalyserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
