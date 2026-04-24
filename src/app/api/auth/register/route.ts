import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { slugify } from "@/lib/format";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email já cadastrado" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);
  const slug = slugify(name) + "-" + Math.random().toString(36).slice(2, 6);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hash,
      workspace: {
        create: {
          name,
          slug,
        },
      },
    },
  });

  return NextResponse.json({ id: user.id }, { status: 201 });
}
