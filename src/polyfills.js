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
