import React, { Component } from 'react';
import Link from 'next/link';
import ReactGA from 'react-ga';
import { Table, Typography, Select, Button } from 'antd';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu, TopAlert } from '../components';

export default class LengthRank extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameLength: 2,
      lengthList: [],
      page: 1,
      loading: false,
      hasNext: false,
    };
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.getMore = this.getMore.bind(this);
  }

  getLengthData = (nameLength, page, more) => {
    this.setState({
      loading: true,
      hasNext: false,
    });

    api.getLengthRankData(nameLength, page).then(response => {
      const { lengthList } = this.state;
      if (response.data) {
        if (more) {
          this.setState({
            lengthList: lengthList.concat(response.data.lengthList),
            hasNext: response.data.hasNext,
            loading: false,
          });
        } else {
          this.setState({
            lengthList: response.data.lengthList,
            hasNext: response.data.hasNext,
            loading: false,
          });
        }
      }
    });
  };

  componentDidMount = () => {
    const { nameLength, page } = this.state;
    this.getLengthData(nameLength, page, false);
    ReactGA.pageview('/length');
  };

  handleSelectChange = (value, options) => {
    if (Object.prototype.hasOwnProperty.call(this.state, options.key)) {
      this.setState({ [options.key]: value });
      this.getLengthData(value, 1, false);
    }
  };

  getMore = () => {
    const { nameLength, page } = this.state;
    const requestPage = page + 1;
    this.setState({ page: requestPage });
    this.getLengthData(nameLength, requestPage, true);
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
    const { hasNext, loading, nameLength, lengthList } = this.state;

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
      <KNMenu activeItem="length">
        <KNHeader title="이름 길이별 랭킹" />

        <div style={{ textAlign: 'center' }}>
          <TopAlert />
          <Typography.Text>이름 길이를 선택해 주세요</Typography.Text>
          <Select style={{ margin: 16, width: '30%' }} value={nameLength} onChange={this.handleSelectChange}>
            {this.createLengthOptions()}
          </Select>

          <Table style={{ margin: 16 }} size="small" rowKey={record => record.name} columns={columns} dataSource={lengthList} pagination={false} bordered />

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me/length" />
        </div>
      </KNMenu>
    );
  }
}
