import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../shared/components/UIElements/Card";
// UI elements
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { AuthContext } from "../../shared/context/auth-context";
//
import UsersList from "../components/UsersList";
import UpdateUserPassword from "../components/UpdateUserPassword";

const Users = () => {
  const [loggedUsername, setLoggedUsername] = useState();
  const auth = useContext(AuthContext);
  // console.log(localStorage.getItem("userData"));
  let cookies = !!localStorage.getItem("userData");
  useEffect(() => {
    let userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
      setLoggedUsername(userData.username);
      setLoggedInText(`Logged in as ${loggedUsername}`);
    } else {
      setLoggedUsername();
    }
  }, [cookies, loggedUsername]);

  const [loggedInText, setLoggedInText] = useState(`Loading...`);
  const [updatePassword, setUpdatePassword] = useState(false);

  const [userList, setUserList] = useState();
  const [isLoading, setIsLoading] = useState(true);
  // Run once to fetch data
  useEffect(() => {
    const fetchData = async () => {
      await fetch(`https://mf-userlogin.herokuapp.com/api/users`)
        .then((response) => response.json())
        .then((data) => {
          setUserList(data.users);
        });
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const changeText = (event) => {
    event.preventDefault();
    setLoggedInText(`Click to change password for ${loggedUsername}`);
  };

  const resetText = (event) => {
    event.preventDefault();
    setLoggedInText(`Logged in as ${loggedUsername}`);
  };

  const passwordUpdateHandler = (event) => {
    // event.preventDefault();
    updatePassword ? setUpdatePassword(false) : setUpdatePassword(true);
  };

  return (
    <React.Fragment>
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {auth.isLoggedIn && (
        <Link
          onMouseOver={changeText}
          onMouseOut={resetText}
          onClick={passwordUpdateHandler}
          to={`/update`}
          style={{ textDecoration: "none", color: "black" }}
        >
          <Card className="center">
            <h3>{loggedInText}</h3>
          </Card>
        </Link>
      )}
      {updatePassword && <UpdateUserPassword reset={passwordUpdateHandler} />}
      {!updatePassword && !isLoading && <UsersList items={userList} />}
    </React.Fragment>
  );
};

export default Users;
