import { createElement } from "./Function.js";

const Home = {
    htmlDOM: createElement({
        'type': 'div',
        'classNames': 'home-page'
    }),
    render: function() {
        const root = document.getElementById('root');
        const questions = [
            {
                'name': 'JavaScript là gì?',
                'questions': 25
            },
            {
                'name': 'Những quốc gia này có gì đặc biệt?',
                'questions': 10
            },
            {
                'name': 'Thuật toán cơ bản',
                'questions': 20
            },
            {
                'name': 'Trắc nghiệm tâm lý',
                'questions': 15
            }
        ];
        const categories = ['Nổi bật', 'Yêu thích', 'Lập trình', 'Toán học'];
        const htmls = `
            ${Banner({
                'banner-text__title': 'Quiz nổi bật nhất',
                'banner-text__description': 'Đây là bài quiz được nhiều người dùng làm nhất tuần qua.'
            }, false)}
            <hr>
            ${QuizCategory({ categories }, false)}
            <hr>
            ${Quizzes({ questions }, false)}
        `;
        this.htmlDOM.insertAdjacentHTML('beforeend', htmls);
        root.appendChild(this.htmlDOM);
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
        </div>
        <div class="btn btn-banner btn-primary-blue">Làm ngay</div>
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
        <a class="quiz" href="/public/quiz">
            <div>
                <div class="quiz-image"></div>
                <div class="quiz-text">
                    <h3 class="quiz-name">${value.name}</h3>
                    <p class="quiz-amount">${value.questions} câu</p>
                </div>
                <span class="material-symbols-outlined">arrow_forward_ios</span>
            </div>
        </a>
        `;
    });
    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

export default Home;