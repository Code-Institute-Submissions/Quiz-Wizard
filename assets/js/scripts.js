const categoryWhitelist = ['General Knowledge', 'Entertainment: Books',
'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Television',
'Entertainment: Video Games', 'Science & Nature', 'Science: Computers',
'Sports', 'Geography', 'History', 'Entertainment: Japanese Anime & Manga']
let playerScores = {}
const correctAnswers = []
const welcomePanel = $('#welcomePanel')
const gameContent = $('#gameContentWrapper')
const gameTitle = $('#gameTitle')
const categoryPanel = $('#gameCategoryPanel')
const difficultyPanel = $('#gameDifficultyPanel')
const triviaWrapper = $('#triviaWrapper')
const triviaPanels = $('#triviaPanelDisplay')
const loadingSpinner = $('#loadingSpinner')

let currentCategory = ''
let difficultyMultiplier = 1
let currentQuestion = 0
let correctTotal = 0
let currentScore = 0

let serverResponse = false

/**
 * Check for async support
 * https://stackoverflow.com/a/46127053/10828019
 */
let isAsync = true;
try {
  eval('async () => {}');
} catch (e) {
  if (e instanceof SyntaxError)
    isAsync = false;
  else
    throw e; // throws CSP error
}

if (isAsync === false) {
    alert('Your browser is not supported, please upgrade to use this website')
}

/**
 * Checks the API server for response and sets variable based on result
 * This checks if the server is available at all, and if not will change to
 * using local data
 * @param {string} url The API address to check
 */
const checkResponse = async url => {
    try {
        const res = await fetch(url)
        if (res.status === 200) {
            serverResponse = true
        }
    }
    catch {
        serverFailed()
    }
}

/**
 * If the server does not respond, inform the user of their options by
 * changing the text on the welcome panel
 */
const serverFailed = () => {
    welcomePanel.children('form').remove()
    welcomePanel.children('div').children().children('p').text('Unfortunately '+
    'we are having issues contacting our database. If you would like to play '+
    'with locally stored questions, press play. Otherwise please try again '+
    'later.')
    welcomePanel.css('height', '50vh')
    welcomePanel.css('padding', '0 10px')
}



/**
 * Uses fetch API to return JSON data. If the server does not respond, loads
 * an alert informing the user
 * @param {string} url takes an API address to fetch data
 * @returns {object} JSON data from url
 */
const getData = async url => {
    try {
        const data = await fetch(url)
        return await data.json()
    }
    catch {
        $('#serverErrorAlert').show()
        loadingSpinner.hide()
    }
}

/**
 * Filters a list of chosen categories out of the complete list from the API
 * @param {array} completeList The API category list
 * @param {array} filterList Chosen category whitelist
 * @returns {array} Result of filtering
 */
const filterCategories = (completeList, filterList) => {
    return completeList.filter(item => {
        return filterList.includes(item.name)
    })
}

/**
 * Displays a list of categories in the DOM
 * https://stackoverflow.com/a/40562841/10828019
 * @param {array} categoryList The list of categories to display
 */
const displayCategories = categoryList => {
    let rowNum = 0
    let colNum = 4
    let rowID = 1
    for (i=0; i<categoryList.length; i++) {
        if (rowNum % colNum === 0) {
            categoryPanel.append(`<div class='row game--category-row'
            id='row${rowID}'>`)
        }
        rowNum++
        $(`#row${rowID}`).append(`<button class='btn col-4 col-md-3
        mx-auto game--category-select'
        id='${categoryList[i].id}'>${categoryList[i].name}</button>`)
        if (rowNum % colNum === 0) {
            categoryPanel.append(`</div>`)
            rowID++
        }
    }
}

/**
 * Loads a list of categories in the DOM, retreived and filtered from the API
 */
const loadCategories = async () => {
    const data = await getData('https://opentdb.com/api_category.php')
    const categories = data.trivia_categories
    filteredCategories = filterCategories(categories, categoryWhitelist)
    displayCategories(filteredCategories)
    gameContent.fadeIn(1000)
    loadingSpinner.hide()
}

/**
 * If the server is unresponsive, this will load locally stored data
 */
const loadLocal = async () => {
    await processTrivia('./assets/data/triviaQuestions.json')
    gameTitle.text('Local Questions')
    $('#gamePanel0').show()
    gameContent.fadeIn(1000)
    triviaWrapper.fadeIn(1000)
    loadingSpinner.hide()
    categoryPanel.hide()
    currentCategory = gameTitle.text()
    $('#currentQuestion').text(`${currentQuestion + 1}/${correctAnswers.length}`)
}

/**
 * Generate a URL to fetch the specific trivia the user selects from the API
 * @param {number} categoryID the id of the category
 * @param {string} difficulty the selected difficulty
 * @returns {string} Complete API url
 */
const generateURL = (categoryID, difficulty) => {
    let urlDefault = 'https://opentdb.com/api.php?amount=10&type=multiple'
    let urlCategory = '&category=' + categoryID
    let urlDifficulty = '&difficulty=' + difficulty
    return urlDefault + urlCategory + urlDifficulty
}

/**
 * Process array of data returned from the API
 * @param {string} triviaUrl address to fetch specific data from the API,
 * generated by user selection
 */
const processTrivia = async (triviaUrl) => {
    const data = await getData(triviaUrl)
    triviaData = data.results
    triviaData.forEach((_, index) => {
        correctAnswers.push(he.decode(triviaData[index].correct_answer))
        triviaData[index].incorrect_answers
        .push(triviaData[index].correct_answer)
    })
    triviaData.forEach(answer => {
        shuffleArray(answer.incorrect_answers)
    })
    for (i=0; i<triviaData[i].incorrect_answers.length; i++) {
        triviaData[i].incorrect_answers.sort(() => Math.random() - 0.5)
    }
    displayTrivia()
    gameContent.hide()
    loadingSpinner.show()
}

/**
 * Displays the processed API data in the DOM for the user to interact with
 */
const displayTrivia = () => {
    triviaData.forEach((trivia, index) => {
        triviaPanels.append(`<div class='element__hidden' id='gamePanel${index}'>
        <div class='row mx-0 game--question'>
            <div class='col-12 mx-auto my-auto'>
                <h3 id='trivia${index}Question'>${trivia.question}</h3>
            </div>
        </div>
        <div class='row mx-0 mb-1'>
            <button class='col-4 mx-auto game--answer--single
            game--answer--outline btn btn-default'
            id='trivia${index}Answer0'>${trivia.incorrect_answers[0]}</button>
            <button class='col-4 mx-auto game--answer--single
            game--answer--outline btn btn-default'
            id='trivia${index}Answer1'>${trivia.incorrect_answers[1]}</button>
        </div>
        <div class='row mx-0'>
            <button class='col-4 mx-auto game--answer--single
            game--answer--outline btn btn-default'
            id='trivia${index}Answer2'>${trivia.incorrect_answers[2]}</button>
            <button class='col-4 mx-auto game--answer--single
            game--answer--outline btn btn-default'
            id='trivia${index}Answer3'>${trivia.incorrect_answers[3]}</button>
        </div>
        </div>`)
    })
    correctAnswers.forEach((answer, index) => {
       for (i=0; i<4; i++) {
           if ($(`#trivia${index}Answer${i}`).text() === answer) {
            $(`#trivia${index}Answer${i}`).addClass(`correct-answer${index}`)
           }
       }
    })
}

/**
 * Shuffles array of answers before displaying them in the DOM
 * https://stackoverflow.com/a/12646864/10828019
 */
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * If the category name includes 'entertainement' removes this from the
 * game heading display
 */
const gameTitleText = () => {
    if (_this.text().includes('Entertainment')) {
        gameTitle.text(_this.text().slice('15'))
    } else {
        gameTitle.text(_this.text())
    }
}

/**
 * Uses the user selection to fetch and process the data and display it for
 * the user
 */
const loadGame = async () => {
    await processTrivia(generateURL(userCategory, userDiff))
    $('#gamePanel0').show()
    gameContent.fadeIn(1000)
    triviaWrapper.fadeIn(1000)
    loadingSpinner.hide()
}

/**
 * Gets data from local storage
 * @returns {object} Result of parsing local data
 */
const getLocalScore = (scores) => {
    let string = localStorage.getItem(scores)
    let obj = JSON.parse(string)
    return obj
}

/**
 * Sets data in local storage
 */
const setLocalScore = () => {
    localStorage.setItem('player scores', JSON.stringify(playerScores))
}

/**
 * Updates the scoreboard with category and user score
 */
const updateScoreboard = (scores) => {
    $('#scoreboardBody').empty()
    for (let [key, value] of Object.entries(scores)) {
        $('#scoreboardBody').append(`<p>${key}: ${value}</p>`)
        .css('text-transform', 'capitalize')
    }
}

/**
 * Checks if local storage exists and if it does, processes it
 */
const checkLocalScore = () => {
    if (localStorage.getItem('player scores') != null) {
        playerScores = getLocalScore('player scores')
        updateScoreboard(playerScores)
    }
}

/**
 * Sets a multiplier on the score based on difficulty selection
 */
const setDifficultyMultiplier = () => {
    if (userDiff === 'hard') {
        difficultyMultiplier = 3
    } else if (userDiff === 'medium') {
        difficultyMultiplier = 2
    } else {
        difficultyMultiplier = 1
    }
}

/**
 * Checks the answer the user selected and changes the colour of the buttons
 * based on the results
 */
const checkAnswer = () => {
    if (_this.is(`.correct-answer${currentQuestion}`)) {
        _this.addClass('btn-success')
        correctTotal++
        currentScore = (correctTotal * difficultyMultiplier)
    } else {
        _this.addClass('btn-danger')
        $(`.correct-answer${currentQuestion}`).addClass('btn-outline-success')
        .removeClass('game--answer--outline')
    }
}

/**
 * Changes the game panels to process through the data, and when the end of the
 * game is reached, display the end game panel
 */
const handleSelection = () => {
    setTimeout(() => {
        $(`#gamePanel${currentQuestion}`).hide()
        $(`#gamePanel${(currentQuestion + 1)}`).fadeIn(1000)
        currentQuestion++
        enableButton('.game--answer--single')
        $('#currentQuestion')
        .text(`${currentQuestion + 1}/${correctAnswers.length}`)
        if (currentQuestion === correctAnswers.length) {
            if (serverResponse === true) {
                endGameProcess()
            } else {
                endGameProcessLocal()
            }
        }
    }, 1500)
}

/**
 * Update the info display at the bottom of the screen
 */
const updateGameInfo = () => {
    if (currentScore === 1) {
        $('#playerScore').text(`${currentScore} point`)
    } else {
        $('#playerScore').text(`${currentScore} points`)
    }
}

/**
 * Update the end game panel to display data relevent to the current game data
 */
const endGameProcess = () => {
    triviaWrapper.hide()
    gameTitle.hide()
    $('#endgamePanel').fadeIn(1000)
    $('#endgameScore').children().children('h4').text(currentCategory)
    $('#endgameScore p').first().text(`Correct answers: ${correctTotal}`)
    $('#endgameScore p').last()
    .text(`Difficulty multiplier: ${difficultyMultiplier}`)
    $('#endgameScore').children().children('h5')
    .text(`Total score: ${currentScore}`)
    playerScores[currentCategory] = currentScore
    setLocalScore()
    updateScoreboard(playerScores)
}

/**
 * Update the end game panel if the user was playing with local data
 */
const endGameProcessLocal = () => {
    triviaWrapper.hide()
    gameTitle.hide()
    $('#endgamePanel').fadeIn(1000)
    $('#endgameScore').children().children('h4').text(currentCategory)
    $('#endgameScore p').first().text(`Correct answers: ${correctTotal}`)
    $('#endgameScore p').last()
    .text(`Difficulty multiplier: ${difficultyMultiplier}`)
    $('#endgameScore').children()
    .children('h5').text(`Total score: ${currentScore}`)
    $('#endgameButton').remove()
    $('#endgamePanel div').last()
    .text(`Please try again later for fresh questions.`)
    .css('margin-top', '2rem')
}

/**
 * Reset the game so the user can play again
 */
const resetGame = () => {
    triviaPanels.empty()
    correctAnswers.length = 0
    currentQuestion = 0
    difficultyMultiplier = 1
    currentScore = 0
    correctTotal = 0
    $('#endgamePanel').hide()
    categoryPanel.fadeIn(1000)
    gameTitle.fadeIn(1000).text(`Choose Your Category`)
    $('#playerScore').text(`Score`)
    disableButton('#begin')
    updateScoreboard(playerScores)
}

/**
 * Disable specific button
 */
const disableButton = selector => {
    $(selector).attr('disabled', true)
}

/**
 * Enable specific button
 */
const enableButton = selector => {
    $(selector).removeAttr('disabled')
}

$(document).ready(function () {

    checkResponse('https://opentdb.com/api_category.php')
    checkLocalScore()
    enableButton('#welcomePlayButton')

    $(document).on('click', '#reloadButton', function() {
        window.location.reload(true)
    })

    $(document).on('click', '#welcomePlayButton', function () {
        $('#welcomePanel').hide()
        loadingSpinner.show()
        if (serverResponse === true) {
            loadCategories()
        } else {
            loadLocal()
        }
    })

    $(document).on('click', '.game--category-select', function() {
        return $(this).attr('id')
    })

    $(document).on('click', '.game--category-select', function(event) {
        _this = $(this)
        userCategory = event.result
        categoryPanel.hide()
        difficultyPanel.fadeIn(1000)
        gameTitleText()
    })

    $(document).on('click', '.game--difficulty-select', function() {
        return $(this).attr('id')
    })

    $(document).on('click', '.game--difficulty-select', function (event) {
        userDiff = event.result
        enableButton('#begin')
    })

    $(document).on('click', '#changeCategory', function() {
        gameTitle.text('Choose Your Category')
        difficultyPanel.hide()
        categoryPanel.fadeIn(1000)
        disableButton('#begin')
    })

    $(document).on('click', '#begin', function() {
        difficultyPanel.hide()
        gameContent.hide()
        loadingSpinner.show()
        loadGame()
        currentCategory = gameTitle.text()
        $('#currentQuestion')
        .text(`${currentQuestion + 1}/${correctAnswers.length}`)
        setDifficultyMultiplier()
    })

    $(document).on('click', '.game--answer--single', function() {
        _this = $(this)
        checkAnswer()
        disableButton('.game--answer--single')
        handleSelection()
        updateGameInfo()
    })

    $(document).on('click', '#endgameButton', function() {
        resetGame()
    })

    $(document).click(function() {
        $('.navbar-collapse').collapse('hide')
    })
})
