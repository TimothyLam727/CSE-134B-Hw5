class HelloWorld extends HTMLElement {
    connectedCallback() {
        console.log("Hello world!");
    }
}

customElements.define('hello-world', HelloWorld);
