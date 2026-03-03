"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import cookieHelper from "./helper/cookieHelper";
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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const [loginAdmin, { loading }] = useMutation(LOGIN_ADMIN, {
  onCompleted: (data) => {
    console.log("✅ LOGIN RESPONSE:", data);
    toast.success("Login successful");
    router.push("/Admindash");
  },
  onError: (error) => {
    console.error("❌ LOGIN ERROR:", error);
    toast.error(error.message);
  },
});

const handleSubmit = async () => {
  console.log("🚀 Submitting login:", { email, password });

  if (!email) return toast.error("Email is required");
  // if (!isValidEmail(email))
  //   return toast.error("Enter valid email format");
  if (!password) return toast.error("Password is required");

  try {
    const response = await loginAdmin({
      variables: { email, password },
    });

    console.log("📦 Mutation returned:", response);
  } catch (err) {
    console.error("🔥 Mutation catch block:", err);
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

        <h2 className="text-2xl font-bold text-center mb-2">
          Admin Sign In
        </h2>

        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="amrender@dhwaniastro.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-full border px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-full border px-3 py-2 pr-10 focus:ring-2 focus:ring-purple-500 focus:outline-none"
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