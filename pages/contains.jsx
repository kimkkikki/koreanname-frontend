import React, { Component } from 'react';
import Link from 'next/link';
import ReactGA from 'react-ga';
import { Table, Input, Select, Button } from 'antd';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu, TopAlert } from '../components';

export default class ContainsSearch extends Component {
  state = {
    name: '',
    page: 1,
    gender: '1',
    loading: false,
    containsData: [],
    hasNext: false,
  };

  handleSelectChange = (value, options) => {
    if (Object.prototype.hasOwnProperty.call(this.state, options.key)) {
      this.setState({ [options.key]: value });
    }
  };

  handleSearch = value => {
    if (value.length > 0) {
      const { gender, page } = this.state;
      this.getData(gender, value, page, false);
      this.setState({ name: value });
    }
  };

  getMore = () => {
    const { gender, name, page } = this.state;
    const requestPage = page + 1;
    this.setState({
      page: requestPage,
    });
    this.getData(gender, name, requestPage, true);
  };

  getData = (gender, name, page, more) => {
    const { containsData } = this.state;
    this.setState({
      loading: true,
    });

    api.getContainsData(gender, name, page).then(response => {
      if (response.data) {
        if (more) {
          this.setState({
            containsData: containsData.concat(response.data.contains),
            hasNext: response.data.hasNext,
            loading: false,
          });
        } else {
          this.setState({
            containsData: response.data.contains,
            hasNext: response.data.hasNext,
            loading: false,
          });
        }
      }
    });

    ReactGA.event({ category: 'contains', action: 'get', label: `${gender}_${name}_${page}` });
  };

  componentDidMount = () => ReactGA.pageview('/contains');

  render() {
    const { gender, loading, hasNext, containsData } = this.state;

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
      <KNMenu activeItem="contains">
        <KNHeader title="한글자(돌림자) 포함 이름" />

        <div style={{ textAlign: 'center' }}>
          <TopAlert />

          <Select style={{ margin: 16 }} value={gender} onChange={this.handleSelectChange}>
            <Select.Option key="gender" value="1">
              남자
            </Select.Option>
            <Select.Option key="gender" value="2">
              여자
            </Select.Option>
          </Select>
          <Input.Search style={{ margin: 16, textAlign: 'center', width: '60%' }} onSearch={this.handleSearch} enterButton placeholder="포함되었으면 하는 이름 자를 입력해 주세요" />

          <Table style={{ margin: 16 }} size="small" rowKey={record => record.name} columns={columns} dataSource={containsData} pagination={false} bordered />

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me/contains" />
        </div>
      </KNMenu>
    );
  }
}
