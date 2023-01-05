const User = require('../models/Users')
const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')

const getAllUsers = asyncHandler(async (req, res) => {

    const users = await User.find().select('-password').lean();
    if (!users?.length) {
        return res.status(400).json({ message: 'No users found' });
    }
    res.json(users);

})


const createNewUser = asyncHandler(async (req, res) => {
    const { username, password, roles } = req.body

    if (!username || !password || !roles.length || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate) {
        return res.status(400).json({ message: 'Duplicate username' });
    }

    const hashPwd = await bcrypt.hash(password, 10)
    const userObject = new User({ username, "password": hashPwd, roles });
    console.log('userObject', userObject)
    // Create and store new user 
    const user = await User.create(userObject)

    if (user) { //created 
        res.status(201).json({ message: `New user ${username} created` })
    } else {
        res.status(400).json({ message: 'Invalid user data received' })
    }
})


const updateUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body

    if (!id || !username || !roles.length || !Array.isArray(roles) || typeof active !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existedUser = await User.findById(id).exec()

    if (!existedUser) {
        return res.status(400).json({ message: 'User is not found' });
    }
    const duplicate = await User.findOne({ username }).lean().exec()

    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate username' });
    }
    existedUser.username = username
    existedUser.roles = roles
    existedUser.active = active
    if (password) {
        existedUser.password = await bcrypt.hash(password, 10)
    }
    await existedUser.save()
    res.json({ message: `${username} updated` })
})


const deleteUser = asyncHandler(async (req, res) => {
    const { id, username, password, roles, active } = req.body
    if (!id) {
        return res.status(400).json({ message: 'UserID is required' });
    }

    const note = await Note.findOne({ user: id }).lean().exec()
    if (note) {
        return res.status(400).json({ message: 'User has assigned notes' });
    }

    const existedUser = await User.findById(id).exec()

    if (!existedUser) {
        return res.status(400).json({ message: 'User is not found' });
    }

    existedUser.deleteOne()
    res.json({ message: `Username: ${username} deleted` })
})

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser
}