$(document).ready(function () {
    $('.category').click(function (e) {
        e.preventDefault();
        console.log('click');
        $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
        $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
    });
    $('.game--difficulty-select').click(function (e) {
        e.preventDefault();
        $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
        $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
    });



    fetch('https://opentdb.com/api.php?amount=10&category=20&difficulty=easy&type=multiple')
    .then(res => res.json())
    .then(data => {
        let triviaData = data.results;
        let correctAnswer = triviaData[0].correct_answer;
        console.log(correctAnswer);
        document.getElementById('triviaQuestion').innerHTML = triviaData[0].question;
        triviaData[0].incorrect_answers.push(triviaData[0].correct_answer);
        // console.log(triviaData[0]);
        // console.log(triviaData[0].category);
        triviaData[0].incorrect_answers.forEach(answer => {
            for (i = 0; i < triviaData[0].incorrect_answers.length; i++) {
                document.getElementById('triviaAnswer' + (i + 1)).innerHTML = triviaData[0].incorrect_answers[i]
                // console.log(i);
            }
        });

        $('.game--answer--single').click(function (e) {
            e.preventDefault();
            // console.log('click');
            console.log($(this).text());
            // console.log('----');
            if ($(this).text() == correctAnswer) {
                console.log('correct');
            } else {
                console.log('incorrect');
            }    
        });
    });
});
