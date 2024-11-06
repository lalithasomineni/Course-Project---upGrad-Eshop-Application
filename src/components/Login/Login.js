import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import ButtonUI from "../../common/Buttonui";
import NavBar from "../../common/Navbar";
import EmailValidator from "../../utils/emailValidator";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signin = () => {
  const [password, setPassword] = useState("");
  const [username, setusername] = useState("");
  const [validuser, setvalidUser] = useState(true);

  let navigate = useNavigate();

  const userNameHandler = (event) => {
    setusername(event.target.value);
  };

  const passwordHandler = (event) => {
    setPassword(event.target.value);
  };

  const submitrequest = async () => {
    try {
      const rawResponse = await fetch("http://localhost:8080/api/auth/signin", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (rawResponse.ok) {
        const result = await rawResponse.json();
        window.sessionStorage.setItem("access-token", result.token);
        window.sessionStorage.setItem("username", username);
        const token = result.token;
        getdateofUsers(token);
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        throw error;
      }
    } catch (e) {
      alert(`Error: ${e.message}`);
    }
  };

  const getdateofUsers = async (token) => {
    try {
      const rawResponse = await fetch("http://localhost:8080/api/users", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          authorization: `Bearer ${token}`,
        },
      });

      if (rawResponse.ok) {
        const result = await rawResponse.json();
        const loggedinUser = result.filter((user) => {
          if (user.email === username) {
            window.sessionStorage.setItem("userid", user.id);
            return user;
          }
        });

        const userRole = loggedinUser.map((rolename) => rolename.roles[0].name);
        if (userRole[0] === "ADMIN") {
          toast.success("Login Success !!"); // This will trigger the toast
          navigate("/home", { state: { admin: true } });
        } else {
          navigate("/home");
        }
      } else {
        const error = new Error();
        error.message = "Something went wrong.";
        throw error;
      }
    } catch (e) {
      navigate("/");
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();

    if (!EmailValidator(username)) {
      setvalidUser(false);
      return;
    }
    submitrequest();
  };

  return (
    <>
      <NavBar>
        <ShoppingCartIcon style={{ color: "white" }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1 }}
          style={{ paddingLeft: "1%" }}
        >
          upGrad E-shop
        </Typography>
        <ButtonUI type="button">Login</ButtonUI>
        <ButtonUI
          type="button"
          onClick={() => {
            navigate("/signup");
          }}
        >
          Sign Up
        </ButtonUI>
      </NavBar>
      <div className="px-3 sm:px-16 md:px-32 py-16 flex flex-col items-center">
        <LockOutlinedIcon
          style={{
            color: "white",
            backgroundColor: "rgb(242, 39, 70)",
            borderRadius: "50%",
            height: "50px",
            width: "50px",
            padding: "7px",
          }}
        />
        <h6 className="text-center text-3xl "> Sign in</h6>
        <br></br>
        <form
          onSubmit={submitHandler}
          className="w-[25%] mx-auto flex flex-col items-center gap-3"
        >
          <TextField
            required
            id="userName"
            label="userName"
            placeholder="userName"
            error={!validuser ? true : false}
            className="w-full"
            onChange={userNameHandler}
          />
          <br />
          <br />
          <TextField
            required
            id="Password"
            type="password"
            label="Password"
            className="w-full"
            placeholder="Password"
            onChange={passwordHandler}
          />
          <br />
          <br />
          <div
            style={{
              display: "flex",
              justifyItems: "center",
              justifyContent: "space-around",
            }}
          >
            {" "}
            <Button
              variant="contained"
              type="submit"
              onClick={submitHandler}
              style={{ backgroundColor: "#3f51b5" }}
            >
              SIGN IN{" "}
            </Button>
          </div>
        </form>
        <br />
        <Row>
          <Col>
            Do not have an account?
            <Link
              to={`/signup`}
              style={{ textDecoration: "underline", color: "blue" }}
            >
              {" "}
              Signup
            </Link>
          </Col>
        </Row>
      </div>

      {/* Add ToastContainer here */}
      <ToastContainer /> {/* This will allow toasts to appear */}
    </>
  );
};

export default Signin;
