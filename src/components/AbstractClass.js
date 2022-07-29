export default class {
    #params;
    #data;

    constructor(params, data) {
        this.#params = params || '';
        this.init(data, data => {
            this.#data = data;
        });
    }

    setTitle(text) {
        document.title = text;
    }
    
    get getParams() {
        return this.#params;
    }

    get getData() {
        return this.#data;
    }

    init(data = {}, callBack = () => {}) {
        try {
            if(!data) throw 'Data Error: Null or Undefined.';
            callBack(data);
        } catch (error) {
            console.error(error);
        }
    }

    render() {
        return '';
    }

}