import express, { Request, Response } from "express";
import { Role } from "../enums/enum";
import { PrismaClient } from "@prisma/client";
import { CreateTaskInput } from "../interfaces/interfaces";

const prisma = new PrismaClient();

export const createTask = async (req: Request< CreateTaskInput >,res: Response) => {
  const { title, description, due_date, userId } = req.body;

  try {
    const createByManager = await prisma.user.findUnique({
      where: { user_id: parseInt( userId) },
    });
    console.log(createByManager);
    if (!createByManager || (createByManager.role as Role) !== Role.MANAGER) {
      console.error("Only a manager can create a task", createByManager);
      return res.status(400).json({ Error: "Only a manager can create a task", createByManager });
    }
    const newTask = await prisma.task.create({
      data: { title, description, due_date, 
        user: { connect: { user_id: parseInt( userId)} },
       },
    });
    console.log("New Task created", newTask);
    res.status(200).json({ Message: "New Task created", newTask });
  } catch (error) {
    console.error("Error creating a Task", error);
    res.status(500).json({ Error: "Error creating a Task", error });
  }
};

export const getAllTask = async (req: Request, res: Response) => {
  try {
    const getBugs = await prisma.task.findMany();
    console.log("All the tasks are listed", getBugs);
    res.status(200).json({ Message: "All the tasks are listed", getBugs });
  } catch (error) {
    console.error("Error getting task", error);
    res.status(500).json({ Error: "Error getting task", error });
  }
};

export const updateTask = async ( req: Request<{ userId: string; taskId: string }>,res: Response) => {
  const userId = parseInt(req.params.userId);
  const taskId = parseInt(req.params.taskId);
  const { title, description, due_date } = req.body;

  try {
    const updateByUser = await prisma.user.findUnique({
      where: { user_id: userId },
    });

    if (!updateByUser ||(updateByUser.role !== Role.MANAGER && updateByUser.role !== Role.ADMIN)
    ) {
      console.log("Only a Tester or Admin can update a Task");
      return res
        .status(400)
        .json({
          Error: "Only a Tester or Admin can update a Task",
          updateByUser,
        });
    }

    const updateTaskList = await prisma.task.update({
      where: { task_id: taskId },
      data: { title, description, due_date },
    });
    console.log("Updated Task", updateTaskList);
    return res.status(200).json({ Message: "Updated Task", updateTaskList });
  } catch (error) {
    console.error("Error updating a Task", error);
    res.status(500).json({ Error: "Error updating a Task", error });
  }
};


export const deleteTask = async (req: Request<{userId:string; taskId:string}>, res: Response) => {
    const userId = parseInt(req.params.userId);
    const taskId = parseInt(req.params.taskId);
  
    try {
      const deleteByUser = await prisma.user.findUnique({ where: { user_id: userId } });

      if (!deleteByUser || (deleteByUser.role !== Role.MANAGER && deleteByUser.role !== Role.ADMIN)) {

        console.log("Only a Tester or Admin can delete a Task");
        return res.status(400).json({ Error: "Only a Tester or Admin can delete a Task", deleteByUser });
      }
      const deletingBug = await prisma.task.delete({
        where: { task_id: taskId },
      });
      console.log("Deleted the Task", deletingBug);
      return res.status(200).json({ Message: "Deleted the Task", deletingBug });
  
    } catch (error) {
      console.error("Error deleting a Task", error);
      res.status(500).json({ Error: "Error deleting a Task", error });
    }
  }