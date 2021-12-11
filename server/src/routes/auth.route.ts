/** @format */

//Dependencies
import express, { Router } from 'express';

//internal imports
import { signup, login } from '../controllers/auth.controller';

//create a router instance
const router: Router = express.Router();

/*   /api/v1/signup   */
router.route('/signup').post(signup);
/*   /api/v1/login   */
router.route('/login').post(login);

export default router;
