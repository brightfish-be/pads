
export default {

    /**
     * Check if the key is not a character key
     * @todo can be done better...
     * Previously `helpers.isFn(this[key])` but since all keys can be listened to through `on()`,
     * modifier/function key methods should not be mandatory.
     * @param {string} key
     * @return {boolean}
     */
    isModifierKey: function (key) {
        return key.length > 1;
    },

    /**
     * Modifier key handler
     * @return void
     */
    backspace: function () {
        this.setFieldValue(this.current.slice(0, -1));
    },

    /**
     * Modifier key handler
     * @return void
     */
    caps: function (e) {
        this.toggleUpperCase(this.toggleKey(e.target));
    },

    /**
     * Modifier key handler
     * @return void
     */
    toggleUpperCase: function (state) {
        this._setPadClassName('pad-upper', this.isUpper = state);
    },

    /**
     * Toggle state of the key
     * @return {Boolean}
     */
    toggleKey: function (key) {
        return key.classList.toggle('active');
    },

    /**
     * Modifier key handler: switch to `num` layout
     * @return void
     */
    num: function(e, key) {
        this._changeLayout(e.target, key);
    },

    /**
     * Modifier key handler: switch to `normal` layout
     * @return void
     */
    normal: function(e, key) {
        this._changeLayout(e.target, key);
    },

    /**
     * Modifier key handler: switch to `alt` layout
     * @return void
     */
    alt: function(e, key) {
        this._changeLayout(e.target, key);
    },

    /**
     * Modifier key handler: hide-the-keyboard key
     * @return void
     */
    close: function () {
        this.hide();
    },

    /**
     * Modifier key handler: 'bind' keyboard to next field in array of `pad-field` elements
     * @return void
     */
    next: function() {
        let n = this.getNextField();
        this.switchField(n);
    }
}
