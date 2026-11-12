import { createContribution, getUserContributions, getContributionById, updateContribution } from './contributions.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';

export const submitContribution = asyncHandler(async (req, res) => {
  const contribution = await createContribution(req.user.id, req.body);
  res.status(201).json({
    message: contribution.status === 'DRAFT' ? 'Draft kontribusi berhasil disimpan' : 'Kontribusi berhasil dikirim dan menunggu verifikasi Kurator',
    data: contribution,
  });
});

export const getMyContributions = asyncHandler(async (req, res) => {
  const list = await getUserContributions(req.user.id);
  res.json({ data: list });
});

export const getContributionDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const item = await getContributionById(id, req.user.id, req.user.role);
  res.json({ data: item });
});

export const updateMyContribution = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updated = await updateContribution(id, req.user.id, req.body);
  res.json({
    message: updated.status === 'SUBMITTED' ? 'Kontribusi berhasil dikirim ulang untuk kurasi' : 'Kontribusi berhasil diperbarui',
    data: updated,
  });
});
