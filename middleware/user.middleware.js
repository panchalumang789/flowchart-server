import dotenv from "dotenv";
import { prisma } from "../lib/index.js";
dotenv.config();

const getUsersMiddleware = async (req, res, next) => {
  try {
    const users = await prisma.flowchartData.findMany();
    req.locals = Object.values(users);
    next();
  } catch (error) {
    next({ error: error });
  }
};

const getUserMiddleware = async (req, res, next) => {
  try {
    const data = await prisma.flowchartData.findUnique({
      where: {
        id: parseInt(req.params?.id),
      },
      select: {
        id: true,
        name: true,
        connection_text: true,
        successors: true,
        guj_name: true,
      },
    });

    if (data) {
      req.locals = data;
      next();
    } else {
      next({ error: "Record not found" });
    }
  } catch (error) {
    next({ error: error });
  }
};

const createMultipleUserMiddleware = async (req, res, next) => {
  try {
    const data = await prisma.flowchartData.createMany({
      data: [...req.body],
    });

    if (data) {
      req.locals = data;
      next();
    } else {
      next({ error: "Failed to create records" });
    }
  } catch (error) {
    next({ error: error });
  }
};

const createUserMiddleware = async (req, res, next) => {
  try {
    if (req.body?.transferChilds) {
      const predecessorData = await prisma.flowchartData.findUnique({
        where: { id: parseInt(req.body?.predecessor) },
        select: { successors: true },
      });

      const data = await prisma.flowchartData.create({
        data: {
          name: req.body?.name,
          guj_name: req.body?.guj_name,
          successors: predecessorData.successors,
        },
      });

      await prisma.flowchartData.update({
        where: { id: parseInt(req.body?.predecessor) },
        data: { successors: [data.id] },
      });

      req.locals = data;
      next();
    } else {
      const data = await prisma.flowchartData.create({
        data: {
          name: req.body?.name,
          guj_name: req.body?.guj_name,
          successors: req.body?.successors,
        },
      });

      const predecessorData = await prisma.flowchartData.findUnique({
        where: { id: parseInt(req.body?.predecessor) },
        select: { successors: true },
      });

      await prisma.flowchartData.update({
        where: { id: parseInt(req.body?.predecessor) },
        data: {
          successors: [...predecessorData.successors, data.id],
        },
      });

      req.locals = data;
      next();
    }
  } catch (error) {
    next({ error: error });
  }
};

const updateUserMiddleware = async (req, res, next) => {
  try {
    const data = await prisma.flowchartData.update({
      where: { id: parseInt(req.params?.id) },
      data: {
        name: req.body?.name,
        guj_name: req.body?.guj_name,
      },
    });

    if (data) {
      req.locals = data;
      next();
    } else {
      next({ error: "Failed to update record" });
    }
  } catch (error) {
    next({ error: error });
  }
};

const deleteUserMiddleware = async (req, res, next) => {
  try {
    // Get the node to be deleted
    const deleteNode = await prisma.flowchartData.findUnique({
      where: { id: parseInt(req.params?.id) },
      select: { successors: true },
    });

    if (!deleteNode) {
      return next({ error: "Node to delete not found" });
    }

    // Find predecessor node
    const predecessorData = await prisma.flowchartData.findFirst({
      where: {
        successors: {
          has: parseInt(req.params?.id),
        },
      },
    });

    if (!predecessorData) {
      return next({ error: "Predecessor not found" });
    }

    // Update predecessor's successors
    const updatedPredecessorSuccessors = predecessorData.successors.filter(
      (child) => +child !== +req.params?.id
    );

    await prisma.flowchartData.update({
      where: { id: predecessorData.id },
      data: {
        successors: [...updatedPredecessorSuccessors, ...deleteNode.successors],
      },
    });

    // Delete the node
    await prisma.flowchartData.delete({
      where: { id: parseInt(req.params?.id) },
    });

    next();
  } catch (error) {
    next({ error: error });
  }
};

export {
  createMultipleUserMiddleware,
  createUserMiddleware,
  deleteUserMiddleware,
  getUserMiddleware,
  getUsersMiddleware,
  updateUserMiddleware,
};
