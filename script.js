//==================== Timer =======================//

    var c=0;
    var t;
    function timedCount()   {
        document.getElementById('txt').value=c;
        c=c+1;
        t=setTimeout("timedCount()", 1000);
    }
    function stopCount()    {
        clearTimeout(t);
    }
    function clearTimer()   {
        document.getElementById('txt').value=0;
        c=0;
    }

//==================== Web Storage =======================//

    for(var i=0, len=localStorage.length; i<len; i++) {
                var key = localStorage.key(i);
                var value = localStorage[key];
                document.getElementById('ranking').innerHTML += '<li>' + value + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;====>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'  + key + '</li><br>';
                }

    var container = document.getElementById("ranking");
    var contents = container.querySelectorAll("li");


//==================== Ranking Order =======================//
    var list = [];
    for(var i=0; i<contents.length; i++){
        list.push(contents[i]);
    }

    list.sort(function(a, b){
	   var aa = parseInt(a.innerHTML);
	   var bb = parseInt(b.innerHTML);
	   return aa < bb ? -1 : (aa > bb ? 1 : 0);
    });

    list.reverse();

    for(var i=0; i<list.length; i++){
	   container.insertBefore(list[i], container.lastChild);
    }

//==================== Login Info =======================//

var called = false;
var username;
var password;
var group = 23;
var game;
var key;
var opponent;
var levelOnline = "";
var j1;
var j2;
var turn_v;
var winner;
var adversario;
var atualizacaoServer;
var adversaire;
var row;
var col;
var orient;
var time_game;
var calledLeave = false;
var or;
var co;
var ro;
function getUserName() {
        username = document.getElementById('user').value;
        password = document.getElementById('pass').value;
        var loginInfo = JSON.stringify({'name': username, 'pass': password});
	    var req = new XMLHttpRequest();
		req.open('post','http://twserver.alunos.dcc.fc.up.pt:8000/register',true);
	    req.setRequestHeader('Content-type','application/json');
	    req.send(loginInfo);
		req.onreadystatechange=function(){
			if(req.readyState != 4){
				return;
			}
			if(req.status != 200) {
				alert(req.status + ": " + req.statusText);
				return;
			}
			var respostaServer = req.responseText;
	        if(respostaServer == "{}"){
	        	var name = document.getElementById('name');
                var playerConnected = document.getElementById('playerConnected');
                name.textContent = username;
                playerConnected.textContent = username;
                document.querySelector('.welcome').classList.remove("hide");
		        document.querySelector('.login').classList.add("hide");
		        document.querySelector('.board').classList.add("marge");
                called = true;
	        }
	        else{
				alert("Error ! Registered user with different password, Try again");
                window.location.reload();
			}
	    }
    }

//==================== Mode Offline =======================//

function startGame(){
            if ( called ) {
            document.querySelector('.player-board').classList.remove("hide");
            document.querySelector('.playground').classList.remove("hide");
            document.querySelector('.game-area').classList.add("hide");
            if(document.getElementById('ofline').checked) {
            if(document.getElementById('2×3').checked) {
                (new GamePlayComputer()).init(3, 2);
            }
            else if(document.getElementById('4×5').checked) {
                (new GamePlayComputer()).init(5, 4);
            }
            else if(document.getElementById('6×8').checked) {
                (new GamePlayComputer()).init(8, 6);
            }
            else{
               (new GamePlayComputer()).init(11, 9); 
            }
            }else if(document.getElementById('online').checked){
                document.querySelector('.player-board').classList.add("hide");
                document.querySelector('.playground').classList.add("hide");
                document.querySelector('.game-area').classList.remove("hide");
                
                if(document.getElementById('2×3').checked) {
                    levelOnline = "beginner";
                }
                else if(document.getElementById('4×5').checked) {
                    levelOnline = "intermediate";
                }
                else if(document.getElementById('6×8').checked) {
                    levelOnline = "advanced";
                }
                else{
                   levelOnline = "expert";
                }
                 startOnline();

            } 
            }
            else{
                alert("You should Login first to start playing");
            }
}

//=====================Leave the game========================//

function leaveGame(){
            var leaveInfo = JSON.stringify({'name': username, 'key': key, 'game': game});
			var req = new XMLHttpRequest();
			req.open('post', 'http://twserver.alunos.dcc.fc.up.pt:8000/leave', true);
			req.setRequestHeader('Content-type','application/json');
			req.send(leaveInfo);
			req.onreadystatechange = function() {
				if (req.readyState != 4){ 
					return;
				}
				if (req.status != 200) { 
					alert(req.status + ": " + req.statusText);
					return; 
				}

				var respostaServer = JSON.parse(req.responseText);
				
				if (respostaServer.hasOwnProperty("error")){ 
					alert("Error: leave"); 
				}
				
				else{
                    document.getElementById('game-area').innerHTML = "Please start the game";
                    document.querySelector('.leave').classList.add("hide");
                    alert("You leaved the session");
                    calledLeave = true;
					
				}
			}
		}
var leaveButton = document.getElementById('leaveGame');
leaveButton.addEventListener('click', leaveGame, true);

//==================== Online Ranking =======================//

var tabName = [];
var tabBoxes = [];
var tabTime = [];

function rankingOnline(level) {
	
	 var rankingInfo = JSON.stringify({"level": level});
		
	 var req = new XMLHttpRequest();

	 req.open('post', 'http://twserver.alunos.dcc.fc.up.pt:8000/ranking', true);

	 req.setRequestHeader('Content-type','application/json');
		
	 req.send(rankingInfo);

	 req.onreadystatechange = function() {
			
	 if(req.readyState != 4){
		return;
	 }
	 if(req.status != 200) {
		alert(req.status + ": " + req.statusText);
		return;
			}

	 var respostaServer = JSON.parse(req.responseText);
			
	 if(respostaServer.hasOwnProperty("error"))
		console.log("Erro: Ranking");
			
	 else{
         var contentScore = "";
         respostaServer = respostaServer.ranking;
         for (var key in respostaServer) {
                var obj = respostaServer[key];
                for (var prop in obj) {
                    if (prop == "name"){
                      contentScore += '<tr><td>' + obj[prop] + '</td>';
                    }
                    if (prop == "boxes"){
                       contentScore += '<td>' + obj[prop] + '</td>';
                    }
                    if (prop == "time"){
                        contentScore += '<td>' + obj[prop] + '</td></tr>';
                    }
                }
        }
         if(level == "beginner"){
         document.getElementById('ranking-beginner').innerHTML += contentScore;
         }
         if(level == "intermediate"){
         document.getElementById('ranking-intermediaire').innerHTML += contentScore;
         }
         if(level == "advanced"){
         document.getElementById('ranking-advanced').innerHTML += contentScore;
         }
         if(level == "expert"){
         document.getElementById('ranking-expert').innerHTML += contentScore;
         }
}
}
     
}

rankingOnline("beginner");
rankingOnline("intermediate");
rankingOnline("advanced");
rankingOnline("expert");

var modalBeginner = document.getElementById('modalBeginner');
var modalIntermediaire = document.getElementById('modalIntermediaire');
var modalAdvanced = document.getElementById('modalAdvanced');
var modalExpert = document.getElementById('modalExpert');
var btnBeginner = document.getElementById("btnBeginner");
var btnIntermediaire = document.getElementById("btnIntermediaire");
var btnAdvanced = document.getElementById("btnAdvanced");
var btnExpert  = document.getElementById("btnExpert");
var span1 = document.getElementsByClassName("close")[0];
var span2 = document.getElementsByClassName("close")[1];
var span3 = document.getElementsByClassName("close")[2];
var span4 = document.getElementsByClassName("close")[3];

btnBeginner.onclick = function() {
    modalBeginner.style.display = "block";
}
btnIntermediaire.onclick = function() {
    modalIntermediaire.style.display = "block";
}
btnAdvanced.onclick = function() {
    modalExpert.style.display = "block";
}
btnExpert.onclick = function() {
    modalAdvanced.style.display = "block";
}

span1.onclick = function() {
    modalBeginner.style.display = "none";
}
span2.onclick = function() {
    modalIntermediaire.style.display = "none";
}
span3.onclick = function() {
    modalAdvanced.style.display = "none";
}
span4.onclick = function() {
    modalExpert.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modalBeginner) {
        modalBeginner.style.display = "none";
    }
    if (event.target == modalIntermediaire) {
        modalIntermediaire.style.display = "none";
    }
    if (event.target == modalAdvanced) {
        modalAdvanced.style.display = "none";
    }
    if (event.target == modalExpert) {
        modalExpert.style.display = "none";
    }
}

document.querySelector('.leave').classList.add("hide");
var subButton = document.getElementById('loginButton');
subButton.addEventListener('click', getUserName, true);
var subButton = document.getElementById('startGame');
subButton.addEventListener('click', startGame, true);