$(document).ready(function () {

    /* API URL generation */
    let urlStart = 'https://opentdb.com/api.php?'
    let url10 = 'amount=10'
    let url15 = 'amount=15'
    let url20 = 'amount=20'
    let urlCategory = '&category=23'
    let urlEasy = '&difficulty=easy'
    let urlMed = '&difficulty=medium'
    let urlHard = '&difficulty=hard'
    let urlType = '&type=multiple'
    let triviaURL = ''

    
    const categoryURL = (categoryChoice) => ({
        'mythology': 'category=20',
        'books': 'category=10',
        'film': 'category=11',
        'television': 'category=14',
        'video-games': 'category=15',
        'science-nature': 'category=17',
        'sport': 'category=21',
        'history': 'category=23',
        'politics': 'category=24',
        'animals': 'category=27',
        'art': 'category=25',
        'geography': 'category=22',
        'vehicles': 'category=28',
        'music': 'category=12',
        'celebrities': 'category=26',
        'general-knowledge': 'category=9',
    })[categoryChoice]
    
    // console.log(categoryURL('film'));

    $('.category').click(function(event) {
        // console.log($(this).attr('id'));
        // console.log(categoryURL($(this).attr('id')));
        return categoryURL($(this).attr('id'))
    })

    $('.category').click(function(event) {
        urlCategory = event.result
        console.log(urlCategory);
    })

    // $('.category').click(function(e) {
    //     e.preventDefault();
        
    //     $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });


    // $('.game--difficulty-select').click(function (e) {
    //     e.preventDefault();
    //     $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });

    triviaURL = urlStart + url10 + urlCategory + urlEasy + urlType

    function getTriviaData(playerSelection) {
        fetch(triviaURL)
        .then(res => res.json())
        .then(data => {
            let triviaData = data.results;
            let triviaQuestions = []
            let triviaAnswers = []
            let triviaCorrect = []
            // push all questions into array
            triviaData.forEach((question, index) => {
                triviaQuestions.push(triviaData[index].question)
            });
            // push correct answer into incorrect answers
            triviaData.forEach((answer, index) => {
                triviaData[index].incorrect_answers.push(triviaData[index].correct_answer)
            });
            // push all answer choices into array
            triviaData.forEach((allAnswers, index) => {
                triviaAnswers.push(triviaData[index].incorrect_answers)
            })
            // shuffle answer array
            for (i =0; i < triviaAnswers.length; i++) {
                // console.log(triviaAnswers[i]);
                triviaAnswers[i].sort(() => Math.random() - 0.5);
                // console.log(triviaAnswers[i]);
            }
            // push all correct answers into array
            triviaData.forEach((cAnswer, index) => {
                triviaCorrect.push(triviaData[index].correct_answer)
            })
            // iterate array to display questions
            triviaQuestions.forEach((question, index) => {
                document.getElementById(`trivia${index}Question`).innerHTML = triviaQuestions[index];
            })
            // iterate array to display answers
            triviaAnswers.forEach((answerArray, index1) => {
                    triviaAnswers[index1].forEach((answer, index2) => {
                        document.getElementById(`trivia${index1}Answer${index2}`).innerHTML = triviaAnswers[index1][index2]
                    })
            })
    
            // console.log(triviaQuestions);
            // console.log(triviaAnswers);
            // triviaData[0].incorrect_answers.forEach(answer => {
            //     for (i = 0; i < triviaData[0].incorrect_answers.length; i++) {
            //         document.getElementById('triviaAnswer' + (i + 1)).innerHTML = triviaData[0].incorrect_answers[i]
            //         console.log(i);
            //     }
            // });
    
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
    }

    
});
