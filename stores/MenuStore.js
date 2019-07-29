import { observable, action } from 'mobx';

export default class MenuStore {
  @observable menuOpen = false;

  @observable isMobile = false;

  @observable onAds = true;

  @action toggleMenu = () => {
    this.menuOpen = !this.menuOpen;
  };

  @action breakToMobile = value => {
    if (value) {
      this.menuOpen = false;
      this.isMobile = true;
    } else {
      this.menuOpen = true;
      this.isMobile = false;
    }
  };
}
