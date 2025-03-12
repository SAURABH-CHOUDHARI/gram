const userModel = require("../models/user.model");

module.exports.createUser = async ({ username, email, password }) => {

    if (!username || !email || !password) {
        console.error("Missing fields!");
        throw new Error("All fields are required [username, email, password]");
    }

    const isUserAlreadyExist = await userModel.findOne({
        $or: [{ username }, { email }],
    });


    if (isUserAlreadyExist) {
        console.error("User already exists!");
        throw new Error("User already exists");
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = new userModel({
        username,
        email,
        password: hashedPassword,
    });

    await user.save();

    delete user._doc.password;

    return user;
};
module.exports.loginUser = async ({ email, password }) => {

    const user = await userModel.findOne({ email });
    
    if (!user) {
        console.error("User not found!");
        throw new Error("Invalid Credentials");
    }
    
    const isPasswordCorrect = await user.comparePassword(password);


    if (!isPasswordCorrect) {
        console.error("Password incorrect!");
        throw new Error("Invalid Credentials");
    }

    delete user._doc.password;

    return user;
};
