const bcrypt = require('bcryptjs');

const password = 'myfirstshit3478'; // 🔒 your real password here
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error hashing password:', err);
    return;
  }
  console.log('Your bcrypt hash:\n', hash);
});
