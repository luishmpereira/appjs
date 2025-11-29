import { Request, Response } from 'express';
import prisma from '@/config/database';

export async function getAllContacts(req: Request, res: Response) {
  try {
    const contacts = await prisma.contact.findMany();
    return res.status(200).json(contacts);
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export async function getContactById(req: Request, res: Response) {
  const { id } = req.params;
  const contact = await prisma.contact.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }

  return res.status(200).json(contact);
}
