import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import ReactGA from 'react-ga';
import { observer, inject } from 'mobx-react';
import Router, { withRouter } from 'next/router';

import { Table, Typography, Input, Select, Row, Col, Button } from 'antd';
import { KNHeader, KNMenu, SocialShare, TopAlert } from '../components';

@inject('ranks')
@observer
class Home extends Component {
  state = {
    endYear: new Date().getFullYear(),
    startYear: 2008,
    page: 1,
  };

  handleSearch = value => {
    if (value.length > 0) {
      Router.push(`/name/${value}`, `/name/${value}`, { shallow: true });
    }
  };

  componentDidMount = () => {
    const { ranks } = this.props;
    const { startYear, endYear, page } = this.state;
    ranks.getRankDataFromServer(startYear, endYear, page);
    ReactGA.pageview('/');
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { startYear, endYear } = this.state;
    const { ranks } = this.props;
    if (prevState.startYear !== startYear || prevState.endYear !== endYear) {
      ranks.getRankDataFromServer(startYear, endYear, 1);
      ReactGA.event({ category: 'rank', action: 'year_change', label: `${startYear}_${endYear}` });
    }
  };

  handleYearChange = (value, options) => {
    if (Object.prototype.hasOwnProperty.call(this.state, options.key)) {
      this.setState({ [options.key]: value });
    }
  };

  getMore = () => {
    const { ranks } = this.props;
    const { startYear, endYear, page } = this.state;
    const requestPage = page + 1;
    this.setState({ page: requestPage });

    ranks.getRankDataFromServer(startYear, endYear, requestPage);
    ReactGA.event({ category: 'rank', action: 'more', label: `${startYear}_${endYear}_${requestPage}` });
  };

  createYearOptions = key => {
    const currentYear = new Date().getFullYear();
    const startYear = 2008;
    const loopCount = currentYear - startYear + 1;
    const yearOptions = [];
    for (let i = 0; i < loopCount; i += 1) {
      yearOptions.push(
        <Select.Option key={key} value={currentYear - i}>
          {`${currentYear - i} 년`}
        </Select.Option>,
      );
    }

    return yearOptions;
  };

  render() {
    const { startYear, endYear } = this.state;
    const { ranks } = this.props;
    const { maleList, femaleList, totalCount, loading, hasNext } = ranks.data;

    const maleListArray = maleList.map(data => ({ name: data.name, rank: data.rank, count: data.count }));

    const femaleListArray = femaleList.map(data => ({ name: data.name, rank: data.rank, count: data.count }));

    const columns = [
      {
        title: '이름',
        dataIndex: 'name',
        key: 'name',
        render: text => (
          <Link href={{ pathname: '/nameDetail', query: { name: text } }} as={`/name/${text}`}>
            <a>{text}</a>
          </Link>
        ),
      },
      { title: '랭킹', dataIndex: 'rank', key: 'rank' },
      { title: '이름수', dataIndex: 'count', key: 'count', render: text => text.toLocaleString() },
    ];

    return (
      <KNMenu activeItem="home">
        <KNHeader title="한국인의 이름 통계" />

        <div style={{ textAlign: 'center' }}>
          <TopAlert />

          <Input.Search style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 제외한 이름만 입력하세요" />

          <Typography.Title level={3}>출생 이름 랭킹</Typography.Title>
          <Typography.Paragraph>{`전체 ${totalCount.toLocaleString()}개의 이름이 등록되어 있습니다.`}</Typography.Paragraph>

          <Row gutter={16}>
            <Col span={12}>
              <Typography.Text>조회시작</Typography.Text>
            </Col>
            <Col span={12}>
              <Typography.Text>조회종료</Typography.Text>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Select style={{ width: '90%' }} value={startYear} onChange={this.handleYearChange}>
                {this.createYearOptions('startYear')}
              </Select>
            </Col>
            <Col span={12}>
              <Select style={{ width: '90%' }} value={endYear} onChange={this.handleYearChange}>
                {this.createYearOptions('endYear')}
              </Select>
            </Col>
          </Row>

          <Typography.Title style={{ marginTop: 30 }} level={4}>
            {`${startYear}년 ~ ${endYear}년`}
          </Typography.Title>

          <Row gutter={4}>
            <Col span={12}>
              <Table size="small" rowKey={record => record.name} columns={columns} dataSource={maleListArray} pagination={false} />
            </Col>
            <Col span={12}>
              <Table size="small" rowKey={record => record.name} columns={columns} dataSource={femaleListArray} pagination={false} />
            </Col>
          </Row>

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me" />
        </div>
      </KNMenu>
    );
  }
}

Home.propTypes = {
  ranks: PropTypes.shape({
    getRankDataFromServer: PropTypes.func,
    data: PropTypes.shape({
      maleList: PropTypes.array,
      femaleList: PropTypes.array,
      totalCount: PropTypes.number,
      loading: PropTypes.bool,
      hasNext: PropTypes.bool,
    }),
  }),
};

export default withRouter(Home);
