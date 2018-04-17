import Pad from './Pad';
import helpers from './helpers';

/**
 * KeyPad
 * @param options
 * @constructor
 */
export default function KeyPad(options) {

    options = Object.assign({
        keyboard: helpers.getKeyboard('email'),
        field: '.pad-field-key'
    }, options || {});

    Pad.call(this, options);
}

KeyPad.prototype = Object.assign(Object.create(Pad.prototype), {

    caps: function (e) {
        this.setUpperCase(this.toggleKey(e.target));
    },

    num: function(e, key) {
        this.changeLayout(e.target, key);
    },

    normal: function(e, key) {
        this.changeLayout(e.target, key);
    },

    alt: function(e, key) {
        this.changeLayout(e.target, key);
    }
});

KeyPad.prototype.constructor = KeyPad;