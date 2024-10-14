import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { TaskStatus, Role } from "../enums/enum";
import {
  CreateTaskAssignInput,
  CreateNotificationInput,
} from "../interfaces/interfaces";
import { connect } from "http2";

const prisma = new PrismaClient();

export const createTaskAssignment = async (
  req: { body: CreateTaskAssignInput },
  res: Response
) => {
  const { createdBy, assignedTo, status, taskId } = req.body;

  try {
    
    const assignedByManager = await prisma.user.findUnique({
      where: { user_id: parseInt( createdBy )},
    });
    console.log("managerID ", createdBy)

    if (
      !assignedByManager ||
      (assignedByManager.role as Role) !== Role.MANAGER
    ) {
      console.error("Only an Manager can assign bugs", assignedByManager);
      return res
        .status(400)
        .json({ Error: "Only an Manager can assign bugs", assignedByManager });
    }

    const newTaskAssignment = await prisma.taskAssigned.create({
      data: {
        task: { connect: { task_id: parseInt(taskId)} },
        createdBy: { connect: { user_id:parseInt( createdBy) } }, 
        assignedTo: { connect: { user_id: parseInt(assignedTo) } },
        status: status as TaskStatus,
      },
    });

    console.log("New Task Assignment created", newTaskAssignment);
    res
      .status(200)
      .json({
        Message: "New Task Assignment created to the user",
        newTaskAssignment,
      });
  } catch (error) {
    console.error("Error creating a Task assignment", error);
    res.status(500).json({ Error: "Error creating a Task assignment", error });
  }
};

  export const getTaskAssigned = async (req: Request, res: Response) => {
     

    try {
        const getAllAsign = await prisma.taskAssigned.findMany();

        console.log("All the bugAssignment are assigned", getAllAsign)
        res.status(200).json({ Message: "All the bugAssignment are assigned", getAllAsign })
    } catch (error) {

        console.error("Error getting a BugAssignment", error)
        res.status(500).json({ Error: "Error getting a BugAssignment", error })
    }

}

export const getSpecificTask = async (req: Request<{ userId: string }>, res: Response) =>{
    const  userId = parseInt(req.params.userId)

    try {
         const findUser = await prisma.user.findUnique({
            where : { user_id : userId},
         })
         if(!findUser || findUser.role !== Role.DEVELOPER){
            console.log(`Only developer can have access to view their tasks`)
            return res.status(400).json({Error: `Only developer can have access to view their tasks`})
         }

         const getUserTask = await prisma.taskAssigned.findMany({
            where: {assignedToId :userId},    
         })
         console.log("All your task has been listed ",getUserTask)
         res.status(200).json({Message : "All your task has been listed ",getUserTask})
    } catch (error) {
        console.error("Error getting a specific task assigned", error)
        res.status(500).json({ Error: "Error getting a task assigned", error })
    }
}

// user can update their status

export const updateStatusByUser = async (
  req: Request<{ userId: string; taskId: string }>,
  res: Response
) => {
  const userId = parseInt(req.params.userId);
  const taskId = parseInt(req.params.taskId);

  const { status } = req.body;

  try {
    const updateByDeveloper = await prisma.user.findUnique({
      where: { user_id: userId },
    });
    if (!updateByDeveloper || updateByDeveloper.role !== Role.DEVELOPER) {
      console.log("Only an Admin can update a Role for the user");
      return res
        .status(400)
        .json({
          Error: "Only an Admin can update a Role for the user",
          updateByDeveloper,
        });
    }
    const updateRole = await prisma.taskAssigned.update({
      where: { taskAssigned_id: taskId },
      data: {
        status: status as TaskStatus,
      },
    });

    console.log("Updated Status by Developer", updateByDeveloper);
    return res
      .status(200)
      .json({ Message: "Updated Status by Developer", updateByDeveloper });
  } catch (error) {
    console.error("Error updating a status", error);
    res.status(500).json({ Error: "Error updating a status", error });
  }
};

export const updateTaskAssignment = async (
  req: Request<{ userId: string; taskId: string }>,
  res: Response
) => {
  const userId = parseInt(req.params.userId);
  const taskId = parseInt(req.params.taskId);
  const { assignedToId, createdById, status } = req.body;

  try {
    const assignedByManager = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (
      !assignedByManager ||
      (assignedByManager.role as Role) !== Role.MANAGER
    ) {
      console.log("Only an MAnager  can update a Task Assignment");
      return res
        .status(400)
        .json({
          Error: "Only an MAnager can update a Task Assignment",
          assignedByManager,
        });
    }

    const updatedBugAssignment = await prisma.taskAssigned.update({
      where: { taskAssigned_id: taskId },
      data: {
        createdById: createdById,
        assignedToId: assignedToId,
        status: status as TaskStatus,
      },
    });

    console.log("Updated Bug Assignment", updatedBugAssignment);
    return res
      .status(200)
      .json({ Message: "Updated Bug Assignment", updatedBugAssignment });
  } catch (error) {
    console.error("Error updating a bug assignment", error);
    res.status(500).json({ Error: "Error updating a bug assignment", error });
  }
};

export const deleteBugAssignment = async (
  req: Request<{ userId: string; taskId: string }>,
  res: Response
) => {
  const userId = parseInt(req.params.userId);
  const taskId = parseInt(req.params.taskId);

  try {
    const assignedByManager = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (
      !assignedByManager ||
      (assignedByManager.role as Role) !== Role.MANAGER
    ) {
      console.log("Only an MAnager  can delete a Task Assignment");
      return res
        .status(400)
        .json({
          Error: "Only an MAnager can delete a Task Assignment",
          assignedByManager,
        });
    }

    const deletedBugAssignment = await prisma.taskAssigned.delete({
      where: { taskAssigned_id: taskId },
    });

    console.log("Deleted Bug Assignment", deletedBugAssignment);
    return res
      .status(200)
      .json({ Message: "Deleted Bug Assignment", deletedBugAssignment });
  } catch (error) {
    console.error("Error deleting a bug assignment", error);
    res.status(500).json({ Error: "Error deleting a bug assignment", error });
  }
};
