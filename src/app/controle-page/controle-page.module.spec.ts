import { ControlePageModule } from './controle-page.module';

describe('ControlePageModule', () => {
  let controlePageModule: ControlePageModule;

  beforeEach(() => {
    controlePageModule = new ControlePageModule();
  });

  it('should create an instance', () => {
    expect(controlePageModule).toBeTruthy();
  });
});
