var messageCreator = function () {};

messageCreator.prototype.getData = function() {
	//todo - make api call with parameters here.
	//This should probably be called by other methods in this class
}

messageCreator.prototype.whereAreMyTickets = function(name, data) {
	
	//todo: foreach
	
	//todo: get json object via getData function
	//data = getData(parameters);
	
	console.log(data.issues[2].key);
	var title = data.issues[2].key;
	var summary = data.issues[2].fields.summary;
	var assignee = data.issues[2].fields.assignee.name;
	var status = data.issues[2].fields.status.name;
	var link = "https://jira.praeses.com/browse/" + title;
	return "```" + title + "\n" + summary + "\n" + assignee + "\n" + link + "\n```";
}

module.exports = new messageCreator();