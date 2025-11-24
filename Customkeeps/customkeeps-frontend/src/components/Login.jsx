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
      const accessToken = response.access || response.data?.access;
      const refreshToken = response.refresh || response.data?.refresh;

      if (accessToken) {
        localStorage.setItem("token", accessToken);
      }
      if (refreshToken) {
        localStorage.setItem("refresh", refreshToken);
      }

      // Save identifier for billing (here we use username)
      localStorage.setItem("email", data.username);

      // Notify parent/app to update UI state
      if (onLogin) onLogin();
    } catch (err) {
      const detail =
        err?.response?.data?.detail ||
        (err?.response?.data && JSON.stringify(err.response.data)) ||
        err?.message ||
        "Unknown error";

      alert("Login failed: " + detail);
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
        {errors.username && (
          <span className="form-error">Username is required.</span>
        )}

        <input
          {...register("password", { required: true })}
          placeholder="Password"
          type="password"
        />
        {errors.password && (
          <span className="form-error">Password is required.</span>
        )}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
