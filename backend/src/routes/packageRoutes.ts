import { Router } from 'express';
import { 
  getPackages, 
  getPackageById, 
  createPackage, 
  updatePackage, 
  deletePackage 
} from '../controllers/packageController.ts';
import { authenticateToken, isAdmin } from '../middlewares/authMiddleware.ts';

const router = Router();

// Public routes
router.get('/', getPackages);
router.get('/:id', getPackageById);

// Protected Admin routes
router.post('/', authenticateToken, isAdmin, createPackage);
router.put('/:id', authenticateToken, isAdmin, updatePackage);
router.delete('/:id', authenticateToken, isAdmin, deletePackage);

export default router;
