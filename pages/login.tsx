import React, { useState } from "react";
import { Button } from "../components/Button";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  const router = useRouter();

  const validateEmail = () => {
    if (!email) {
      setEmailError("Email is required");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else {
      setPasswordError("");
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    validateEmail();
    validatePassword();

    if (email && password) {
      try {
        const response = await axios.post("http://localhost:8080/api/login", {
          email,
          password,
        });
        // Handle successful login response
        localStorage.setItem("token", response.data);
        router.push("/");
      } catch (error) {
        setLoginError("Invalid email or password");
      }
    }
  };

  return (
    <div className="bg-slate-50 h-screen flex justify-center">
      <div className="bg-white self-center shadow-md p-12 rounded-md">
        <p className="text-primary text-4xl font-extrabold mb-10 text-center">
          Log In
        </p>
        <div className="flex flex-col gap-4 place-items-center">
          <input
            className="bg-gray-100 h-12 rounded-md pl-3 focus:bg-white focus:outline-gray-200"
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError("");
              setLoginError("");
            }}
            onBlur={validateEmail}
          />
          {emailError && <p className="text-red-500">{emailError}</p>}

          <input
            className="bg-gray-100 h-12 rounded-md pl-3 focus:bg-white focus:outline-gray-200"
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setPasswordError("");
              setLoginError("");
            }}
            onBlur={validatePassword}
          />
          {passwordError && <p className="text-red-500">{passwordError}</p>}

          {loginError && <p className="text-red-500">{loginError}</p>}

          <div onClick={handleSubmit}>
            <Button title={"Sign In"} size="md" />
          </div>

          <p className="text-sm">
            Don&apos;t have an account?{" "}
            <Link className="text-primary" href="signup">
              Register
            </Link>
          </p>

          {/* <Image
            width={100}
            height={10}
            src={"/sign-in-with-google-icon-3.jpg"}
            alt={"google sign in"}
          /> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
