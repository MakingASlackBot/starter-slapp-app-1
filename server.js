'use strict'

const express = require('express')
const Slapp = require('slapp')
const ConvoStore = require('slapp-convo-beepboop')
const Context = require('slapp-context-beepboop')
const request = require('request')
var messageCreator = require('./messageCreator');

const options = {  
    url: 'https://jira.praeses.com/rest/api/2/search?jql=assignee=mstuart',
    method: 'GET',
    headers: {
        'Authorization' : 'Basic am9zY2llbmNlZmFpcnRlc3R1c2VyOm5oRGFnMixlS0Q9Vk0zKlU=',
		'content-type' : 'application/json'
    }
};

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
\`hi\` - to demonstrate a conversation that tracks state.
\`thanks\` - to demonstrate a simple response.
\`<type-any-other-text>\` - to demonstrate a random emoticon response, some of the time :wink:.
\`attachment\` - to see a Slack attachment message.
`

// function testjira()
// {
	// console.log("this function fires");

	// request(options, function(err, res, body){
		// console.log("inside jira")
			// if (err) {
				// console.log(err)
				// return
			// }
			// console.log('headers', res.headers)
			// console.log('status code', res.statuscode)
			// //var json = json.parse(body);
			// console.log(body);
	// });
// }


// var jiraobject = testjira();

var fakeData = getFakeData();
var fakeMessage = getMessages();

function getFakeData() { 
	var obj = require('./json/fake-data.json');
	return obj;
}

//*********************************************
// Setup different handlers for messages
//*********************************************

slapp.message('Where are my tickets?', ['direct_message'], (msg) => {	
	msg.say(messageCreator.whereAreMyTickets("name here", fakeData))
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
