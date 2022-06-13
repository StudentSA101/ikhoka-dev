import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

const appServiceMock = {
  getHello: jest.fn().mockImplementation(() => 'This is a iKhokha test!'),
};

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appServiceMock,
        },
      ],
    }).compile();

    appService = moduleRef.get<AppService>(AppService);
    appController = moduleRef.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "This is a iKhokha test!"', () => {
      expect(appController.getHello()).toBe('This is a iKhokha test!');
      expect(appService.getHello).toHaveBeenCalled();
    });
  });
});
