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

        // console.log(triviaData)
        arrayLooper(triviaData, 'question')
    }

    function arrayLooper(array, query) {
        array.forEach((el, index) => {
            console.log(`${index} ${el[query]}`);
        })
    }

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
