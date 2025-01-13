import { Router } from 'express';
import InventoryController  from "../controllers/inventory.controller";
import { authenticate, authorizedUser} from "../utils/auth"
import { Roles } from '../utils/constant';

const InventoryRouter = Router();
const inventoryController = new InventoryController()

InventoryRouter.post('/add', authenticate, authorizedUser([Roles.Admin]), inventoryController.createItem);
InventoryRouter.get('/', authenticate, inventoryController.getItems);
InventoryRouter.put('/update/:id', authenticate, authorizedUser([Roles.Admin]), inventoryController.updateItem);
InventoryRouter.delete('/delete/:id', authenticate, authorizedUser([Roles.Admin]), inventoryController.deleteItem);


export default InventoryRouter;