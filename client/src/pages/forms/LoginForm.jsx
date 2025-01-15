import React, { useState } from "react";
import {
  InputFieldComponent,
  PasswordFieldComponent,
  FormBtn,
} from "../../utils/resource/ComponentsProvider.util";

import {
  MdEmail,
  FcGoogle,
  RiLockPasswordFill,
  FaUserLock,
} from "../../utils/resource/IconsProvider.util";

import images from "../../utils/resource/ImageProvider.util"

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <div className="absolute top-0 left-0 w-full bg-white flex items-center justify-start px-8 mt-2">
        <span>
          <img src={images.logo} alt="logo" className="w-32" />
        </span>
      </div>
      <div className="w-full max-w-md bg-white rounded-lg p-6 flex flex-col gap-8">
        <header className="flex flex-col items-center gap-1">
          <div className="h-10 w-10 border border-[#e0e0e0] text-primary-txt rounded-lg flex items-center justify-center mb-5 ">
            <FaUserLock className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold mb-2">Hi, Welcome Back</h1>
          <p className="text-center text-sm font-light text-secondary-txt">
            Enter your credentials to access your account
          </p>
        </header>
        <form className="flex flex-col gap-5">
          <InputFieldComponent
            label="Email"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            icon={MdEmail}
            value={email}
            onChange={setEmail}
            required={true}
          />

          <PasswordFieldComponent
            label="Password"
            name="password"
            id="password"
            placeholder="Enter your password"
            icon={RiLockPasswordFill}
            value={password}
            onChange={setPassword}
            required={true}
          />

          <div className="flex justify-between items-center gap-3">
            {/* Remember Me Checkbox */}
            <label className="flex items-center text-sm text-primary-txt cursor-pointer">
              <input
                type="checkbox"
                className="mr-2 accent-primary-btn cursor-pointer"
                id="rememberMe"
              />
              Remember Me
            </label>

            {/* Forgot Password Link */}
            <div>
              <a
                href="/auth/forget-password"
                className="w-full text-sm text-link"
              >
                Forgot Password?
              </a>
            </div>
          </div>

          <FormBtn btnText="Login" />

          <div className="flex gap-3 items-center">
            <hr className="w-full" />{" "}
            <p className="text-sm text-secondary-txt font-body">OR</p>{" "}
            <hr className="w-full" />
          </div>

          <button className="border hover:bg-[#f5f5f5] text-primary-txt px-4 py-2 rounded-md flex gap-2 items-center justify-center">
            <FcGoogle className="h-5 w-5" />
            <span className="text-sm font-medium font-body">
              Continue with Google
            </span>
          </button>

          <p className="text-sm text-center text-primary-txt font-light">
            Don't have an account?{" "}
            <a href="/signup" className="text-link font-medium">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </>
  );
};

export default LoginForm;
