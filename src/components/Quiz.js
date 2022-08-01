import AbstractClass from "./AbstractClass.js";
import {
    createElement,
    setHandlers,
    setHandler,
    getParentElement,
    insertAfter,
    Counter
} from "./Function.js";

const nextQuestion = (function() {
    return function NavigateToNextQuestion(event, data = {}, counter) {
        let index = counter.increase();
        if(index === data.length) return;
        const { target } = event,
        quizPage = getParentElement((getParentElement(target))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', data[index]),
        c = new QuizChoices('', data[index]);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        highlightIndexBtn(indexBtns, index);
    }
})();

const prevQuestion = (function() {
    return function NavigateToPreviousQuestion(event, data = {}, counter) {
        let index = counter.decrease();
        if(index === -1) return;
        const { target } = event,
        quizPage = getParentElement((getParentElement(target))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', data[index]),
        c = new QuizChoices('', data[index]);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        highlightIndexBtn(indexBtns, index);
    }
})();

const currentQuestion = (function() {
    return function ShowCurrentQuestion(event, data = {}, index = 0) {
        const { target } = event,
        quizPage = getParentElement((getParentElement((getParentElement(target))))),
        indexBtns = quizPage.querySelectorAll('.btn.btn-question-index');
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        quizPage.getElementsByClassName('quiz-choices')[0].remove();
        const q = new QuizQuestions('', data[index]),
        c = new QuizChoices('', data[index]);
        quizPage.querySelector('#js-questionCounter').textContent = index + 1;
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
        insertAfter(c.render(), quizPage.getElementsByTagName('hr')[0]);
        highlightIndexBtn(indexBtns, index);
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
    const inputs = [];

    this.setInput = (i) => {
        try {
            if(inputs.length > 4) throw 'Overflow: each question has only 4 choices.';
            inputs.push(i);
        } catch (error) {
            console.error(error);
        }
    }

    this.change = (i) => {
        inputs.forEach(input => {
            if(input !== i) { 
                getParentElement(input).style.backgroundColor = 'transparent';
                input.checked = false;
            }
        });
    }

    this.toggleState = (() => {
        return function toggleDataAndRadio(index, data) {
            if(inputs[index].checked) { 
                getParentElement(inputs[index]).style.backgroundColor = '#32CD32';
                data.checked = inputs[index].checked;
            } else getParentElement(inputs[index]).style.backgroundColor = 'transparent';
            this.change(inputs[index]);
        }
    })();
}

function indexQuestionState() {
    const indexes = [];
    let data;

    this.setInput = (input) => {
        indexes.push(input);
    }

    this.setInputs = (inputs) => {
        indexes.push(...inputs);
    }

    this.setData = (refData) => {
        data = refData;
    }

    this.setState = (index) => {
        if(data.questions[index].choices.some(choice => choice.checked)) indexes[index].style.backgroundColor = '#262626';
    }
}

function highlightIndexBtn(buttons, index, color = '#6495ED') {
    buttons.forEach(button => {
        if(button === buttons[index]) button.style.backgroundColor = color;
            else button.style.backgroundColor = 'transparent';
    });
}

export default class extends AbstractClass {
    #fakedata;
    #dom;
    #indexQuestion;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Quiz');
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-page'
        });
        this.#indexQuestion = 0;
        this.initDom();
        document.querySelector('header .title').textContent = `Quiz / ${this.getData.name}`;
    }

    get getDom() {
        return this.#dom;
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
        const { questions } = this.getData,
        counter = new Counter(0, this.getData.questions.length - 1),
        indexState = new indexQuestionState(),
        qQuestions = new QuizQuestions('', questions[this.#indexQuestion]),
        qChoices = new QuizChoices('', questions[this.#indexQuestion]),
        qInfo = new QuizInfo('', this.getData, counter);

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
        });

        prevBtn.textContent = 'Previous';
        nextBtn.textContent = 'Next';

        nextBtn.addEventListener('click', (event) => nextQuestion(event, this.getData.questions, counter));
        prevBtn.addEventListener('click', (event) => prevQuestion(event, this.getData.questions, counter));

        quizBtn.appendChild(prevBtn);
        quizBtn.appendChild(nextBtn);
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
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-questions'
        });
        this.initDom();
    }

    initDom() {
        const { text } = this.getData;
        this.#dom.insertAdjacentHTML('beforeend', `
            <div class="question-slider"><div class="slider" id="js-questionSlider">
                <div class="question-page">
                    <p class="question-page__text">${text}</p>
                </div>
            </div></div>
            <div class="page__dot"><div class="btn btn-dot"></div></div>
        `);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizChoices extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-choices'
        });
        this.initDom();
    }

    initDom() {
        const { choices } = this.getData,
        radioChks = [],
        radioChoice = new choiceCollectionState();
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
            radioChoice.setInput(radioChk);
            radioChk.type = 'checkbox';
            radioChk.name = 'choices';
            if(choices[i].checked) label.style.backgroundColor = '#32CD32';

            label.textContent = choices[i].data;
            radioChk.addEventListener('click', () => radioChoice.toggleState(i, choices[i]));
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
    #counter
    #dom;

    constructor(params, data, object) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-info'
        });
        this.#counter = object;
        this.initDom();
    }

    initDom() {
        const { amount } = this.getData,
        qIndex = new QuizIndex('', this.getData, this.#counter),
        qTimer = new Timer('','15:00'),
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
    #object
    #dom;

    constructor(params, data, object) {
        super(params, data);
        this.#object = object;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-index'
        });
        this.initDom();
    }

    initDom() {
        const f = (100 - (this.getData.amount * 2 - 2)) / this.getData.amount;
        for(let i = 0; i < this.getData.amount; i++) {
            const index = createElement({
                'type': 'button',
                'classNames': 'btn btn-question-index'
            });
            
            if(i === 0) index.style.backgroundColor = '#6495ED';
            index.addEventListener('click', (event) => currentQuestion(event, this.getData.questions, this.#object.setNumber(i)));
            if(this.getData.questions[i].choices.some(choice => choice.checked)) index.style.backgroundColor = '#262626';
            
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
        total.textContent = `/${this.getData}`

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

    initDom() {
        const timeText = createElement({
            'type': 'span',
            'classNames': 'question-timer__time',
            'id': 'js-questionTimer'
        });

        timeText.textContent = this.getData;

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