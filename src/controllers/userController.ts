import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { Role } from "../enums/enum";
import argon2 from "argon2";
import { CreateUserInput } from "../interfaces/interfaces";

const prisma = new PrismaClient();

export const createUser = async (
  req: { body: CreateUserInput },
  res: Response
) => {
  const { username, email, password, role } = req.body;

  try {
    // const saltRounds = 10;
    const hashedPassword = await argon2.hash(password);
    console.log(hashedPassword);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role as Role,
      },
    });
    console.log("New user has been created ", newUser);
    res.status(200).json({ Message: 'New user has been created ' , newUser});
  } catch (error) {
    console.error("Error creating a user", error);
    res.status(500).json({ message: "Error creating a user", error });
  }
};



export const getAllUser = async (req: Request, res: Response) => {
  try {
    const getUser = await prisma.user.findMany();
    res.status(201).json({ Message: "All the users are listed", getUser });
    console.log("All the users are listed", getUser);
  } catch (error) {
    console.error("Error getting all user", error);
    res.status(500).json({ error: "Error getting a user" });
  }
};

// update the user role by admin


export const upateRoleByadmin = async (
  req: Request<{ adminId: string }>,
  res: Response
) => {
  const adminId = parseInt(req.params.adminId);
  const { targetId, role } = req.body;

  try {
    const updateByAdmin = await prisma.user.findUnique({
      where: { user_id: adminId },
    });
    if (!updateByAdmin || updateByAdmin.role !== Role.ADMIN) {
      console.log("Only an Admin can update a Role for the user");
      return res
        .status(400)
        .json({
          Error: "Only an Admin can update a Role for the user",
          updateByAdmin,
        });
    }
    const updateRole = await prisma.user.update({
      where: { user_id: parseInt(targetId) },
      data: {
        role: role as Role,
      },
    });

    console.log("Updated Role by Admin", updateRole);
    return res
      .status(200)
      .json({ Message: "Updated Role by Admin", updateRole });
  } catch (error) {
    console.error("Error updating a Role by admin", error);
    res.status(500).json({ Error: "Error updating a Role by admin", error });
  }
};



export const updateUser = async (
  req: Request<{ userId: string }>,
  res: Response
) => {
  const { userId } = req.params;

  const { username, email, password } = req.body;

  try {
    const updateUser = await prisma.user.update({
      where: { user_id: parseInt(userId) },
      data: { username, email, password },
    });
    console.log("Updated the user with the details", updateUser);
    res
      .status(200)
      .json({
        Message: "Updated the user with the details " ,updateUser,
      });
  } catch (error) {
    console.error("Error updating a bug", error);
    res.status(500).json({ Error: "Error updating a bug", error });
  }
};



export const deleteUser = async (
  req: Request<{ adminId: string }>,
  res: Response
) => {
  const adminId = parseInt(req.params.adminId);
  const { targetUserId } = req.body;
  console.log(`Deleting the user with userId ${adminId}`);
  try {
    const deleteByAdmin = await prisma.user.findUnique({
      where: { user_id: adminId },
    });
    if (!deleteByAdmin || deleteByAdmin.role !== Role.ADMIN) {
      console.log("Only an Admin can delete the user",deleteByAdmin);
      return res
        .status(400)
        .json({ Error: "Only an Admin can delete the user", deleteByAdmin });
    }
    if (!targetUserId) {
      return res
        .status(400)
        .json({ Error: "No target user ID provided for deletion" });
    }

    const targetUser = await prisma.user.findUnique({
      where: { user_id: targetUserId },
    });

    if (!targetUser) {
      return res.status(404).json({ Error: "User to be deleted not found" });
    }
    const deleteUser = await prisma.user.delete({
      where: { user_id: parseInt(targetUserId) },
    });
    console.log("Deleted user", deleteUser);
    res.status(200).json({ Message: "Deleted user ", deleteUser });
  } catch (error) {
    const errorMessage = (error as Error).message;
    console.error("Error deleting the user", errorMessage);
    res.status(500).json({ error: "Error deleting the user" });
  }
};
