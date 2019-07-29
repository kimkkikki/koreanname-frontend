import React, { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Typography, Input } from 'antd';
import PropTypes from 'prop-types';
import * as api from '../api/api';
import { NameChart, SocialShare, KNHeader, KNMenu } from '../components';

const { Title, Paragraph } = Typography;

class NameDetail extends Component {
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
      Router.push(`/name/${value}`, `/name/${value}`, { shallow: true });
    }
  };

  componentDidMount = () => {
    const { name } = this.props;
    this.getNameData(name);
    ReactGA.pageview(`/name/${name}`);
  };

  getNameData = name => {
    if (name.length > 0) {
      api.getNameData(name).then(response => {
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
          <div style={{ margin: 16, textAlign: 'center' }}>
            {totalCount === 0 ? (
              <React.Fragment>
                <Title level={4}>혹시 성을 넣고 검색하셨나요?</Title>
                <Paragraph>{`${name}은 한명도 없습니다.`}</Paragraph>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Title level={4}>{`${name} 은(는) ${totalCount.toLocaleString()}명 있으며,`}</Title>
                <Paragraph>{`남녀 합하여 ${totalRank.toLocaleString()}번째, 남자는 ${maleRank.toLocaleString()}번째, 여자는 ${femaleRank.toLocaleString()}번째로 많이 쓰인 이름입니다.`}</Paragraph>
                <Paragraph>{`지역 인구수 대비 ${areaChartData[0].name}에서 가장 많이 쓰였습니다.`}</Paragraph>
                <Paragraph>
                  <Link href={{ pathname: '/changeDetail', query: { name } }} as={`/change/${name}`}>
                    <a>이 이름의 개명 통계가 궁금한가요?</a>
                  </Link>
                </Paragraph>
                <NameChart lineChartData={lineChartData} genderChartData={genderChartData} areaChartData={areaChartData} />
              </React.Fragment>
            )}
          </div>
        </React.Fragment>
      );
    }

    const shareUrl = encodeURI(`https://koreanname.me/name/${name}`);

    return (
      <KNMenu activeItem="home">
        <KNHeader title={`${name}의 이름통계`} />

        <Input.Search defaultValue={name} style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 제외한 이름만 입력하세요" />

        {dataView}

        <SocialShare url={shareUrl} name={name} />
      </KNMenu>
    );
  }
}

NameDetail.propTypes = {
  name: PropTypes.string,
};

export default withRouter(NameDetail);
