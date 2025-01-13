import { Router } from 'express';
import {UserController}  from "../controllers/user.controller";
import { authenticate, authorizedUser} from "../utils/auth"
import { Roles } from '../utils/constant';

const UserRouter = Router();
const userController = new UserController()

UserRouter.get('/', authenticate, userController.GetUsers);
UserRouter.get('/:id', authenticate, userController.GetOneUser)
UserRouter.put('/:id', authenticate, userController.UpdateUser)
UserRouter.delete('/:id', authenticate, authorizedUser([Roles.Admin]), userController.DeleteUser)


export default UserRouter;