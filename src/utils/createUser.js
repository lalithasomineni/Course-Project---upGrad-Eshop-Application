import axios from "axios";

export default async function CreateUser(data) {
    try {
      const r = await axios.post(`http://localhost:8080/api/auth/signup`, {
        email: data.email,
        role: [data.role],
        password: data.password,
        firstName: data.fname,
        lastName: data.lname,
        contactNumber: data.mobile,
      });
      return r.status;
    } catch (e) {
      if (e.response && e.response.status) {
        return e.response.status;
      }
    } finally {
      console.log(`Finally Signup called`);
    }
  }