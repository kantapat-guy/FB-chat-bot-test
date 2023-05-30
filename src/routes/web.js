import express from "express"
import chatbotController from "../controller/chatbotController"

let router = express.Router()

let initWebRoutes = (app) => {
  router.get("/", chatbotController.test)
  
  router.get("/webhook", chatbotController.getWebHook)
  
  router.post("/webhook", chatbotController.postWebHook)
  

  return app.use("/", router)
}

module.exports = initWebRoutes
