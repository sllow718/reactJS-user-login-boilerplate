import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import { AuthContext } from "../../context/auth-context";
import "./NavLinks.css";
import Button from "../FormElements/Button";

const NavLinks = (props) => {
  const auth = useContext(AuthContext);
  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          ALL USERS
        </NavLink>
      </li>

      {/* if not logged in, show login */}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/login">LOGIN</NavLink>
        </li>
      )}
      {/* if logged in, show logout */}
      {auth.isLoggedIn && (
        <li>
          <Button onClick={auth.logout}>LOGOUT</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
