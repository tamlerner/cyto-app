export function generateComplexPassword(length = 64): string {
    const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
    let password = "";
    
    // Ensure the length is a positive integer
    if (length <= 0) {
        throw new Error("Password length must be a positive integer.");
    }

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}

// Example usage
const complexPassword = generateComplexPassword();
console.log(complexPassword);
