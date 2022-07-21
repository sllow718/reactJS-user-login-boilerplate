import React, { useContext, useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { useForm } from "../../shared/hooks/form-hook";
import { AuthContext } from "../../shared/context/auth-context";
import "../pages/Auth.css";
import { VALIDATOR_MINLENGTH } from "../../shared/util/validators";

import { useHttpClient } from "../../shared/hooks/http-hook";

const UpdateUserPassword = (props) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();
  const [formState, inputHandler, setFormData] = useForm(
    {
      currentPassword: {
        value: "",
        isValid: false,
      },
      newPassword: {
        value: "",
        isValid: false,
      },
    },
    false
  );

  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const authSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      const responseData = await sendRequest(
        `https://mf-userlogin.herokuapp.com/api/users/update/${auth.userId}`,
        "PATCH",
        JSON.stringify({
          currentPassword: formState.inputs.currentPassword.value,
          newPassword: formState.inputs.newPassword.value,
        }),
        {
          "Content-Type": "application/json",
          Authorization: "Bearer " + auth.token,
        }
      );
      setPasswordResetSuccess(true);

      props.reset();
    } catch (err) {}
  };

  const removeModalHandler = () => {
    setPasswordResetSuccess(false);
    history.push(`/`);
  };

  return (
    <React.Fragment>
      {passwordResetSuccess && (
        <ErrorModal
          error={`Password successfully changed! You will be re-directed to the main page shortly...`}
          header={`Password Updated!`}
          onClear={clearError && removeModalHandler}
        />
      )}
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
              id="currentPassword"
              type="password"
              label="Type in current password"
              errorText="Please enter your current password"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(6)]}
            />
            <Input
              element="input"
              id="newPassword"
              type="password"
              label="Type in new password"
              errorText="Please enter a valid new password"
              onInput={inputHandler}
              validators={[VALIDATOR_MINLENGTH(6)]}
            />
            <Button type="submit" disabled={!formState.isValid}>
              Change Password
            </Button>
          </form>
        </Card>
      )}
    </React.Fragment>
  );
};

export default UpdateUserPassword;
