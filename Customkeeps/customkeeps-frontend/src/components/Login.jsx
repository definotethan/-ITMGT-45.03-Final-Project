import React from "react";
import { useForm } from "react-hook-form";
import { loginUser } from "../api/apiService";

export default function Login({ onLogin }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await loginUser(data);

      // Save tokens
      localStorage.setItem("token", response.access || response.data?.access);
      localStorage.setItem("refresh", response.refresh || response.data?.refresh);

      // Save identifier for Stripe billing details (here we use username)
      localStorage.setItem("email", data.username); // <--- NEW LINE

      onLogin(); // Notify parent/app to update UI state
    } catch (err) {
      alert(
        "Login failed: " +
          (
            err.response?.data?.detail ||
            JSON.stringify(err.response?.data) ||
            err.message ||
            "Unknown error"
          )
      );
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: true })}
          placeholder="Username"
        />
        {errors.username && <span>Username is required.</span>}

        <input
          {...register("password", { required: true })}
          placeholder="Password"
          type="password"
        />
        {errors.password && <span>Password is required.</span>}

        <button type="submit" disabled={isSubmitting}>
          Login
        </button>
      </form>
    </div>
  );
}
