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

            if (!response.ok) {
              setError(data.message);
              return;
            }

            alert("Signup successful");

        } catch (err) {
          console.error("Server-side or Network error:", err);
          setError("Server-side error");

        }

    };

    return (
      <main className="flex flex-col items-center justify-center min-h-screen bg-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-md w-full p-8 bg-white border border-gray-200 rounded-xl shadow-md space-y-4 text-center">
        <h2 className="text-3xl font-bold">Sign Up</h2>
        <input type="email" value={userName} placeholder="Email" onChange={(e) => setUserName(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"></input>
        <input type="password" value={password} placeholder="Password" onChange={(e) => setPassword(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"></input>
        <input type="password" value={confirmPass} placeholder="Confirm Password" onChange={(e) => setConfirmPass(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-lg"></input>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="w-full px-6 py-2 border rounded-lg shadow-sm hover:bg-gray-100 hover:shadow transition">Sign Up</button>
      </form>
        
      </main>
 
    );

}

export default SignupForm;