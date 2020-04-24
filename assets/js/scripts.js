$(document).ready(function () {
    
    fetch('https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(data => {
        let triviaData = data.results;
        document.getElementById('triviaQuestion').innerHTML = triviaData[0].question;
        triviaData[0].incorrect_answers.push(triviaData[0].correct_answer);
        // console.log(triviaData[0]);
        // console.log(triviaData[0].category);
        triviaData[0].incorrect_answers.forEach(answer => {
            for (i = 0; i < triviaData[0].incorrect_answers.length; i++) {
                document.getElementById('triviaAnswer' + (i + 1)).innerHTML = triviaData[0].incorrect_answers[i]
                console.log(i);
            }
        });
    })
});
