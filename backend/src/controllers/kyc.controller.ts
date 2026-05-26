import { Request, Response } from "express";

import prisma from "../config/prisma";
import { kycSchema } from "../validators/kyc.validator";

export const getKYC = async (
  req: Request,
  res: Response
) => {
  try {
    const kycRecord = await prisma.kYCRecord.findUnique({
      where: {
        userId: req.user!.userId
      }
    });

    return res.json({
      success: true,
      kycRecord
    });
  } catch (error: any) {
    console.error("GET KYC ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitKYC = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = kycSchema.parse(req.body);
    const selfie = req.file;

    const kycRecord = await prisma.kYCRecord.upsert({
      where: {
        userId: req.user!.userId
      },
      create: {
        ...validatedData,
        selfieFileName: selfie?.originalname || null,
        selfieUrl: selfie ? `/uploads/${selfie.filename}` : null,
        userId: req.user!.userId
      },
      update: {
        ...validatedData,
        selfieFileName: selfie?.originalname,
        selfieUrl: selfie ? `/uploads/${selfie.filename}` : undefined
      }
    });

    return res.status(201).json({
      success: true,
      message: "KYC submitted successfully",
      kycRecord
    });
  } catch (error: any) {
    console.error("SUBMIT KYC ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid KYC data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
