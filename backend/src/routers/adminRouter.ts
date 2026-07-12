import { Router } from 'express';
import { createUser } from '../handlers/adminRoutes/createUser';



const adminRouter = Router();

adminRouter.post("/users", createUser)

export default adminRouter;