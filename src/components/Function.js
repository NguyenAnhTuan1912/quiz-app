function createElement(props = {}) {
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

function setHandlers(elements = NodeList, type = '', handler = () => {}) {
    try {
        if(!(elements instanceof NodeList)) throw 'TypeError: Your Elements must be a NodeList.';
        elements.forEach((element) => {
            element.addEventListener(type, handler);
        });
    } catch (error) {
        console.error(error);
    }
}

function setHandler(element = HTMLElement, type = '', handler = () => {}) {
    try {
        if(!(element instanceof HTMLElement)) throw 'TypeError: Your Element must be a HTMLElement.';
        console.log(element);
        element.addEventListener(type, handler(event));
    } catch (error) {
        console.error(error);
    }
}

function getParentElement(element = Node || null) {
    return element.parentElement;
}

export {
    createElement,
    show,
    setHandlers,
    setHandler,
    getParentElement
}