import { useState } from "react";

function SignupForm() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");

    return (
      <form>
        <h2>Sign Up</h2>
        <input type="email" value={userName} placeholder="Email" onChange={(e) => setUserName(e.target.value)} required></input>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required></input>
        <input type="password" value={confirmPassword} placeholder="Confirm Password" onChange={(e) => setConfirmPassward(e.target.value)} required></input>
        <button type="submit">Sign Up</button>
      </form>
    );

}

export default SignupForm;