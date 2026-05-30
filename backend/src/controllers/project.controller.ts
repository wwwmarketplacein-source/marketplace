import { Request, Response } from "express";

import prisma from "../config/prisma";
import {
  bidSchema,
  projectSchema
} from "../validators/project.validator";

const splitSkills = (skills?: string[] | string) => {
  if (Array.isArray(skills)) {
    return skills.filter(Boolean);
  }

  return (skills || "")
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
};

const serializeSkills = (skills?: string[] | string) => {
  return splitSkills(skills).join(",");
};

const storageSkills = (skills?: string[] | string) => {
  const parsedSkills = splitSkills(skills);
  return (process.env.NODE_ENV === "production"
    ? parsedSkills
    : parsedSkills.join(",")) as any;
};

const formatProject = <T extends { skills: string[] | string }>(project: T) => ({
  ...project,
  skills: Array.isArray(project.skills)
    ? project.skills
    : splitSkills(project.skills)
});

export const listProjects = async (
  req: Request,
  res: Response
) => {
  try {
    const mine = req.query.mine === "true";

    const projects = await prisma.project.findMany({
      where: {
        ...(mine
          ? { buyerId: req.user!.userId }
          : { status: "PUBLISHED" as const })
      },
      include: {
        buyer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            company: {
              select: {
                legalName: true,
                kybStatus: true
              }
            }
          }
        },
        bids: {
          select: {
            id: true,
            amount: true,
            status: true,
            vendorId: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return res.json({
      success: true,
      projects: projects.map(formatProject)
    });
  } catch (error: any) {
    console.error("LIST PROJECTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const createProject = async (
  req: Request,
  res: Response
) => {
  try {
    if (req.user!.role !== "BUYER" && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only project providers can publish projects"
      });
    }

    const validatedData = projectSchema.parse(req.body);

    if (validatedData.maxBudget < validatedData.minBudget) {
      return res.status(400).json({
        success: false,
        message: "Maximum budget must be greater than minimum budget"
      });
    }

    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        category: validatedData.category,
        description: validatedData.description,
        requirements: validatedData.requirements || null,
        minBudget: validatedData.minBudget,
        maxBudget: validatedData.maxBudget,
        deadline: validatedData.deadline,
        ndaRequired: validatedData.ndaRequired,
        skills: storageSkills(validatedData.skills),
        buyerId: req.user!.userId
      }
    });

    return res.status(201).json({
      success: true,
      message: "Project published successfully",
      project: formatProject(project)
    });
  } catch (error: any) {
    console.error("CREATE PROJECT ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid project data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const submitBid = async (
  req: Request,
  res: Response
) => {
  try {
    if (req.user!.role !== "VENDOR" && req.user!.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Only service providers can submit bids"
      });
    }

    const validatedData = bidSchema.parse(req.body);

    const projectId = String(req.params.projectId);

    const project = await prisma.project.findUnique({
      where: {
        id: projectId
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const bid = await prisma.bid.create({
      data: {
        amount: validatedData.amount,
        proposal: validatedData.proposal,
        projectId: project.id,
        vendorId: req.user!.userId
      }
    });

    return res.status(201).json({
      success: true,
      message: "Bid submitted successfully",
      bid
    });
  } catch (error: any) {
    console.error("SUBMIT BID ERROR:", error);

    if (error?.name === "ZodError") {
      return res.status(400).json({
        success: false,
        message: "Invalid bid data",
        errors: error.issues
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
