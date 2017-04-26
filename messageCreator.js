var messageCreator = function () {}

const request = require('request')

function getData(name) {
	//todo - make api call with parameters here.
	
	var options = {  	
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=label=' + name,
		url: 'https://jira.praeses.com/rest/api/2/search?jql=labels%20%3D%20' + name + '%20and%20status%20%3D%20"In%20Dev',
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=assignee=mstuart',  //alternate URL for testing
		method: 'GET',
		headers: {
			 'Authorization' : 'Basic am9zY2llbmNlZmFpcnRlc3R1c2VyOm5oRGFnMixlS0Q9Vk0zKlU=',
			 'content-type' : 'application/json'
		}
	 };
	
	 request(options, function(err, res, body){		
		if (err) {
			console.log(err)
			return
		}			
		//console.log(body);
		return body;
	 });
}

messageCreator.prototype.whereAreMyTickets = function(name) {
	
	//todo: foreach
	
	//todo: get json object via getData function
	var data = getData(name);
	
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
			var assignee = data.issues[i].fields.assignee.name;
		}
		else {
			var assignee = "No assignee";
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
		MyTicketString += "```" + title + " - " + summary + "\n" + status  + "\n" + assignee + "\n" + link + "\n``` \n";
		MyTicketArray.push(" ```" + title + " - " + summary + "\n" + status  + "\n" + assignee + "\n" + link + "\n``` \n ");
	}
	return MyTicketString;
}

module.exports = new messageCreator();