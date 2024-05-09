import User from '../models/User.js';  

export const getUser = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password, gameState, notes } = req.body;  
  try {
    const newUser = new User({
      username,
      email,
      password,
      gameState: {  
        ...gameState
      },
      notes  
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

