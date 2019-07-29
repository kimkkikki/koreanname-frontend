import { useStaticRendering } from 'mobx-react';

import RankStore from './RankStore';
import MenuStore from './MenuStore';

const isServer = typeof window === 'undefined';
useStaticRendering(isServer);
let stores = null;

export function initializeStore(initialData) {
  if (isServer) {
    return {
      menu: new MenuStore(),
      ranks: new RankStore(),
    };
  }

  if (stores === null) {
    stores = {
      menu: new MenuStore(),
      ranks: new RankStore(),
    };
  }
  return stores;
}

export default initializeStore;
