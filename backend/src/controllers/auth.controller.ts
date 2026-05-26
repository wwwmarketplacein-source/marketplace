import { Request, Response } from "express";
import bcrypt from "bcrypt";

import prisma from "../config/prisma";
import {
  loginSchema,
  registerSchema
} from "../validators/auth.validator";
import { generateAccessToken } from "../utils/jwt";

export const register = async (
  req: Request,
  res: Response
) => {
  try {

    const validatedData =
      registerSchema.parse(req.body);

    const existingUser =
      await prisma.user.findUnique({
        where: {
          email: validatedData.email
        }
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        validatedData.password,
        10
      );

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        role: validatedData.role,

        company: {
          create: {
            legalName: validatedData.companyName,
            tradingName: validatedData.tradingName || null,

            registrationNumber:
              validatedData.registrationNumber || `TEMP-${Date.now()}`,

            businessType: validatedData.businessType || "PRIVATE",

            industry: validatedData.industry || "Technology",

            addressLine1: "Pending",
            city: validatedData.country || "Pending",
            postalCode: "000000",

            companyEmail:
              validatedData.email,

            phoneNumber1: "Pending",
            websiteUrl: validatedData.websiteUrl || null
          }
        }
      }
    });

    const token =
      generateAccessToken({
        userId: user.id,
        role: user.role
      });

    return res.status(201).json({
      success: true,
      message: "Registration successful",

      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });

  } catch (error: any) {

    console.error("REGISTER ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid registration data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const login = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: validatedData.email
      }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!passwordMatches) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateAccessToken({
      userId: user.id,
      role: user.role
    });

    return res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error: any) {
    console.error("LOGIN ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid login data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
