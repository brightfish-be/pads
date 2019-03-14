if (typeof Object.assign !== 'function') {

    /**
     * `Object.assign` polyfill
     * @param {Object} target
     * @param {*} varArgs
     * @return {Object}
     */
    Object.assign = function (target, varArgs) {
        'use strict';
        var to, index, l = arguments.length, nextSource, nextKey;

        if (!target) { // TypeError if undefined or null
            throw new TypeError('Cannot convert undefined or null to object');
        }

        to = Object(target);

        for (index = 1; index < l; index++) {
            nextSource = arguments[index];
            if (nextSource) { // Skip over if undefined or null
                for (nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

export default {

    /**
     * Query an element in the dom
     * @param {String|Element} el
     * @return {Element}
     */
    getElement: function(el) {
        return !el instanceof HTMLElement ? d.querySelector(el) : el
    },

    /**
     * Wrap an element in a `div` with a class attribute
     * @param {HTMLElement|Node} el
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
    },

    /**
     *
     * @param {Element} el
     * @param name
     * @param handler
     * @return {{el: Element, fn: Function, evt: string}}
     */
    addEvent: function (el, name, handler) {
        el.addEventListener(name, handler, true);
        return {
            el: el,
            fn: handler,
            evt: 'click'
        }
    },
};
