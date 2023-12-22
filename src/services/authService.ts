import APIClient from "./api-client";
import { User } from "./userService";

const authService = new APIClient<User>("auth");

export default authService;