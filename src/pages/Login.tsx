import { useState } from "react";
import { login } from "../api/auth";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {

      const response = await login({
        email,
        password
      });

      localStorage.setItem(
        "token",
        response.token
      );

      alert("Login exitoso");

      console.log(response.token);

    } catch (error) {
      alert("Credenciales inválidas");
      console.error(error);
    }
  }

  return (
    <div className="container mt-5">

      <h2>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label>Email</label>

          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
        >
          Ingresar
        </button>

      </form>
    </div>
  );
}

export default Login;