const categoryWhitelist = ['General Knowledge', 'Entertainment: Books', 'Entertainment: Film', 'Entertainment: Music', 'Entertainment: Television', 'Entertainment: Video Games', 'Science & Nature', 'Science: Computers', 'Sports', 'Geography', 'History', 'Entertainment: Japanese Anime & Manga']
const gamePlayer = {
    'username': '',
    'scores': []
}
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
 * Checks the API server for response and sets variable based on result
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

const serverFailed = () => {
    welcomePanel.children('form').remove()
    welcomePanel.children('div').children().children('p').text('Unfortunately our we are having issues contacting our database. If you would like to play with locally stored questions, press play. Otherwise please try again later.')
    welcomePanel.css('height', '50vh')
    welcomePanel.css('padding', '0 10px')
}

checkResponse('https://opentdb.com/api_category.php')

/**
 * Uses fetch API to return JSON data
 * @param {string} url takes an API address to fetch data
 */
const getData = async url => {
    try {
        return await (await fetch(url)).json()
    }
    catch {
        $('#serverErrorAlert').show()
        loadingSpinner.hide()
    }
}
// const filterCategories = (completeList, filterList) => {
//     return completeList.filter(item => {
//         return filterList.includes(item.name)
//     })
// }
/**
 * Filters a list of chosen categories out of the complete list from the API
 * @param {array} completeList The API category list
 * @param {array} filterList Chosen category whitelist
 */
const filterCategories = (completeList, filterList) => {
    return completeList.filter(item => {
        return filterList.includes(item.name)
    })
}

/**
 * Displays a list of categories in the DOM
 * @param {array} categoryList The list of categories to display
 */
const displayCategories = categoryList => {
    rowNum = 0
    colNum = 4
    rowID = 1
    for (i=0; i<categoryList.length; i++) {
        if (rowNum % colNum === 0) {
            categoryPanel.append(`<div class='row game--category-row' id='row${rowID}'>`)
        }
        rowNum++
        $(`#row${rowID}`).append(`<button class='btn col-4 col-md-3 mx-auto game--category-select' id='${categoryList[i].id}'>${categoryList[i].name}</button>`)
        if (rowNum % colNum === 0) {
            categoryPanel.append(`</div>`)
            rowID++
        }
    }
}
// if (el.name.includes('Entertainment: ')) {
//     console.log(el.name.slice(15))
// }

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

const loadLocal = async () => {
    await processTrivia('./assets/localdata/localTrivia.json')
    gameTitle.text('Local Questions')
    $('#gamePanel0').show()
    gameContent.fadeIn(1000)
    triviaWrapper.fadeIn(1000)
    loadingSpinner.hide()
    categoryPanel.hide()
    $('#currentQuestion').text(`${currentQuestion + 1}/${correctAnswers.length}`)
}

/**
 * Generate a URL to fetch the specific trivia the user selects from the API
 * @param {number} categoryID the id of the category
 * @param {string} difficulty the selected difficulty
 */
function generateURL(categoryID, difficulty) {
    let urlDefault = 'https://opentdb.com/api.php?amount=10&type=multiple'
    let urlCategory = '&category=' + categoryID
    let urlDifficulty = '&difficulty=' + difficulty
    return urlDefault + urlCategory + urlDifficulty
}

/**
 * Process array of data returned from the API
 * @param {string} triviaUrl address to fetch specific data from the API, generated by user selection
 */
const processTrivia = async (triviaUrl) => {
    const data = await getData(triviaUrl)
    triviaData = data.results
    triviaData.forEach((_, index) => {
        correctAnswers.push(he.decode(triviaData[index].correct_answer))
        triviaData[index].incorrect_answers.push(triviaData[index].correct_answer)
    })
    for (i=0; i<triviaData[i].incorrect_answers.length; i++) {
        triviaData[i].incorrect_answers.sort(() => Math.random() - 0.5)
    }
    displayTrivia()
    gameContent.hide()
    loadingSpinner.show()
}

const displayTrivia = () => {
    triviaData.forEach((trivia, index) => {
        triviaPanels.append(`<div class='element__hidden' id='gamePanel${index}'>
        <div class='row mx-0 game--question'>
            <div class='col-12 mx-auto my-auto'>
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
    correctAnswers.forEach((answer, index) => {
       for (i=0; i<4; i++) {
           if ($(`#trivia${index}Answer${i}`).text() === answer) {
            $(`#trivia${index}Answer${i}`).addClass(`correct-answer${index}`)
           }
       }
    })
}

const checkUsernameExists = () => {
    if (typeof($('#usernameInput').val()) === 'string') {
        gamePlayer.username = $('#usernameInput').val()
        localStorage.setItem(`${gamePlayer.username}`, JSON.stringify(gamePlayer))
    }
}

const gameTitleText = () => {
    if (_this.text().includes('Entertainment')) {
        gameTitle.text(_this.text().slice('15'))
    } else {
        gameTitle.text($(this).text())
    }
}

const loadGame = async () => {
    await processTrivia(generateURL(userCategory, userDiff))
    $('#gamePanel0').show()
    gameContent.fadeIn(1000)
    triviaWrapper.fadeIn(1000)
    loadingSpinner.hide()
}

function updateScoreboard() {
    $('#scoreboardBody').empty()
    for (const property in gamePlayer.scores) {
        $('#scoreboardBody').append(`<p>${property}: ${gamePlayer.scores[property]}</p>`)
    }
    localStorage.setItem(`${gamePlayer.username}`, JSON.stringify(gamePlayer))
    console.log('scoreboard updated');
}

const setDifficultyMultiplier = () => {
    if (userDiff === 'hard') {
        difficultyMultiplier = 3
    } else if (userDiff === 'medium') {
        difficultyMultiplier = 2
    } else {
        difficultyMultiplier = 1
    }
}

const checkAnswer = () => {
    if (_this.is(`.correct-answer${currentQuestion}`)) {
        _this.addClass('btn-success')
        console.log('correct')
        correctTotal++
        currentScore = (correctTotal * difficultyMultiplier)
    } else {
        console.log('incorrect')
        _this.addClass('btn-danger')
        $(`.correct-answer${currentQuestion}`).addClass('btn-outline-success').removeClass('game--answer--outline')
    }
}

const handleSelection = () => {
    setTimeout(() => {
        $(`#gamePanel${currentQuestion}`).hide()
        $(`#gamePanel${(currentQuestion + 1)}`).fadeIn(1000)
        currentQuestion++
        enableButton('.game--answer--single')
        $('#currentQuestion').text(`${currentQuestion + 1}/${correctAnswers.length}`)
        endGameProcess()
    }, 1500)
}

const updateGameInfo = () => {
    if (currentScore === 1) {
        $('#playerScore').text(`${currentScore} point`)
    } else {
        $('#playerScore').text(`${currentScore} points`)
    }
}

const endGameProcess = () => {
    if (currentQuestion === correctAnswers.length) {
        triviaWrapper.hide()
        gameTitle.hide()
        $('#endgamePanel').fadeIn(1000)
        if (typeof(gamePlayer.username) === 'string' && gamePlayer.username.length > 0) {
            $('#endgameScore').children().children('h2').text(`${gamePlayer.username}!`)
        }
        $('#endgameScore').children().children('h4').text(currentCategory)
        $('#endgameScore p').first().text(`Correct answers: ${correctTotal}`)
        $('#endgameScore p').last().text(`Difficulty multiplier: ${difficultyMultiplier}`)
        $('#endgameScore').children().children('h5').text(`Total score: ${currentScore}`)
        Object.assign(gamePlayer.scores, {[currentCategory]: currentScore})
        updateScoreboard()
    }
}

function resetGame() {
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
    updateScoreboard()
}

function disableButton(selector) {
    $(selector).attr('disabled', true)
}

function enableButton(selector) {
    $(selector).removeAttr('disabled')
}

$(document).ready(function () {

    enableButton('#welcomePlayButton')

    $(document).on('click', '#reloadButton', function() {
        window.location.reload(true)
    })

    $(document).on('click', '#welcomePlayButton', function () {
        checkUsernameExists()
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
        $('#currentQuestion').text(`${currentQuestion + 1}/${correctAnswers.length}`)
        $('#displayUsername').text(gamePlayer.username)
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
