import { Router } from 'express';
import { ClientController } from '../controllers/clientController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// GET /clients/:dni - Consultar cliente por DNI
router.get('/:dni', ClientController.getByDNI);

// GET /clients - Listar todos los clientes
router.get('/', ClientController.getAll);

// POST /clients - Crear nuevo cliente
router.post('/', ClientController.create);

export default router;
