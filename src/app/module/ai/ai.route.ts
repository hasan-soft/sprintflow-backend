import express from "express";
import { AIController } from "./ai.controller";

const router = express.Router();

router.post("/chat", AIController.getAIChatResponse);
router.post("/search-suggestions", AIController.getSearchSuggestions);

export const AIRoutes = router;
