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



    // $('.category').click(function(e) {
    //     e.preventDefault();
    //     /* Category selection switch */
    //     switch ($(this).prop('id')) {
    //         case 'mythology':
    //         console.log('mythology');
    //         break;
    //         case 'books':
    //         console.log('books');
    //         break;
    //         case 'film':
    //         console.log('film');
    //         break;
    //         case 'television':
    //         console.log('television');
    //         break;
    //         case 'videoGames':
    //         console.log('video games');
    //         break;
    //         case 'scienceNature':
    //         console.log('Science and nature');
    //         break;
    //         case 'sports':
    //         console.log('sports');
    //         break;
    //         case 'history':
    //         console.log('history');
    //         break;
    //         case 'politics':
    //         console.log('politics');
    //         break;
    //         case 'animals':
    //         console.log('animals');
    //         break;
    //         case 'art':
    //         console.log('art');
    //         break;
    //         case 'geography':
    //         console.log('geography');
    //         break;
    //         case 'vehicles':
    //         console.log('vehicles');
    //         break;
    //         case 'music':
    //         console.log('music');
    //         break;
    //         case 'celebrities':
    //         console.log('celebrities');
    //         break;
    //         case 'generalKnowledge':
    //         console.log('general knowledge');
    //         break;
    //         default:
    //         console.log('default');
    //     }
        
    //     $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });


    // $('.game--difficulty-select').click(function (e) {
    //     e.preventDefault();
    //     $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });

    triviaURL = urlStart + url10 + urlCategory + urlEasy + urlType

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
});
