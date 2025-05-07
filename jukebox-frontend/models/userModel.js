// Simulate a user model with hardcoded data
const users = [
    { email: "admin@admin.com", password: "1234" },
    { email: "user@example.com", password: "pass123" }
  ];
  
  export function findUser(email, password) {
    return users.find(user => user.email === email && user.password === password);
  }
  