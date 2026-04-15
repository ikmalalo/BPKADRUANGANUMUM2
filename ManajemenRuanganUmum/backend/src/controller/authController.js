const db = require('../config/db');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const { rows } = await db.query(query, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Username atau password salah' });
    }

    const user = rows[0];
    // Exclude password from response
    delete user.password;

    res.status(200).json({ 
      message: 'Login berhasil', 
      user 
    });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

module.exports = {
  login
};

