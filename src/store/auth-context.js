import React, { useState, useEffect, useCallback } from "react";

let logoutTimer;

const AuthContext = React.createContext({
  token: "",
  isLoggedIn: false,
  login: (token) => {},
  logout: () => {},
});

const calculateRemainingTime = (expirationTime) => {
  const currentTime = new Date().getTime();
  const adjustedExpirationTime = new Date(expirationTime).getTime();

  const remainingDuration = adjustedExpirationTime - currentTime;

  return remainingDuration;
};

const retrieveStoredToken = () => {
  const storedToken = localStorage.getItem("id");
  const storedExpirationTime = localStorage.getItem("expirationTime");

  const remainingTime = calculateRemainingTime(storedExpirationTime);
  if (remainingTime <= 60000) {
    localStorage.removeItem("id");
    return null;
  }
  return { token: storedToken, duration: remainingTime };
};

export function AuthContextProvider(props) {
  const tokenData = retrieveStoredToken();
  let initialToken;
  if (tokenData) {
    initialToken = tokenData.token;
  }
  const [authToken, setAuthToken] = useState(initialToken);
  const userIsLoggedIn = !!authToken;

  const logoutHandler = useCallback(() => {
    setAuthToken(null);
    localStorage.removeItem("id");
    localStorage.removeItem("expirationTime");

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }
  }, []);

  const loginHandler = (token, expirationTime) => {
    setAuthToken(token);

    localStorage.setItem("id", token);
    localStorage.setItem("expirationTime", expirationTime);
    const remainingTime = calculateRemainingTime(expirationTime);

    logoutTimer = setTimeout(logoutHandler, remainingTime);
  };

  useEffect(() => {
    if (tokenData) {
      console.log(tokenData.duration);
      logoutTimer = setTimeout(logoutHandler, tokenData.duration);
    }
  }, [tokenData, logoutHandler]);

  return (
    <AuthContext.Provider
      value={{
        token: authToken,
        isLoggedIn: userIsLoggedIn,
        login: loginHandler,
        logout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
export default AuthContext;
