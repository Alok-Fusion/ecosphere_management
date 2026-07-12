import type { Request, Response } from "express";
import { prisma } from '../../prisma';
import { hashPassword } from '../../lib/auth';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, departmentId, password } = req.body;
    if (!name || !email || !password || !role) {
      return res
        .status(400)
        .json({ error: "Name, email, role, and password are required" });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ error: "Email already registered" });

    const passwordHash = hashPassword(password);
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        departmentId: departmentId ? parseInt(departmentId) : null,
      },
      include: { department: true },
    });
    return res.status(201).json(newUser);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create user" });
  }
};
