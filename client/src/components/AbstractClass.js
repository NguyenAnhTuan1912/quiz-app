export default class {
    constructor(params) {
        let _params = params;

        this.getParams = () => _params;
        this.setParams = (params) => { _params = params };
    }

    setTitle(text) {
        document.title = text;
    }

    init() {}

    initDom() {}

    render() {
        return '';
    }

}