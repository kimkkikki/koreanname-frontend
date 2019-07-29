import React from 'react';
import { Alert } from 'antd';
import PropTypes from 'prop-types';

const TopAlert = props => {
  const description = (
    <div>
      {`데이터 출처 : `}
      <a target="_blank" href="http://efamily.scourt.go.kr/">
        전자가족관계시스템
      </a>
    </div>
  );
  const { message } = props;
  return <Alert style={{ textAlign: 'center' }} message={message} description={description} type="success" />;
};

TopAlert.propTypes = {
  message: PropTypes.string,
};

TopAlert.defaultProps = {
  message: '2008년 이후 출생자의 데이터만 존재합니다.',
};

export default TopAlert;
