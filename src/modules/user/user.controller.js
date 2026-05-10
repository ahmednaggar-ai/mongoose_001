import { addUser, changeUserData, existsUser, removeUser, retreiveUserById, retrieveUsers } from "./user.service.js";

const getUsersList = async (req, res) => {
  const response = await retrieveUsers();
  res.status(response.success ? 200 : 400).json(response);
};

const getUserById = async(req, res) => {
  let {id} = req.params;
  const response = await retreiveUserById(id);
  res.status(response.success ? 200 : 400).json(response);
};

const createUser = async (req, res) => {
  let {userName, email, password, phone} = req.body;
  const exists = await existsUser(email)
  if(exists){
    return res.status(400).json({
      success: false,
      message: "User already exists",
    })
  }
  const userData = {
    userName,
    email,
    password,
    phone,
  }
  const response = await addUser(userData);
  res.status(response.success ? 200 : 400).json(response);
};

const updateUser = async(req, res) => {
  let {id} = req.params;
  let {userName, email, password, phone} = req.body;
  const userData = {
    userName,
    email,
    password,
    phone,
  }
  const response = await changeUserData(id, userData);
  res.status(response.success ? 200 : 400).json(response);
};

const deleteUser = async (req, res) => {
  let { id } = req.params;
  const response = await removeUser(id);
  res.status(response.success ? 200 : 400).json(response);
};

export {getUsersList, getUserById, createUser, updateUser, deleteUser}