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
        let watch, isStart = false, isStop = false,
        minute = minuteValue, second = secondValue;
        const modalContainer = document.getElementById('modal'),
        handInWarningMessageBox  = document.getElementById('warning'),
        warningBoxHandInBtn = handInWarningMessageBox.querySelector('#js-warningBoxHandInBtn');
        warningBoxHandInBtn.href = '/result/quiz-' + location.pathname.match(/\d+$/).join();

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
                        turnOnModal(modalContainer, handInWarningMessageBox);
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
            refSubmitBtn.classList.add('btn-primary');
            refSubmitBtn.disabled = false;
        } else {
            refSubmitBtn.classList.remove('btn-primary');
            refSubmitBtn.classList.add('btn-disabled');
            refSubmitBtn.disabled = true;
        }
    }

    this.listenChoosedQuestion = () => {
        count = 0;
        questions.forEach(question => {
            if(question.choices.some(choice => choice.checked)) count += 1;
        });
        this.toggleSubmit();
    }
}

function Init() {
    let check = false;

    this.start = () => {
        if(!check) check = true;
    }

    this.isStart = () => {
        return check;
    }
}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function turnOnModal(modalContainer, messageBox) {
    modalContainer.classList.remove('hide');
    messageBox.classList.remove('hide');
}

function turnOffModal(modalContainer, messageBox) {
    modalContainer.classList.add('hide');
    messageBox.classList.add('hide');
}

function showConfirmBox(modalContainer, currentTarget, data) {
    const {amount, time, name} = data,
    [ minute, second ] = time.split(':'),
    messageBox = modalContainer.querySelector('#confirm'),
    quizNameP = modalContainer.querySelector('#js-quizName'),
    timeP = modalContainer.querySelector('#js-modalInfoTime'),
    amountP = modalContainer.querySelector('#js-modalInfoAmount'),
    acceptBtn = modalContainer.querySelector('#js-acceptBtn');
    turnOnModal(modalContainer, messageBox);
    quizNameP.textContent = name;
    timeP.textContent = `${(minute == '0') ? `${second} second` : `${minute}min${second}s`}`;
    amountP.textContent = `${amount} Questions.`;
    acceptBtn.href = `/quiz/${currentTarget.getAttribute('data-id')[currentTarget.getAttribute('data-id').length - 1]}`;

}

function showNoteBox(modalContainer, currentTarget, data) {
    const messageBox = modalContainer.querySelector('#note'),
    handInBtn = modalContainer.querySelector('#js-noteBoxHandInBtn');
    handInBtn.href = `/result/${currentTarget.getAttribute('data-id')[currentTarget.getAttribute('data-id').length - 1]}`;
    turnOnModal(modalContainer, messageBox);
}

const showModal = (function() {
    return function showModal(event, data) {
        const { currentTarget } = event,
        typeOfBox = currentTarget.getAttribute(['data-message-box']),
        modalContainer = document.getElementById('modal');
        if((/confirm/gi).test(typeOfBox)) {
            showConfirmBox(modalContainer, currentTarget, data);
        }
        if((/note/gi).test(typeOfBox)) {
            showNoteBox(modalContainer, currentTarget);
        }
    }
})();

const hideModal = (function() {
    return function hideModal(event) {
        const { currentTarget } = event,
        modalContainer = document.getElementById('modal'),
        messageBox = getParentElement(getParentElement(currentTarget));
        turnOffModal(modalContainer, messageBox);
    }
})();

function createSpan(data, className) {
    const spanNode = document.createElement('span');
    const textNode = document.createTextNode(data);
    spanNode.append(textNode);
    spanNode.classList.add(...className);
    return spanNode;
}

function rubberText(text) {
    const spanTitleArray = text.split('').map((value, index) => {
        if(value === ' ') return ' ';
        const spanTitleComplete = createSpan(value, ['display', `_${index + 1}`, 'rubber_band']);
        setTimeout(() => {
            spanTitleComplete.classList.remove('display');
        }, (text.length + 4) * 100);
        return spanTitleComplete;
    });
    return spanTitleArray;
}


export {
    createElement,
    show,
    setHandlers,
    setHandler,
    getParentElement,
    insertAfter,
    getRandomNumber,
    turnOffModal,
    turnOnModal,
    showModal,
    hideModal,
    rubberText,
    CountDown,
    Counter,
    QuizzesCheck,
    Init
}