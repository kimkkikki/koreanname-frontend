import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import PropTypes from 'prop-types';

import AdSense from 'react-adsense';

import { Layout, Menu, Affix, Row, Col } from 'antd';

const { Sider } = Layout;

@inject('menu')
@observer
class KNMenu extends Component {
  onClickMenu = () => {
    const { menu } = this.props;
    const { toggleMenu, isMobile } = menu;
    if (isMobile) {
      toggleMenu();
    }
  };

  render() {
    const { activeItem, children, menu } = this.props;
    const { menuOpen, breakToMobile, isMobile } = menu;

    const layoutStyle = { minHeight: '100vh' };
    if (isMobile) {
      layoutStyle.paddingBottom = 50;
    }
    return (
      <React.Fragment>
        <Layout style={layoutStyle}>
          <Sider trigger={null} collapsed={!menuOpen} onBreakpoint={breakToMobile} breakpoint="md" collapsedWidth="0">
            <Menu theme="dark" onClick={this.onClickMenu} defaultSelectedKeys={[activeItem]}>
              <Menu.Item key="home">
                <a href="/">Home</a>
              </Menu.Item>
              <Menu.Item key="contains">
                <a href="/contains">맞춤 이름 찾기</a>
              </Menu.Item>
              <Menu.Item key="length">
                <a href="/length">이름 길이별 랭킹</a>
              </Menu.Item>
              <Menu.Item key="change">
                <a href="/change">개명 이름 랭킹</a>
              </Menu.Item>
              <Menu.Item key="unique">
                <a href="/unique">유일한이름</a>
              </Menu.Item>
              <Menu.Item key="born">
                <a href="/born">출생아 통계</a>
              </Menu.Item>
              <Menu.Item key="surname">
                <a href="/surname">성씨별 통계</a>
              </Menu.Item>
            </Menu>

            {/* {menu.onAds ? <AdSense.Google client="ca-pub-0128314650546610" slot="7477660188" style={{ display: 'block', height: 200, width: 200 }} /> : ''} */}
          </Sider>
          <Layout style={{ background: '#fff' }}>
            <Layout.Content>
              <Row justify="center" type="flex">
                <Col xl={16} lg={16} md={24} sm={24} xs={24}>
                  {children}
                </Col>
              </Row>
            </Layout.Content>

            {menu.onAds ? (
              <div style={{ textAlign: 'center' }}>
                <AdSense.Google client="ca-pub-0128314650546610" slot="9850143863" style={{ display: 'block' }} format="auto" responsive="true" />
              </div>
            ) : (
              ''
            )}

            <Layout.Footer>
              <p>
                {`개발자 `}
                <a target="_blank" href="https://github.com/kimkkikki">
                  kimkkikki
                </a>
              </p>
              <p>
                {`데이터는 `}
                <a target="_blank" href="http://efamily.scourt.go.kr/">
                  전자가족관계시스템
                </a>
                에서 매일 수집하여 갱신됩니다.
              </p>
            </Layout.Footer>
          </Layout>
        </Layout>

        {/* {menu.onAds && isMobile ? (
          ''
        ) : (
          <Affix style={{ position: 'absolute', top: 140, right: 0, width: 160, height: 600 }}>
            <AdSense.Google client="ca-pub-0128314650546610" slot="5737558320" style={{ display: 'inline-block', height: 600, width: 160 }} />
          </Affix>
        )} */}

        {menu.onAds && isMobile ? <AdSense.Google client="ca-pub-0128314650546610" slot="4231163289" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, height: 50, display: 'inline-block' }} format="fluid" /> : ''}
      </React.Fragment>
    );
  }
}

KNMenu.propTypes = {
  activeItem: PropTypes.string,
  children: PropTypes.node,
  menu: PropTypes.shape({
    toggleMenu: PropTypes.func,
    isMobile: PropTypes.bool,
    onAds: PropTypes.bool,
    menuOpen: PropTypes.func,
    breakToMobile: PropTypes.func,
  }),
};

export default KNMenu;
