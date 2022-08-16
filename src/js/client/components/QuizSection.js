import AbstractClass from "./AbstractClass.js";
import { 
    createElement,
    showModal,
    getRandomNumber,
    turnOnModal,
    getParentElement,
    setUpNoteBox
 } from "../../function.js";
import {
    navigateTo
} from "../../router.js"

function getPotential(allData) {
    const potentials = allData.filter(data => !data.isTest);
    const potential = potentials[getRandomNumber(0, potentials.length)];
    return potential;
}

function setUpConfirmBox(button, data) {
    const {amount, time, name} = data,
    modalContainer = document.getElementById('modal'),
    [ minute, second ] = time.split(':'),
    messageBox = modalContainer.querySelector('#confirm'),
    quizNameP = messageBox.querySelector('#js-quizName'),
    timeP = messageBox.querySelector('#js-modalInfoTime'),
    amountP = messageBox.querySelector('#js-modalInfoAmount'),
    acceptBtn = messageBox.querySelector('#js-acceptBtn');
    quizNameP.textContent = name;
    timeP.textContent = `${(minute == '0') ? `${second} second` : `${minute}min${second}s`}`;
    amountP.textContent = `${amount} Questions.`;
    const segments = button.getAttribute('data-id').split('-');
    acceptBtn.href = `/quiz/${segments[0]}/${segments[2]}`;
}

function showConfirmBox(event) {
    const modalContainer = document.getElementById('modal'),
    messageBox = modalContainer.querySelector('#confirm');
    turnOnModal(modalContainer, messageBox);
}

function randomQuizHandler(event) {
    const { currentTarget } = event;
    if(currentTarget.getAttribute('data-is-test') === 'true') {
        const modalContainer = document.getElementById('modal'),
        messageBox = modalContainer.querySelector('#note');
        setUpNoteBox(currentTarget, 
            {
                title: 'You took this quiz before!',
                message: `If you want to take it again, please press (or click) "Take this quiz" button below.`,
                buttonText: 'I will take another quiz',
                anchorText: 'Take this quiz'
            }
        );
        turnOnModal(modalContainer, messageBox);
    } else showConfirmBox(event);
}

function setUpRandomButton(button, data) {
    button.href = `/quiz/${data.id.split('-')[0]}/${data.id.split('-')[2]}`;
    button.setAttribute('data-id', `${data.id}`);
    button.setAttribute('data-message-box', `confirm`);
    button.setAttribute('data-is-test', `${data.isTest}`);
    setUpConfirmBox(button, data);
}

export default class extends AbstractClass {
    constructor(params, data, allData, categories) {
        super(params);
        this.setTitle('Quiz page');
        let _dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section'
        });
        let _categories = ['highlight'].concat(categories);
        let _data = data;
        let _allData = allData;
        this.getDom = () => _dom;
        this.setDom = dom => { _dom = dom };
        this.getData = () => _data;
        this.setData = data => { _data = data };
        this.getAllData = () => _allData;
        this.setAllData = allData => { _allData = allData };
        this.getCategories = () => _categories;
        this.setCategories = categories => { _categories = categories };
        this.initDom();
    }

    getRandomQuiz() {
        const potential = getPotential(this.getAllData());
        if(potential !== undefined) {
            if(arguments[0]) {
                setUpRandomButton(arguments[0], potential);
            } else {
                const takeRandomQuizBtn = this.getDom().querySelector('#js-takeRandomQuizBtn');
                setUpRandomButton(takeRandomQuizBtn, potential);
            }
        } else {
            const takeRandomQuizBtn = this.getDom().querySelector('#js-takeRandomQuizBtn'),
            dataId = takeRandomQuizBtn.getAttribute('data-id');
            const lastPotential = this.getAllData().find(data => data.id === dataId );
            setUpRandomButton(takeRandomQuizBtn, lastPotential);
            return;
        };
    }

    changeQuizzes() {
        const questions = this.getData(), categories = this.getCategories(),
        quizzes = new Quizzes('', { questions, categories });
        this.getRandomQuiz();
        let quizzesBtns = this.getDom().querySelector('#js-quizPageQuizzesContainer');
        const buttons = this.getDom().querySelector('#js-quizPageQuizCategoryContainer').querySelectorAll('a'),
        potentialButton = location.pathname.split('/')[2];
        buttons.forEach(button => {
            if(potentialButton === button.href.split('/')[4]) button.classList.add('btn-no-background--active');
            else button.classList.remove('btn-no-background--active');
        });
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
        const questions = this.getData(), categories = this.getCategories(), allData = this.getAllData(),
        banner = new Banner('', { ...bannerData, allData, categories }),
        quizCategory = new QuizCategory('', { categories }),
        quizzes = new Quizzes('', { questions, categories });
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
        const { title, description, allData, categories } = this.getData();
        this.getDom().insertAdjacentHTML('beforeend', `
            <div class="banner-image"></div> 
            <div class="banner-text">
                <h3 class="banner-text__title">${title}</h3>
                <p class="banner-text__description">${description}</p>
            </div>
        `);
        const takeRandomQuizBtn = createElement({
            'type': 'button',
            'classNames': 'btn btn-banner btn-no-background btn-rounded-5px ft-sz-13',
            'id': 'js-takeRandomQuizBtn'
        }),
        bannerText = this.getDom().querySelector('.banner-text');
        const potential = getPotential(allData);
        takeRandomQuizBtn.textContent = 'Take';
        setUpRandomButton(takeRandomQuizBtn, potential);
        takeRandomQuizBtn.addEventListener('click', randomQuizHandler);
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
        const { questions, categories } = this.getData(),
        buttons = [];
        questions.forEach((question, index) => {
            const button = createElement({
                'type': 'button'
            });
            button.setAttribute('data-id', `${question.id}`);
            button.setAttribute('data-message-box', `confirm`);
            button.setAttribute('data-is-test', `${question.isTest}`);
            button.insertAdjacentHTML('beforeend', `
                <div class="quiz">
                    <div class="quiz-image">
                        <span class="material-symbols-outlined">${categories[1][question.id.split('-')[0]]['icon']}</span>
                    </div>
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
                    messageBox = modalContainer.querySelector('#note');
                    setUpNoteBox(currentTarget, 
                        {
                            title: 'You took this quiz before!',
                            message: `If you want to take it again, please press (or click) "Take this quiz" button below.`,
                            buttonText: 'I will take another quiz',
                            anchorText: 'Take this quiz'
                        }
                    );
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