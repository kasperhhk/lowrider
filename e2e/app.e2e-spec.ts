import { LowriderAngularPage } from './app.po';

describe('lowrider-angular App', function() {
  let page: LowriderAngularPage;

  beforeEach(() => {
    page = new LowriderAngularPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
