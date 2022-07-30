import AbstractClass from "./AbstractClass.js";
import {
    createElement,
    setHandlers,
    setHandler,
    getParentElement
} from "./Function.js";

const counter = (function() {
    let count = 0;
    return function(isStop = false, isIncrease = true) {
      if(!isStop)
        if(isIncrease) count += 1;
        else count -= 1;
      return count;
    }
  })();

const nextQuestion = (function() {
    return function NavigateToNextQuestion(event, data = {}) {
        let index = (counter(true) === data.length - 1) ? counter(true) : counter();
        // console.log(index);
        if(index === data.length) return;
        const { target } = event,
        quizPage = getParentElement((getParentElement(target)));
        quizPage.getElementsByClassName('quiz-questions')[0].remove();
        const q = new QuizQuestions('', data[index]);
        // console.log(data[index]);
        quizPage.insertBefore(q.render(), quizPage.getElementsByTagName('hr')[0]);
    }
})();

export default class extends AbstractClass {
    #fakedata;
    #dom;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Quiz');
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-page'
        });
        this.initDom();
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

    initDom() {
        const { amount, questions } = this.getData,
        qQuestions = new QuizQuestions('', questions[0]);
        this.#dom.insertAdjacentHTML('beforeend', `
            ${QuizInfo({ amount }, false)}
            ${qQuestions.render(false)}
            <hr>
            ${QuizChoices({ choices: questions[0].choices }, false)}
        `);

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
        nextBtn.addEventListener('click', (event) => nextQuestion(event, this.getData.questions));

        
        quizBtn.appendChild(prevBtn);
        quizBtn.appendChild(nextBtn);
        this.#dom.appendChild(quizBtn);
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
        console.log(this.getData);
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

function QuizInfo(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quiz-info'
    });
    
    let htmls = `
        ${QuizIndex({ data : props.amount }, false)}
        ${Counter({ data : props.amount }, false)}
        ${Timer({}, false)}
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

function QuizIndex(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'question-index'
    });

    const f = (100 - (props.data * 2 - 2)) / props.data;

    let htmls = ``;
    for(let i = 0; i < props.data; i++) {
        // htmls += `
        //     <div class="btn btn-question-index"></div>
        // `;
        const index = createElement({
            'type': 'div',
            'classNames': 'btn btn-question-index'
        });

        div.style.gridTemplateColumns += f + '%';
        div.appendChild(index);
    }

    // div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

function Timer(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'question-timer'
    });

    const htmls = `
        <span class="question-timer__time" id="js-questionTimer">15:00</span>
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

function Counter(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'question-counter'
    });

    const htmls = `
        <span class="question-counter__index" id="js-questionCounter">1</span><span class="question-counter__total">/${[props.data]}</span>
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}





async function QuizQuestion(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quiz-questions'
    });

    const dot = createElement({
        'type': 'div',
        'classNames': 'page__dot'
    });

    let htmls = `<div class="question-slider"><div class="slider" id="js-questionSlider">`

    props.questionsPage.forEach((value) => {
        htmls += `
            <div class="question-page">
                <p class="question-page__text">${value}</p>
            </div>
        `;
    });

    htmls += `
        </div></div>
    `;

    dot.insertAdjacentHTML('beforeend', `<div class="btn btn-dot"></div><div class="btn btn-dot"></div><div class="btn btn-dot"></div>`);

    div.insertAdjacentHTML('beforeend', htmls);
    div.appendChild(dot);
    return (isReturnDom) ? div : div.outerHTML;
}

function QuizChoices(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quiz-choices'
    });

    const htmls = `
        <button class="btn btn-rounded-5px btn-choice" id="js-choice-1" onlick="">${props.choices[0].data}</button>
        <button class="btn btn-rounded-5px btn-choice" id="js-choice-2" onlick="">${props.choices[1].data}</button>
        <button class="btn btn-rounded-5px btn-choice" id="js-choice-3" onlick="">${props.choices[2].data}</button>
        <button class="btn btn-rounded-5px btn-choice" id="js-choice-4" onlick="">${props.choices[3].data}</button>
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}