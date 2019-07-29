import { observable, action } from 'mobx';
import * as api from '../api/api';

export default class RankStore {
  @observable alreayRanks = {};

  @observable data = {
    maleList: [],
    femaleList: [],
    loading: false,
    hasNext: false,
    totalCount: 0,
  };

  @action getRankDataFromServer = (startYear, endYear, page) => {
    const key = startYear + endYear + page;
    if (this.alreayRanks[key] !== undefined) {
      this.data = this.alreayRanks[key];
    } else {
      this.data.loading = true;
      api
        .getRankData(startYear, endYear, page)
        .then(response => {
          if (response.data) {
            let serverData;
            if (page === 1) {
              serverData = {
                maleList: response.data.male,
                femaleList: response.data.female,
              };
            } else {
              // More
              serverData = {
                maleList: this.data.maleList.concat(response.data.male),
                femaleList: this.data.femaleList.concat(response.data.female),
              };
            }

            serverData.hasNext = response.data.maleHasNext || response.data.femaleHasNext;
            serverData.loading = false;
            serverData.totalCount = response.data.totalCount;

            this.alreayRanks[key] = serverData;
            this.data = serverData;
          }
        })
        .catch(reason => {
          console.log(reason);
          this.data.loading = false;
        });
    }
  };
}
