import React, { Component } from 'react';
import Link from 'next/link';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Table, Select, Button, Alert, Input } from 'antd';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu } from '../components';

class SurnameRank extends Component {
  state = {
    surnameList: [],
    page: 1,
    loading: false,
    hasNext: false,
  };

  handleSearch = value => {
    if (value.length > 0) {
      Router.push(`/surname/${value}`, `/surname/${value}`, { shallow: true });
    }
  };

  getSurnameData = (page, more) => {
    this.setState({
      loading: true,
      hasNext: false,
    });

    api.getSurnameRankData(page).then(response => {
      const { surnameList } = this.state;
      if (response.data) {
        if (more) {
          this.setState({
            surnameList: surnameList.concat(response.data.surnames),
            hasNext: response.data.hasNext,
            loading: false,
          });
        } else {
          this.setState({
            surnameList: response.data.surnames,
            hasNext: response.data.hasNext,
            loading: false,
          });
        }
      }
    });
  };

  componentDidMount = () => {
    const { page } = this.state;
    this.getSurnameData(page, false);
    ReactGA.pageview('/surname');
  };

  getMore = () => {
    const { page } = this.state;
    const requestPage = page + 1;
    this.setState({ page: requestPage });
    this.getSurnameData(requestPage, true);
  };

  createLengthOptions = () => {
    const options = [];
    for (let i = 1; i < 15; i += 1) {
      options.push(
        <Select.Option key="nameLength" value={i}>
          {i}
        </Select.Option>,
      );
    }
    return options;
  };

  render() {
    const { hasNext, loading, surnameList } = this.state;

    const columns = [
      {
        title: '이름',
        dataIndex: 'surname',
        key: 'surname',
        render: text => (
          <Link href={{ pathname: '/surnameDetail', query: { surname: text } }} as={`/surname/${text}`}>
            <a>{text}</a>
          </Link>
        ),
      },
      { title: '랭킹', dataIndex: 'rank', key: 'rank' },
      { title: '명수', dataIndex: 'count', key: 'count', render: text => `${text.toLocaleString()} 명` },
      { title: '비율', dataIndex: 'percent', key: 'percent', render: text => `${text.toLocaleString()}%` },
    ];

    const description = (
      <div>
        {`데이터 출처 : `}
        <a target="_blank" href="http://kosis.kr">
          국가통계포털
        </a>
      </div>
    );

    return (
      <KNMenu activeItem="surname">
        <KNHeader title="한국인의 성씨별 랭킹" />

        <div style={{ textAlign: 'center' }}>
          <Alert style={{ textAlign: 'center' }} message="성씨 데이터는 2015년 통계자료 입니다." description={description} type="success" />

          <Input.Search style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 검색해 보세요" />

          <Table style={{ margin: 16 }} size="small" rowKey={record => record.name} columns={columns} dataSource={surnameList} pagination={false} bordered />

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me/surname" />
        </div>
      </KNMenu>
    );
  }
}

export default withRouter(SurnameRank);
