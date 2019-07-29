import React, { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Typography, Input } from 'antd';
import PropTypes from 'prop-types';
import * as api from '../api/api';
import { NameChart, SocialShare, KNHeader, KNMenu } from '../components';

class ChangeDetail extends Component {
  static async getInitialProps({ query: { name } }) {
    return { name };
  }

  state = {
    show: false,
    totalCount: 0,
    totalRank: 0,
    maleRank: 0,
    femaleRank: 0,
  };

  handleSearch = value => {
    if (value.length > 0) {
      Router.push(`/change/${value}`, `/change/${value}`, { shallow: true });
    }
  };

  componentDidMount = () => {
    const { name } = this.props;
    this.getChangeNameData(name);
    ReactGA.pageview(`/change/${name}`);
  };

  getChangeNameData = name => {
    if (name.length > 0) {
      api.getChangeNameData(name).then(response => {
        if (response.status === 200) {
          this.setState({
            totalRank: response.data.rank.rank,
            totalCount: response.data.rank.count,
            lineChartData: response.data.year,
            genderChartData: response.data.gender,
            areaChartData: response.data.area,
            show: true,
          });

          if (response.data.rank.male) {
            this.setState({
              maleRank: response.data.rank.male.rank,
              // maleCount: response.data.rank.male.count,
              femaleRank: response.data.rank.female.rank,
              // femaleCount: response.data.rank.female.count,
            });
          }
        }
      });
    }
  };

  render() {
    const { show, totalRank, totalCount, lineChartData, genderChartData, areaChartData } = this.state;
    const { maleRank, femaleRank } = this.state;
    const { name } = this.props;

    let dataView = '';
    if (show) {
      dataView = (
        <React.Fragment>
          {maleRank !== 0 || femaleRank !== 0 ? (
            <div style={{ margin: 16, textAlign: 'center' }}>
              <Typography.Title level={4}>{`${name} 으로 개명한 사람은 총 ${totalCount.toLocaleString()}명 있으며,`}</Typography.Title>
              <Typography.Paragraph>{`개명이름으로 남녀합쳐서 ${totalRank.toLocaleString()}번째, 남자 이름으로 ${maleRank.toLocaleString()}번째, 여자 이름으로 ${femaleRank.toLocaleString()}번째로 많이 쓰인 이름입니다.`}</Typography.Paragraph>
              {areaChartData[0] ? <Typography.Paragraph>{`지역 인구수 대비 ${areaChartData[0].name}에서 가장 많이 쓰였습니다.`}</Typography.Paragraph> : <div />}
              <Typography.Paragraph>
                <Link href={{ pathname: '/nameDetail', query: { name } }} as={`/name/${name}`}>
                  <a>이 이름의 출생자 통계가 궁금한가요?</a>
                </Link>
              </Typography.Paragraph>
            </div>
          ) : (
            <Typography.Paragraph style={{ textAlign: 'center' }}>{`${name}은 11년 이후 개명자 중에 ${totalCount.toLocaleString()}명 있으며, 남녀 합쳐서 ${totalRank.toLocaleString()}번째로 많이쓰인 이름입니다.`}</Typography.Paragraph>
          )}
          <NameChart lineChartData={lineChartData} genderChartData={genderChartData} areaChartData={areaChartData} />
        </React.Fragment>
      );
    }

    const shareUrl = encodeURI(`https://koreanname.me/change/${name}`);

    return (
      <KNMenu activeItem="change">
        <KNHeader title={`${name}의 개명 이름통계`} />

        <Input.Search defaultValue={name} style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 제외한 이름만 입력하세요" />

        {dataView}

        <SocialShare url={shareUrl} name={name} />
      </KNMenu>
    );
  }
}

ChangeDetail.propTypes = {
  name: PropTypes.string,
};

export default withRouter(ChangeDetail);
