export default {

    layouts: {
        dial : {
            normal: [
                [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
                ['backspace', 'enter', 'close']
            ]
        },
        email: {
            normal: [
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
                ['caps', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
                ['num', '@', '.', 'enter']
            ],
            num: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
                ['$', '!', '~', '&', '=', '#', '[', ']'],
                ['alt', '.', '_', '-', '+', 'backspace'],
                ['normal', '@', '.', 'enter']
            ],
            alt: [
                ['`', '|', '{', '}', '?', '%', '^', '*', '/', "'"],
                ['$', '!', '~', '&', '=', '#', '[', ']'],
                ['num', '.', '_', '-', '+', 'backspace'],
                ['normal', '@', '.', 'enter']
            ]
        },
        // todo : implement
        full: null
    },

    /**
     * Get one of the predefined keyboards with its layouts
     * @param {string} type
     * @return {*}
     */
    getKeyboard: function (type) {
        switch (type) {
            case 'dial':
                return this.layouts.dial;
            case 'email':
                return this.layouts.email;
            default:
                return this.layouts.full;
        }
    },

    /**
     * Wrap an element in a ``div`` with a class attribute
     * @param {HTMLElement} el
     * @param {string} className
     * @return {Node}
     */
    wrap: function (el, className) {
        let parent = el.parentNode,
            wrapper = document.createElement('div');

        wrapper.className = className;
        wrapper.appendChild(parent.removeChild(el));
        return parent.appendChild(wrapper);
    },

    /**
     * Check if passed argument is a function
     * @param {*} fn
     * @return {boolean}
     */
    isFn: function (fn) {
        return typeof fn === 'function';
    }
};
