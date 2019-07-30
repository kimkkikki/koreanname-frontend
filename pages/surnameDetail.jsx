import React, { Component } from 'react';
import Router, { withRouter } from 'next/router';
import ReactGA from 'react-ga';
import { Typography, Input, Table } from 'antd';
import PropTypes from 'prop-types';
import * as api from '../api/api';
import { SocialShare, KNHeader, KNMenu } from '../components';

const { Title } = Typography;

const columns = [
  {
    title: '지역',
    dataIndex: 'area',
    key: 'area',
  },
  { title: '명수', dataIndex: 'count', key: 'count', render: text => `${text.toLocaleString()}명` },
  { title: '비중', dataIndex: 'percent', key: 'percent', render: text => `${text.toLocaleString()}%` },
];

class SurnameDetail extends Component {
  static async getInitialProps({ query: { surname } }) {
    return { surname };
  }

  state = {
    area: [],
    totalCount: 0,
  };

  handleSearch = value => {
    if (value.length > 0) {
      Router.push(`/surname/${value}`, `/surname/${value}`, { shallow: true });
    }
  };

  componentDidMount = () => {
    const { surname } = this.props;
    this.getSurnameData(surname);
    ReactGA.pageview(`/surname/${surname}`);
  };

  getSurnameData = surname => {
    if (surname.length > 0) {
      api.getSurnameData(surname).then(response => {
        if (response.status === 200) {
          this.setState({
            area: response.data.area,
            totalCount: response.data.total,
          });
        }
      });
    }
  };

  render() {
    const { totalCount, area } = this.state;
    const { surname } = this.props;

    const dataView = (
      <React.Fragment>
        <div style={{ margin: 16, textAlign: 'center' }}>
          {totalCount === 0 ? (
            <React.Fragment>
              <Title level={4}>{`${surname}씨 성은 한명도 없습니다.`}</Title>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Title level={4}>{`${surname}씨 성은 ${totalCount.toLocaleString()}명 있습니다`}</Title>
            </React.Fragment>
          )}
        </div>
      </React.Fragment>
    );

    const shareUrl = encodeURI(`https://koreanname.me/surname/${surname}`);

    return (
      <KNMenu activeItem="surname">
        <KNHeader title={`${surname}씨의 지역별 성씨 통계`} />

        <Input.Search defaultValue={surname} style={{ margin: 16, textAlign: 'center', width: '95%' }} onSearch={this.handleSearch} size="large" enterButton placeholder="성을 검색해 보세요" />

        {dataView}
        <Table style={{ margin: 16 }} size="small" rowKey={record => record.name} columns={columns} dataSource={area} pagination={false} bordered />

        <SocialShare url={shareUrl} name={surname} />
      </KNMenu>
    );
  }
}

SurnameDetail.propTypes = {
  surname: PropTypes.string,
};

export default withRouter(SurnameDetail);
