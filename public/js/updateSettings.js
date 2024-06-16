/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

// type is either 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:5000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:5000/api/v1/users/updateMe';
    const res = await axios({
      method: 'PATCH',
      url,
      data,
    });
    // console.log(res);
    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully`);
      // window.setTimeout(() => {
      //   window.location.assign('/me');
      // }, 1500);
    }
  } catch (err) {
    showAlert('error', err);
    console.log(err);
  }
};
