import { MongooseSetUpModuleModule } from './mongoose-set-up-module.module';

describe('MongooseSetUpModuleModule', () => {
  let mongooseSetUpModuleModule: MongooseSetUpModuleModule;

  beforeEach(() => {
    mongooseSetUpModuleModule = new MongooseSetUpModuleModule();
  });

  it('should create an instance', () => {
    expect(mongooseSetUpModuleModule).toBeTruthy();
  });
});
