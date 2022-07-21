import { useState, useCallback, useEffect } from "react";

let logOutTimer;

export const useAuth = () => {
  // authContext reads isLoggedIn from app.js
  // there is no other useState function that exists outside of app.js for isLoggedIn
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userId, setUserId] = useState();

  // update isLoggedIn to be true

  const login = useCallback((uid, token, username, expirationDate) => {
    setToken(token);
    setUserId(uid);

    // token expires in 1 hour
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    setTokenExpirationDate(tokenExpirationDate);
    // store item in localstorage so that it can be re-used
    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        username: username,
        token: token,
        expiration: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  // update isLoggedIn to be false
  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logOutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logOutTimer);
    }
  }, [token, logout, tokenExpirationDate]);
  // check local storage for userId, token
  // run when application runs for the first time
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        storedData.username,
        new Date(storedData.expiration)
      );
    }
  }, [login]);

  return { token, login, logout, userId };
};
