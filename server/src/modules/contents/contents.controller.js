import { findContents, findContentBySlugOrId, createContent, updateContent, deleteContent } from './contents.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiError } from '../../utils/apiError.js';

export const listContents = asyncHandler(async (req, res) => {
  const result = await findContents(req.query);
  res.json(result);
});

export const getDetail = asyncHandler(async (req, res) => {
  const { slugOrId } = req.params;
  const result = await findContentBySlugOrId(slugOrId);
  if (!result) {
    throw new ApiError(404, 'Konten museum tidak ditemukan');
  }
  res.json({ data: result });
});

export const createNewContent = asyncHandler(async (req, res) => {
  const content = await createContent(req.body, req.user.id);
  res.status(201).json({ message: 'Konten berhasil dibuat', data: content });
});

export const updateExistingContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const content = await updateContent(id, req.body);
  res.json({ message: 'Konten berhasil diperbarui', data: content });
});

export const removeContent = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await deleteContent(id);
  res.json({ message: 'Konten berhasil dihapus' });
});
