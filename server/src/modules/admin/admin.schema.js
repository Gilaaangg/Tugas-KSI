import { z } from 'zod';

export const reviewContributionSchema = z.object({
  status: z.enum(['UNDER_REVIEW', 'APPROVED', 'REVISION', 'REJECTED']),
  adminNotes: z.string().optional(),
  rejectionReason: z.string().optional(),
}).refine((data) => {
  if (data.status === 'REVISION' && (!data.adminNotes || !data.adminNotes.trim())) {
    return false;
  }
  return true;
}, {
  message: 'Catatan perbaikan wajib diisi ketika meminta revisi.',
  path: ['adminNotes'],
}).refine((data) => {
  if (data.status === 'REJECTED' && (!data.rejectionReason || !data.rejectionReason.trim())) {
    return false;
  }
  return true;
}, {
  message: 'Alasan penolakan wajib diisi ketika menolak kontribusi.',
  path: ['rejectionReason'],
});

export const updateUserRoleSchema = z.object({
  role: z.enum(['USER', 'ADMIN']),
});
