require("dotenv").config()
import express from "express"
import viewEngine from "../src/config/viewEngine"
import initWebRoutes from "../src/routes/web"

let app = express()

// Config view engine
viewEngine(app)

// Config json parse
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

initWebRoutes(app)

module.exports = app
