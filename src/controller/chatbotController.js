require("dotenv").config()
const fetch = require("node-fetch")
const { URL, URLSearchParams } = require("url");
// import fetch from "node-fetch";

const test = (req, res) => {
  return res.send("Hello again")
}


const handleMessage = (sender_psid, receive_message) => {
  console.log("handle message......")

  let response = {}

  if (receive_message.text) {
    response = {
      text: `Your sent message: ${receive_message.text}, Thank you for your message. I appreciate it and will respond as soon as possible.`,
    }
  }

  callSendAPI(sender_psid, response)
}

const callSendAPI = async (sender_psid, res_user) => {
  let request_body = {
    recipient: {
      id: sender_psid,
    },
    message: res_user,
    messaging_type: "RESPONSE"
  }
  // const url = `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`

  let url = new URL(`https://graph.facebook.com/v17.0/me/messages`)
  url.search = new URLSearchParams({
    access_token: process.env.PAGE_ACCESS_TOKEN,
  })

  let response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request_body),
  })

  if (!response.ok) {
    console.warn(
      `Unable to call Send API: ${response.statusText}`,
      await response.json()
    )
  }

  // try {
  //   const request = await axios.post(
  //     `https://graph.facebook.com/v17.0/me/messages?access_token=${process.env.PAGE_ACCESS_TOKEN}`,
  //     request_body,
  //     { headers: { "content-type": "application/json" } }
  //   )
  //   console.log("message sent!! ", request)
  // } catch (err) {
  //   console.error("Unable to send message: ", err)
  // }

  console.log("handle send api......")
}

const handlePostBack = () => {
  console.log("postBack")
}

const getWebHook = (req, res) => {
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

const postWebHook = (req, res) => {
  let body = req.body

  console.log(`\u{1F7EA} Received webhook:`)
  console.dir(body, { depth: null })

  // Check if this is an event from a page subscription
  if (body.object === "page") {
    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED")

    body.entry.forEach(async function (entry) {
      // let webhook_event = entry.messaging[0]
      // console.log(webhook_event)

      // Iterate over webhook events - there may be multiple
      entry.messaging.forEach(async function (webhookEvent) {
        let sender_psid = webhookEvent.sender.id
        console.log("Sender ID:", sender_psid)
  
        if (webhookEvent.message) {
          console.log("trigger event......")
          handleMessage(sender_psid, webhookEvent.message)
        } else if (webhookEvent.postback) {
          handlePostBack(sender_psid, webhookEvent.message)
        }
      })

    })
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404)
  }
}


module.exports = {
  test: test,
  getWebHook: getWebHook,
  postWebHook: postWebHook,
}
