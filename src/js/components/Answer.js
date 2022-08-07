import { 
    createElement
} from "../Function.js";
import {
    navigateTo
} from "../Router"
import AbstractClass from "./AbstractClass.js";

export default class extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Answer');
        document.querySelector('header .title').textContent = `View answer`;
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-answer'
        });
        this.initDom();
    }

    initDom() {
        const { name, amount, questions } = this.getData;
        const header = createElement({
            'type': 'header',
            'classNames': 'title'
        }),
        answerSection = createElement({
            'type': 'div',
            'classNames': 'quiz-answers__section'
        }),
        answerButtonBox = createElement({
            'type': 'div',
            'classNames': 'quiz-answers-button'
        }),
        backBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-primary btn-rounded-5px ft-sz-13 tc-white'
        });

        backBtn.href = '/result/quiz-' + this.getParams;
        backBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        backBtn.insertAdjacentHTML('beforeend', '<span class="material-symbols-outlined ft-sz-15 tc-white">arrow_back</span>Back to view score');

        header.insertAdjacentHTML('beforeend', `
            <p class="text-subtitle tc-white">View your answers and our answers.</p>
            <h1 class="text-title tc-white">${name}</h1>
        `);
        
        for(let i = 0; i < amount; i++) {
            const answers = new Answers('', {index: i, text: questions[i].text, amount: amount, questions: questions});
            answerSection.append(answers.render());
        }

        answerButtonBox.append(backBtn);

        this.#dom.append(
            header,
            answerSection,
            answerButtonBox
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class Answers extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question'
        });
        this.initDom();
    }

    initDom() {
        const { index, text, amount, questions } = this.getData;
        const header = new AnswerHeader('', {index: index, amount: amount, question: questions[index]}),
        content = new AnswerContent('', { text: text, choices: questions[index].choices });

        this.#dom.append(
            header.render(),
            content.render()
        );
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class  AnswerHeader extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-head'
        });
        this.initDom();
    }

    initDom() {
        const { index, amount, question } = this.getData;
        let state = false;
        if(question.choices.find(choice => choice.checked && choice.isAnswer)) state = true;

        const indexContainer = createElement({
            'type': 'div',
            'classNames': `question-index ${(state) ? 'tc-quiz-green' : 'tc-quiz-red'}`
        }),
        scoreContainer = createElement({
            'type': 'div',
            'classNames': 'question-score'
        }),
        iconIndexContainer = createElement({
            'type': 'div',
            'classNames': 'question-index__icon'
        }),
        textIndexContainer = createElement({
            'type': 'div',
            'classNames': 'question-index__text'
        });

        console.log((state) ? 'done' : 'close');

        iconIndexContainer.insertAdjacentHTML('beforeend', `<span class="material-symbols-outlined">${(state) ? 'done' : 'close'}</span>`);
        textIndexContainer.insertAdjacentHTML('beforeend', `<span class="text-bold">${index + 1}</span><span> of ${amount} Questions</span>`);
        scoreContainer.insertAdjacentHTML('beforeend', `<span>${(state) ? '1/1' : '0/1'}</span>`);

        indexContainer.append(iconIndexContainer, textIndexContainer);

        this.#dom.append(
            indexContainer,
            scoreContainer
        );
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class AnswerContent extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'question-content'
        });
        this.initDom();
    }

    initDom() {
        const { text, choices } = this.getData;
        const questionTextContainer = createElement({
            'type': 'div',
            'classNames': 'question-text'
        }),
        questionAnswerContainer = createElement({
            'type': 'div',
            'classNames': 'question-answer'
        });

        questionTextContainer.insertAdjacentHTML('beforeend', `
            <p class="ft-sz-14">${text}</p>
        `);

        const correctChoiceText = choices.find(choice => choice.isAnswer).data,
        userChoiceText = choices.find(choice => choice.checked);
        
        let state = false;
        if(choices.some(choice => choice.checked && choice.isAnswer)) state = true;

        questionAnswerContainer.insertAdjacentHTML('beforeend', `
            <p class="ft-sz-14">Correct answer:</p>
            <p class="ft-sz-14 pd-8-12">${correctChoiceText}</p>
            <p class="ft-sz-14">Your answer:</p>
            <p class="ft-sz-14 pd-8-12 ${(state) ? 'correct-answer' : 'incorrect-answer'}">${(userChoiceText) ? userChoiceText.data : 'You skipped this question.'}</p>
        `);

        this.#dom.append(
            questionTextContainer,
            questionAnswerContainer
        );
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

{/* <div class="quiz-answers__section">
    <div class="question">
        <div class="question-head">
            <div class="question-index tc-quiz-green">
                <div class="question-index__icon">
                    <span class="material-symbols-outlined">done</span>
                </div>
                <div class="question-index__text">
                    <span class="text-bold">1</span><span> of 5 Questions</span>
                </div>
            </div>
            <div class="question-score">
                <span>1/1</span>
            </div>
        </div>
        <div class="question-content">
            <div class="question-text">
                <p class="ft-sz-14">${this.getData.questions[0].text}</p>
            </div>
            <div class="question-answer">
                <p class="ft-sz-14">Answer:</p>
                <p class="ft-sz-14 pd-8-12">${this.getData.questions[0].choices[1].data}</p>
                <p class="ft-sz-14">Your answer:</p>
                <p class="ft-sz-14 pd-8-12 correct-answer">${this.getData.questions[0].choices[1].data}</p>
            </div>
        </div>
    </div>
</div> */}