import AbstractClass from "./AbstractClass.js";
import { 
    createElement,
    showModal,
    getRandomNumber,
    turnOnModal,
    getParentElement
 } from "../../function.js";
import {
    navigateTo
} from "../../router.js"

function categoriesBtnState(buttons, index, data) {

}

export default class extends AbstractClass {
    constructor(params, data, categories) {
        super(params);
        this.setTitle('Quiz page');
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section'
        });
        let _categories = ['highlight'].concat(categories);
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };
        this.getCategories = () => _categories;
        this.setCategories = categories => { _categories = categories };

        this.getCategories('/api/quiz/categories');

        this.initDom();
    }

    changeQuizzes() {
        const questions = this.getData(),
        quizzes = new Quizzes('', { questions });
        let quizzesBtns = this.getDom().querySelector('#js-quizPageQuizzesContainer');
        this.getDom().removeChild(quizzesBtns);
        quizzesBtns = null;
        this.getDom().append(
            quizzes.render()
        );
    }

    initDom() {
        const bannerData = {
            'title': 'Take a random quiz',
            'description': 'There are a lot of quizzes which are added from many difference resources. '
        }
        const questions = this.getData(), categories = this.getCategories(),
        banner = new Banner('', { ...bannerData, categories }),
        quizCategory = new QuizCategory('', { categories }),
        quizzes = new Quizzes('', { questions });
        this.getDom().append(
            banner.render(),
            createElement({ 'type': 'hr' }),
            quizCategory.render(),
            createElement({ 'type': 'hr' }),
            quizzes.render()
        );
    }

    render(isNode = true) {
        this.setTitle('Quiz page');
        document.querySelector('header h1.title').textContent = document.title;
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}

class Banner extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section__banner',
            'id': 'js-quizPageBannerContainer'
        });
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        this.initDom();
    }

    initDom() {
        const { title, description, categories } = this.getData();
        const keys = Object.keys(categories[1]);
        this.getDom().insertAdjacentHTML('beforeend', `
            <div class="banner-image"></div> 
            <div class="banner-text">
                <h3 class="banner-text__title">${title}</h3>
                <p class="banner-text__description">${description}</p>
            </div>
        `);
        const takeRandomQuizBtn = createElement({
            'type': 'a',
            'classNames': 'btn btn-banner btn-no-background btn-rounded-5px ft-sz-13'
        }),
        bannerText = this.getDom().querySelector('.banner-text');
        takeRandomQuizBtn.href = `/quiz/${keys[getRandomNumber(0, (keys.length - 1))]}/${categories[1][keys[getRandomNumber(0, (keys.length - 1))]]}`;
        takeRandomQuizBtn.textContent = 'Take';
        takeRandomQuizBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        bannerText.appendChild(takeRandomQuizBtn);
        this.getDom().append(bannerText);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}

class QuizCategory extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quiz-category',
            'id': 'js-quizPageQuizCategoryContainer'
        });

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        let _data = data;
        this.initDom();
    }

    initDom() {
        const { categories } = this.getData(),
        categoriesItemContainer = createElement({
            'type': 'div',
            'classNames': 'category-items'
        }),
        keys = Object.keys(categories[1]),
        buttons = [];
        keys.unshift(categories[0]);
        keys.forEach((value, index) => {
            const button = createElement({
                'type': 'a',
                'classNames': 'btn btn-no-background btn-rounded-5px category-item ft-sz-13'
            });
            const href = '/quiz/' + value.replace(value[0], value[0].toLowerCase());
            button.href = href;
            button.textContent = value.replace(value[0], value[0].toUpperCase());
            if(location.pathname === href) button.classList.add('btn-no-background--active');
            button.addEventListener('click', (event) => { 
                const { currentTarget } = event;
                const buttonsCategory = getParentElement(currentTarget).querySelectorAll('a');
                buttonsCategory.forEach(button => {
                    if(currentTarget === button) button.classList.add('btn-no-background--active');
                    else button.classList.remove('btn-no-background--active');
                });
                event.preventDefault();
                navigateTo(currentTarget.href)
            });
            buttons.push(button);
        });
        categoriesItemContainer.append(...buttons);
        this.getDom().append(categoriesItemContainer);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}

class Quizzes extends AbstractClass {
    constructor(params, data) {
        super(params);
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quizzes',
            'id': 'js-quizPageQuizzesContainer'
        });
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };

        this.initDom();
    }

    initDom() {
        const { questions } = this.getData(),
        buttons = [];
        questions.forEach(question => {
            const button = createElement({
                'type': 'button'
            });
            button.setAttribute('data-id', `${question.id}`);
            button.setAttribute('data-message-box', `confirm`);
            button.setAttribute('data-is-test', `${question.isTest}`);
            button.insertAdjacentHTML('beforeend', `
                <div class="quiz">
                    <div class="quiz-image"></div>
                    <div class="quiz-text">
                        <h3 class="fw-semi-bold ft-sz-15 quiz-name">${question.name}</h3>
                        <p class="fw-regular ft-sz-13 quiz-amount">${question.amount} questions.</p>
                    </div>
                    <span class="material-symbols-outlined">arrow_forward_ios</span>
                </div>
            `);
            button.addEventListener('click', (event) => {
                const { currentTarget } = event;
                if(currentTarget.getAttribute('data-is-test') === 'true') {
                    const modalContainer = document.getElementById('modal'),
                    messageBox = modalContainer.querySelector('#note'),
                    acceptBtn = modalContainer.querySelector('#js-noteBoxHandInBtn'),
                    titleTxt = modalContainer.querySelector('#js-noteTitle'),
                    messageTxt = modalContainer.querySelector('#js-noteMessage'),
                    button = modalContainer.querySelector('#note button'),
                    anchor = modalContainer.querySelector('#note a');
                    titleTxt.textContent = 'You took this quiz before!';
                    messageTxt.textContent = `If you want to take it again, please press (or click) "Take this quiz" button below.`;
                    button.textContent = 'I will take another quiz';
                    anchor.textContent = 'Take this quiz';
                    const segments = currentTarget.getAttribute('data-id').split('-');
                    acceptBtn.href = `/quiz/${segments[0]}/${segments[2]}`;
                    turnOnModal(modalContainer, messageBox);
                } else showModal(event, { amount: question.amount, time: question.time, name: question.name });
            });
            buttons.push(button);
        });
        this.getDom().append(...buttons);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}