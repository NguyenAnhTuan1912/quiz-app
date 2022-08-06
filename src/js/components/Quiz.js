import AbstractClass from "./AbstractClass.js";
import {
    createElement,
    getParentElement,
    insertAfter,
    CountDown,
    Counter,
    QuizzesCheck,
    showModal,
} from "../Function.js";
import {
    navigateTo
} from "../Router.js";


const currentQuestion = (function() {
    return function ShowCurrentQuestion(event, data = {}, index = 0, quizzesCheck) {
        const { target } = event,
        { amount, questions } = data,
        quizPage = getParentElement((getParentElement((getParentElement(target))))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', questions[index]),
        c = new QuizChoices('', { questions: questions[index], amount: amount}, quizzesCheck);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        indexBtnState(indexBtns, index, questions);
    }
})();

const nextQuestion = (function() {
    return function NavigateToNextQuestion(event, data = {}, { counter, quizzesCheck }) {
        let index = counter.increase();
        if(index === data.length) return;
        const { target } = event,
        { amount, questions } = data,
        quizPage = getParentElement((getParentElement(target))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', questions[index]),
        c = new QuizChoices('', { questions: questions[index], amount: amount}, quizzesCheck);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        indexBtnState(indexBtns, index, questions);
    }
})();

const prevQuestion = (function() {
    return function NavigateToPreviousQuestion(event, data = {}, { counter, quizzesCheck }) {
        let index = counter.decrease();
        if(index === -1) return;
        const { target } = event,
        { amount, questions } = data,
        quizPage = getParentElement((getParentElement(target))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', questions[index]),
        c = new QuizChoices('', { questions: questions[index], amount: amount}, quizzesCheck);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        indexBtnState(indexBtns, index, questions);
    }
})();

// const chooseAnswer = (function() {
//     return function chooseTheAnswer(event, data = {}) {
//         const { target } = event;
//         if(!data.isChecked) {
//             target.style.backgroundColor = 'transparent';
//             target.style.color = '#262626';
//             data.isChecked = true;
//         }
//         target.style.backgroundColor = '#6495ED';
//         target.style.color = 'white';
//         data.isChecked = true;
//     }
// })();

function choiceCollectionState() {
    const inputs = [], indexBtns = [];
    let data;

    this.setData = (refData) => {
        data = refData;
    }

    this.setInput = (i) => {
        try {
            if(inputs.length > 4) throw 'Overflow: each question has only 4 choices.';
            inputs.push(i);
        } catch (error) {
            console.error(error);
        }
    }

    this.check = () => {
        console.log(inputs);
        console.log(indexBtns);
    }

    this.setIndexBtn = (indexBtn) => {
        indexBtns.push(indexBtn);
    }

    this.changeWhenTrue = (i, refData) => {
        let count = 0;
        inputs.forEach(input => {
            if(input === i) {
                getParentElement(input).style.backgroundColor = '#228B22';
                getParentElement(input).style.color = 'white';
                refData.checked = i.checked;
            }
            else {
                getParentElement(input).style.backgroundColor = 'transparent';
                getParentElement(input).style.color = '#262626';
                data[count].checked = false;
                input.checked = false;
            }
            count++;
        });
    }

    this.canSubmit = () => {}

    this.toggleSubmitButton = () => {}

    this.changeWhenFalse = () => {
        let count = 0;
        inputs.forEach(input => {
            getParentElement(input).style.backgroundColor = 'transparent';
            getParentElement(input).style.color = '#262626';
            input.checked = false;
            data[count].checked = false;
            count++;
        });
    }

    this.changeDataState = () => {
        data.forEach(subData => {
            subData.checked = false;
        });
    }

    this.toggleState = (() => {
        return function toggleDataAndRadio(index, refData) {
            if(inputs[index].checked) { 
                this.changeWhenTrue(inputs[index], refData);
            } else {
                this.changeWhenFalse();
            };
        }
    })();
}

function indexBtnState(buttons, index, data) {
    // if(data[index].choices.some(choice => choice.checked)) {
    //     buttons.forEach(button => {
    //         if(button === buttons[index]) button.style.backgroundColor = '#262626';
    //         else button.style.backgroundColor = 'transparent';
    //     });
    // }
    let i = 0;
    buttons.forEach(button => {
        if(button === buttons[index]) button.style.backgroundColor = '#6495ED';
        else if(data[i].choices.some(choice => choice.checked)) button.style.backgroundColor = '#262626';
        else button.style.backgroundColor = 'transparent';
        i++;
    });
}

export default class extends AbstractClass {
    #dom;
    #indexQuestion;

    constructor(params, data) {
        super(params, data);
        this.reset();
        this.setTitle('Quiz');
        document.querySelector('header .title').textContent = `Quiz / ${this.getData.name}`;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-page'
        });
        this.#indexQuestion = 0;
        this.initDom();
        this.initTime();
        this.getData.isPending = true; 
    }

    get getDom() {
        return this.#dom;
    }

    reset() {
        const { isPending, questions } = this.getData;
        if(!isPending) {
            questions.forEach(question => {
                const checkedChoice = question.choices.find(choice => choice.checked);
                if(checkedChoice) checkedChoice.checked = false;
            });
        }
    }

    initTime() {
        const [ minute, second ] = this.getData.time.split(':'),
        qCountDown = new CountDown(parseInt(minute), parseInt(second)),
        minuteField = this.#dom.querySelector('#js-minuteField'),
        secondField = this.#dom.querySelector('#js-secondField');
        qCountDown.setCountDownField(minuteField, secondField);
        qCountDown.run();
    }

    getCheckedQuestion() {
        let sum = 0;
        this.getData.forEach(value => {
            if(value.isChecked) sum++;
        });
        return sum;
    }

    init(data = {}, callBack = () => {}) {
        try {
            if(!data) throw 'Data Error: Null or Undefined.';
            callBack(data);
        } catch (error) {
            console.error(error);
        }
    }    

    currentQuestion() {
        // Cap nhap sau
    }

    initDom() {
        const { questions, amount } = this.getData,
        counter = new Counter(0, this.getData.questions.length - 1),
        quizzesCheck = new QuizzesCheck(),
        qInfo = new QuizInfo('', this.getData, { counter: counter, quizzesCheck: quizzesCheck });
        quizzesCheck.setData({questions: questions, amount: amount});

        const quizBtn = createElement({
            'type': 'div',
            'classNames': 'quiz-button'
        }),
        prevBtn = createElement({
            'type': 'button',
            'classNames': 'btn btn-primary-black btn-rounded-5px prev',
            'id': 'js-prevBtn'
        }),
        nextBtn = createElement({
            'type': 'button',
            'classNames': 'btn btn-primary-black btn-rounded-5px next',
            'id': 'js-nextBtn'
        }),
        submitBtn = createElement({
            'type': 'button',
            'classNames': 'btn btn-rounded-5px btn-disabled',
            'id': 'js-submitBtn'
        });

        submitBtn.setAttribute('data-message-box', 'note');

        nextBtn.addEventListener('click', event => nextQuestion(event,
            { questions: questions, amount: amount },
            { counter: counter, quizzesCheck: quizzesCheck }));
        prevBtn.addEventListener('click', event => prevQuestion(event,
            { questions: questions, amount: amount },
            { counter: counter, quizzesCheck: quizzesCheck }));
        submitBtn.addEventListener('click', event => {
            showModal(event);
        });

        submitBtn.setAttribute('data-id', `quiz-${this.getParams}`);

        nextBtn.textContent = 'Next';
        prevBtn.textContent = 'Previous';
        submitBtn.textContent = 'Submit';

        submitBtn.disabled = true;

        quizzesCheck.setSubmitButtonReference(submitBtn);
        quizzesCheck.listenChoosedQuestion();

        quizBtn.appendChild(prevBtn);
        quizBtn.appendChild(nextBtn);
        quizBtn.appendChild(submitBtn);
        
        const qQuestions = new QuizQuestions('', questions[this.#indexQuestion], quizzesCheck),
        qChoices = new QuizChoices('', {questions: questions[this.#indexQuestion], amount: amount}, quizzesCheck);

        this.#dom.append(
            qInfo.render(),
            qQuestions.render(),
            document.createElement('hr'),
            qChoices.render(),
            quizBtn
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizQuestions extends AbstractClass {
    #quizzesCheck
    #dom;

    constructor(params, data, objectContructor) {
        super(params, data);
        this.#quizzesCheck = objectContructor;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-questions'
        });
        this.initDom();
    }

    initDom() {
        const { text } = this.getData;
        // this.#quizzesCheck.listenChoosedQuestion();
        this.#dom.insertAdjacentHTML('beforeend', `
            <div class="question-slider"><div class="slider" id="js-questionSlider">
                <div class="question-page">
                    <p class="question-page__text">${text}</p>
                </div>
            </div></div>
            <div class="page__dot"><button class="btn btn-dot"></button></div>
        `);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizChoices extends AbstractClass {
    #quizzesCheck;
    #dom;
    
    constructor(params, data, objectContructor) {
        super(params, data);
        this.#quizzesCheck = objectContructor;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-choices'
        });
        this.initDom();
    }

    initDom() {
        const { questions: { choices } } = this.getData,
        radioChks = [],
        radioChoices = new choiceCollectionState();
        radioChoices.setData(choices);
        for(let i = 0; i < 4; i++) {
            const 
            label = createElement({
                'type': 'label',
                'classNames': 'btn btn-rounded-5px btn-choice'
            }),
            radioChk = createElement({
                'type': 'input',
                'id': 'js-choice-' + (i + 1)
            });
            radioChoices.setInput(radioChk);
            radioChk.type = 'checkbox';
            radioChk.name = 'choices';
            if(choices[i].checked) {
                radioChk.checked = true;
                label.style.backgroundColor = '#228B22';
                label.style.color = 'white';
            }

            label.textContent = choices[i].data;
            radioChk.addEventListener('click', () => radioChoices.toggleState(i, choices[i]));
            radioChk.addEventListener('click', () => this.#quizzesCheck.listenChoosedQuestion());
            label.append(radioChk);
            radioChks.push(label);
        }
        this.#dom.append(...radioChks);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizInfo extends AbstractClass {
    #objContructors
    #dom;

    constructor(params, data, objectContructors) {
        super(params, data);
        this.#objContructors = objectContructors;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-info'
        });
        this.initDom();
    }

    initDom() {
        const { amount, time } = this.getData,
        qIndex = new QuizIndex('', this.getData,
            { 
                counter: this.#objContructors.counter,
                quizzesCheck: this.#objContructors.quizzesCheck
            }
        ),
        qTimer = new Timer('', time),
        qQuestionsCounter = new CounterQuestion('', amount);

        this.#dom.appendChild(qIndex.render());
        this.#dom.appendChild(qQuestionsCounter.render());
        this.#dom.appendChild(qTimer.render());
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizIndex extends AbstractClass {
    #objContructors
    #dom;

    constructor(params, data, objectContructors) {
        super(params, data);
        this.#objContructors = objectContructors;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-index'
        });
        this.initDom();
    }

    initDom() {
        const { questions, amount } = this.getData;
        const f = (100 - (amount * 2 - 2)) / amount;
        for(let i = 0; i < amount; i++) {
            const index = createElement({
                'type': 'button',
                'classNames': 'btn btn-question-index'
            });
            
            if(i === 0) index.style.backgroundColor = '#6495ED';
            else if(questions[i].choices.some(choice => choice.checked)) index.style.backgroundColor = '#262626';
            index.addEventListener('click', (event) => currentQuestion(event,
                { questions: questions, amoun: amount},
                this.#objContructors.counter.setNumber(i),
                this.#objContructors.quizzesCheck
            ));
            index.setAttribute('data-index-question', '');

            this.#dom.style.gridTemplateColumns += f + '%';
            this.#dom.appendChild(index);
        }
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class CounterQuestion extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-counter'
        });
        this.initDom();
    }

    initDom() {
        const current = createElement({
            'type': 'span',
            'classNames': 'question-counter__index',
            'id': 'js-questionCounter'
        }), total = createElement({
            'type': 'span',
            'classNames': 'question-counter__total'
        });

        current.textContent = '1';
        total.textContent = ` of ${this.getData} Questions.`

        this.#dom.append(current, total);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class Timer extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-timer'
        });
        this.initDom();
    }

    timeFormat(number) {
        return number.toString().replace(/^\S$/g, `0${number}`);
    }

    initDom() {
        const timeText = createElement({
            'type': 'span',
            'classNames': 'question-timer__time',
        }),
        minuteField = createElement({
            'type': 'span',
            'id': 'js-minuteField'
        }),
        secondField = createElement({
            'type': 'span',
            'id': 'js-secondField'
        }),
        [minute, second] = this.getData.split(':');


        minuteField.textContent = this.timeFormat(minute);
        secondField.textContent = this.timeFormat(second);

        timeText.append(
            "Time left: ",
            minuteField,
            ":",
            secondField
        );

        this.#dom.appendChild(timeText);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}



// async function QuizQuestion(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'quiz-questions'
//     });

//     const dot = createElement({
//         'type': 'div',
//         'classNames': 'page__dot'
//     });

//     let htmls = `<div class="question-slider"><div class="slider" id="js-questionSlider">`

//     props.questionsPage.forEach((value) => {
//         htmls += `
//             <div class="question-page">
//                 <p class="question-page__text">${value}</p>
//             </div>
//         `;
//     });

//     htmls += `
//         </div></div>
//     `;

//     dot.insertAdjacentHTML('beforeend', `<div class="btn btn-dot"></div><div class="btn btn-dot"></div><div class="btn btn-dot"></div>`);

//     div.insertAdjacentHTML('beforeend', htmls);
//     div.appendChild(dot);
//     return (isReturnDom) ? div : div.outerHTML;
// }


// const counter = (function() {
//     let count = 0;
//     return function(isStop = false, isIncrease = true) {
//         if(!isStop)
//             if(isIncrease) count += 1;
//             else count -= 1;
//         return count;
//     }
// })();

// function counter() {
//     let number = 0,
//     isStop = false,
//     isIncrease = true,
//     isReset = false

//     this.toZero() = () => {
//         if(isReset) number = 0;
//     };

//     this.count = () => {
//         if(!isStop)
//             if(isIncrease) number += 1;
//             else number -= 1;
//         return number;
//     };
// }

// const Quiz = {
//     htmlDOM: createElement({
//         'type': 'div',
//         'classNames': 'quiz-page'
//     }),
//     data: {},
//     render: async function() {
//         document.title = 'Quiz';
//         const root = document.getElementById('root');
//         const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
//         const questions = [1, 2 ,3];


//         const htmls = `
//             ${QuizInfo({ data }, false)}
//             ${QuizQuestion({ questions }, false)}
//             <hr>
//             ${QuizChoices({}, false)}
//         `;

//         this.htmlDOM.insertAdjacentHTML('beforeend', htmls);
//         // this.htmlDOM.appendChild(QuizInfo({ data }));
//         // this.htmlDOM.appendChild(QuizQuestion({ data }));
//         root.appendChild(this.htmlDOM);

//         // Ather add index to Quiz Page and add Quiz Page to root
//         const quizInfoContainer = document.getElementsByClassName('quiz-info')[0];
//         const index = quizInfoContainer.getElementsByClassName('btn-question-index');
//         for(let i = 0; i < 15; i++) {
//             index[i].onclick = function() {
//                 const questionIndexShow = quizInfoContainer.querySelector('#js-questionCounter');
//                 console.log(questionIndexShow);
//                 questionIndexShow.textContent = data[i];
//             }
//         }
//     },
//     renderData: function() {

//     }
// }

// function QuizIndex(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'question-index'
//     });

//     const f = (100 - (props.data * 2 - 2)) / props.data;

//     let htmls = ``;
//     for(let i = 0; i < props.data; i++) {
        
//         const index = createElement({
//             'type': 'button',
//             'classNames': 'btn btn-question-index'
//         });
        
//         if(i === 0) index.style.backgroundColor = '#6495ED';
//         if(props.questions[i].choices.some(choice => choice.checked)) index.style.backgroundColor = '#262626';
//         index.addEventListener('click', (event) => currentQuestion(event, props.questions, props.counter.setNumber(i)));
        
//         div.style.gridTemplateColumns += f + '%';
//         div.appendChild(index);
//     }

//     // div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// function CounterQuestion(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'question-counter'
//     });

//     const htmls = `
//         <span class="question-counter__index" id="js-questionCounter">1</span><span class="question-counter__total">/${[props.data]}</span>
//     `;

//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// function Timer(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'question-timer'
//     });

//     const htmls = `
//         <span class="question-timer__time" id="js-questionTimer">15:00</span>
//     `;

//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }


// function QuizChoices(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'quiz-choices'
//     });

//     const htmls = `
//         <button class="btn btn-rounded-5px btn-choice" id="js-choice-1" onlick="">${props.choices[0].data}</button>
//         <button class="btn btn-rounded-5px btn-choice" id="js-choice-2" onlick="">${props.choices[1].data}</button>
//         <button class="btn btn-rounded-5px btn-choice" id="js-choice-3" onlick="">${props.choices[2].data}</button>
//         <button class="btn btn-rounded-5px btn-choice" id="js-choice-4" onlick="">${props.choices[3].data}</button>
//     `;

//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }