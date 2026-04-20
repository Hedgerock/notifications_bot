import {Router} from "express";
import {eventsRootFunction, login, mainRootFunction, shutdown, turnUp} from "../controller/appController.js";
import {authMiddleware} from "../middleware/index.js";

export const appRouter = Router();

appRouter.post("/login", login);
appRouter.post("/shutdown", authMiddleware, shutdown);
appRouter.post("/turnup", authMiddleware, turnUp);
appRouter.get("/events", eventsRootFunction);
appRouter.get("/", mainRootFunction);