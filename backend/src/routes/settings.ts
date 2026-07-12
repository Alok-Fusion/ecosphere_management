import { Router } from 'express';
import { prisma } from '../prisma';
import type { Response } from 'express';


const router = Router();



router.patch('/settings', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  const updates = req.body;
  for (const [key, value] of Object.entries(updates)) {
    await prisma.eSGConfig.upsert({
      where: { key },
      update: { value: String(value) },
      create: { key, value: String(value) },
    });
  }
  return res.json({ success: true });
});

export default router;