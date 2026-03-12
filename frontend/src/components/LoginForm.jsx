import { useState } from "react";

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");


  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      setError("Username is required");
      return;
    }

    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    console.log("Sending login request to backend:", { userName, password});

    setError("");

    try {
      const response = await fetch(
        "http://localhost:4000/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userName, password}),
        });

        const data = await response.json();
        console.log("Response from backend:", data);

        if (!response.ok) {
          setError(data);
          return;
        }

        alert("login successful");

    } catch (err) {
      console.error("Server-side or Network error:", err);
      setError("Server-side error");

    }

  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Log In</h2>
      <input
        type="email"
        value={userName}
        placeholder="Email"
        onChange={(e) => setUserName(e.target.value)}
        required
      ></input>
      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      ></input>
      {error && <p className="text-red-500">{error}</p>}
      <button type="submit">Log In</button>
    </form>
  );
}

export default LoginForm;
