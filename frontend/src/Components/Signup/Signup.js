import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import styles from "./styles.module.css";
import MainNavbar from "../Navbar/MainNavbar";

const Signup = () => {
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  let name,value;
  const handleChange = (e) => {
    console.log(e);
    name = e.target.name;
    value = e.target.value;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5001/register";
      const { data: res } = await axios.post(url, data);
      navigate("/login");
      console.log(res.message);
      window.alert(res.message);
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // const handleSubmit = async(e) => {
  //   e.preventDefault();
  //   try {
  //     const {firstName, lastName, email, password} = data;
  //     const res = await fetch("/register",{
  //       method : "POST",
  //       headers: {
  //         "Content-Type" : "application/json"
  //       },
  //       body: JSON.stringify({
  //         firstName, lastName, email, password
  //       })
  //     });
  //     navigate("/login");
  //   } catch (error) {
  //     if (
  //       error.response &&
  //       error.response.status >= 400 &&
  //       error.response.status <= 500
  //     ) {
  //       setError(error.response.data.message);
  //     }
  //   }
  // };

  return (
    <>
    <MainNavbar />
    <div className={styles.signup_container}>
      <div className={styles.signup_form_container}>
        <div className={styles.left}>
          <h1>Welcome Back</h1>
          <Link to="/login">
            <button type="button" className={styles.white_btn}>
              Sign in
            </button>
          </Link>
        </div>
        <div className={styles.right}>
          <form method="POST" className={styles.form_container} >
            <h1>Create Account</h1>
            <input
              type="text"
              placeholder="First Name"
              name="firstname"
              onChange={handleChange}
              value={data.firstName}
              required
              className={styles.input}
            />
            <input
              type="text"
              placeholder="Last Name"
              name="lastname"
              onChange={handleChange}
              value={data.lastName}
              required
              className={styles.input}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className={styles.input}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className={styles.input}
            />
            {error && <div className={styles.error_msg}>{error}</div>}
            <button type="submit" className={styles.green_btn} onClick={handleSubmit}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Signup;
