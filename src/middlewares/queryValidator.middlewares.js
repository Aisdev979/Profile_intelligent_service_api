export const validateProfileQuery = (req, res, next) => {
  const { min_age, max_age, page, limit } = req.query;

  const numberFields = ["min_age", "max_age", "page", "limit"];

  for (let field of numberFields) {
    if (req.query[field] !== undefined) {
      if (isNaN(Number(req.query[field]))) {
        return res.status(422).json({
          status: "error",
          message: "Invalid query parameters",
        });
      }
    }
  }

  next();
};
