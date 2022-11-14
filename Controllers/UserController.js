import Agreement from '../Models/Agreement.js';
import Product from '../Models/Product.js';
import User from '../Models/User.js';
import Review from '../Models/Review.js';

export const updateUser = {
    controller: async (req, res) => {
        if (req.currUser._id.toString() !== req.params.id) {
            return res.status(400).send("You are not authenticated to update the profile");
        }
        if (!req.body.username || !req.body.email || !req.body.mobile || !req.body.location) {
            return res.status(400).json("Please Fill all the fields");
        }

        if (!req.body.password && !req.body.newPassword && !req.body.rePassword && req.body.username && req.body.email && req.body.mobile && req.body.location) {
            try {
                const findUser = await User.findOne({ userId: req.userId });

                if (!findUser) {
                    return res.status(401).send("User Not Found")
                } else {
                    let emailverified = true;
                    if (req.body.email !== findUser.email)
                        emailverified = false;
                    let mobileverified = true;
                    if (req.body.mobile !== findUser.mobile)
                        mobileverified = false;
                    const updateUser = await User.findByIdAndUpdate(req.userId,
                        {
                            username: req.body.username,
                            email: req.body.email,
                            mobile: req.body.mobile,
                            location: req.body.location,
                            avatar: req.body.avatar,
                            emailverified: emailverified,
                            mobileverified: mobileverified
                        }, { new: true }
                    );

                    const { password, ...others } = updateUser._doc;

                    return res.status(200).json({ ...others });
                }
            } catch (e) {
                // console.log(e);
                return res.status(500).send("Updation Failed");
            }
        } else if (req.body.password && req.body.newPassword && req.body.rePassword && req.body.username && req.body.email && req.body.mobile && req.body.location) {
            try {
                const findUser = await User.findOne({ email: req.body.email });

                if (!findUser) {
                    return res.status(401).send("User Not Found")
                } else {
                    let emailverified = true;
                    if (req.body.email !== findUser.email)
                        emailverified = false;
                    // const decryptedPass = CryptoJS.AES.decrypt(
                    //     findUser.password,
                    //     process.env.AES_SEC_KEY
                    // ).toString(CryptoJS.enc.Utf8);
                    const decryptedPass = findUser.password;

                    if (decryptedPass !== req.body.password) {
                        return res.status(401).send("Incorrect Current Password");
                    }

                    if (req.body.newPassword === req.body.rePassword) {
                        const updateUser = await User.findByIdAndUpdate(req.userId,
                            {
                                username: req.body.username,
                                email: req.body.email,
                                avatar: req.body.avatar,
                                mobile: req.body.mobile,
                                location: req.body.location,
                                password: req.body.newPassword,
                                emailverified: emailverified
                                // password: CryptoJS.AES.encrypt(req.body.newPassword, process.env.AES_SEC_KEY).toString()
                            }, { new: true }
                        );

                        const { password, ...others } = updateUser._doc;

                        return res.status(200).json({ ...others });

                    } else {
                        return res.status(401).send("Password and re-Enter Password Must be Same");
                    }
                }
            } catch (e) {
                return res.status(500).send("Internal server error");
            }
        } else {
            return res.status(401).send("Please Fill all the Fields");
        }
    }
}

export const findUser = {
    controller: async (req, res) => {
        try {
            const findUser = await User.findById(req.params.id);
            // console.log(req.currUser);
            res.status(201).json(findUser);

        } catch (e) {
            res.status(500).json("Internal Server Error");
        }
    }
}

export const findAllUsers = {
    controller: async (req, res) => {
        try {
            const page = req.query.page - 1 || 0;
            const limit = req.query.limit || 100;

            const currentUseridx = page * limit;
            let allUsers = await User.find();
            let finalUsers = [];
            allUsers.map((user) => {
                const { password, ...others } = user._doc;
                finalUsers.push(others);
            })

            allUsers = finalUsers;

            if (allUsers.length - 1 < currentUseridx)
                return res.status(401).send("more users not available");

            const currentPageUsers = allUsers.slice(currentUseridx, currentUseridx + limit);
            // console.log(currentPageUsers);

            res.status(200).send(currentPageUsers);
        } catch (e) {
            console.log(e);
            return res.status(400).send("Internal server error");
        }
    }
}

export const deleteUser = {
    validator: async (req, res, next) => {
        if (req.currUser._id.toString() !== req.params.id) {
            return res.status(400).send("You are not authenticated to delete this user");
        }
        next()
    },
    controller: async (req, res) => {
        try {
            const findRenter = await Agreement.find({ renterid: req.params.id });

            if (findRenter.length > 0) {
                return res.status(400).send("Your products are rented, cannot delete account");
            }

            const findBorrower = await Agreement.find({ borrowerid: req.params.id });

            if (findBorrower.length > 0) {
                return res.status(400).send("You have borrowed products, cannot delete account");
            }

            await Product.deleteMany({ renterid: req.params.id });
            await Review.deleteMany({ renterid: req.params.id });
            await User.findByIdAndDelete(req.params.id);

            return res.status(200).send("Account deletion Successfull");
        } catch (e) {
            console.log(e);
            return res.status(500).send("Account deletion Failed");
        }
    }
}

export const myTools = {
    controller: async (req, res) => {


        try {

            const product = await Product.find({ $or: [{ 'renterid': req.currUser._id }, { 'borrowerid': req.currUser._id }] })
            console.log(product);

            let borrowed = product.filter((prod) => (prod.borrowerid == req.currUser._id))
            let rented = product.filter((prod) => (prod.renterid == req.currUser._id))

            return res.send({
                borrowed, rented
            })
        }
        catch (e) {
            return res.status(500).send(e)
        }

    }
}
