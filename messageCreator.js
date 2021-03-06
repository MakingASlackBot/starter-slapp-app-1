var messageCreator = function () {}

const request = require('request')

messageCreator.prototype.getData = function(name, functionName, urlString) {	
	var url;
	switch(urlString) {
		case 'whereTickets':
		url = 'https://jira.praeses.com/rest/api/2/search?jql=status%20in%20("In%20Dev"%2C%20"Ready%20for%20Code%20Review"%2C%20"In%20Code%20Review"%2C%20"Ready%20for%20QA"%2C%20"In%20QA"%2C%20"Ready%20for%20UAT"%2C%20"In%20UAT"%2C%20"Ready%20for%20RC"%2C%20"In%20RC")%20AND%20labels%20%3D%20' + name
		break;
		case 'ticketsToTest':
		url = 'https://jira.praeses.com/rest/api/2/search?jql=status%20in%20("Ready%20for%20QA"%2C%20"In%20QA"%2C%20"Ready%20for%20UAT"%2C%20"In%20UAT"%2C%20"Ready%20for%20RC"%2C%20"In%20RC")%20AND%20labels%20in%20(' + name + '.qa%2C%20' + name + '.uat%2C%20' + name + '.rc)'
		break;
	}
	var options = {  			
		url: url,
		method: 'GET',
		headers: {
			 'Authorization' : 'Basic am9zY2llbmNlZmFpcnRlc3R1c2VyOm5oRGFnMixlS0Q9Vk0zKlU=',
			 'content-type' : 'application/json'
		}
	 };

	 function callback(err, res, body){
		if (!err && res.statusCode == 200){
			var stringToReturn = TicketFormat(JSON.parse(body));			
			functionName(stringToReturn);
		}
	 }
	
	 request(options, callback);
}

function TicketFormat(data) {
	var MyTicketArray = [];
	var MyTicketString = '';
	for(i = 0; i < data.issues.length; i++) {
		if(data.issues[i].key != null) {
			var title = data.issues[i].key;
		}
		else {
			var title = "No title";
		}
		if (data.issues[i].fields.summary != null) {
			var summary = data.issues[i].fields.summary;
		}
		else {
			var summary = "No summary";
		}
		if (data.issues[i].fields.assignee != null) {
			var assignee = data.issues[i].fields.assignee.displayName;
			var assigneeEmail = data.issues[i].fields.assignee.emailAddress;
			var assignMessage = assignee + ' mailto:' + assigneeEmail;
		}
		else {
			var assignee = "No assignee";
			var assigneeEmail = ' ';
			var assignMessage = "No Assignee";
		}
		if (data.issues[i].fields.status != null) {
			var status = data.issues[i].fields.status.name;
		}
		else {
			var status = "No status";
		}
		if (title != "No title"){
			var link = "https://jira.praeses.com/browse/" + title;
		}
		else {
			var link = "https://jira.praeses.com/browse/";
		}
		MyTicketString += "```" + title + " - " + summary + "\n" + status  + "\n" + assignMessage + "\n" + link + "\n``` \n";
		MyTicketArray.push("```" + title + " - " + summary + "\n" + status  + "\n" + assignMessage + "\n" + link + "\n``` \n");
	}
	if(MyTicketString == '') {
		MyTicketString = 'You have no tickets at this time';
	}
	return MyTicketString;
}

module.exports = new messageCreator();