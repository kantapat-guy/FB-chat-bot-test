require("dotenv").config()
import app from "../api/index"

let port = process.env.PORT || 8080

const connect = () => {
  app.listen(port, () => {
    console.log(`App listening on port: ${port}`)
  })
}

connect()
