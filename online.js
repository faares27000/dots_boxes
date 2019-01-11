function startOnline() {
var joinInfo = JSON.stringify({"name": username, "pass": password, "level": levelOnline, "group": group});
 var req = new XMLHttpRequest();
 req.open('post', 'http://twserver.alunos.dcc.fc.up.pt:8000/join', true);
 req.setRequestHeader('Content-type','application/json');

 req.send(joinInfo);
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
    console.log("Erro: join");

 else{

    game = respostaServer.game;	
    key = respostaServer.key;
    console.log("game: " + game + " key: " + key + " username: " + username + " password: " + password + " level: " + levelOnline);
    adversario = new EventSource('http://twserver.alunos.dcc.fc.up.pt:8000/update?name=' + username + '&game=' + game + '&key=' + key + '');
    document.getElementById('game-area').innerHTML = "Waiting for your opponent";
    document.querySelector('.leave').classList.remove("hide");
    adversario.onmessage = function(event) {

    atualizacaoServer = JSON.parse(event.data);

    if (atualizacaoServer.hasOwnProperty("error")){
        alert("Erro: update");
    }else{
        j1 = username;
        j2 = atualizacaoServer.opponent;
        turn_v = atualizacaoServer.turn;
        winner = atualizacaoServer.winner;
        if(typeof atualizacaoServer.move === 'undefined'){
            console.log('Not yet')
        } else {
            orient = atualizacaoServer.move.orient;
            row = atualizacaoServer.move.row;
            col = atualizacaoServer.move.col;
            time_game = atualizacaoServer.move.time;
            console.log(orient +"  "+ row + "  " +col);
        }
        if(document.getElementById('2×3').checked || document.getElementById('4×5').checked || document.getElementById('6×8').checked || document.getElementById('9×11').checked){
            var opponentConnected = document.getElementById('opponent');
            opponentConnected.textContent = j2;
        }
        document.querySelector('.player-board').classList.remove("hide");
        document.querySelector('.playground').classList.remove("hide");
        document.querySelector('.leave').classList.add("hide");
        document.querySelector('.game-area').classList.add("hide");

        if(document.getElementById('2×3').checked) {
            init(3, 2);
            document.getElementById('2×3').checked = false;
        }
        else if(document.getElementById('4×5').checked) {
            init(5, 4);
            document.getElementById('4×5').checked = false;
        }
        else if(document.getElementById('6×8').checked) {
            init(8, 6);
            document.getElementById('6×8').checked = false;
        }
        else if(document.getElementById('9×11').checked){
            init(11, 9);
            document.getElementById('9×11').checked = false;
        }
        if(player == 2){
            computerTurn();
        }
        if(atualizacaoServer.winner!==undefined || calledLeave){
            adversario.close();
            
        }
     }
        
    }
        
 }
}
                    
 function sendMove(orient, row, col){
     
        adversaire = j2;
        turn_v == adversaire;
        var notifyInfo = JSON.stringify({"name": username, "game": game, "key": key, "orient": orient, "row": row, "col": col});
        var reqNotify = new XMLHttpRequest();
        reqNotify.open('post','http://twserver.alunos.dcc.fc.up.pt:8000/notify',true);
        reqNotify.setRequestHeader('Content-type','application/json');
        reqNotify.send(notifyInfo);
        reqNotify.onreadystatechange=function(){
            if(reqNotify.readyState != 4){
                return;
            }
            if(reqNotify.status != 200) {
                alert(reqNotify.status + ": " + reqNotify.statusText);
                return;
            }
            var respostaServerNotify = reqNotify.responseText;
            if(respostaServerNotify == "{}"){
                drawPlayground();
                turn();
            }
            else{
                alert("Error : Edge already drawn");
            }
        }
 }
    var lines = [];
    var boxes = [];
    var player = 0;
    var computer = 2;
     
        

    function init(width, height) {
        lines = [];
        boxes = [];
        

        for(var x = 0; x < width; x++) {
            boxes[x] = [];

            lines[x * 2] = [];
            lines[x * 2 + 1] = [];

            if(x == width - 1) {
                lines[x * 2 + 2] = [];
            }

            for(var y = 0; y < height; y++) {
                boxes[x][y] = 0;

                lines[x * 2][y] = 0;
                lines[x * 2 + 1][y] = 0;

                if(x == width - 1) {
                    lines[x * 2 + 2][y] = 0;
                }
                if(y == height - 1) {
                    lines[x * 2 + 1][y + 1] = 0;
                }
            }
        }

        clearTimer();
        nextPlayer();
        initPlayground();
        timedCount();
        drawPlayground();
        turn();
    }

    function initPlayground() {
        var playground = document.querySelector(".playground");
        playground.innerHTML = "";

        for(var x = 0; x < boxes.length; x++) {
            var lineColumn = document.createElement("div");
            lineColumn.classList.add("column");

            var column = document.createElement("div");
            column.classList.add("column");

            var lastLineColumn = null;

            if(x == boxes.length - 1) {
                lastLineColumn = document.createElement("div");
                lastLineColumn.classList.add("column");
            }

            for(var y = 0; y < boxes[x].length; y++) {
                lineColumn.innerHTML += "<div class='dot'></div>";
                lineColumn.innerHTML += "<div class='line vertical' id='line_" + (x * 2) + "_" + y + "'></div>";

                if(lastLineColumn != null) {
                    lastLineColumn.innerHTML += "<div class='dot'></div>";
                    lastLineColumn.innerHTML += "<div class='line vertical' id='line_" + (x * 2 + 2) + "_" + y + "'></div>";

                    if(y == boxes[x].length - 1) {
                        lastLineColumn.innerHTML += "<div class='dot'></div>";
                    }
                }

                column.innerHTML += "<div class='line horizontal' id='line_" + (x * 2 + 1) + "_" + y + "'></div>";
                column.innerHTML += "<div class='box' id='box_" + x + "_" + y + "'></div>";


                if(y == boxes[x].length - 1) {
                    column.innerHTML += "<div class='line horizontal' id='line_" + (x * 2 + 1) + "_" + (y + 1) + "'></div>";
                    lineColumn.innerHTML += "<div class='dot'></div>";
                }
            }

            playground.appendChild(lineColumn);
            playground.appendChild(column);
            if(lastLineColumn != null) {
                playground.appendChild(lastLineColumn);
            }
        }
        
        var lineEls = document.querySelectorAll(".playground .line");
        for(var i = 0; i < lineEls.length; i++) {
            lineEls[i].addEventListener('click', function() {
                var coords = this.id.split("_");
                if(player != computer && markLine(parseInt(coords[1]), parseInt(coords[2]))) {
                    var j = 1;
                    if(coords[1]%2 == 0){
                        or = "v";
                        for(n=0; n<lineEls.length; n += 2){
                        if(coords[1] == n){
                            co = j;
                        }
                        j++;
                    }
                    } else {
                        or = "h";
                        for(n=1; n<lineEls.length; n += 2){
                        if(coords[1] == n){
                            co = j;
                        }
                        j++;
                    }
                    }
                    
                    var m = 1;
                    for(n=0; n<lineEls.length; n++){
                        if(coords[2] == n){
                            ro = m;
                        }
                        m++
                    }
                    console.log("move("+ or + "," + ro +","+ co + ")")
                    sendMove(or,ro,co);
                    }
                
                    
            }, false);
        }
    }

    function drawPlayground() {
        document.querySelector(".board #score_1").innerHTML = getScore(1);
        document.querySelector(".board #score_2").innerHTML = getScore(2);

        if(player == 1) {
            document.querySelector('#player_1').classList.add("turn");
            document.querySelector('#player_2').classList.remove("turn");
        } else if(player == 2) {
            document.querySelector('#player_2').classList.add("turn");
            document.querySelector('#player_1').classList.remove("turn");
        } else {
            document.querySelector('#player_1').classList.remove("turn");
            document.querySelector('#player_2').classList.remove("turn");
        }

        for(var x = 0; x < boxes.length; x++) {
            for(var y = 0; y < boxes[x].length; y++) {
                var box = boxes[x][y];
                var elem = document.querySelector("#box_" + x + "_" + y);

                setClass(elem, box);
            }
        }

        for(x = 0; x < lines.length; x++) {
            for(y = 0; y < lines[x].length; y++) {
                var line = lines[x][y];
                elem = document.querySelector("#line_" + x + "_" + y);

                setClass(elem, line);
            }
        }
    }

    function setClass(elem, player) {
        if(player == 1) {
            elem.classList.add("blue");
            elem.classList.remove("red");
        } else if(player == 2) {
            elem.classList.add("red");
            elem.classList.remove("blue");
        } else {
            elem.classList.remove("blue");
            elem.classList.remove("red");
        }
    }

    function markLine(x, y) {
        if(lines[x][y] == 0) {
            lines[x][y] = player;

            var gotPoint = false;
            var lineBoxes = getBoxesForLine(x, y);
            for(var i = 0; i < lineBoxes.length; i++) {
                var box = lineBoxes[i];

                if(isBoxCircled(box.x, box.y)) {
                    boxes[box.x][box.y] = player;
                    gotPoint = true;
                }
            }

            if(!gotPoint) {
                nextPlayer();
            }
            return true;
        }
        return false;
    }

    function turn() {
        if(getScore(0) == 0) {
            player = 0;
            drawPlayground();
            setTimeout(function () {
                if(getScore(1) > getScore(2)) {
                    stopCount();
                    alert(winner + " wins! , Time : " + time_game);
                } else if(getScore(2) > getScore(1)) {
                    stopCount();
                    alert(winner + " wins! , Time : " + time_game);
                } else {
                    stopCount();
                    alert("Draw , Time : "+ time_game);
                }
            }, 250);
        } else {
            if (player == computer) {
                setTimeout(computerTurn, 500);
            }
        }
    }

    function nextPlayer() {
        
        if(player == 1) {
            player = 2;
        } else if(player == 2) {
            player = 1;
        } else {
            if(turn_v === j1){
                player = 1
            } else {
                player = 2
            }
        }
    }

    function getBoxesForLine(x, y) {
        var boxes = [];

        if(x % 2 == 0) {
            if(x > 0) {
                boxes.push({x: x / 2 - 1, y: y});
            }
            if(x < lines.length - 1) {
                boxes.push({x: x / 2, y: y});
            }
        } else {
            if(y > 0) {
                boxes.push({x: (x - 1) / 2, y: y - 1});
            }
            if(y < lines[x].length - 1) {
                boxes.push({x: (x - 1) / 2, y: y})
            }
        }

        return boxes;
    }

    function getLinesForBox(x, y) {
        return [
            {x: x * 2, y: y},
            {x: x * 2 + 1, y: y},
            {x: x * 2 + 2, y: y},
            {x: x * 2 + 1, y: y + 1}
        ]
    }

    function isBoxCircled(x, y) {
        var result = true;

        var boxLines = getLinesForBox(x, y);
        for(var i = 0; i < boxLines.length; i++) {
            var line = boxLines[i];
            result = result && lines[line.x][line.y] > 0;
        }

        return result;
    }

    function getScoreLines(state) {
        var result = [];

        if(state === undefined) {
            state = "score";
        }

        for(var x = 0; x < lines.length; x++) {
            for(var y = 0; y < lines[x].length; y++) {
                if(lines[x][y] == 0) {
                    var lineBoxes = getBoxesForLine(x, y);

                    var passed = true;
                    for(var i = 0; i < lineBoxes.length; i++) {
                        if(state == "play") {
                            passed = passed && getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length > 2;
                        } else if(state == "risk") {
                            passed = passed && getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length >= 2;
                        } else if(state == "score") {
                            if(getUnmarkedLinesForBox(lineBoxes[i].x, lineBoxes[i].y).length == 1) {
                                passed = true;
                                break;
                            } else {
                                passed = false;
                            }
                        }
                    }

                    if(passed) {
                        result.push({x: x, y: y});
                    }
                }
            }
        }

        return result;
    }

    function getUnmarkedLinesForBox(x, y) {
        var boxLines = getLinesForBox(x, y);
        var result = [];

        for(var n = 0; n < boxLines.length; n++) {
            var line = boxLines[n];
            if(lines[line.x][line.y] == 0) {
                result.push(line);
            }
        }

        return result;
    }

    function getScore(player) {
        var score = 0;

        for(var x = 0; x < boxes.length; x++) {
            for(var y = 0; y < boxes[x].length; y++) {
                if(boxes[x][y] == player) {
                    score++;
                }
            }
        }

        return score;
    }

    
    function getNextLine(prevLine, prevBox) {
        var lineBoxes = getBoxesForLine(prevLine.x, prevLine.y);

        var box = null;
        var line = null;

        for(var i = 0; i < lineBoxes.length; i++) {
            if (prevBox == null || lineBoxes[i].x != prevBox.x || lineBoxes[i].y != prevBox.y) {
                box = lineBoxes[i];
            }
        }

        if(box != null) {
            var unmarkedLines = getUnmarkedLinesForBox(box.x, box.y);
            if(unmarkedLines.length == 2) {
                for(i = 0; i < unmarkedLines.length; i++) {
                    if(unmarkedLines[i].x != prevLine.x || unmarkedLines[i].y != prevLine.y) {
                        line = unmarkedLines[i];
                    }
                }
            }
        }

        return {box: box, line: line};
    }

    function computerTurn() {
                    coords="line_0_0";
                    coords = coords.split("_");
                    if(orient=="v"){
                        var j=0;
                        for(i=1; i<20; i++){
                            if(col==i){
                               coords[1]=j; 
                            }
                            j+=2;
                        }
                    } else{
                        var j=1;
                        for(i=1; i<20; i++){
                            if(col==i){
                                coords[1]=j;
                            }
                            j+=2;
                        }
                    }
                    var l=0;
                    for(i=1; i<20; i++){
                        if(row == i){
                            coords[2]=l;
                        }
                        l++;
                    }
                
        if(typeof atualizacaoServer.move === 'undefined'){
            console.log('Not yet')
        } else {
            
                if(player == computer && markLine(parseInt(coords[1]), parseInt(coords[2]))) {
                    drawPlayground();
                    turn();
                }
        }
        
                
        }
          
    

    function random(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
}

    