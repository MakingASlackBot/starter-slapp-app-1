var messageCreator = function () {}

const request = require('request')

messageCreator.prototype.getData = function(name, functionName) {
	//todo - make api call with parameters here.
	
	var options = {  	
		//url: https://jira.praeses.com/rest/api/2/search?jql=labels%20in%20(heather.rc%2C%20heather.uat%2C%20heather.qa)
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=label=' + name,
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=labels%20%3D%20heather%20and%20status%20%3D%20"In%20Dev"',
		url: 'https://jira.praeses.com/rest/api/2/search?jql=assignee=mstuart',  //alternate URL for testing
		method: 'GET',
		headers: {
			 'Authorization' : 'Basic am9zY2llbmNlZmFpcnRlc3R1c2VyOm5oRGFnMixlS0Q9Vk0zKlU=',
			 'content-type' : 'application/json'
		}
	 };

	 function callback(err, res, body){
		if (!err && res.statusCode == 200){
			console.log("log 1: " + body);
			var stringToReturn = TicketFormat(body);			
			console.log(stringToReturn);
			functionName(stringToReturn);
		}
	 }
	
	 request(options, callback);
}

function testFun(body){
	console.log("log 2: " + body);
	return "lol";
}

function TicketFormat(data) {
	
	//todo: foreach	
	//todo: get json object via getData function				
	console.log("Log 3: " + data.issues);
	return;

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