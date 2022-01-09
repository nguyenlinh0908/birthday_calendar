const jwt = require("jsonwebtoken");

module.exports = (request, response, next) => {
  const token = request.app.get("token");
  if (token == "") return response.status(401).render("errors/error_404");
  try {
    const verified = jwt.verify(token, process.env.SECRET_KEY);
    response.locals.verified = verified;
    next();
  } catch (err) {
    return response.status(400).render("errors/error_404");
  }
};
