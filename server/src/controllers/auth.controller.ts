import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import prisma from "../prisma";

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    console.log(
      `🚀🚀 User name : ${name} == email : ${email} == password : ${password}`
    );

    const user = await prisma.user.create({
      data: { name, email, password: hashed },
    });

    const token = generateToken(user.id);
    res.status(201).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    console.log("🔴🔴 Error while Signup ::=> ", err);
    res.status(500).json({ message: "Signup failed", error: err });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user.id);
    res.status(200).json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err });
  }
};
