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


function CountDown(minuteValue, secondValue) {
    try {
        if(!(/^\d{1,2}$/.test(minuteValue) && (typeof minuteValue === 'number'))) throw 'TypeError: Minute must be a number and has 1 or 2 digit(s)';
        if(!(/^\d{1,2}$/.test(secondValue) && (typeof secondValue === 'number'))) throw 'TypeError: Second must be a number and has 1 or 2 digit(s)';
        let watch, remain, isStart = false, isStop = false,
        minute = minuteValue, second = secondValue;
        
        let minuteField = undefined,
        secondField = undefined;

        this.setCountDownField = (refMinuteField, refSecondField) => {
            minuteField = (typeof refMinuteField === 'object') ? refMinuteField : undefined;
            secondField = (typeof refSecondField === 'object') ? refSecondField : undefined;
        }


        this.timeFormat = number => {
            return number.toString().replace(/^\S$/g, `0${number}`);
        }

        this.handlerWatch = () => {
            try {
                if(!minuteField) throw 'ElementError: minuteField is undefined or null.';
                if(!secondField) throw 'ElementError: secondFiled is undedined or null.';
                if(second === 0) {
                    second = 59;
                    if(minute <= 0) {
                        second = 0;
                        this.stopWatch();
                    } else minute -= 1;
                    } else second -= 1;
                    minuteField.textContent = this.timeFormat(minute);
                    secondField.textContent = this.timeFormat(second);
            } catch (error) {
                console.error(error);
            }
        }

        this.startWatch = () => {
            watch = setInterval(this.handlerWatch, 1000);
            isStart = true;
            isStop = false;
        }

        this.stopWatch = () => {
            clearInterval(watch);
            isStart = false;
            isStop = true;
        }

        this.run = () => {
            if(!isStart) {
            this.startWatch();
            } else {
            this.stopWatch();
            }
        }

        this.reset = () => {
            minute = minuteValue, second = secondValue;
            minuteField.textContent = this.timeFormat(minute);
            secondField.textContent = this.timeFormat(second);
            this.stopWatch();
        }
        
        this.isStop = () => {
            return isStop;
        }
    } catch(error) {
    console.error(error);
    }
}

function QuizzesCheck() {
    let questions, amount, refSubmitBtn, count = 0;

    this.setData = (data) => {
        questions = data.questions;
        amount = data.amount;
    }

    this.setSubmitButtonReference = (ref) => {
        refSubmitBtn = ref;
    }

    this.getChoosedQuestionsAmount = () => {
        return amount;
    }

    this.canSubmit = () => {
        return count >= Math.round(amount * 0.3);
    }

    this.toggleSubmit = () => {
        if(this.canSubmit()) {
            refSubmitBtn.classList.remove('btn-disabled');
            refSubmitBtn.classList.add('btn-primary-black');
            refSubmitBtn.disabled = false;
        } else {
            refSubmitBtn.classList.remove('btn-primary-black');
            refSubmitBtn.classList.add('btn-disabled');
            refSubmitBtn.disabled = true;
        }
    }

    this.listenChoosedQuestion = () => {
        count = 0;
        questions.forEach(question => {
            if(question.choices.some(choice => choice.checked)) count += 1;
        });
        console.log(amount);
        console.log(this.canSubmit());
        this.toggleSubmit();
    }
}

export {
    createElement,
    show,
    setHandlers,
    setHandler,
    getParentElement,
    insertAfter,
    CountDown,
    Counter,
    QuizzesCheck
}