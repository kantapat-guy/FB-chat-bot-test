require("dotenv").config()
import express from 'express'
import viewEngine from './config/viewEngine'
import initWebRoutes from './routes/web'

let app = express()

// Config view engine
viewEngine(app)


// Config json parse
app.use(express.json())
app.use(express.urlencoded({extended: true}))

initWebRoutes(app)

let port = process.env.PORT || 8080

app.listen(port, () => {
    console.log(`App listening on port: ${port}`);
})
