import { Router } from "express";
import { logger } from "../config/winston.js";
import { timeCookie } from "../config/constans.js";
import signup from "../controllers/login/signup.js";
import login from "../controllers/login/login.js";

const chatRouter = Router();

chatRouter.get("/", (req, res) => {
  const { url, method } = req;
  if (req.session.email) {
    req.session.count++;

    req.session.cookie.maxAge = timeCookie;
    logger.info(`El método y la ruta son: ${method} ${url}.`);
    res.render("chat", {
      email: req.session.email,
    });
    return;
  }

  res.redirect("/login");
});

chatRouter.get("/login", (req, res) => {
  const { url, method } = req;
  logger.info(`El método y la ruta son: ${method} ${url}`);
  res.render("login");
});

chatRouter.get("/signup", (req, res) => {
  const { url, method } = req;
  logger.info(`El método y la ruta son: ${method} ${url}`);
  res.render("signup");
});

chatRouter.post("/login", async (req, res) => {
  const { url, method } = req;
  const { email, password } = req.body;

  const result = await login(email, password);

  if (!result.success) {
    logger.error(`El método y la ruta son: ${method} ${url}. ${result.error}.`);
    res.status(403).render("loginError", {
      mensaje: result.error,
    });
    return;
  }

  req.session.email = email;
  req.session.count = (req.session.count ?? 0) + 1;

  logger.info(`El método y la ruta son: ${method} ${url}.`);

  res.redirect("/");
});

chatRouter.post("/signup", async (req, res) => {
  const { url, method } = req;
  const { email, password } = req.body;

  const result = await signup(email, password);

  if (!result.success) {
    logger.error(`El método y la ruta son: ${method} ${url}. ${result.error}.`);
    res.status(403).render("loginError", {
      mensaje: result.error,
    });
    return;
  }

  logger.info(`El método y la ruta son: ${method} ${url}.`);

  res.redirect("/login");
});

chatRouter.get("/logout", (req, res) => {
  const { url, method } = req;
  if (req.session.email) {
    const email = req.session.email;
    req.session.destroy(() => {
      res.render("logout", {
        email,
      });
    });

    return;
  }

  logger.info(`El método y la ruta son: ${method} ${url}.`);

  res.redirect("/login");
});

export default chatRouter;
