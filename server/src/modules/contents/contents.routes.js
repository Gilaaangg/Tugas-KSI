import { Router } from 'express';
import { listContents, getDetail, createNewContent, updateExistingContent, removeContent } from './contents.controller.js';
import { createContentSchema, updateContentSchema } from './contents.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';

const router = Router();

router.get('/', listContents);
router.get('/:slugOrId', getDetail);

// Protected Admin CRUD
router.post('/', requireAuth, requireAdmin, validate(createContentSchema), createNewContent);
router.put('/:id', requireAuth, requireAdmin, validate(updateContentSchema), updateExistingContent);
router.delete('/:id', requireAuth, requireAdmin, removeContent);

export default router;
