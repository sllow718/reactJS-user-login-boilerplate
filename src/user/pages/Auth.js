import React, { useContext, useState } from "react";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "./Auth.css";
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH,
  VALIDATOR_EMAIL,
} from "../../shared/util/validators";

import { useHttpClient } from "../../shared/hooks/http-hook";

const Authenticate = () => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [formState, inputHandler, setFormData] = useForm(
    {
      username: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        isValid: false,
      },
    },
    false
  );
  const [LogInMode, setLogInMode] = useState(true);

  const authSubmitHandler = async (event) => {
    event.preventDefault();
    if (LogInMode) {
      try {
        const responseData = await sendRequest(
          "https://mf-userlogin.herokuapp.com/api/users/login",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.username,
          null
        );
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          "https://mf-userlogin.herokuapp.com/api/users/signup",
          "POST",
          JSON.stringify({
            username: formState.inputs.username.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { "Content-Type": "application/json" }
        );
        auth.login(
          responseData.userId,
          responseData.token,
          responseData.username,
          null
        );
      } catch (err) {}
    }
  };

  const switchModeHandler = (event) => {
    if (!LogInMode) {
      setFormData(
        {
          ...formState.inputs,
          email: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          email: { value: "", isValid: false },
        },
        false
      );
    }
    setLogInMode((prevMode) => !prevMode);
  };
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && (
        <Card className="authentication">
          <form className="place-form" onSubmit={authSubmitHandler}>
            <Input
              element="input"
              id="username"
              type="text"
              label="Username"
              errorText="Please enter a username"
              onInput={inputHandler}
              validators={[VALIDATOR_REQUIRE()]}
            />
            {!LogInMode && (
              <Input
                element="input"
                id="email"
                type="text"
                label="Email"
                validators={[VALIDATOR_EMAIL()]}
                errorText="Please enter a valid E-mail."
                onInput={inputHandler}
              />
            )}
            <Input
              element="input"
              id="password"
              type="password"
              label="Password"
              errorText="Please enter a valid password"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(6)]}
            />
            <Button type="submit" disabled={!formState.isValid}>
              {LogInMode ? "Login" : "Sign Up"}
            </Button>
          </form>
          <Button inverse onClick={switchModeHandler}>
            {LogInMode ? "Sign Up" : "Log In"}
          </Button>
        </Card>
      )}
    </React.Fragment>
  );
};

export default Authenticate;
