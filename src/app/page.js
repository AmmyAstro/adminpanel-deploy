"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "./redux/slices/loginSlice";

export default function LoginForm() {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const { loading, user, token, error } = useSelector((state) => state.login);

  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobile(value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginRequest({ mobile, password }));
  };

  useEffect(() => {
    if (token) {
      router.push("/Admindash");
    }
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-center mb-2">Sign In</h2>
        <p className="text-center text-gray-600 mb-6">
          Enter your credentials to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-medium text-gray-700"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={handleMobileChange}
              maxLength={10}
              inputMode="numeric"
              required
              placeholder="Enter phone number"
              className="mt-1 w-full rounded-full border border-gray-200  px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
                className="mt-1 w-full rounded-full border border-gray-200 px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-xs text-purple-500 font-semibold"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-fit place-self-center px-10  rounded-full bg-purple-600 text-white py-2 font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
          {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {error && (
          <p className="text-center text-red-500 text-sm mt-2">{error}</p>
        )}

        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link
            href="#"
            className="text-purple-600 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
