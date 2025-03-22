import dotenv from "dotenv";
import { prisma } from "../index.js";
dotenv.config();

const loginMiddleware = async (req, res, next) => {
  try {
    const user = await prisma.loginData.findFirst({
      where: {
        username: req.body?.username,
        password: req.body?.password,
      },
    });

    if (user) {
      req.locals = user;

      await prisma.loginData.update({
        where: {
          id: user.id,
        },
        data: {
          loginTime: {
            push: new Date().toLocaleString(),
          },
        },
      });

      next();
    } else {
      next({ error: "User not found or password incorrect" });
    }
  } catch (error) {
    next({ error: error });
  }
};

export { loginMiddleware };
