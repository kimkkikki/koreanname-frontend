import App, { Container } from 'next/app';
import Head from 'next/head';

import React from 'react';
import { Provider } from 'mobx-react';
import ReactGA from 'react-ga';
import { initializeStore } from '../stores';

class KNApp extends App {
  static async getInitialProps(appContext) {
    const mobxStore = initializeStore();
    appContext.ctx.mobxStore = mobxStore;

    const appProps = await App.getInitialProps(appContext);

    return {
      ...appProps,
      initialMobxState: mobxStore,
    };
  }

  constructor(props) {
    super(props);
    const isServer = !process.browser;
    this.mobxStore = isServer ? props.initialMobxState : initializeStore(props.initialMobxState);
    ReactGA.initialize('UA-122078781-2');
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Head>
          <title>한국인의 이름통계</title>
        </Head>
        <Provider {...this.mobxStore}>
          <Component {...pageProps} />
        </Provider>
      </Container>
    );
  }
}

export default KNApp;
