import bcrypt from 'bcryptjs';

const users = [
  {
    firstName: 'Akhil Reddy',
    lastName: 'Mallidi',
    fullName: 'Akhil Reddy Mallidi',
    email: 'admin@scts.in',
    password: bcrypt.hashSync('admin@1234', 10),
    isAdmin: true
  }
];

export default users;