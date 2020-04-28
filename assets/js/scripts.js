$(document).ready(function () {

    let categoryArray = []

    async function getData(url) {
        const res = await fetch(url)
        const data = await res.json()
        return data
    }
    
    async function getCategories(catUrl) {
        const data = await getData(catUrl)
        categoryList = data.trivia_categories
        console.log('full list')
        console.log(categoryList)
        filterCategories('General Knowledge')
        filterCategories('Entertainment: Books')
        filterCategories('Entertainment: Film')
        filterCategories('Entertainment: Music')
        filterCategories('Entertainment: Television')
        filterCategories('Entertainment: Video Games')
        filterCategories('Science & Nature')
        filterCategories('Science: Computers')
        filterCategories('Sports')
        filterCategories('Geography')
        filterCategories('History')
        filterCategories('Entertainment: Japanese Anime & Manga')
        console.log('filtered')
        console.log(categoryArray)
    }

    getCategories('https://opentdb.com/api_category.php')

    const filterCategories = (categoryName) => {
        categoryArray.push(categoryList.filter(el => el.name === categoryName)[0])
    }

    // async function getTriviaData() {
    //     const res = await fetch(triviaURL);
    //     const data = await res.json();
    //     // console.log(data.results);
    //     return data.results;
    // }

    /* API URL generation */
    let urlStart = 'https://opentdb.com/api.php?amount=10'
    let urlSelection = ''
    let urlType = '&type=multiple'
    let triviaURL = 'https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple'

    /* Values to select category and difficulty of trivia */
    const triviaSelect = (categoryChoice) => ({
        'mythology': '&category=20',
        'books': '&category=10',
        'film': '&category=11',
        'television': '&category=14',
        'video-games': '&category=15',
        'science-nature': '&category=17',
        'sport': '&category=21',
        'history': '&category=23',
        'politics': '&category=24',
        'animals': '&category=27',
        'art': '&category=25',
        'geography': '&category=22',
        'vehicles': '&category=28',
        'music': '&category=12',
        'celebrities': '&category=26',
        'general-knowledge': '&category=9',
        'easy': '&difficulty=easy',
        'medium': '&difficulty=medium',
        'hard': '&difficulty=hard'
    })[categoryChoice]
    
    /* Click events for selecting category and difficulty of trivia */
    $('.game--category-select').click(function(event) {
        return triviaSelect($(this).attr('id'))
    })

    $('.game--category-select').click(function(event) {
        urlSelection = event.result
        
        // display category name in title
        document.getElementById('gameTitle').innerHTML = $(this).attr('id').toUpperCase()
        // $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
        // $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
        $('.game--categories').hide()
        $('.game--difficulty').fadeIn(1500)

    })
    
    $('.game--difficulty-select').click(function(event) {
        return triviaSelect($(this).attr('id'))
    })

    $('.game--difficulty-select').click(function(event) {
        urlSelection = urlSelection + event.result
        console.log(urlSelection);
        triviaURL = urlStart + urlSelection + urlType
        console.log(triviaURL)
        userSelection()
        // $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
        // $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
        $('.game--difficulty').hide();
        $('.game--display').fadeIn(1500);
    })

    // $('.game--category-select').click(function(e) {
    //     e.preventDefault();
        
    //     $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });


    // $('.game--difficulty-select').click(function (e) {
    //     e.preventDefault();
    //     $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown');
    //     $('.game--display').addClass('game--panel__shown').removeClass('game--panel__hidden');
    // });

    
    let triviaQuestions = []
    let triviaAnswers = []
    let triviaCorrect = []
    /* Get data out of local scope */
    /* https://stackoverflow.com/a/44644532 */
    async function getTriviaData() {
        const res = await fetch(triviaURL);
        const data = await res.json();
        // console.log(data.results);
        return data.results;
    }
    
    function processTriviaData() {
        getTriviaData().then(triviaData => {
            // push all questions into array
            triviaData.forEach((question, index) => {
                triviaQuestions.push(triviaData[index].question)
            })
            // push correct answer into incorrect answers
            triviaData.forEach((answer, index) => {
                triviaData[index].incorrect_answers.push(triviaData[index].correct_answer)
            })
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
        })
    }

    async function displayTrivia() {
        await getTriviaData()
        processTriviaData()
        return triviaCorrect;
    }
    
    let correctArray = []
    async function userSelection() {
        correctArray = await displayTrivia()
        console.log(correctArray);
    }
    
    function changeQuestion() {
        $(`#gamePanel${checkAnswer}`).hide()
        $(`#gamePanel${(checkAnswer + 1)}`).fadeIn(1000)
    }

    /* check correct answer */
    let checkAnswer = 0
    let currentScore = 0
    $('.game--answer--single').click(function() {
        console.log(checkAnswer);
        console.log($(this).text())
        if ($(this).text() == correctArray[checkAnswer]) {
            console.log('correct')
            $(this).css('background-color', 'green')
            currentScore ++
        } else {
            console.log('incorrect')
            $(this).css('background-color', 'red')
        }
        setTimeout(() => {
            // $(`#gamePanel${checkAnswer}`).addClass('game--panel__hidden').removeClass('game--panel__shown')
            // $(`#gamePanel${(checkAnswer + 1)}`).addClass('game--panel__shown').removeClass('game--panel__hidden')
            $(`#gamePanel${checkAnswer}`).hide()
            $(`#gamePanel${(checkAnswer + 1)}`).fadeIn(1500)
            checkAnswer++
            console.log(checkAnswer);
        }, 1500);
        // $(`#gamePanel${checkAnswer}`).addClass('game--panel__hidden').removeClass('game--panel__shown')
        // $(`#gamePanel${(checkAnswer + 1)}`).addClass('game--panel__shown').removeClass('game--panel__hidden')
        // $(`#gamePanel${checkAnswer}`).hide()
        // $(`#gamePanel${(checkAnswer + 1)}`).fadeIn(1000)
        document.getElementById('playerScore').innerHTML = `Score ${currentScore}/10`
        console.log(checkAnswer);
    })

    /* Question about this */
    // let checkCorrect = () => console.log($(this));
    // let checkCorrect = () => ($(this).text() == correctArray[1]) ? console.log('correct') : console.log('incorrect')

});
