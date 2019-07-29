import React, { Component } from 'react';
import ReactGA from 'react-ga';
import * as api from '../api/api';
import { NameChart, SocialShare, KNHeader, KNMenu, TopAlert } from '../components';

export default class Born extends Component {
  state = {
    lineChartData: [],
    genderChartData: [],
    areaChartData: [],
  };

  componentDidMount = () => {
    this.getBornData();
    ReactGA.pageview('/born');
  };

  componentDidUpdate = prevProps => {
    if (prevProps !== this.props) {
      this.getBornData();
    }
  };

  getBornData = () => {
    api.getBornData().then(response => {
      if (response.status === 200) {
        this.setState({
          lineChartData: response.data.year,
          genderChartData: response.data.gender,
          areaChartData: response.data.area,
        });
      }
    });
  };

  render() {
    const { lineChartData, genderChartData, areaChartData } = this.state;

    return (
      <KNMenu activeItem="born">
        <KNHeader title="연도별 출생아 통계" />
        <TopAlert />

        <NameChart lineChartData={lineChartData} genderChartData={genderChartData} areaChartData={areaChartData} />

        <SocialShare url="https://koreanname.me/born" />
      </KNMenu>
    );
  }
}
