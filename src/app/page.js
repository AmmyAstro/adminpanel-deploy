"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

const LOGIN_ADMIN = gql`
  mutation LoginAdmin($email: String!, $password: String!) {
    loginAdmin(email: $email, password: $password) {
      accessToken
      refreshToken
      admin {
        id
        name
        email
        role {
          name
        }
      }
    }
  }
`;

export default function AdminLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loginAdmin, { loading }] = useMutation(LOGIN_ADMIN, {
onCompleted: (data) => {

  const { accessToken, refreshToken } = data.loginAdmin;

  // localStorage
  localStorage.setItem("adminToken", accessToken);

  // cookie for middleware
  document.cookie = `token=${accessToken}; path=/`;

  toast.success("Login successful");

  router.replace("/Admindash");
},
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const { email, password } = form;

    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    try {
      await loginAdmin({
        variables: { email, password },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0000004b] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">
        <Image
          src="/admin-img/adlogo.png"
          alt="logo"
          width={140}
          height={140}
          className="mx-auto mb-6"
        />

        <h2 className="text-2xl font-bold text-center mb-6">Admin Sign In</h2>

        <div className="space-y-4">
          {/* Email */}
          <div>
            <label className="text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              placeholder="admin@dhwaniastro.com"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-full border px-3 py-2 focus:ring-2 focus:ring-purple-500 outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="text-sm font-medium">Password</label>

            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              className="mt-1 w-full rounded-full border px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-500 outline-none"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-9 text-xs text-purple-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full rounded-full bg-purple-600 text-white py-2 font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
