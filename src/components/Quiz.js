import { createElement } from "./Function.js";

const Quiz = {
    htmlDOM: createElement({
        'type': 'div',
        'classNames': 'quiz-page'
    }),
    data: {},
    render: async function() {
        document.title = 'Quiz';
        const root = document.getElementById('root');
        const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
        const questions = [1, 2 ,3];


        const htmls = `
            ${QuizInfo({ data }, false)}
            ${QuizQuestion({ questions }, false)}
            <hr>
            ${QuizChoices({}, false)}
        `;

        this.htmlDOM.insertAdjacentHTML('beforeend', htmls);
        // this.htmlDOM.appendChild(QuizInfo({ data }));
        // this.htmlDOM.appendChild(QuizQuestion({ data }));
        root.appendChild(this.htmlDOM);

        // Ather add index to Quiz Page and add Quiz Page to root
        const quizInfoContainer = document.getElementsByClassName('quiz-info')[0];
        const index = quizInfoContainer.getElementsByClassName('btn-question-index');
        for(let i = 0; i < 15; i++) {
            index[i].onclick = function() {
                const questionIndexShow = quizInfoContainer.querySelector('#js-questionCounter');
                console.log(questionIndexShow);
                questionIndexShow.textContent = data[i];
            }
        }
    },
    renderData: function() {

    }
}

export default Quiz;

function QuizInfo(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quiz-info'
    });
    
    let htmls = `
        ${QuizIndex({ data : props.data }, false)}
        ${Counter({ data : props.data }, false)}
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

    const f = (100 - (props.data.length * 2 - 2)) / props.data.length;

    let htmls = ``;
    props.data.forEach((value) => {
        // htmls += `
        //     <div class="btn btn-question-index"></div>
        // `;
        const index = createElement({
            'type': 'div',
            'classNames': 'btn btn-question-index'
        });

        div.style.gridTemplateColumns += f + '%';
        div.appendChild(index);
    });

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
        <span class="question-counter__index" id="js-questionCounter">1</span><span class="question-counter__total">/${[props.data.length]}</span>
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

    props.questions.forEach((value) => {
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
        <div class="btn btn-rounded-5px btn-choice" id="js-choice-1"></div>
        <div class="btn btn-rounded-5px btn-choice" id="js-choice-2"></div>
        <div class="btn btn-rounded-5px btn-choice" id="js-choice-3"></div>
        <div class="btn btn-rounded-5px btn-choice" id="js-choice-4"></div>
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}