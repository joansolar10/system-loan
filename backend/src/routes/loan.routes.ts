import { Router } from 'express';
import { LoanController } from '../controllers/loanController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// POST /loans - Crear nuevo préstamo
router.post('/', LoanController.create);

// GET /loans - Listar todos los préstamos
router.get('/', LoanController.getAll);

// GET /loans/:id - Obtener préstamo por ID
router.get('/:id', LoanController.getById);

// GET /loans/:id/payments - Obtener cronograma de pagos
router.get('/:id/payments', LoanController.getPayments);

// GET /loans/:id/ddjj - Generar PDF de declaración jurada
router.get('/:id/ddjj', LoanController.generateDDJJ);

export default router;
