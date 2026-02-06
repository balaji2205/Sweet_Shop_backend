exports.ownerLogin = (req, res) => {
  const { username, password } = req.body;

  if (
    username === process.env.OWNER_USERNAME &&
    password === process.env.OWNER_PASSWORD
  ) {
    return res.json({
      message: 'Login successful',
      token: 'OWNER_LOGGED_IN'
    });
  }

  return res.status(401).json({
    message: 'Invalid credentials'
  });
};
