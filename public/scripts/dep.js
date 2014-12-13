export default class Test {
    constructor() {
        this.name = 'test';
    }

    say( something ) {
        console.log( something || 'hello', 'from the', this.name, 'class' );
    }
}
