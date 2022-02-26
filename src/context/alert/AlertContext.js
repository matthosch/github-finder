import { createContext, useReducer } from 'react';
import alertReducer from './AlertReducer';

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  // Create initial state and destructure current state and dispatch
  const initialState = null;
  const [state, dispatch] = useReducer(alertReducer, initialState);

  // Set an alert
  const setAlert = (msg, msgType) => {
    dispatch({
      type: 'SET_ALERT',
      payload: { msg, msgType },
    });

    setTimeout(() => dispatch({ type: 'REMOVE_ALERT' }), 3000);
  };

  return (
    <AlertContext.Provider
      value={{
        alert: state,
        setAlert,
      }}
    >
      {children}
    </AlertContext.Provider>
  );
};

export default AlertContext;
