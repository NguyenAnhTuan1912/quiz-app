import AbstractClass from "./AbstractClass.js";
import { createElement } from "./Function.js";

export default class extends AbstractClass {
    #dom;
    #cate;

    constructor(params, data) {
        super(params, data);
        this.setTitle('Home');
        this.#dom = createElement({
            'type': 'div',
            'classNames': 'home-page'
        });
        this.#cate = ['Nổi bật', 'Toán học', 'Logic', 'Đố vui'];
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
        const questions = this.getData, categories = this.getCategories;
        console.log(questions);
        this.#dom.insertAdjacentHTML('beforeend', `
            <div class="home-page">
                ${Banner({
                    'banner-text__title': 'Quiz nổi bật nhất',
                    'banner-text__description': 'Đây là bài quiz được nhiều người dùng làm nhất tuần qua.'
                }, false)}
                <hr>
                ${QuizCategory({ categories }, false)}
                <hr>
                ${Quizzes({ questions }, false)}
            </div>
        `);
    }

    async render(isNode = true) {
        return (isNode) ? this.#dom : this.#dom.outerHTML;
    }
}

function Banner(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'home-page__banner',
        'id': 'js-homePageBannerContainer'
    });
    const htmls = `
        <div class="banner-image"></div> 
        <div class="banner-text">
            <h3 class="banner-text__title">${props['banner-text__title']}</h3>
            <p class="banner-text__description">${props['banner-text__description']}</p>
            <div class="btn btn-banner btn-no-background btn-rounded-5px">Làm ngay</div>
        </div>
    `;
    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

function QuizCategory(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quiz-category',
        'id': 'js-homePageQuizCategoryContainer'
    });

    const div2 = createElement({
        'type': 'div',
        'classNames': 'category-items'
    });

    let htmls = ``;
    props.categories.forEach((value) => {
        htmls += `
            <div class="btn btn-rounded-5px category-item">
                <p class="category-item__text">${value}</p>
            </div>
        `;
    });

    div2.insertAdjacentHTML('beforeend', htmls);
    div.appendChild(div2);
    return (isReturnDom) ? div : div.outerHTML;
}

function Quizzes(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'quizzes',
        'id': 'js-homePageQuizzesContainer'
    });

    let htmls = ``;
    props.questions.forEach((value) => {
        htmls += `
            <a href="/quiz/${value.id}" data-id="${value.id}" data-link onclick="linkClickHandler(event)">
                <div class="quiz">
                    <div class="quiz-image"></div>
                    <div class="quiz-text">
                        <h3 class="quiz-name">${value.name}</h3>
                        <p class="quiz-amount">${value.amount} câu</p>
                    </div>
                    <span class="material-symbols-outlined">arrow_forward_ios</span>
                </div>
            </a>
        `;
    });
    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

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