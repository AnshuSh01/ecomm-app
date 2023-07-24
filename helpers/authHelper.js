import bcrypt from 'bcrypt';

export const hashPassword = async (Password) => {
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Password, saltRounds);
        return hashedPassword;
    }
    catch (e) {
        console.log("Bcrypt authhelper.js error", e);
        return "error in authHelper hashPassword"
    }
};

export const comparePassword = async (Password, hashedPassword)=> {
    return bcrypt.compare(Password, hashedPassword);
}