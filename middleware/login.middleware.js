const postMiddleware = async (req, res, next) => {
  try {
    if (req.body) {
      res.locals = {
        status: 200,
        message: { message: "Post Middleware Call", ...req.body },
      };
      next();
    } else {
      next({
        error: { status: 404, message: { message: "Data Not Found!" } },
      });
    }
  } catch (error) {
    next({
      error: { status: 404, message: { message: "Data Not Found!" } },
    });
  }
};

export { postMiddleware };
