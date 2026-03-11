function SignupForm() {
    return (
      <form>
        <h2>Sign Up</h2>
        <input type="email" placeholder="Email" required></input>
        <input type="password" placeholder="Password" required></input>
        <input type="password" placeholder="Confirm Password" required></input>
      </form>
    );

}

export default SignupFrom;