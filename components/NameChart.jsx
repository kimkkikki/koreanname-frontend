import React, { Component } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, PieChart, Cell } from 'recharts';
import PropTypes from 'prop-types';

import { Card } from 'antd';

const regionColors = {
  서울: '#941e34',
  경기: '#0C489D',
  인천: '#008FFF',
  울산: '#F0F0E0',
  경남: '#F15A38',
  경북: '#004EA2',
  대구: '#59FF00',
  충남: '#8C8C70',
  충북: '#00A664',
  광주: '#EF4222',
  세종: '#00A0C6',
  부산: '#232DAC',
  강원: '#FABD00',
  전남: '#FFCD00',
  전북: '#76B624',
  제주: '#555',
  대전: '#269A2F',
};

class NameChart extends Component {
  render() {
    const { areaChartData, lineChartData, genderChartData } = this.props;

    return (
      <div style={{ margin: 16 }}>
        <Card title="연도별 추이">
          <ResponsiveContainer width="100%" aspect={2}>
            <LineChart data={lineChartData}>
              <XAxis dataKey="year" />
              <YAxis yAxisId="left" />
              <CartesianGrid strokeDasharray="3 3" />
              <Legend />
              <Tooltip
                formatter={value => {
                  if (value !== undefined) {
                    return `${value.toLocaleString()}명`;
                  }
                  return value;
                }}
              />
              <Line name="합계" dot={false} yAxisId="left" type="monotone" dataKey="count" stroke="#008000" />
              <Line connectNulls name="남자" dot={false} yAxisId="left" type="monotone" dataKey="male" stroke="#1E90FF" />
              <Line connectNulls name="여자" dot={false} yAxisId="left" type="monotone" dataKey="female" stroke="#FF1493" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ marginTop: 16 }} title="성별">
          <ResponsiveContainer width="100%" aspect={2}>
            <PieChart>
              <Pie
                data={genderChartData}
                dataKey="value"
                label={({ value }) => {
                  return `${value.toLocaleString()}명`;
                }}
              >
                <Cell key="남자" fill="#1E90FF" />
                <Cell key="여자" fill="#FF1493" />
              </Pie>
              <Tooltip
                formatter={value => {
                  if (value !== undefined) {
                    return `${value.toLocaleString()}명`;
                  }
                  return value;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
        <Card style={{ marginTop: 16 }} title="지역">
          <ResponsiveContainer width="100%" aspect={1}>
            <PieChart>
              <Pie
                data={areaChartData}
                dataKey="value"
                label={({ value }) => {
                  return `${value.toLocaleString()}명`;
                }}
              >
                {areaChartData.map(data => (
                  <Cell key={data.name} fill={regionColors[data.name]} />
                ))}
              </Pie>
              <Tooltip
                formatter={value => {
                  if (value !== undefined) {
                    return value.toLocaleString();
                  }
                  return value;
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    );
  }
}

NameChart.propTypes = {
  lineChartData: PropTypes.arrayOf(PropTypes.object),
  genderChartData: PropTypes.arrayOf(PropTypes.object),
  areaChartData: PropTypes.arrayOf(PropTypes.object),
};

export default NameChart;
