import { Request, Response } from "express";

import prisma from "../config/prisma";

export const getDashboard = async (
  req: Request,
  res: Response
) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: req.user!.userId
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        company: true,
        kycRecord: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const [publishedProjects, myProjects, activeBids] = await Promise.all([
      prisma.project.count({
        where: {
          status: "PUBLISHED"
        }
      }),
      prisma.project.count({
        where: {
          buyerId: req.user!.userId
        }
      }),
      prisma.bid.count({
        where: {
          vendorId: req.user!.userId
        }
      })
    ]);

    return res.json({
      success: true,
      user,
      stats: {
        publishedProjects,
        myProjects,
        activeBids,
        profileViews: activeBids * 17 + 12,
        savedProjects: Math.min(publishedProjects, 8)
      }
    });
  } catch (error: any) {
    console.error("DASHBOARD ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
