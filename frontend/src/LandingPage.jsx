function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6 p-4">
      <h1>🍱 CYF Lunch Organiser</h1>
      <p>Manage weekly lunch orders for CYF London classes</p>
      <div className="homepage-buttons">
        <button>Sign up</button>
        <button>Log in</button>
      </div>
      <p>Access is limited to authorised CYF volunteers.</p>
    </main>
  );
}

export default LandingPage;
