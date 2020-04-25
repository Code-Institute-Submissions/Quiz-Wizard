$(document).ready(function () {

    /* API URL generation */
    let urlStart = 'https://opentdb.com/api.php?'
    let url10 = 'amount=10'
    let url15 = 'amount=15'
    let url20 = 'amount=20'
    let urlCategory = '&category=10'
    let urlEasy = '&difficulty=easy'
    let urlMed = '&difficulty=medium'
    let urlHard = '&difficulty=hard'
    let urlType = '&type=multiple'
    let triviaURL = ''



        $('.category').click(function(e) {
        e.preventDefault();
        /* Category selection switch */
        switch ($(this).prop('id')) {
            case 'mythology':
            console.log('mythology');
            break;
            case 'books':
            console.log('books');
            break;
            default:
            console.log('default');
        }
        
        $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
        $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
    });
    $('.game--difficulty-select').click(function (e) {
        e.preventDefault();
        $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
        $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
    });

    triviaURL = urlStart + url10 + urlCategory + urlEasy + urlType

    fetch(triviaURL)
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
