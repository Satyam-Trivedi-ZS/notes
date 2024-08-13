import { Router } from 'express';
import collectionController from "../controller/collectionController";
const router = Router();

router.post('/add', collectionController.addCollection);
router.post('/getById', collectionController.getById);
router.post('/getByParentId', collectionController.getByParent);
router.post('/getAllByParentId', collectionController.getAllByParent);

export default router;