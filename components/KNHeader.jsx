import React from 'react';
import Head from 'next/head';
import { observer, inject } from 'mobx-react';

import PropTypes from 'prop-types';

import AdSense from 'react-adsense';

import { Layout, Icon, Typography } from 'antd';

const { Header } = Layout;

@inject('menu')
@observer
class KNHeader extends React.Component {
  render() {
    const { menu } = this.props;
    const { menuOpen, toggleMenu } = menu;
    const { title } = this.props;
    return (
      <React.Fragment>
        <Head>
          <title>{title}</title>
        </Head>
        <Header style={{ background: '#fff' }}>
          <Icon style={{ fontSize: 18, cursor: 'pointer', paddingRight: 24 }} onClick={toggleMenu} type={menuOpen ? 'menu-fold' : 'menu-unfold'} />
          <Typography.Text style={{ fontSize: 18 }}>{title}</Typography.Text>
        </Header>
        {menu.onAds ? (
          <div style={{ textAlign: 'center' }}>
            <AdSense.Google client="ca-pub-0128314650546610" slot="1108986553" style={{ display: 'block' }} format="auto" responsive="true" />
          </div>
        ) : (
          ''
        )}
      </React.Fragment>
    );
  }
}

KNHeader.propTypes = {
  title: PropTypes.string,
  menu: PropTypes.shape({
    toggleMenu: PropTypes.func,
    isMobile: PropTypes.bool,
    onAds: PropTypes.bool,
    menuOpen: PropTypes.func,
    breakToMobile: PropTypes.func,
  }),
};

KNHeader.defaultProps = {
  title: '한국인의 이름통계',
};

export default KNHeader;
