var startbutton  = document.getElementById('start-button');
var qzheader     = document.getElementById('quiz-header');
var qzquestion   = document.getElementById('quiz-question');
var qzoptions    = document.getElementById('quiz-options');
var qzstatus     = document.getElementById('quiz-status');
var qztime = 50;
var qzpos  = 0;
var qzscore = 0;


//Questions to be displayed by the quiz
var questions = [
    ['Inside which HTML element do we put the JavaScript?', '&lt;scripting&gt;', '&lt;js&gt;', '&lt;script&gt;', '&lt;javascript&gt;', 'C'],
    ['What is the correct syntax for referring to an external script called "xxx.js"?', '&lt;script name="xxx.js"&gt;', '&lt;script src="xxx.js"&gt;', '&lt;script href="xxx.js"&gt;', '&lt;script "xxx.js"&gt;', 'B'],
    ['How do you create a function in JavaScript?', 'function : myFunction()', 'function = myFunction()', 'function(myFunction())', 'function myFunction()', 'D'],
    ['How do you call a function named "myFunction" in JavaScript?', 'myFunction()', ' call myFunction()', 'call function myFunction()', 'execute myFunction()', 'A'],
    ['How do you write an IF statement in JavaScript?', 'IF i = 5 then', 'IF i = 5', 'IF i === 5 then', 'IF( i == 5 )', 'D'],
]

//Interval to start chronograph
var myInterval;

startbutton.addEventListener("click", function(){

    myInterval = setInterval(updateCountDown, 1000);

    nextquestion();

})

//handle chronograph, when times up then end quiz
function updateCountDown(){

    if (qztime > 0){

        qzheader.innerHTML = qztime;
        qztime--;

    }else{

        if ( qzpos < questions.length ){  
            clearInterval(myInterval);
            timesUp();
        }

    }
    
}

//move to next question
function nextquestion(){

    if ( qzpos < questions.length ){

        printquestion();
        printstatus();
        qzpos++;

    }else{

        submitquiz();

    }

}

//print next question
function printquestion(){

    qzquestion.innerHTML = '<br><h2>' + questions[qzpos][0] + '</h2><br>';
    qzoptions.innerHTML  = '<br><button class="btn" id="answer-button" onclick="checkanswer(&apos;A&apos;,' + qzpos + ')">'    + questions[qzpos][1] + '</button><br><br>';
    qzoptions.innerHTML  += '<button class="btn" id="answer-button" onclick="checkanswer(&apos;B&apos;,'   + qzpos + ')">'     + questions[qzpos][2] + '</button><br><br>';
    qzoptions.innerHTML  += '<button class="btn" id="answer-button" onclick="checkanswer(&apos;C&apos;,'   + qzpos + ')">'     + questions[qzpos][3] + '</button><br><br>';
    qzoptions.innerHTML  += '<button class="btn" id="answer-button" onclick="checkanswer(&apos;D&apos;,'   + qzpos + ')">'     + questions[qzpos][4] + '</button><br><br>';

}

//print quiz status
function printstatus(){

    qzstatus.innerHTML = '<h1>Question: ' + (qzpos+1) +  ' / '+ questions.length +'</h1>';

}

//handle answer, if correct add 20 points to score, if incorrect penalize chrono with 10 sec.
function checkanswer(value, qzindex){
    
    if ( value == questions[qzindex][5] ){

        qzscore = qzscore + 20;

    }else{

        qztime = qztime - 10;
    }

    nextquestion();

}

//times up, print submit score
function timesUp(){

    qztime = 0;

    qzheader.innerHTML = 'times Up!';

    qzquestion.innerHTML = '<br><h2>Your final Score is: ' + qzscore + '</h2><br>';

    qzoptions.innerHTML =  '<br><label>Enter your Initials:</label>';
    qzoptions.innerHTML += '&nbsp;&nbsp;<input id="initials"/>&nbsp;&nbsp;';
    qzoptions.innerHTML += '<button class="btn" id="submit-button" onclick="saveScore()"> SUBMIT </button><br><br>';

    qzstatus.innerHTML = '<h1>Thanks for taking the exam!</h1>';


}

//print submit score
function submitquiz(){

    clearInterval(myInterval);

    qzheader.innerHTML = 'All Done!';

    qzquestion.innerHTML = '<br><h2>Your final Score is: ' + qzscore + '</h2><br>';

    qzoptions.innerHTML =  '<br><label>Enter your Initials:</label>';
    qzoptions.innerHTML += '&nbsp;&nbsp;<input id="initials"/>&nbsp;&nbsp;';
    qzoptions.innerHTML += '<button class="btn" id="submit-button" onclick="saveScore()"> SUBMIT </button><br><br>';

    qzstatus.innerHTML = '<h1>Thanks for taking the exam!</h1>';

}

//save score in local memory.
function saveScore(){

    var lclinitials = document.querySelector('#initials');

    if (lclinitials.value.trim() == ''){
        qzstatus.innerHTML = '<h1>Enter your initials to submit!</h1>';
        return;
    }

    console.log(lclinitials.value.trim());

    var scoreobj = {
        initials: lclinitials.value.trim(),
        score: qzscore,
    };
    console.log(scoreobj);

    var index = localStorage.length + 1;
    var userid = 'USRQUZ' + index;
    console.log(index, userid);

    localStorage.setItem(userid, JSON.stringify(scoreobj));

    var lcltopScores = [];
    if ( localStorage.getItem('topScores') != undefined ){

        lcltopScores = JSON.parse(localStorage.getItem('topScores'));

    } 
    lcltopScores.push(userid);
    console.log(lcltopScores);

    localStorage.setItem('topScores', JSON.stringify(lcltopScores));

    seeScores();

}

//print scores
function seeScores(){

    var lcltopScores = [];
    var lclusrobj;
    var htmlstr = '<table>'


    if ( localStorage.getItem('topScores') != undefined ){

        lcltopScores = JSON.parse(localStorage.getItem('topScores'));

        for (var i = 0; i < lcltopScores.length; i++){

            lclusrobj = JSON.parse(localStorage.getItem(lcltopScores[i]));
            console.log(lclusrobj.initials);

            htmlstr += '<tr><td>' + lclusrobj.initials + '</td><td>:</td><td>' + lclusrobj.score + '</td></tr>';

        }
    }

    qzheader.innerHTML = 'Coding Quiz Challenge Scores:';
    qzquestion.innerHTML = '<br><h2>Scores:</h2><br>';
    htmlstr += '</table>';
    qzoptions.innerHTML = htmlstr;
    qzstatus.innerHTML = '<button class="btn" id="back-button" onclick="refresh()"> BACK </button><br><br>';
    qzstatus.innerHTML += '<button class="btn" onclick="clearlclstorage()"> CLEAR SCORES </button><br><br>';

}

//reload page
function refresh(){
    window.location.reload()
}

//clear local storage, ONLY erases vars used by the app, it does not clear other vars in local storage that may be used by other apps
function clearlclstorage(){

    var lcltopScores = [];
    
    if ( localStorage.getItem('topScores') != undefined ){

        lcltopScores = JSON.parse(localStorage.getItem('topScores'));

        for (var i = 0; i < lcltopScores.length; i++){

            localStorage.removeItem(lcltopScores[i]);

        }

    }

    localStorage.removeItem('topScores');

    seeScores();
}



