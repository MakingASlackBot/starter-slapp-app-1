'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const request = require('request')
var messageCreator = require('./messageCreator');

// use `PORT` env var on Beep Boop - default to 3000 locally
var port = process.env.PORT || 3000

var slapp = Slapp({
  // Beep Boop sets the SLACK_VERIFY_TOKEN env var
  verify_token: process.env.SLACK_VERIFY_TOKEN,
  convo_store: ConvoStore(),
  context: Context()
})


var HELP_TEXT = `
I will respond to the following messages:
\`help\` - to see this message.
\`Where are my Tickets?\` - to see tickets that have a label with your name in it.
\`What am I testing?\` - to see what tickets have your name and are ready for testing.
`


function getUser(userID, msg, callback1){
	
	var callback = function(stringToReturn){
		msg.say(stringToReturn);
	}  
	
	var options = {  			
		url: 'https://slack.com/api/users.info?token=xoxb-173658510769-DkVilQ4Cb94aJY3rgkCyiKJm&user=' + userID,  //U5508DRJS 
		method: 'GET',
	 };

	 function callback0(err, res, body){
		if (!err && res.statusCode == 200){			
			var userObject = JSON.parse(body);
			callback1(userObject.user.profile.first_name, callback);
		}
	 }
	
request(options, callback0);

}

//*********************************************
// Setup different handlers for messages
//*********************************************
// response to the user typing "Where are my tickets?"
slapp.message('Where are my tickets?', ['direct_message'], (msg, text) => {	
  
  var callback1 = function(userName, callback){
	  messageCreator.getData(userName, callback, 'whereTickets')
  }
  
  getUser(msg.body.event.user, msg, callback1);
})

// response to the user typing "What am I testing?"
slapp.message('What am I testing?', ['direct_message'], (msg, text) => {	
  
  var callback1 = function(userName, callback){
	messageCreator.getData(userName, callback, 'ticketsToTest');
  }

  getUser(msg.body.event.user, msg, callback1);
  
})

// response to the user typing "help"
slapp.message('help', ['mention', 'direct_message'], (msg) => {
  msg.say(HELP_TEXT)
})

// "Conversation" flow that tracks state - kicks off when user says hi, hello or hey
slapp
  .message('^(hi|hello|hey)$', ['direct_mention', 'direct_message'], (msg, text) => {		
	msg	  
      .say("you suck")
      // sends next event from user to this route, passing along state
      .route('how-are-you', { greeting: text })
  })

// Can use a regex as well
slapp.message(/^(thanks|thank you)/i, ['mention', 'direct_message'], (msg) => {
  // You can provide a list of responses, and a random one will be chosen
  // You can also include slack emoji in your responses
  msg.say([
    "You're welcome :smile:",
    'You bet',
    ':+1: Of course',
    'Anytime :sun_with_face: :full_moon_with_face:'
  ])
})

// demonstrate returning an attachment...
slapp.message('attachment', ['mention', 'direct_message'], (msg) => {
  msg.say({
    text: 'Check out this amazing attachment! :confetti_ball: ',
    attachments: [{
      text: 'Slapp is a robust open source library that sits on top of the Slack APIs',
      title: 'Slapp Library - Open Source',
      image_url: 'https://storage.googleapis.com/beepboophq/_assets/bot-1.22f6fb.png',
      title_link: 'https://beepboophq.com/',
      color: '#7CD197'
    }]
  })
})

// Catch-all for any other responses not handled above
slapp.message('.*', ['direct_mention', 'direct_message'], (msg) => {
  // respond only 40% of the time
  if (Math.random() < 0.4) {
    msg.say([':wave:', ':pray:', ':raised_hands:'])
  }
})

// attach Slapp to express server
var server = slapp.attachToExpress(express())

// start http server
server.listen(port, (err) => {
  if (err) {
    return console.error(err)
  }

  console.log(`Listening on port ${port}`)
})
