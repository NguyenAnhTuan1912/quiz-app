function createElement(props) {
    const type = document.createElement(props.type);
    if(props.classNames) type.classList.add(...props.classNames.split(' '));
    if(props.id) type.id = props.id;
    return type;
}

const show = (function() {
    return function handler(event) {
        const { target, currentTarget } = event;
        if(target !== currentTarget) return;
        currentTarget.parentElement.classList.toggle('move-x');
    }
})();

export {
    createElement,
    show
}