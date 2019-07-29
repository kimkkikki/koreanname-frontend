import React, { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Table, Typography, Input, Select, Row, Col, Button } from 'antd';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu, TopAlert } from '../components';

class ChangeRank extends Component {
  state = {
    totalCount: 0,
    maleList: [],
    femaleList: [],
    endYear: new Date().getFullYear(),
    startYear: 2011,
    page: 1,
    loading: false,
  };

  handleSearch = value => {
    if (value.length > 0) {
      Router.push(`/change/${value}`, `/change/${value}`, { shallow: true });
    }
  };

  componentDidMount = () => {
    const { startYear, endYear, page } = this.state;
    this.setState({
      loading: true,
    });
    api.getChangeRankData(startYear, endYear, page).then(response => {
      if (response.data) {
        this.setState({
          maleList: response.data.male,
          femaleList: response.data.female,
          hasNext: response.data.hasNext,
          loading: false,
          totalCount: response.data.totalCount,
        });
      }
    });

    ReactGA.pageview('/change');
  };

  componentDidUpdate = (prevProps, prevState) => {
    const { startYear, endYear } = this.state;
    if (prevState.startYear !== startYear || prevState.endYear !== endYear) {
      api.getChangeRankData(startYear, endYear, 1).then(response => {
        if (response.data) {
          this.setState({
            maleList: response.data.male,
            femaleList: response.data.female,
            totalCount: response.data.totalCount,
            page: 1,
          });
        }
      });
    }
  };

  handleYearChange = (value, options) => {
    if (Object.prototype.hasOwnProperty.call(this.state, options.key)) {
      this.setState({ [options.key]: value });
    }
  };

  getMore = () => {
    const { page } = this.state;
    const requestPage = page + 1;
    this.setState({
      page: requestPage,
      loading: true,
    });

    const { startYear, endYear, maleList, femaleList } = this.state;
    api.getChangeRankData(startYear, endYear, requestPage).then(response => {
      if (response.data) {
        this.setState({
          maleList: maleList.concat(response.data.male),
          femaleList: femaleList.concat(response.data.female),
          hasNext: response.data.hasNext,
          loading: false,
          totalCount: response.data.totalCount,
        });
      }
    });
  };

  createYearOptions = key => {
    const currentYear = new Date().getFullYear();
    const startYear = 2011;
    const loopCount = currentYear - startYear + 1;
    const yearOptions = [];
    for (let i = 0; i < loopCount; i += 1) {
      yearOptions.push(
        <Select.Option key={key} value={currentYear - i}>
          {`${currentYear - i}년`}
        </Select.Option>,
      );
    }

    return yearOptions;
  };

  render() {
    const { maleList, femaleList, totalCount, loading, startYear, endYear, hasNext } = this.state;

    const maleListArray = maleList.map(data => ({ name: data.name, rank: data.rank, change: data.change }));
    const femaleListArray = femaleList.map(data => ({ name: data.name, rank: data.rank, change: data.change }));

    const columns = [
      {
        title: '이름',
        dataIndex: 'name',
        key: 'name',
        render: text => (
          <Link href={{ pathname: '/changeDetail', query: { name: text } }} as={`/change/${text}`}>
            <a>{text}</a>
          </Link>
        ),
      },
      { title: '랭킹', dataIndex: 'rank', key: 'rank' },
      { title: '이름수', dataIndex: 'change', key: 'change', render: text => text.toLocaleString() },
    ];

    return (
      <KNMenu activeItem="change">
        <KNHeader title="개명 이름 통계" />

        <div style={{ textAlign: 'center' }}>
          <TopAlert message="개명 데이터는 2011년 이후만 존재합니다" />

          <Input.Search style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 제외한 이름만 입력하세요" />

          <Typography.Title level={3}>개명 이름 랭킹</Typography.Title>
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

          <Row style={{ margin: 10 }} gutter={8}>
            <Col span={12}>
              <Table size="small" rowKey={record => record.name} columns={columns} dataSource={maleListArray} pagination={false} bordered />
            </Col>
            <Col span={12}>
              <Table size="small" rowKey={record => record.name} columns={columns} dataSource={femaleListArray} pagination={false} bordered />
            </Col>
          </Row>

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me/change" />
        </div>
      </KNMenu>
    );
  }
}

export default withRouter(ChangeRank);
