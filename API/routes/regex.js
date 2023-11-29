// Regular expression for email validation
exports.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Regular expression for password validation (at least 8 characters, one uppercase, one lowercase, one digit)
exports.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

// Regular expression for username validation (letters, digits, underscores, and hyphens, 3 to 16 characters)
exports.usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/;
