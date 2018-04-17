import Pad from './Pad';
import helpers from './helpers.js';

/**
 * NumPad
 * @param options
 * @constructor
 */
export default function NumPad (options) {
    options = options || {};
    options.keyboard = options.keyboard || helpers.getKeyboard('dial');
    options.field = options.field || '.pad-field-num';
    Pad.call(this, options);
}

NumPad.prototype = Object.create(Pad.prototype);
NumPad.prototype.constructor = NumPad;
