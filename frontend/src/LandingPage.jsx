function LandingPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-6 p-4">
      <div className="max-w-md p-8 bg-white border rounded-xl shadow-md space-y-6 text-center">
        <h1 className="text-4xl font-bold">🍱 CYF Lunch Organiser</h1>
        <p className="text-gray-600 text-center max-w-md">
          Manage weekly lunch orders for CYF London classes
        </p>
        <div className="homepage-buttons">
          <button>Sign up</button>
          <button>Log in</button>
        </div>
        <p>Access is limited to authorised CYF volunteers.</p>
      </div>
    </main>
  );
}

export default LandingPage;
