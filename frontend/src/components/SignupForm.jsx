import { useState } from "react";

function SignupForm() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
      <form>
        <h2>Sign Up</h2>
        <input type="email" placeholder="Email" required></input>
        <input type="password" placeholder="Password" required></input>
        <input type="password" placeholder="Confirm Password" required></input>
        <button type="submit">Sign Up</button>
      </form>
    );

}

export default SignupFrom;