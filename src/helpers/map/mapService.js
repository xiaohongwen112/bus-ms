import axios from 'axios';

export const getMapJson = (id) => {
  const url = process.env.NODE_ENV === 'development' ? `/static/mapJson/${id}.json` : `/static/mapJson/${id}.json`;
  return axios(url);
};

export default undefined;
