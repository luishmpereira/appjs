import { Request, Response } from 'express';
import prisma from '@/config/database';
import { subject } from "@casl/ability";
import { User } from '@/lib/prisma/client';

export async function getAllContacts(req: Request, res: Response) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const contacts = await prisma.contact.findMany({
      orderBy: { id: "asc" },
      take: limit,
      skip: offset,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    const total = await prisma.contact.count();

    return res.status(200).json({
      data: contacts,
      meta: {
        total,
        page,
        last_page: Math.ceil(total / limit),
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function getContactById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    return res.status(200).json(contact);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function createContact(req: Request, res: Response) {
  try {
    const { name, email, phone, sellerId } = req.body;

    const exists = await prisma.contact.findFirst({ where: { email } });
    if (exists) {
      return res.status(400).json({ error: "Contact with this email already exists" });
    }

    // Verify if seller exists
    if (sellerId) {
      const seller = await prisma.user.findUnique({ where: { id: Number(sellerId) } });
      if (!seller) {
        return res.status(400).json({ error: "Seller not found" });
      }
    }

    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        sellerId: sellerId ? Number(sellerId) : (req.user as User)?.id
      }
    });

    return res.status(201).json(contact);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function updateContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, phone, sellerId } = req.body;

    const contact = await prisma.contact.findUnique({
      where: { id: Number(id) }
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Check permissions if needed, e.g. using CASL
    // if (req.ability?.cannot("update", subject("Contact", contact))) {
    //   return res.status(403).json({ error: "Forbidden" });
    // }

    if (sellerId) {
      const seller = await prisma.user.findUnique({ where: { id: Number(sellerId) } });
      if (!seller) {
        return res.status(400).json({ error: "Seller not found" });
      }
    }

    const updatedContact = await prisma.contact.update({
      where: { id: Number(id) },
      data: {
        name: name || contact.name,
        email: email || contact.email,
        phone: phone || contact.phone,
        sellerId: sellerId ? Number(sellerId) : contact.sellerId
      }
    });

    return res.json(updatedContact);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function deleteContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const contact = await prisma.contact.findUnique({
      where: { id: Number(id) }
    });

    if (!contact) {
      return res.status(404).json({ error: "Contact not found" });
    }

    // Check permissions
    // if (req.ability?.cannot("delete", subject("Contact", contact))) {
    //   return res.status(403).json({ error: "Forbidden" });
    // }

    await prisma.contact.delete({
      where: { id: Number(id) }
    });

    return res.status(204).send();
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
