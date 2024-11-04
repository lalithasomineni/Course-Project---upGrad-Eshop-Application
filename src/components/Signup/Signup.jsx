import React, { Component } from "react";

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            firstName: "",
            password: "",
            confirmPassword: "",
            lastName: "",
            contactNumber: "",
            role: ["user"]
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    async handleSubmit(event) {
        event.preventDefault();  

        const { email, firstName,password,confirmPassword, lastName, contactNumber, role } = this.state;
        const userData = {
            email,
            firstName,
            password,
            confirmPassword,
            lastName,
            contactNumber,
            role
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userData),
            });

            const data = await response.json();  
            console.log(data);
            if(data){
                window.location.href = "http://localhost:3000/login"
            }
            else{
                alert("signed in successfully, but login is not working")
            }
        } catch (error) {
            console.error("Error:", error);
            alert("User already exists")
        }
    }

    render() {
        return (
            <>
                <form onSubmit={this.handleSubmit.bind(this)}>
                    <h1>Signup Form</h1>
                    <input type="text" placeholder="Email" name="email" required onChange={this.handleChange} />
                    <input type="text" placeholder="First Name" name="firstName" required onChange={this.handleChange} />
                    <input type="password" placeholder="Password" name="password" required onChange={this.handleChange} />
                    <input type="password" placeholder="confirm Password" name="confirmpassword" required onChange={this.handleChange} />
                    <input type="text" placeholder="Last Name" name="lastName" required onChange={this.handleChange} />
                    <input type="text" placeholder="Contact Number" name="contactNumber" required onChange={this.handleChange} />
                    <button type="submit">Sign Up</button>
                </form>
            </>
        );
    }
}

export default Signup;
