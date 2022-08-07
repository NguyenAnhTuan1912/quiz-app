import AbstractClass from "./AbstractClass.js";
import { 
    createElement,
    showModal,
    getRandomNumber,
    turnOffModal,
    turnOnModal
 } from "../Function.js";
import {
    navigateTo
} from "../Router.js"
import ModalBox from "./ModalBox.js";

export default class extends AbstractClass {
    #dom;
    #cate;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Quiz page');
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section'
        });
        this.#cate = ['Highlight', 'Math', 'Logic', 'Fun'];
        this.initDom();
        document.querySelector('header .title').textContent = document.title;
    }

    get getDom() {
        return this.#dom;
    }

    get getCategories() {
        return this.#cate;
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

    initDom() {
        const bannerData = {
            'title': 'Take a random quiz',
            'description': 'There are a lot of quizzes which are added from many difference resources. '
        }
        const questions = this.getData, categories = this.getCategories,
        banner = new Banner('', bannerData),
        quizCategory = new QuizCategory('', { categories }),
        quizzes = new Quizzes('', { questions });
        this.#dom.append(
            banner.render(),
            createElement({ 'type': 'hr' }),
            quizCategory.render(),
            createElement({ 'type': 'hr' }),
            quizzes.render()
        );
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class Banner extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-section__banner',
            'id': 'js-quizPageBannerContainer'
        });
        this.initDom();
    }

    initDom() {
        const { title, description } = this.getData;
        this.#dom.insertAdjacentHTML('beforeend', `
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
        bannerText = this.#dom.querySelector('.banner-text');

        takeRandomQuizBtn.href = `/quiz/${getRandomNumber(1, 5)}`;
        takeRandomQuizBtn.textContent = 'Take';
        takeRandomQuizBtn.addEventListener('click', (event) => {
            const { currentTarget } = event;
            event.preventDefault();
            navigateTo(currentTarget.href)
        });
        bannerText.appendChild(takeRandomQuizBtn);
        this.#dom.append(bannerText);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class QuizCategory extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quiz-category',
            'id': 'js-quizPageQuizCategoryContainer'
        });
        this.initDom();
    }

    initDom() {
        const { categories } = this.getData,
        categoriesItemContainer = createElement({
            'type': 'div',
            'classNames': 'category-items'
        });
        categories.forEach((value) => {
            categoriesItemContainer.insertAdjacentHTML('beforeend', `
                <div class="btn btn-no-background btn-rounded-5px category-item ft-sz-13">
                    <p class="category-item__text">${value}</p>
                </div>
            `)
        });
        this.#dom.append(categoriesItemContainer);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

class Quizzes extends AbstractClass {
    #dom;

    constructor(params, data) {
        super(params, data);
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'quizzes',
            'id': 'js-quizPageQuizzesContainer'
        });
        this.initDom();
    }

    initDom() {
        const { questions } = this.getData,
        buttons = [];
        questions.forEach(question => {
            const button = createElement({
                'type': 'button'
            });
            button.setAttribute('data-id', `quiz-${question.id}`);
            button.setAttribute('data-message-box', `confirm`);
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
        this.#dom.append(...buttons);
    }

    render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

// function Banner(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'home-page__banner',
//         'id': 'js-homePageBannerContainer'
//     });
//     const htmls = `
//         <div class="banner-image"></div> 
//         <div class="banner-text">
//             <h3 class="banner-text__title">${props['banner-text__title']}</h3>
//             <p class="banner-text__description">${props['banner-text__description']}</p>
//             <div class="btn btn-banner btn-no-background btn-rounded-5px">Get started</div>
//         </div>
//     `;
//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// function QuizCategory(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'quiz-category',
//         'id': 'js-homePageQuizCategoryContainer'
//     });

//     const div2 = createElement({
//         'type': 'div',
//         'classNames': 'category-items'
//     });

//     let htmls = ``;
//     props.categories.forEach((value) => {
//         htmls += `
//             <div class="btn btn-rounded-5px category-item">
//                 <p class="category-item__text">${value}</p>
//             </div>
//         `;
//     });

//     div2.insertAdjacentHTML('beforeend', htmls);
//     div.appendChild(div2);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// function Quizzes(props = {}, isReturnDom = true) {
//     const div = createElement({
//         'type': 'div',
//         'classNames': 'quizzes',
//         'id': 'js-homePageQuizzesContainer'
//     });

//     let htmls = ``;
//     props.questions.forEach((value) => {
//         htmls += `
//             <button data-id="quiz-${value.id}" onclick="">
//                 <div class="quiz">
//                     <div class="quiz-image"></div>
//                     <div class="quiz-text">
//                         <h3 class="quiz-name">${value.name}</h3>
//                         <p class="quiz-amount">${value.amount} questions.</p>
//                     </div>
//                     <span class="material-symbols-outlined">arrow_forward_ios</span>
//                 </div>
//             </button>
//         `;
//     });
//     div.insertAdjacentHTML('beforeend', htmls);
//     return (isReturnDom) ? div : div.outerHTML;
// }

// htmlDOM: createElement({
//     'type': 'div',
//     'classNames': 'home-page'
// }),
// data: {},
// render: async function() {
//     document.title = 'Home';
//     const root = document.getElementById('root');
//     const questions = [
//         {
//             'name': '25 điều thú vị về loài mèo mà bạn có biết?',
//             'questions': 25
//         },
//         {
//             'name': '10 câu hỏi toán lớp 1',
//             'questions': 10
//         },
//         {
//             'name': 'Nhũng câu hỏi hóc búa - Phần 3',
//             'questions': 20
//         },
//         {
//             'name': 'Những câu hỏi học búa - Phần 2',
//             'questions': 15
//         }
//     ];
//     const categories = ['Nổi bật', 'Yêu thích', 'Lập trình', 'Toán học'];
//     const htmls = `
//         ${Banner({
//             'banner-text__title': 'Quiz nổi bật nhất',
//             'banner-text__description': 'Đây là bài quiz được nhiều người dùng làm nhất tuần qua.'
//         }, false)}
//         <hr>
//         ${await QuizCategory({ categories }, false)}
//         <hr>
//         ${await Quizzes({ questions }, false)}
//     `;
//     this.htmlDOM.insertAdjacentHTML('beforeend', htmls);
//     root.appendChild(this.htmlDOM);
// },
// renderData: function() {

// }