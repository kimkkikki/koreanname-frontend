import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FacebookShareButton, TwitterShareButton, TelegramShareButton, FacebookIcon, TwitterIcon, TelegramIcon } from 'react-share';

import { Typography, Avatar, Row, Col } from 'antd';

const { Title } = Typography;

class SocialShare extends Component {
  handleKakaoLink = () => {
    const { name, url } = this.props;
    let description = '#이름통계';
    if (name !== undefined) {
      description = `#${name} #이름통계`;
    }

    // eslint-disable-next-line no-undef
    Kakao.init('9c3b1966fc203ce80395450693f52a06');
    // eslint-disable-next-line no-undef
    Kakao.Link.sendDefault({
      objectType: 'feed',
      content: {
        title: '이름통계 조회',
        description,
        imageUrl: 'http://koreanname.me/home.png',
        link: {
          mobileWebUrl: url,
          webUrl: url,
        },
      },
    });
  };

  render() {
    const { url } = this.props;
    return (
      <React.Fragment>
        <Title style={{ textAlign: 'center' }} level={4}>
          공유하기
        </Title>
        <Row style={{ margin: 16 }} type="flex" justify="center" gutter={16}>
          <Col span={4}>
            <FacebookShareButton url={url}>
              <FacebookIcon size={32} round />
            </FacebookShareButton>
          </Col>
          <Col span={4}>
            <TwitterShareButton url={url}>
              <TwitterIcon size={32} round />
            </TwitterShareButton>
          </Col>
          <Col span={4}>
            <TelegramShareButton url={url}>
              <TelegramIcon size={32} round />
            </TelegramShareButton>
          </Col>
          <Col span={4}>
            <a href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(url)}`} target="_blank">
              <Avatar src="/static/line-round.png" />
            </a>
          </Col>
          <Col span={4}>
            <Avatar src="//developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" onClick={this.handleKakaoLink} />
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

SocialShare.propTypes = {
  url: PropTypes.string,
  name: PropTypes.string,
};

export default SocialShare;
