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
	var title = data.issues[2].key;
	var summary = data.issues[2].fields.summary;
	var assignee = data.issues[2].fields.assignee.name;
	var status = data.issues[2].fields.status.name;
	var link = "https://jira.praeses.com/browse/" + title;
	return "```" + title + "\n" + summary + "\n" + assignee + "\n" + link + "\n```";
}

module.exports = new messageCreator();