import React from "react";
import { useForm } from "react-hook-form";
import { registerUser } from "../api/apiService";

export default function Register({ onRegister }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      onRegister();
      alert("Registration successful! You may now log in.");
    } catch (err) {
      alert(
        "Registration failed: " +
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
      <h2>Register</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register("username", { required: true })}
          placeholder="Username"
        />
        {errors.username && <span>Username is required.</span>}
        <input
          {...register("email")}
          placeholder="Email"
          type="email"
        />
        <input
          {...register("password", { required: true })}
          placeholder="Password"
          type="password"
        />
        {errors.password && <span>Password is required.</span>}
        <button type="submit" disabled={isSubmitting}>
          Register
        </button>
      </form>
    </div>
  );
}
