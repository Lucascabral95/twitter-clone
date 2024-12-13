"use client";
import React from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Home: React.FC = () => {
  const router = useRouter();

  const acceso = async (formData: FormData) => {
    try {
      const email = formData.get("email");
      const password = formData.get("password");

      const response = await axios.post(
        "/api/auth/login",
        {
          email: email,
          password: password,
        }
      );

      if (response.status === 200) {
        router.push("/adentro");
      }

      console.log(response.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1> Home login </h1>

      <form action={acceso} style={{ color: "red" }}>
        <input
          type="email"
          name="email"
          placeholder="Ingresa tu email"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Ingresa tu contraseña"
          required
        />
        <button type="submit"> Login </button>
      </form>
    </div>
  );
};

export default Home;
