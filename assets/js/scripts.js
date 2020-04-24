$(document).ready(function () {
    
    fetch('https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(data => {
        let triviaData = data.results;
        document.getElementById('triviaQuestion').innerHTML = triviaData[0].question;
    })
});
