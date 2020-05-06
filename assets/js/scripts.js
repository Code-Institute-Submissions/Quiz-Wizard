$(document).ready(function () {

    /* ==============
    >>DATA PROCESSING
    ============== */

    // Get data from API
    async function getData(url) {
        let res
        let data
        try {
            res = await fetch(url)
            data = await res.json()
            console.log(res)
            return data
        }
        catch {
            console.log('error')
        }
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
    }

    // Filter categories using specific names
    const filterCategories = (categoryName) => {
        categoryArray.push(categoryList.filter(el => el.name === categoryName)[0])
    }
    
    /* https://stackoverflow.com/a/40562841/10828019 */
    // generate category buttons in DOM - found above code to help with looping for new rows and adjusted for javascript
    // https://opentdb.com/api_category.php
    async function createCategories() {
        await getCategories('./categories.json')
        rowNum = 0
        colNum = 4
        rowID = 1
        for (i=0; i<categoryArray.length; i++) {
            if (rowNum % colNum === 0) {
                $('.game--categories').append(`<div class='row game--category-row' id='row${rowID}'>`)
            }
            rowNum++
            $(`#row${rowID}`).append(`<button class='btn col-4 col-md-3 mx-auto game--category-select my-2' id='${categoryArray[i].id}'>${categoryArray[i].name}</button>`)
            if (rowNum % colNum === 0) {
                $('.game--categories').append(`</div>`)
                rowID++
            }
        }
    }
    
    // Load categories using above processing
    async function loadCategories() {
        await createCategories()
        $('.game-content').fadeIn(1000)
        $('#loadingSpinner').hide()
    }

    // Generate url to get specific trivia user selects
    function generateURL(categoryID, difficulty) {
        let urlDefault = 'https://opentdb.com/api.php?amount=10&type=multiple'
        let urlCategory = '&category=' + categoryID
        let urlDifficulty = '&difficulty=' + difficulty
        // return urlDefault + urlCategory + urlDifficulty
        return './trivia.json'
    }

    /* Processing of trivia data */
    let correctArray = []
    async function processTriviaData(triviaUrl) {
        const data = await getData(triviaUrl)
        triviaData = data.results
        // push all correct answers into seperate array
        triviaData.forEach((el, index) => {
            correctArray.push(triviaData[index].correct_answer)
        })
        // push correct answer into incorrect answers
        triviaData.forEach((el, index) => {
            triviaData[index].incorrect_answers.push(triviaData[index].correct_answer)
        })
        // shuffle answer array
        for (i=0; i<triviaData[i].incorrect_answers.length; i++) {
            triviaData[i].incorrect_answers.sort(() => Math.random() - 0.5)
        }
        // generate panel of questions and answers for each trivia entry
        triviaData.forEach((trivia, index) => {
            $('.game--display').append(`<div class='trivia--panel game--panel__hidden' id='gamePanel${index}'>
            <div class='row mx-0 mb-3 game--question'>
                <div class='col-10 mx-auto my-auto'>
                    <h3 id='trivia${index}Question'>${trivia.question}</h3>
                </div>
            </div>
            <div class='row mx-0 mb-1'>
                <button class='col-4 mx-auto game--answer--single game--answer--outline btn btn-default' id='trivia${index}Answer0'>${trivia.incorrect_answers[0]}</button>
                <button class='col-4 mx-auto game--answer--single game--answer--outline btn btn-default' id='trivia${index}Answer1'>${trivia.incorrect_answers[1]}</button>
            </div>
            <div class='row mx-0'>
                <button class='col-4 mx-auto game--answer--single game--answer--outline btn btn-default' id='trivia${index}Answer2'>${trivia.incorrect_answers[2]}</button>
                <button class='col-4 mx-auto game--answer--single game--answer--outline btn btn-default' id='trivia${index}Answer3'>${trivia.incorrect_answers[3]}</button>
            </div>
            </div>`)
        })
        correctArray.forEach((el, index) => {
           for (i=0; i<4; i++) {
               if ($(`#trivia${index}Answer${i}`).text() === el) {
                $(`#trivia${index}Answer${i}`).addClass(`correct-answer${index}`)
               }
           }
        })
        $('#gamePanel0').addClass('game--panel__shown').removeClass('game--panel__hidden')
    }

    /* ===============
    >>USER INTERACTION
    =============== */

    // Declare empty player object
    const gamePlayer = {
        'username': '',
        // 'General Knowledge': {
        //     'score': 0,
        //     'difficulty': ''
        // }
    }
    let testVar = 'hihi'
    let testobj = 'category'
    let testscore = 5
    // Welcome screen
    $(document).on('click', '.welcome--play', function (event) {
        if (typeof($('#usernameInput').val()) === 'string') {
            gamePlayer.username = $('#usernameInput').val()
        }
        $('.welcome-panel').hide()
        $('#loadingSpinner').show()
        loadCategories()
    })

    // Select category
    $(document).on('click', '.game--category-select', function (event) {
        return $(this).attr('id')
    })

    $(document).on('click', '.game--category-select', function (event) {
        userCategory = event.result
        $('.game--categories').addClass('game--panel__hidden').removeClass('game--panel__shown')
        $('.game--difficulty').addClass('game--panel__shown').removeClass('game--panel__hidden')
        $('#gameTitle').text($(this).text())
    })

    // Select difficulty
    $(document).on('click', '.game--difficulty-select', function (event) {
        return $(this).attr('id')
    })

    $(document).on('click', '.game--difficulty-select', function (event) {
        userDiff = event.result
        $('#begin').removeAttr('disabled')
    })

    // Begin game by using the URL generated through previous steps and
    // processing it to create the game panels
    let currentCategory = ''
    $(document).on('click', '#begin', function (event) {
        processTriviaData(generateURL(userCategory, userDiff))
        $('.game--difficulty').addClass('game--panel__hidden').removeClass('game--panel__shown')
        $('.game--display--wrapper').addClass('game--panel__shown').removeClass('game--panel__hidden')
        currentCategory = $('#gameTitle').text()
        console.log(currentCategory)
    })

    // Check answer is correct, process it and move to next panel
    let checkAnswer = 0
    let currentScore = 0
    $(document).on('click', '.game--answer--single', function (event) {
        console.log($(this).text())
        if ($(this).is(`.correct-answer${checkAnswer}`)) {
            $(this).addClass('btn-success')
            console.log('correct')
            currentScore++
        } else {
            console.log('incorrect')
            $(this).addClass('btn-danger')
            $(`.correct-answer${checkAnswer}`).addClass('btn-outline-success').removeClass('game--answer--outline')
        }
        // disable answer buttons after selection is made to prevent multiple clicks
        $('.game--answer--single').attr('disabled', true)
        // display selection for 1.5 seconds before moving on
        setTimeout(() => {
            $(`#gamePanel${checkAnswer}`).addClass('game--panel__hidden').removeClass('game--panel__shown')
            $(`#gamePanel${(checkAnswer + 1)}`).addClass('game--panel__shown').removeClass('game--panel__hidden')
            checkAnswer++
            $('.game--answer--single').removeAttr('disabled')
            // After all panels have been completed, show end game panel with score displayed
            if (checkAnswer === correctArray.length) {
                $('.game--display--wrapper').addClass('game--panel__hidden').removeClass('game--panel__shown')
                $('#gameTitle').addClass('game--panel__hidden').removeClass('game--panel__shown')
                $('.endgame-panel').addClass('game--panel__shown').removeClass('game--panel__hidden')
                $('.endgame--score').text(`${currentScore} points`)
                Object.assign(gamePlayer, {[currentCategory]: {
                    'score': currentScore,
                    'difficulty': userDiff
                }})
            }
        }, 1500)
        $('#playerScore').text(`Score ${currentScore} points`)
    })

    // Reset from end game panel back to category select screen so it can be played again
    $(document).on('click', '#endgameButton', function() {
        $('.game--display').empty()
        correctArray = []
        checkAnswer = 0
        currentScore = 0
        $('.endgame-panel').addClass('game--panel__hidden').removeClass('game--panel__shown')
        $('.game--categories').addClass('game--panel__shown').removeClass('game--panel__hidden')
        $('#gameTitle').addClass('game--panel__shown').removeClass('game--panel__hidden').text(`Choose Your Category`)
        $('#playerScore').text(`Score 0 points`)
        console.log(gamePlayer);
    })


})
