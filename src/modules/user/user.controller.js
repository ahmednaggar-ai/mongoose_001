import { userModel } from "../../models/user.model.js";
import { getUnknownSchemaKeys, unknownFieldsErrorPayload } from "../../utils/schema-body.js";
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
  const unknownKeys = getUnknownSchemaKeys(req.body, userModel.schema);
  if (unknownKeys.length > 0) {
    return res.status(400).json(unknownFieldsErrorPayload(unknownKeys));
  }
  let {userName, email, password, phone} = req.body;
  const exists = await existsUser(email)
  if(exists){
    return res.status(400).json({
      success: false,
      message: "User already exists",
    })
  }
  const response = await addUser(req.body);
  res.status(response.success ? 200 : 400).json(response);
};

const updateUser = async(req, res) => {
  let {id} = req.params;
  const unknownKeys = getUnknownSchemaKeys(req.body, userModel.schema);
  if (unknownKeys.length > 0) {
    return res.status(400).json(unknownFieldsErrorPayload(unknownKeys));
  }
  const response = await changeUserData(id, req.body);
  res.status(response.success ? 200 : 400).json(response);
};

const deleteUser = async (req, res) => {
  let { id } = req.params;
  const response = await removeUser(id);
  res.status(response.success ? 200 : 400).json(response);
};

export {getUsersList, getUserById, createUser, updateUser, deleteUser}