import AbstractClass from "./AbstractClass.js";
import { 
    createElement,
    showModal,
    getRandomNumber,
    turnOffModal,
    turnOnModal
 } from "../../function.js";
import {
    navigateTo
} from "../../router.js"

export default class extends AbstractClass {
    constructor(params, data, categories) {
        super(params);
        this.setTitle('Quiz page');
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section'
        });
        let _categories = ['Highlight'].concat(categories);
        let _data = data;

        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };
        this.getCategories = () => _categories;
        this.setCategories = categories => { _categories.concat(categories) };

        this.getCategories('/api/quiz/categories');

        this.initDom();
        document.querySelector('header .title').textContent = document.title;
    }

    // getNameAndAmount(data = {}) {
    //     const keys = Object.keys(data);
    //     return keys.map((key) => {
    //         return {
    //             name: data[key].name,
    //             amount: data[key].amount
    //         };
    //     });
    // }

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
        banner = new Banner('', bannerData),
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
        const categories = ['math', 'logic', 'fun'];
        const { title, description } = this.getData();
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

        takeRandomQuizBtn.href = `/quiz/${categories[getRandomNumber(0, 2)]}/1`;
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
        buttons = [];
        categories.forEach((value, index) => {
            const button = createElement({
                'type': 'a',
                'classNames': 'btn btn-no-background btn-rounded-5px category-item ft-sz-13'
            });
            if(index === 0) { button.classList.add('btn-no-background--active') }
            button.href = '/quiz/' + value.replace(value[0], value[0].toLowerCase());
            button.textContent = value;
            button.addEventListener('click', (event) => { 
                const { currentTarget } = event;
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
            button.addEventListener('click', (event) => { showModal(event, { amount: question.amount, time: question.time, name: question.name }) });
            buttons.push(button);
        });
        this.getDom().append(...buttons);
    }

    render(isNode = true) {
        return (isNode) ? this.getDom() : this.getDom().outerHTML;
    }
}