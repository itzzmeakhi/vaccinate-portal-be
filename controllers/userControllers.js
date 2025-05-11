import User from './../models/User.js';
import generateToken from '../utils/generateToken.js';

const authUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(user && (await user.matchPassword(password))) {
      res.status(200);
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401);
      next(new Error('Invalid email or password'));
    }
  } catch(err) {
    next(err);
  }
}; 

export { 
  authUser
};