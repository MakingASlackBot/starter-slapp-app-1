var messageCreator = function () {}

const request = require('request')

messageCreator.prototype.getData = function(name) {
	//todo - make api call with parameters here.
	
	//var options = {  	
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=label=' + parameters.name,
		//url: 'https://jira.praeses.com/rest/api/2/search?jql=assignee=mstuart',  //alternate URL for testing
		//method: 'GET',
		//headers: {
		//	 'Authorization' : 'Basic am9zY2llbmNlZmFpcnRlc3R1c2VyOm5oRGFnMixlS0Q9Vk0zKlU=',
		//	 'content-type' : 'application/json'
		//}
	 //};
	
	 //request(options, function(err, res, body){		
		//if (err) {
			//console.log(err)
			//return
		//}			
		//console.log(body);
	 //});
}

messageCreator.prototype.whereAreMyTickets = function(name, data) {
	
	//todo: foreach
	
	//todo: get json object via getData function
	//data = getData(name);
	
	console.log(data.issues[2].key);
	var MyTicketArray = [];
	var MyTicketString = '';
	MyTicketString = "hey this is your tickets";
	for(i = 0; i < data.issues.length; i++) {
		console.log(data.issues.length);
		if(data.issues[i].key =! null) {
			var title = data.issues[i].key;
		}
		else {
			var title = "No title";
		}
		if (data.issues[i].fields.summary =! null) {
			var summary = data.issues[i].fields.summary;
		}
		else {
			var summary = "No summary";
		}
		if (data.issues[i].fields.assignee =! null) {
			var assignee = data.issues[i].fields.assignee.name;
		}
		else {
			var assignee = "No assignee";
		}
		if (data.issues[i].fields.status =! null) {
			var status = data.issues[i].fields.status.name;
		}
		else {
			var status = "No status";
		}
		if (title =! "No title"){
			var link = "https://jira.praeses.com/browse/" + title;
		}
		else {
			var link = "https://jira.praeses.com/browse/";
		}
		MyTicketString += "```" + title + "\n" + summary + "\n" + assignee + "\n" + link + "\n``` \n";
		MyTicketArray.push("```" + title + "\n" + summary + "\n" + assignee + "\n" + link + "\n```");
	}
	return MyTicketString;
}

module.exports = new messageCreator();