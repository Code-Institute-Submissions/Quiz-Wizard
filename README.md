# Quiz Wizard

Build an interactive front-end site. The site should respond to the users' actions, allowing users to actively engage with data, alter the way the site displays the information to achieve their preferred goals.

--------------------

## UX (User Experience)
### Project Goals
The goal of this project is to provide an educational and entertaining experience for the users. This will be in the form of a web app, aimed at anyone interested in the content of the game. To achieve this the site needs to be easily accessible to people of all ages.

### User Goals
* An entertaining way to learn new facts
* An easy way to test their trivia knowledge
* A fun way to pass the time that feels meaningful
* Able to use the website on mobile, tablet or desktop

### User Requirements and Expectations
##### Requirements
* Choose category of questions
* Input answer selection
##### Expectations
* Choose difficulty of questions
* Display results and score
* Immediate feedback after each question

#### User Stories

* As a user, I would like to be able to play a game of trivia so that I can challenge my knowledge
* As a user, I would like to be able to choose from a selection of categories so that I can have a choice in what the game is about
* As a user, I would like to be able to select the difficulty of the questions so that I can customise the challenge of the game
* As a user, I would like to be able to see my score and record it so that I can track my progress

<em>"As an avid game show fan, I want to participate in a similar experience so that I can feel like I'm a part of the show. Maybe one day I'll feel confident enough to go on one!"</em> - A. Plaza

<em>I teach children in their early teens, and I'm looking for something fun and interesting to do when they have finished all their assignments. I want to be able to challenge them with general knowledge, but not questions that are too difficult.</em> - Mr. Crisp

<em>Since I retired I have a lot of spare time, I like to keep my mind sharp by exercising it with challenging activities such as trivia. I want something easy to use so that I can focus on the qeustions.</em> - Arnold

## Site Owner Goals
* Display trivia information for users and display their answers
* Create an engaging and enjoyable experience for users
* An intuitive and easy to navigate app

### Scope

##### Single page web app

* nav bar/header
* help
* category selection
* display questions and update
* display score
* reset button

#### Functional Requirements

* The site will be public and available to anyone
* Users are able to interact with the game
* Stores and displays updated and relevent data

#### Content Requirements

* Header with logo, game name and menu
* Display content of the game - category, question, answer choices, result and score

### Structure

#### Interaction design

* Navigation at top. Due to the nature of the project being a single page, navigation will be limited to instructions and resetting the game
* Clicking the logo also resets the game - possibly with a confirmation required so user doesn't lose progress
* Could have an initial welcome screen that fades or requires a button click to begin, rather than opening on a category select screen

## Design Choices

Because trivia is a mental activity and a game, I decided to create a theme that focuses on promoting mental clarity while still appearing fun and engaging.

##### Colours
I originally used [coolers.co](https://coolors.co/) to design a colour scheme, but upon implementation I didn't think it looked good. Instead I opted for a the Bootswatch theme ['Superhero'](https://bootswatch.com/superhero/).

This theme closely matched my original colours and was already tried and tested in implementation. My colour choices were influenced by [this](https://coschedule.com/blog/color-psychology-marketing/) blog on colour psychology. Green <em>"lends us a clearer sense of right from wrong since green incorporates a balance of both the logical and emotional"</em> and Blue <em>"lends a more mental reaction rather than physical that allows us to destress, calm down, and think of the most ideal situation."</em> I wanted to combine these into a single colour that I believe would be suited to the aformentioned philosophy for this project

##### Fonts
* Primary: Manrope - After doing some research on font psychology I decided this is a good choice for the main text of this project. This is due to it's clean, neutral appearance. I want this because I don't want people to be distracted by the font when reading questions and thinking of answers
* Logo: Bowlby One SC - A sleek, modern display font for the game logo and welcome page

##### CSS
* I have chosen to use the [BEM](http://getbem.com/) naming convention for my CSS classes. I like the way this reads and allows for descriptive naming for ease of use.

Note on CSS: I have chosen to use vw/vh on padding and margins in a lot of cases as I believe this allows for an even more responsive experience than using solely rem. My decision was influenced by my own experimentation as well as researching, particularly [this](https://www.elegantthemes.com/blog/divi-resources/better-mobile-website-design-how-to-use-vw-vh-and-rem-to-create-fluid-divi-pages) article.

## Wireframes
I used [Pencil](https://pencil.evolus.vn/) to design my wireframes, giving me a rough outline of how I wanted the data to be displayed on the website. They are avaiable to view [here](assets/wireframes)

## Features
* Database request for trivia selection
* Dynamic processing and displaying of trivia data
* Scoreboard updating and storing user score
* Help popup
* Slide navigation menu on mobile

### Future planned features
* Ability to choose a player name and store multiple players and their scores
* Display high scores per player and per category


## Technologies Used

### Languages
* [HTML](https://www.w3schools.com/html/)
* [CSS](https://www.w3schools.com/css/)
* [JavaScript](https://www.w3schools.com/js/)
* [JSON](https://www.json.org/json-en.html)

### Tools and Libraries
* [Bootstrap](https://getbootstrap.com)
* [Bootswatch](https://bootswatch.com/)
* [JQuery](https://jquery.com)
* [Popper.JS](https://popper.js.org/)
* [Font Awesome](https://fontawesome.com/)
* [Google Fonts](https://fonts.google.com)
* [HTML entities (he)](https://github.com/mathiasbynens/he)
* [Git](https://git-scm.com/)

### Resources
* [Stack Overflow](https://stackoverflow.com)
* [MDN](https://developer.mozilla.org/en-US/)
* [w3 Schools](https://www.w3schools.com/)
* [Favicon Generator](https://www.favicon-generator.org/)
* [Loading spinner](https://loading.io/css/)
* [Flavio Copes](https://flaviocopes.com/)
* [Traversy Media](https://www.traversymedia.com/)
* [Web Dev Simplified](https://www.youtube.com/channel/UCFbNIlppjAuEX4znoulh0Cw)
* [The Coding Train](https://www.youtube.com/user/shiffman)

## Testing
* The website was constantly tested during development using Chrome dev tools
* During development the API database went down, so I implemented functionality to handle this, inform the user, and load locally stored data
* The original theme for the website did not look good once implemented and tested, so I had to redesign it
* Tested retrieving, processing and displaying data from the API dynamically constantly through development, both in the console and the DOM

## Bugs
Multiple clicks:
* Bug: It was possible to click my event handlers multiple times, completely breaking the game functionality
* Fix: After receiving an input, buttons are disabled and then re-enabled when another input is required

Special characters:
* Bug: The API delivers data with special character encoding, and my function to check the answer was testing decoded text against encoded text. Even if the correct answer was selected, it did not recognise it
* Fix: Use HTML Entities library (linked in tools and libraries) to decode the text from the API before processing it

## Deployment
* Deployed using Github Pages
* Re-tested the whole site after deployment
* Additionally tested using -
    * [Google Mobile Friendly Test](https://search.google.com/test/mobile-friendly) and received a mobile friendly result
    * [Webpagetest](https://www.webpagetest.org/) - [(result)](https://www.webpagetest.org/result/200511_FY_3dac919ab877314097c51632730c6b93/) and received a satisfactory result
    * Dev tools audit and after resolving the issue listed below received above 90 on all categories
    * Validated both HTML and CSS with [w3schools](https://www.w3schools.com/) validation service

### Issues encountered and steps taken to resolve
* Recommended by Dev tools audit to add a preconnect link to head element to improve loading time. Implemented this and increased performance score from high 70's to 91
* Added rel property to all stylesheets after using W3 validator

## Final comments
This was a fun yet very challenging project to learn. Using multiple resources I was able to implement a working trivia game by using a database to provide the user with a selection of categories and difficulty. Once they have made their choice I can dynamically display the data and process their answers.

I refactored the code multiple times for both consitency and modularity. This was both a frustrating and enlightening experience, as I have learned multiple ways to do things and am getting more efficient in my writing and understanding of the code. I can already imagine how to write a new project from scratch much more efficiently to save time and hassle refactoring.


