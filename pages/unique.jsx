import React, { Component } from 'react';
import Link from 'next/link';
import ReactGA from 'react-ga';
import { Button, Tag } from 'antd';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu, TopAlert } from '../components';

export default class Unique extends Component {
  state = {
    page: 1,
    uniqueList: [],
    hasNext: true,
    loading: false,
  };

  getMore = () => {
    const { page, uniqueList } = this.state;
    const requestPage = page + 1;
    this.setState({
      page: requestPage,
      loading: true,
    });

    api.getUniqueData(requestPage).then(response => {
      if (response.data) {
        this.setState({
          uniqueList: uniqueList.concat(response.data.uniques),
          hasNext: response.data.hasNext,
          loading: false,
        });
      }
      ReactGA.event({ category: 'unique', action: 'more', label: `${requestPage}` });
    });
  };

  componentDidMount = () => {
    const { page } = this.state;
    this.setState({
      loading: true,
    });
    api.getUniqueData(page).then(response => {
      if (response.data) {
        this.setState({
          uniqueList: response.data.uniques,
          hasNext: response.data.hasNext,
          loading: false,
        });
      }
    });
    ReactGA.pageview('/unique');
  };

  render() {
    const { uniqueList, loading, hasNext } = this.state;
    return (
      <KNMenu activeItem="unique">
        <KNHeader title="유일한 이름들" />
        <TopAlert />

        <div style={{ margin: 16 }}>
          {uniqueList.map((unique, i) => (
            <Tag style={{ padding: 5, margin: 5 }} color="cyan" key={i}>
              <Link href={{ pathname: '/nameDetail', query: { name: unique } }} as={`/name/${unique}`}>
                <a>{unique}</a>
              </Link>
            </Tag>
          ))}

          <Button style={{ margin: 16, width: '95%' }} type="primary" disabled={!hasNext} loading={loading} onClick={this.getMore}>
            더보기
          </Button>

          <SocialShare url="https://koreanname.me/unique" />
        </div>
      </KNMenu>
    );
  }
}
