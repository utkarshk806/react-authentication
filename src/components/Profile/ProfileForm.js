import classes from "./ProfileForm.module.css";
import { useRef, useContext } from "react";
import AuthContext from "../../store/auth-context";
import { useHistory } from "react-router-dom";

const ProfileForm = () => {
  const passwordInputRef = useRef();
  const authCtx = useContext(AuthContext);
  const history = useHistory();
  const idToken = authCtx.token;

  function formSubmitHandler(event) {
    event.preventDefault();
    const enteredPassword = passwordInputRef.current.value;
    if (enteredPassword.trim().length < 6) {
      return;
    }
    fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBlHExdjfN29X8mmS3nI6xDSHTX-sUQzvw",
      {
        method: "POST",
        body: JSON.stringify({
          idToken,
          password: enteredPassword,
          returnSecureToken: false,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      //assumption: always succeds!
      history.replace("/");
      console.log(res);
    });
  }

  return (
    <form className={classes.form} onSubmit={formSubmitHandler}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input
          type="password"
          id="new-password"
          minLength="7"
          ref={passwordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
