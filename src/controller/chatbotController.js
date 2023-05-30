import axios from "axios"

require("dotenv").config()

let test = (req, res) => {
  return res.send("Hello again")
}

let getWebHook = (req, res) => {
  // Parse the query params
  let mode = req.query["hub.mode"]
  let token = req.query["hub.verify_token"]
  let challenge = req.query["hub.challenge"]

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === process.env.MY_VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED")
      res.status(200).send(challenge)
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403)
    }
  }
}

let postWebHook = (req, res) => {
  let body = req.body

  // Check if this is an event from a page subscription
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      let webhook_event = entry.messaging[0]
      console.log(webhook_event)

      let sender_psid = webhook_event.sender.id
      console.log("Sender ID:", sender_psid)

      if (webhook_event.message) {
        handleMessage(sender_psid, webhook_event.message)
      } else if (webhook_event.postback) {
        handlePostBack(sender_psid, webhook_event.message)
      }
    })

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED")
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
}

const callSendAPI = (sender_psid, response) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: response,
  }

  axios
    .post(
      `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
      request_body
    )
    .then((res) => {
      console.log("message sent!!")
    })
    .catch((err) => {
      console.error("Unable to send message: ", err)
    })
}

const handleMessage = (sender_psid, receive_message) => {
  let response

  if (receive_message.text) {
    response = {
      text: `Your sent message: ${receive_message}`,
    }
  }

  callSendAPI(sender_psid, response)
}

const handlePostBack = () => {
  console.log("postBack")
}

module.exports = {
  test: test,
  getWebHook: getWebHook,
  postWebHook: postWebHook,
}
