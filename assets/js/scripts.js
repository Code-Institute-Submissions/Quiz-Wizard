$(document).ready(function () {

    // Get data from API
    async function getData(url) {
        const res = await fetch(url)
        const data = await res.json()
        return data
    }

    // Get specific trivia data based on user selection
    async function getTriviaData(triviaUrl) {
        const data = await getData(triviaUrl)
        // console.log(data.results)
        return data.results
    }

    // Generate array of categories
    let categoryArray = []
    async function getCategories(catUrl) {
        const data = await getData(catUrl)
        categoryList = data.trivia_categories
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
        // console.log(categoryList);
        // console.log('filtered')
        // console.log(categoryArray)
    }

    // Filter category function
    const filterCategories = (categoryName) => {
        categoryArray.push(categoryList.filter(el => el.name === categoryName)[0])
    }

    /* https://stackoverflow.com/a/40562841/10828019 */
    // generate category buttons in DOM - found above code to help with looping for new rows and adjusted for javascript
    async function createCategories() {
        await getCategories('https://opentdb.com/api_category.php')
        rowNum = 0
        colNum = 4
        rowID = 1
        for (i=0; i<categoryArray.length; i++) {
            if (rowNum % colNum === 0) {
                $('.game--categories').append(`<div class='row game--category-row' id='row${rowID}'>`)
            }
            rowNum++
            $(`#row${rowID}`).append(`<button class='btn btn-default col-6 col-md-3 game--category-select' id='${categoryArray[i].id}'>${categoryArray[i].name}</button>`)
            if (rowNum % colNum === 0) {
                $('.game--categories').append(`</div>`)
                rowID++
            }
        }
    }
    createCategories()

    // generate url to get specific trivia user selects
    function generateURL(categoryID, difficulty) {
        let urlDefault = 'https://opentdb.com/api.php?amount=10&type=multiple'
        let urlCategory = '&category=' + categoryID
        let urlDifficulty = '&difficulty=' + difficulty
        return urlDefault + urlCategory + urlDifficulty
    }

    /* Processing of trivia data */
    let triviaQuestions = []
    let triviaAnswers = []
    let triviaCorrect = []

    async function processTriviaData(triviaUrl) {
        const data = await getData(triviaUrl)
        triviaData = data.results
        // push correct answer into incorrect answers
        triviaData.forEach((el, index) => {
            triviaData[index].incorrect_answers.push(triviaData[index].correct_answer)
        })
        // shuffle answer array
        for (i=0; i<triviaData[i].incorrect_answers.length; i++) {
            // console.log(triviaData[i].incorrect_answers);
            triviaData[i].incorrect_answers.sort(() => Math.random() - 0.5);
            // console.log(triviaData[i].incorrect_answers);
        }
        // generate panel of questions and answers for each trivia entry
        triviaData.forEach((trivia, index) => {
            // console.log('new game panel');
            $('.game--display').append(`<div class='game--panel game--panel__shown' id='gamePanel${index}'>
            <div class='row'>
                <div class='col-10 offset-1 game--question'>
                    <h3 id='trivia${index}Question'>${trivia.question}</h3>
                </div>
            </div>
            <br>
            <div class='row'>
                <button class='col-6 game--answer--single btn btn-default' id='trivia${index}Answer0'>${trivia.incorrect_answers[0]}</button>
                <button class='col-6 game--answer--single btn btn-default' id='trivia${index}Answer1'>${trivia.incorrect_answers[1]}</button>
            </div>
            <div class='row'>
                <button class='col-6 game--answer--single btn btn-default' id='trivia${index}Answer2'>${trivia.incorrect_answers[2]}</button>
                <button class='col-6 game--answer--single btn btn-default' id='trivia${index}Answer3'>${trivia.incorrect_answers[3]}</button>
            </div>
            </div>
            <br>`)
            
            // console.log('new Q: ' + el.question);
            // console.log('A:' + el.incorrect_answers);
            // console.log('Corr:' + el.correct_answer);
        })
        // console.log(triviaData)
        // arrayLooper(triviaData, 'question')
    }

    

    function arrayLooper(array, query) {
        array.forEach((el, index) => {
            console.log(`${index} ${el[query]}`);
        })
    }

    

    let testArray = [
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "Which company did Valve cooperate with in the creation of the Vive?",
    "correct_answer": "HTC",
    "incorrect_answers": [
    "Oculus",
    "Google",
    "Razer"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "What is the first book of the Old Testament?",
    "correct_answer": "Genesis",
    "incorrect_answers": [
    "Exodus",
    "Leviticus",
    "Numbers"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "In past times, what would a gentleman keep in his fob pocket?",
    "correct_answer": "Watch",
    "incorrect_answers": [
    "Money",
    "Keys",
    "Notebook"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "How would one say goodbye in Spanish?",
    "correct_answer": "Adi&oacute;s",
    "incorrect_answers": [
    " Hola",
    "Au Revoir",
    "Salir"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "Red Vines is a brand of what type of candy?",
    "correct_answer": "Licorice",
    "incorrect_answers": [
    "Lollipop",
    "Chocolate",
    "Bubblegum"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "What is the nickname of the US state of California?",
    "correct_answer": "Golden State",
    "incorrect_answers": [
    "Sunshine State",
    "Bay State",
    "Treasure State"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "What is on display in the Madame Tussaud&#039;s museum in London?",
    "correct_answer": "Wax sculptures",
    "incorrect_answers": [
    "Designer clothing",
    "Unreleased film reels",
    "Vintage cars"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "According to the nursery rhyme, what fruit did Little Jack Horner pull out of his Christmas pie?",
    "correct_answer": "Plum",
    "incorrect_answers": [
    "Apple",
    "Peach",
    "Pear"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "How many furlongs are there in a mile?",
    "correct_answer": "Eight",
    "incorrect_answers": [
    "Two",
    "Four",
    "Six"
    ]
    },
    {
    "category": "General Knowledge",
    "type": "multiple",
    "difficulty": "easy",
    "question": "What is the name of NASA&rsquo;s most famous space telescope?",
    "correct_answer": "Hubble Space Telescope",
    "incorrect_answers": [
    "Big Eye",
    "Death Star",
    "Millenium Falcon"
    ]
    }
    ]

    function testing() {
        testArray.forEach((el, index) => {
            
        })
    }
    // testing()

    // processTriviaData('https://opentdb.com/api.php?amount=10&type=multiple&category=9&difficulty=easy')


    /* User interaction */

    // select category
    $(document).on('click', '.game--category-select', function (event) {
        return $(this).attr('id')
    })

    $(document).on('click', '.game--category-select', function (event) {
        userCategory = event.result
        console.log(userCategory)
    })

    $('.game--difficulty-select').click(function (event) {
        return $(this).attr('id')
    })
    $('.game--difficulty-select').click(function (event) {
        userDiff = event.result
        console.log($(this).attr('id'));
    })

    $('#begin').click(function (event) {
        console.log(userCategory + ' ' + userDiff)
        console.log(generateURL(userCategory, userDiff));
        processTriviaData(generateURL(userCategory, userDiff))
        // getTriviaData(generateURL(userCategory, userDiff))
        // createTrivia()
    })

    

    
    




    /* Old code - kept for reference at this time */
    /* Click events for selecting category and difficulty of trivia */
    /* $('.game--category-select').click(function(event) {
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

    }) */
    
    /* $('.game--difficulty-select').click(function(event) {
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
    }) */

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

    
    
    /* Get data out of local scope */
    /* https://stackoverflow.com/a/44644532 */
    // async function getTriviaData() {
    //     const res = await fetch(triviaURL);
    //     const data = await res.json();
    //     // console.log(data.results);
    //     return data.results;
    // }
    
    /* function processTriviaData() {
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
    } */

    /* async function displayTrivia() {
        await getTriviaData()
        processTriviaData()
        return triviaCorrect;
    } */
    
    // let correctArray = []
    // async function userSelection() {
    //     correctArray = await displayTrivia()
    //     console.log(correctArray);
    // }
    
    // function changeQuestion() {
    //     $(`#gamePanel${checkAnswer}`).hide()
    //     $(`#gamePanel${(checkAnswer + 1)}`).fadeIn(1000)
    // }

    /* check correct answer */
    /* let checkAnswer = 0
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
    }) */

    /* Question about this */
    // let checkCorrect = () => console.log($(this));
    // let checkCorrect = () => ($(this).text() == correctArray[1]) ? console.log('correct') : console.log('incorrect')

});
