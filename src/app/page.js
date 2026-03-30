"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import client, { authTokenVar } from "@/components/utils/apolloClient";

const LOGIN_STAFF = gql`
  mutation LoginStaff($email: String!, $password: String!) {
    loginStaff(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
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

export default function StaffLogin() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loginStaff, { loading }] = useMutation(LOGIN_STAFF, {
    onCompleted: async (data) => {
      const { accessToken, user } = data.loginStaff;
      console.log("loading:", loading);

      authTokenVar(accessToken);

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      toast.success(`Welcome ${user.name}`);

      await client.resetStore();

      router.push("/Admindash");
    },

    onError: (err) => {
      toast.error(err.message || "Login failed");
    },
  });
console.log("loading:", loading);
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    const { email, password } = form;

    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");

    await loginStaff({
      variables: { email, password },
    });
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

        <h2 className="text-2xl font-bold text-center mb-6">Staff Sign In</h2>

        <div className="space-y-4">
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
