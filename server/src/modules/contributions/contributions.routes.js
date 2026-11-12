import { Router } from 'express';
import { submitContribution, getMyContributions, getContributionDetail, updateMyContribution } from './contributions.controller.js';
import { createContributionSchema, updateContributionSchema } from './contributions.schema.js';
import { validate } from '../../middleware/validate.js';
import { requireAuth } from '../../middleware/requireAuth.js';
import { submitLimiter } from '../../middleware/rateLimit.js';

const router = Router();

router.use(requireAuth);

router.post('/', submitLimiter, validate(createContributionSchema), submitContribution);
router.get('/me', getMyContributions);
router.get('/my', getMyContributions); // Backward compatibility alias
router.get('/:id', getContributionDetail);
router.put('/:id', validate(updateContributionSchema), updateMyContribution);

export default router;
