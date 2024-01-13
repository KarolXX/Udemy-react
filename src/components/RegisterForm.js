import React, { useRef, useState } from "react";

const RegisterForm = ({ setUser }) => {
  const formRef = useRef();
  const [error, setError] = useState(null);

  const validateName = (name) => {
    const regex = /^[a-zA-Z0-9]{7,}$/;
    return regex.test(name);
  };

  const validatePassword = (password) => {
    // Password should be at least 7 characters and contain at least one special character
    const regex = /^(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,}$/;
    return regex.test(password);
  };

  const register = (e) => {
    e.preventDefault();

    const name = formRef.current.elements.name.value;
    const password = formRef.current.elements.password.value;

    // Validation for name field
    if (!validateName(name)) {
      setError(
        "Name must be at least 7 characters long and contain only alphanumeric characters."
      );
      formRef.current.reset();
      return;
    }

    // Validation for password field
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 7 characters long and contain at least one special character."
      );
      formRef.current.reset();
      return;
    }

    fetch("http://localhost:8080/oauth/users", {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        password: password,
      }),
    })
      .then((resp) => {
        if (resp.status === 201) {
          resp.text().then(function (text) {
            alert(text);
            formRef.current.reset();
          });
          throw "User with given nick already exists";
        } else {
          return resp.json();
        }
      })
      .then((data) => {
        setUser(data.person);
        setError(null); // Clear any previous validation errors
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        // Handle other errors as needed
      });
  };

  return (
    <div className="form">
      <form ref={formRef}>
        Create account on <b>Udemy</b>
        {error && (
          <p
            style={{
              fontSize: "14px",
              color: "red",
              maxWidth: "300px",
              wordWrap: "break-word",
            }}
          >
            {error}
          </p>
        )}
        <p className="form__p">
          <label>Your name: </label>
          <br />
          <input name="name" type="text" className="form__input" />
          <br />
          <label>Password: </label>
          <br />
          <input name="password" type="password" className="form__input" />
        </p>
        <button
          type="submit"
          className="btn form__btn"
          onClick={(e) => register(e)}
        >
          Add me in!
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
