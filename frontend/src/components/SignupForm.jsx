import { useState } from "react";

function SignupForm() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

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

        if (password !== confirmPass) {
          setError("Passwords do not match");
          return;
        }

        console.log("Sending signup request to backend:", { userName, password, confirmPass });

        setError("");

        try {
          const response = await fetch(
            "http://localhost:4000/api/auth/signup",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userName, password, confirmPass }),
            });

            const data = await response.json();
            console.log("Response from backend:", data);

        } catch (err) {

        }

    }

    return (
      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <input type="email" value={userName} placeholder="Email" onChange={(e) => setUserName(e.target.value)} required></input>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required></input>
        <input type="password" value={confirmPass} placeholder="Confirm Password" onChange={(e) => setConfirmPass(e.target.value)} required></input>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit">Sign Up</button>
      </form>
    );

}

export default SignupForm;