import axios from 'axios';

export function getNameData(name) {
  return axios.get(`${process.env.API_HOST}/api/name/${name}`);
}

export function getChangeNameData(name) {
  return axios.get(`${process.env.API_HOST}/api/change/${name}`);
}

export function getBornData() {
  return axios.get(`${process.env.API_HOST}/api/born`);
}

export function getRankData(start, end, page) {
  return axios.get(`${process.env.API_HOST}/api/rank/${start}/${end}/${page}`);
}

export function getChangeRankData(start, end, page) {
  return axios.get(`${process.env.API_HOST}/api/change/${start}/${end}/${page}`);
}

export function getUniqueData(page) {
  return axios.get(`${process.env.API_HOST}/api/unique/${page}`);
}

export function postKeywords(name) {
  return axios.post(`${process.env.API_HOST}/api/keywords`, { name });
}

export function getKeywords() {
  return axios.get(`${process.env.API_HOST}/api/keywords`);
}

export function getContainsData(gender, name, page) {
  return axios.get(`${process.env.API_HOST}/api/contains/${gender}/${name}/${page}`);
}

export function getLengthRankData(length, page) {
  return axios.get(`${process.env.API_HOST}/api/length/${length}/${page}`);
}
