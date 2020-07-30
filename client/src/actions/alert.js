import { v4 as uuidv4 } from 'uuid';
import { SET_ALERT, REMOVE_ALERT, LOGOUT } from './types';
export const setAlert = (msg, alertType) => (dispatch) => {
  const id = uuidv4();
  dispatch({
    type: SET_ALERT,
    payload: {
      msg,
      alertType,
      id,
    },
  });
  setTimeout(() => {
    dispatch({ type: REMOVE_ALERT, payload: id });
  }, 5000);
};

// LOG OUT AND CLEAR PROFILE
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT });
};
