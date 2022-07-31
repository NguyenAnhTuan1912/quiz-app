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

function Counter(s = 0, e = 100, st = 1) {
    let number = 0,
    isStop = false,
    isReset = false,
    step = st,
    start = s,
    end = e
    
    this.setNumber = (n) => {
        number = n;
        return number;
    }

    this.setStart = (s) => {
      start = s;
    }
    
    this.setEnd = (e) => {
      end = e;
    }
    
    this.reset = () => {
        if(isReset) number = 0;
    };
  
    this.decrease = () => {
      if(!isStop && !(number === start)) number -= step;
      return number;
    };
  
    this.increase = () => {
      if(!isStop && !(number === end)) number += step;
      return number;
    };
}

function insertAfter(newNode, node) {
    node.parentNode.insertBefore(newNode, node.nextSibling);
}

export {
    createElement,
    show,
    setHandlers,
    setHandler,
    getParentElement,
    insertAfter,
    Counter
}