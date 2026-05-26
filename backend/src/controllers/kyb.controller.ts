import { Request, Response } from "express";

import prisma from "../config/prisma";
import { kybSchema } from "../validators/kyb.validator";

export const getKYB = async (
  req: Request,
  res: Response
) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        userId: req.user!.userId
      },
      include: {
        kybRecords: {
          include: {
            documents: true
          },
          orderBy: {
            submittedAt: "desc"
          }
        }
      }
    });

    return res.json({
      success: true,
      company
    });
  } catch (error: any) {
    console.error("GET KYB ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitKYB = async (
  req: Request,
  res: Response
) => {
  try {
    const validatedData = kybSchema.parse(req.body);
    const files = req.files as Express.Multer.File[] | undefined;

    const company = await prisma.company.findUnique({
      where: {
        userId: req.user!.userId
      }
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found"
      });
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: company.id
      },
      data: {
        addressLine1: validatedData.addressLine1,
        city: validatedData.city,
        postalCode: validatedData.postalCode,
        annualTurnover: validatedData.annualTurnover,
        kybStatus: "PENDING",
        kybRecords: {
          create: {
            status: "PENDING",
            documents: {
              create: (files || []).map((file) => ({
                docType: file.fieldname,
                fileName: file.originalname,
                mimeType: file.mimetype,
                fileSize: file.size,
                cloudinaryUrl: `/uploads/${file.filename}`
              }))
            }
          }
        }
      },
      include: {
        kybRecords: {
          include: {
            documents: true
          },
          orderBy: {
            submittedAt: "desc"
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: "KYB submitted successfully",
      company: updatedCompany
    });
  } catch (error: any) {
    console.error("SUBMIT KYB ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid KYB data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
