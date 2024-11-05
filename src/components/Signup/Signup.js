import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Checkbox, Snackbar } from "@mui/material";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import createUser from "../../utils/createUser";  // Ensure this is correctly imported
import emailValidator from "../../utils/emailValidator";
import contactValidator from "../../utils/contactValidator";
import Navbar from "../../common/Navbar";
import ButtonUI from "../../common/Buttonui";

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [contactNumber, setContact] = useState("");
  const [confirmpassword, setConfirmPassword] = useState("");
  const [validEmail, setValidEmail] = useState(true);
  const [validContact, setValidContact] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Handlers
  const handleFirstNameChange = (e) => setFirstName(e.target.value);
  const handleLastNameChange = (e) => setLastName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleContactChange = (e) => setContact(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const handleConfirmPasswordChange = (e) => setConfirmPassword(e.target.value);
  const handleRoleChange = () => setIsAdmin(!isAdmin);

  // Form submission handler
  const submitHandler = async (event) => {
    event.preventDefault();

    // Validate email
    if (!emailValidator(email)) {
      setValidEmail(false);
      return;
    }

    // Validate contact number
    if (!contactValidator(contactNumber)) {
      setValidContact(false);
      return;
    }

    // Check if passwords match
    if (password !== confirmpassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Create user
    const createFeedback = await createUser({
      email,
      fname: firstName,
      lname: lastName,
      mobile: contactNumber,
      password,
      role: isAdmin ? "admin" : "user",
    });

    if (createFeedback !== 200) {
      toast.error("User already exists with the same email address");
      return;
    }

    toast.success("User Registered Successfully!");

    // Clear form fields
    setFirstName("");
    setLastName("");
    setEmail("");
    setContact("");
    setPassword("");
    setConfirmPassword("");

    // Redirect to sign-in page after success
    setTimeout(() => navigate("/login"), 2000);
  };

  return (
    <>
               <Navbar>
        <ShoppingCartIcon style={{ color: "white" }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          upGrad E-shop
        </Typography>
        <ButtonUI
          type="button"
          onClick={() => {
            navigate("/login");
          }}
        >
          Login
        </ButtonUI>
        <ButtonUI type="button">Sign Up</ButtonUI>
      </Navbar>

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
        <h6 className="text-center text-3xl">Sign up</h6>

        <form
          onSubmit={submitHandler}
          className="w-[100%] sm:w-[50%] md:w-[100%] mx-auto flex flex-col gap-4"
        >
          <TextField
            required
            id="firstName"
            label="First Name"
            placeholder="First Name"
            className="w-full"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <TextField
            required
            id="lastName"
            label="Last Name"
            placeholder="Last Name"
            className="w-full"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <TextField
            required
            id="email"
            label="Email Address"
            placeholder="Email Address"
            error={!validEmail}
            className="w-full"
            value={email}
            onChange={handleEmailChange}
            helperText={!validEmail ? "Invalid email address" : ""}
          />
          <TextField
            required
            id="password"
            label="Password"
            type="password"
            className="w-full"
            value={password}
            placeholder="Password"
            onChange={handlePasswordChange}
          />
          <TextField
            required
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm Password"
            className="w-full"
            value={confirmpassword}
            onChange={handleConfirmPasswordChange}
          />
          <TextField
            required
            id="contact"
            label="Contact Number"
            placeholder="Contact Number"
            error={!validContact}
            className="w-full"
            value={contactNumber}
            onChange={handleContactChange}
            helperText={!validContact ? "Invalid contact number" : ""}
          />

          <label>Admin</label>
          <Checkbox id="role" onChange={handleRoleChange} checked={isAdmin}>
            Admin
          </Checkbox>

          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <Button
              variant="contained"
              type="submit"
              disabled={!firstName || !lastName || !email || !password || !confirmpassword || contactNumber.length < 10}
            >
              SIGN UP
            </Button>
          </div>
        </form>

        <Row>
          <Col>
            Already have an account?{" "}
            <Link to="/login" style={{ textDecoration: "underline", color: "blue" }}>
              Login
            </Link>
          </Col>
        </Row>
      </div>

      <ToastContainer />
    </>
  );
};

export default Signup;
