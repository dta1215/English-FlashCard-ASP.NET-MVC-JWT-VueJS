
const playTemplate = 
`
<div class="vueTopicContainer">
    <h4 class="childbox-header">{{Topic.topicName}}</h4>
    <div id="FlashCard" class="flashCardContainer">
        <div class="slider">
            <div class="flashCard dummyflashCard">
                <div class="front">
                </div>
                <div class="back">
                </div>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="loadingContainer">
            <div class="loadingStatus"></div>
        </div>
        <div class="slideControlArea">
            <div style="float:left;">Page: </div><div style="float:left;" class="pageStatus"></div>
        </div>
        <div class="flashCardControlArea">
            <button id="btnNext" class="btn btn-sm btn-primary"><i class="fas fa-arrow-right"></i> Next</button>
            <button id="btnShuffle" class="btn btn-sm btn-primary"><i class="fas fa-random"></i> Shuffle</button>
            <button id="btnAutoPlay" class="btn btn-sm btn-primary"><i class="fas fa-play"></i> Auto Next</button>
        </div>
    </div>
    <hr />
    <h4 class="childbox-header">Correct Answer Game</h4>
    <div id="CorrectAnswer" class="correctAnswerArea">
        <div class="showAnswer"></div>
        <audio id="loadAudio" hidden></audio>
        <audio id="correctAudio" src="/Content/audio/correct sound.mp3" hidden></audio>
        <audio id="inCorrectAudio" src="/Content/audio/incorrect sound.mp3" hidden></audio>
        <text>Type correct answer </text><input id="inputAnswer" type="text" />
        <button id="btnSubmitAnswer" class="btn btn-sm btn-danger">Submit answer</button>
    </div>
                
    <hr />
    <div id="MatchingGame" class="matchingGameArea">
        <h4 class="childbox-header">Matching Game</h4>
        <div class="timeArea">
            <div style="float: left;">Total time:  </div><div class="timming" style="float: left;">0</div><div class="timeUnit" style="float: left;"> s</div>
        </div>
        <button id="btnShuffleMeaning" classs="btn btn-sm btn-primary">Shuffle Answer</button>
        <div class="matchingGameContainer">
            <div class="matchingArea">
                <div class="meaningArea"> </div>
                <div class="vocabularyArea"> </div>
            </div>
            <div class="startArea">
                <button id="btnStartGame" class="btn btn-lg btn-danger">Start Matching Game</button>
                <button id="btnEndGame" class="btn btn-danger" hidden>End</button>
            </div>
        </div>
    </div>

    <div class="completeMatchingArea">
        <div class="mainComplete">
            <p class="completeResult"></p>
            <div class="completeControl">
                <button id="btnPlayAgain" class="btn btn-sm btn-info">Play Again</button>
                <button id="btnCloseCompleteMatchingArea" class="btn btn-sm btn-danger">Cancle</button>
            </div>
        </div>
    </div>
</div>


`

//<div class="stateContainer"></div>

const Play = {
    template: playTemplate,
    data() {
        return {
            topicID: null,
            Topic: {}
        }
    },
    methods: {
        async loadTopicToPLay() {
            await store.dispatch('playTopic', this.topicID).then((result) => {
                this.Topic = result
            })
        },
        async init(vueComponent) {
            $(document).ready(async function () {
                //loadOtherTopics()

                if (correctAnswerGame.temp.getAnswer()) {
                    $('#inputAnswer').val(correctAnswerGame.temp.getAnswer())
                }

                handleNavSideMenu()
                const res = await Load()

                //RUN Handler after Load Data
                await Handler()

                const rootFlashCards = await res
                if (rootFlashCards) {
                    initMatchingGame(rootFlashCards)
                    matchAction()
                }

                await fillCorrectAsnwerGame()
            });

            const gameTime = {
                time: 0,
                timmer: {},
                timeEnd: 0,
                updateTime(callback) {
                    this.timmer = window.setInterval(() => {
                        ++this.time
                        callback(this.time)
                    }, 1000)
                },
                reset(time = 0) {
                    this.time = time
                },
                start() {
                    this.updateTime()
                },
                end() {
                    this.timeEnd = this.time
                    window.clearInterval(this.timmer)
                    this.reset()
                }
            }

            const [btnStartGame, btnEndGame] = [$('#btnStartGame'), $('#btnEndGame')]
            const btnShuffleMeaning = $('#btnShuffleMeaning')

            btnShuffleMeaning.click(() => {
                const meaningArea = $('.meaningArea')
                const shuffle = meaningArea.children().sort(() => {
                    return Math.random() - 0.6
                })
                meaningArea.empty().append(shuffle)
                $('.vocabularyArea').html($('.vocabularyArea').html())
                matchAction()
            })

            btnStartGame.click(() => {
                $('.startArea').fadeOut(1000)
                gameTime.updateTime((time) => {
                    $('.timming').text(time)
                    $('.timeUnit').text(` s`)
                })
            })

            btnEndGame.click(() => {
                gameTime.end()
                gameTime.reset(-1)
                let time = gameTime.timeEnd
                let completeResult
                if (time % 60 == 0) {
                    completeResult = `${time / 60} phút`
                } else {
                    completeResult = `${Math.floor(time / 60)} minutes` + ` and ${time % 60} seconds`
                }
                completeGameWithTime(completeResult)
            })

            function completeGameWithTime(totalTime) {
                if (totalTime) {
                    $('.completeResult').text(`You have completed Matching Game with total time is: ${totalTime}`)
                    $('.completeMatchingArea').show(300)

                    $('#btnCloseCompleteMatchingArea').click(() => {
                        $('.completeMatchingArea').hide()
                    })

                    $('#btnPlayAgain').click((e) => {
                        e.stopImmediatePropagation()
                        $('.completeMatchingArea').hide()
                        btnStartGame.trigger('click')
                        initMatchingGame()
                        matchAction()
                    })
                }
            }

            initMatchingGame()
            function initMatchingGame() {
                const slider = $('.slider')
                const flashCard = $('.flashCard')

                const vocabularies = $('.vocabulary')
                const meanings = $('.meaning')

                let vocabulariesMatching = vocabularies.map((i, curr) => {
                    if ($(curr).is('img')) {
                        return $(curr).attr('src')
                    }
                    return $(curr).text()
                })
                let meaningMatching = meanings.map((i, curr) => {
                    return $(curr).text()
                })

                renderMatchingGame()
                function renderMatchingGame() {
                    //let hasURL = "http" || "https" || "img" || "data" || "base64"
                    let vocabulariesHTML = vocabulariesMatching.toArray().map((vocabulary, i) => {
                        if (/http|img|data|base64/.test(vocabulary)) {
                            return `
                            <div draggable="true" class="vocabularyCard" id="${i}">
                                <img class="imgMatching imgPlay" src="${vocabulary}" />
                            </div> 
                        `
                        }
                        return `
                        <div draggable="true" class="vocabularyCard" id="${i}">
                            <p>${vocabulary}</p>
                        </div> 
                    `
                    }).join("")
                    const meaningsHTML = meaningMatching.toArray().map((meaning, i) => {
                        return `
                        <div draggable="false" class="meaningCard Card${i}" id="${i}">
                            <p>${meaning}</p>
                        </div>
                    `
                    }).join("")
                    // Render result HTML / append
                    $('.vocabularyArea').html(vocabulariesHTML)
                    $('.meaningArea').html(meaningsHTML)
                }
            }

            matchAction()
            function matchAction() {
                let pairMatch = 0
                const answerObject = {
                    pair: 0
                }
                const meaningCard = $('.meaningCard')
                const vocabularyCard = $('.vocabularyCard')
                let countCorrectMatching = $('.meaningCard:not([style*="display: none"])').length

                let answerChange = new Proxy({}, {
                    set: function (target, prop, receiver) {
                        // on answerpair change, start matching
                        if (receiver == 2) {
                            const pair = $('.flashCardSelected')
                            const id1 = $(pair[0]).attr('id')
                            const id2 = $(pair[1]).attr('id')

                            if (id1 == id2) {
                                $('#correctAudio')[0].play()
                                pairMatch = 0
                                updateCompleteState(countCorrectMatching--)
                                $(pair[0]).removeClass('flashCardSelected').fadeOut(300)
                                $(pair[1]).removeClass('flashCardSelected').fadeOut(300)
                            } else {
                                $('#incorrectAudio')[0].play()
                            }
                        }
                    }
                })

                meaningCard.on('click', function (e) {
                    e.stopImmediatePropagation()
                    $(this).toggleClass('flashCardSelected')
                    // if selected
                    if ($(this).hasClass('flashCardSelected')) {
                        answerChange.select = ++pairMatch
                    } else {
                        answerChange.select = --pairMatch
                    }
                })

                vocabularyCard.on('click', function (e) {
                    e.stopImmediatePropagation()
                    $(this).toggleClass('flashCardSelected')
                    if ($(this).hasClass('flashCardSelected')) {
                        answerChange.select = ++pairMatch
                    } else {
                        answerChange.select = --pairMatch
                    }
                })

                function updateCompleteState(matchCount = 0) {
                    if (matchCount == 1) {
                        btnEndGame.trigger('click')
                    }
                }
            }



            const correctAnswerGame = (function answerGame() {
                const temp = {
                    clearTemp: function () {
                        localStorage.clear()
                    },
                    saveTemp: function (template, answer) {
                        temp.clearTemp()
                        localStorage.setItem('template', template)
                        localStorage.setItem('answer', answer)
                    },
                    getTemplate: function () {
                        return localStorage.getItem('template')
                    },
                    getAnswer: function () {
                        return localStorage.getItem('answer')
                    }
                }

                function handleAnswer(correct, answer) {
                    // const correct = "hi sandro where are you from"
                    // const answer = "dang the anh"
                    // hi sandro where are you from  cat walk on air  down in the dump
                    // toi ten la dang the anh       dang the anh     dang the anh

                    const resultHTML = answer.split('').map((char, i) => {
                        if (char == " ") {
                            return `<text class="space">${char}<text>`
                        }
                        return `<text>${char}<text>`
                    })
                    $('.showAnswer').append(resultHTML)

                    const existPhrase = []
                    const resultValue = []
                    let existElement = []
                    let phraseHold = []

                    const result = answer.split(' ').map((phrase, i) => {
                        correct.split(' ').map((phr2, j) => {
                            phr2.split('').map((char) => {
                                if (phrase.includes(char) && !existPhrase.includes(phrase) && !existPhrase.includes(phr2)) {
                                    // console.log("1:", phrase, phr2, char);
                                    let findChar
                                    let before, after


                                    if (!existElement.includes(char)) {
                                        findChar = $(`.showAnswer text:contains(${char})`).not('.insert').not('.root').first()
                                        findChar.addClass('root')
                                    } else {
                                        findChar = $(`.showAnswer text:contains(${char})`).not('.insert').not('.root').eq(1)
                                        findChar.addClass('root')
                                    }

                                    // Insert correct missing word Section
                                    if (phr2.indexOf(char) == phr2.length) {
                                        findChar.prevAll('text').addClass('delete-Active')
                                        findChar.prevAll('text').fadeOut(2000, function () {
                                            $(this).remove()
                                        })
                                        before = phr2.slice(0, phr2.indexOf(char))
                                        findChar.before(`<text class="insert">${before}</text>`)
                                    }
                                    else if (phr2.indexOf(char) == 0) {
                                        findChar.prevUntil('.space').addClass('delete-Active')
                                        findChar.prevUntil('.space').fadeOut(2000, function () {
                                            $(this).remove()
                                        })
                                        after = phr2.slice(1, phr2.length)
                                        findChar.after(`<text class="insert">${after}</text>`)
                                    }
                                    else if (phr2.indexOf(char) > 0 && phr2.indexOf(char) < phr2.length) {
                                        before = phr2.slice(0, phr2.indexOf(char))
                                        after = phr2.slice(phr2.indexOf(char) + 1, phr2.length)
                                        // console.log(before + " " + after );

                                        // console.log(findChar.nextUntil('.space'));
                                        if (findChar.nextUntil('.space').length > 0) {
                                            findChar.nextUntil('.space').addClass('delete-Active')
                                            findChar.nextUntil('.space').fadeOut(2000, function () {
                                                $(this).remove()
                                            })
                                        }
                                        findChar.prevUntil('.space').addClass('delete-Active')
                                        findChar.prevUntil('.space').fadeOut(3000, function () {
                                            $(this).remove()
                                        })
                                        findChar.before(`<text class="insert">${before}</text>`)
                                        findChar.after(`<text class="insert">${after}</text>`)
                                    }
                                    existPhrase.push(phrase)
                                    existPhrase.push(phr2)
                                    findChar.nextUntil('.space').map((i, e) => {
                                        existElement.push($(e).text())
                                    })
                                }
                            })
                        })
                    })

                    const template = correct.split(' ').map((phrase, i) => {
                        return phrase
                    })
                    let phraseGroup = []

                    setTimeout(() => {
                        $('.showAnswer').find('text').first().before(`<text class="space"></text>`)
                        $('.showAnswer').append(`<text class="space"></text>`)
                        $('.showAnswer').find('.space').map((i, curr) => {
                            let group = $(curr).prevUntil('.space')
                            const res = [...group].some((e, i) => {
                                return $(e).hasClass('insert')
                            })
                            if (!res) {
                                group.addClass('delete-Active')
                                group.remove()
                            } else {
                                phraseGroup.push(group)
                            }
                        })
                        const resHTML = phraseGroup.map((group, i) => {
                            const mergeCharacters = Object.assign([], group).reverse().map((curr, i) => {
                                return $(curr).text()
                            })
                            return `<text class="group">${mergeCharacters.join('')}</text>`
                        }).join(`<text class="space"> </text>`)
                        $('.showAnswer').empty().append(resHTML)

                        $('.showAnswer text.group').map((i, element) => {
                            $(element).fadeOut(1000, function () {
                                $(this).text(template[i] + " ")
                                $(this).fadeIn(200)
                            })
                        })

                        // append phan tu con lai
                        const start = $(`.showAnswer`).find(`.group`).length
                        let remainGroup = template.slice(start, template.length)
                        $(remainGroup).each((i, group) => {
                            $('.showAnswer').append(`<text class="group">${group}</text><text class="space"> </text>`)
                        })
                    }, 3000)
                }
                return {
                    temp: temp,
                    handleAnswer: handleAnswer
                }
            })()



            async function fillCorrectAsnwerGame() {
                //correctAnswerArea
                //showAnswer
                //inputAnswer
                //btnSubmitAnswer
                $('#btnNext').click((e) => {
                    e.stopImmediatePropagation()
                    $('.showAnswer').empty()
                    //$('#inputAnswer').val("").focus()
                })

                $('#btnSubmitAnswer').click(() => {
                    $('.showAnswer').empty()
                    const currActiveFlashCard = $('.slider > .flashCard.active')

                    const correct_Answer = currActiveFlashCard.find('.meaning').text()
                    const userAnswer = $('#inputAnswer').val()
                    correctAnswerGame.temp.saveTemp(correct_Answer, userAnswer)

                    if (correct_Answer === userAnswer) {
                        soundEffect().play('/content/audio/correct-v2.mp3')
                    } else {
                        soundEffect().play('/content/audio/wrong-v1.mp3')
                        setTimeout(() => {
                            correctAnswerGame.handleAnswer(correct_Answer, userAnswer)
                        }, 1000);
                    }
                })
            }

            async function Load() {
                //const res = await $.get(`/topic/play/${vueComponent.currID}`)
                //vueComponent.Topic = JSON.parse(res)\
                let html = ``
                $.each(vueComponent.Topic.FlashCards, (i, flashCard) => {
                    html += `
                        <div class="flashCard">
                            <div class="front">
                                <img class="vocabulary" src="${flashCard.Content}" loading="lazy" alt="Alternate Text" />
                            </div>
                            <div class="back">
                                <h1 class="meaning">${flashCard.Vocabulary}</h1>
                            </div>
                        </div>
                    `
                })
                $('.slider').empty().html(html)
                return new Promise((resolve) => {
                    const flashCards = $('.flashCard')
                    resolve(flashCards)
                })
            }

            async function Handler() {
                const flashCardContainer = ('.flashCardContainer')
                const slider = $('.slider')
                let flashCard = $('.flashCard')

                const btnShuffle = $('#btnShuffle')
                const btnNext = $('#btnNext')
                const btnAutoPlay = $('#btnAutoPlay')

                var posX = 0
                let currPage = 1
                const totalPage = flashCard.length

                FlashCardHandler()
                function FlashCardHandler() {
                    $(flashCard[0]).addClass('active')
                    flashCard.click(function (e) {
                        const currFlashCard = $(this)
                        const isActive = currFlashCard.hasClass("active")
                        if (isActive) {
                            $('.front').toggleClass('frontFlip')
                            $('.back').toggleClass('backFlip')
                        }
                    })

                    //console.log($('.pageStatus'), currPage, totalPage)
                    $('.pageStatus').text(`${currPage}/${totalPage}`)

                    btnNext.click((e) => {
                        e.stopPropagation()
                        const activatingFlashCard = slider.find('.flashCard.active')
                        const nextFlashCard = activatingFlashCard.next()
                        ++currPage

                        activatingFlashCard.removeClass("active")
                        nextFlashCard.addClass("active")
                        nextFlashCard.children().eq(1).removeClass("backFlip")
                        nextFlashCard.children().eq(0).removeClass("frontFlip")

                        const flashCardWidth = $('.flashCard').innerWidth()

                        posX += -flashCardWidth
                        if (posX == (flashCard.length * -flashCardWidth)) {
                            posX = 0
                            slider.css('transform', `translateX(${posX}px)`)
                            currPage = 1
                            const firstFlashCard = flashCard.first().addClass("active")
                        } else {
                            slider.css('transform', `translateX(${posX}px)`)
                        }
                        $('.pageStatus').text(`${currPage}/${totalPage}`)
                    })
                }

                btnShuffle.click((e) => {
                    const newFlashCard = flashCard.sort((item) => {
                        return Math.random() - 0.6
                    })
                    slider.empty().html(newFlashCard)
                    slider.find('.active').removeClass('active')
                    $(newFlashCard[0]).addClass("active")
                    posX = 0
                    slider.css('transform', `translateX(${posX}px)`)
                    currPage = 1
                    $('.pageStatus').text(`${currPage}/${totalPage}`)

                    FlashCardHandler()
                })

                AutoPlay()
                function AutoPlay() {
                    var autoInterval
                    btnAutoPlay.click((e) => {
                        const loadingStatus = $('.loadingStatus')
                        if (!autoInterval) {
                            $('.loadingContainer').show()
                            loadingStatus.animate({ width: '0px' }, 1)
                            loadingStatus.animate({ width: '300px' }, 5000, "linear")

                            autoInterval = window.setInterval(() => {
                                loadingStatus.animate({ width: '0px' }, 1)
                                btnNext.click()
                                loadingStatus.animate({ width: '300px' }, 5000, "linear")
                            }, 5000);
                        } else {
                            window.clearInterval(autoInterval)
                            loadingStatus.animate({ width: '0px' }, 1, () => {
                                $('.loadingContainer').hide()
                            })
                            autoInterval = undefined
                        }
                    })
                }
            }

            function handleNavSideMenu() {
                $(window).scroll(function (e) {
                    const scrollTop = $(this).scrollTop()

                    const headerHeight = $('.header').outerHeight()
                    if (scrollTop < headerHeight) {
                        removeDockNavSideMenu()
                    } else {
                        makeDockNavSideMenu()
                    }
                    function makeDockNavSideMenu() {
                        $('.stateContainer').addClass('dockMenu')
                    }
                    function removeDockNavSideMenu() {
                        $('.stateContainer').removeClass('dockMenu')
                    }
                })
            }

            function soundEffect() {
                const sound = {
                    src: "",
                    play: function (getSrc, volume = 1.0) {
                        sound.src = getSrc
                        $('#loadAudio').attr('src', getSrc)
                        $('#loadAudio')[0].volume = volume
                        $('#loadAudio')[0].play()
                    }
                }
                return sound
            }


            async function loadOtherTopics() {
                const ID = this.currID
                let page = 0
                //showOtherTopic
                const firstLoad = await $.get(`/Topics/LoadMore/${ID}/0`)
                if (firstLoad) {
                    const firstLoadHTML = firstLoad.map((topic, i) => {
                        return `<p><a href="/Home/Play/${topic.topicID}">${topic.topicName}</a></p>`
                    }).join('')
                    $('.showOtherTopic').empty().html(firstLoadHTML)
                }


                $('#btnLoadMore').click(async () => {
                    ++page
                    const res = await $.get(`/Topics/LoadMore/${ID}/${page}`)
                    if (res.length >= 1) {
                        const resHTML = res.map((topic, i) => {
                            return `<p><a href="/Home/Play/${topic.topicID}">${topic.topicName}</a></p>`
                        }).join('')
                        $('.showOtherTopic').append(resHTML)
                    } else {
                        $('#btnLoadMore').hide()
                    }
                })
            }
        }
    },
    mounted: async function () {
        this.topicID = this.$route.params.id

        await this.loadTopicToPLay()
        this.init(this)
    }
}