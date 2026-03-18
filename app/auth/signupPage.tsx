const handleSignUp = async (e) => {
  e.preventDefault();
  
  // Basic Validation
  if (password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: fullName } // Storing the name in user_metadata
    }
  });

  if (error) setError(error.message);
  else alert("Check your email for the confirmation link!");
};