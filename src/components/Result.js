import { createElement } from "./Function.js";

const Result = {
    htmlDOM: createElement({
        'type': 'div',
        'classNames': 'result-page'
    }),
    render: function() {
        const root = document.getElementById('root');

        this.htmlDOM.appendChild(Point({}));
        this.htmlDOM.appendChild(Redirect({}));
        root.appendChild(this.htmlDOM);
    }
}

export default Result;

function Point(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'point'
    });

    const htmls = `
        <div class="point-box">
            <h2 class="point-box__title">ĐIỂM CỦA BẠN:</h2>
            <h1 class="text-semi-light ft-sz-20" js="js-point">15</h1>
            <hr>
            <h1 class="text-bold ft-sz-20">15</h1>
            <p class="point-box__message" js="js-pointBoxMessage">Bạn đã đạt được điểm tuyệt đối!</p>
        </div>
    `;


    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}

function Redirect(props = {}, isReturnDom = true) {
    const div = createElement({
        'type': 'div',
        'classNames': 'redirect'
    });

    const htmls = `
        <div class="btn btn-primary-blue btn-rounded-5px"><span>Xem lại bài kiểm tra</span></div>
        <div class="btn btn-next btn-rounded-5px"><span class="text-bold">Bài tiếp theo: </span><span id="js-quizName">Quiz name</span></div>
    `;

    div.insertAdjacentHTML('beforeend', htmls);
    return (isReturnDom) ? div : div.outerHTML;
}