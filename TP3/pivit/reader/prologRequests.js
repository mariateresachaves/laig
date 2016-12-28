function getPrologRequest(requestString, onSuccess, onError, port)
{
	var requestPort = port || 8081
	var request = new XMLHttpRequest();
	request.open('GET', 'http://localhost:'+requestPort+'/'+requestString, true);
	
	request.onload = onSuccess || function(data){console.log("Request successful. Reply: " + data.target.response);};
	request.onerror = onError || function(){console.log("Error waiting for response");};
	
	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
	request.send();
}
		
//Handle the Reply
function handleReply(data)
{
	var x = data.target.response;
				
	x = x.replace(new RegExp('computer', 'g'), '"computer"');
	x = x.replace(new RegExp('human', 'g'), '"human"');
	x = x.replace(new RegExp(',m,', 'g'), ',"m",');
	x = x.replace(new RegExp(',v', 'g'), ',"v"');
	x = x.replace(new RegExp(',h', 'g'), ',"h"');				
		
	var newArr = JSON.parse(x);
		
	var players = newArr[0];				
	console.log("Players");
	for(i = 0; i < players.length; i++){
		console.log("player " + i + ": " + players[i][0] + ", " + players[i][1]);
	}
				
	var board = newArr[1];				
	console.log("\nBoard");
	for(i = 0; i < board.length; i++){
		for(j = 0; j < board[i].length; j++){
			console.log("x[0]: " + board[i][j]);
		}
	}			
}