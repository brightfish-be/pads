import polyfills from './polyfills';
import keyHelpers from './key-helpers';
import keyboards from './keyboards';
import helpers from './helpers';
import events from './events';

const
    d = document,
    DEFAULTS = {
        root: null,
        field: null,
        keyboard: 'email',
        layout: 'normal',
    };

/**
 * Pad
 *
 * @param {Object} options
 * @constructor
 */
export default function Pad(options) {
    let self = this,
        fields = Array.prototype.slice.call(d.querySelectorAll('input.pad-field')),
        field = options.field ? helpers.getElement(options.field) : fields[0];

    self._o = options = Object.assign({}, DEFAULTS, options || {});

    self._dom = {
        fields: fields,
        root: options.root ? helpers.getElement(options.root) : helpers.wrap(fields[0], 'pad-wrap'),
        pad: self._createPadElement()
    };

    self._setState(field, options.keyboard, options.layout);

    self._render();

    // Cache for user bound events (with `on()`)
    self._userHandlers = [];

    // Bind and stash events for later removal
    self._domHandlers = self._bindFocus(fields);
    self._domHandlers.push(self._bindKeys(self._dom.root));
}

/**
 * Add a custom keyboard with its custom key methods
 * @param {String} name
 * @param {Object} layouts
 * @param {Object} methods
 */
Pad.addKeyboard = function (name, layouts, methods) {
    keyboards[name] = layouts;
    Pad.prototype = Object.assign(Pad.prototype, methods);
};


Pad.prototype = Object.assign({}, keyHelpers, events, {

    /**
     * Activate the instance for another field, optionally with another keyboard and layout
     * @param {HTMLInputElement} field
     * @param {string} keyboard
     * @param {string} layout
     * @return {Object}
     */
    switchField: function (field, keyboard, layout) {
        let self = this;

        layout = layout || 'normal';
        keyboard = keyboard || field.getAttribute('data-pad') || field.type || DEFAULTS.keyboard;

        self._setState(field, keyboard, layout);
        self._render();
        self.show();
        return this;
    },

    /**
     * Modify state properties
     * @param {HTMLInputElement} field
     * @param {string} keyboard
     * @param {string} layout
     * @private
     */
    _setState: function (field, keyboard, layout) {
        let self = this;

        if (self._dom.field) {
            self._dom.field.classList.remove('pad-active');
        }

        field.classList.add('pad-active');

        self._dom.field = field;
        self.keyboard = keyboard;
        self.layout = layout;
        self.current = self.getFieldValue();
        self.fieldIdx = self._dom.fields.indexOf(field);
    },

    /**
     * Get all layouts of keyboard
     * @param {string} name
     * @return {{}}
     * @private
     */
    _getKeyboard: function (name) {
        return keyboards[name];
    },

    /**
     * Add/remove a class name
     * @param className
     * @param state
     * @private
     */
    _setPadClassName: function (className, state) {
        this._dom.pad.classList[state ? 'add' : 'remove'](className);
    },

    /**
     * Switch between layouts of the current keyboard
     * @param {HTMLDivElement} btn
     * @param {String} name
     * @private
     */
    _changeLayout: function (btn, name) {
        this.layout = this.toggleKey(btn) ? name : 'normal';
        this.toggleUpperCase(false);
        this._render();
    },

    /**
     * Render the key rows and append them
     * @return {HTMLDivElement}
     * @private
     */
    _render: function () {
        let self = this,
            pad = self._dom.pad,
            keyboard = self._getKeyboard(self.keyboard)[self.layout],
            html = '';

        keyboard.forEach(function (row) {
            html += '<div class="pad-row">';

            row.forEach(function (key) {
                html += key ? self._createKey(key, self.isModifierKey(key)) : self._createKeySpacer();
            });

            html += '</div>';
        });

        pad.innerHTML = html;

        if (!pad.parentNode) self._dom.root.appendChild(pad);

        return pad;
    },

    /**
     * Creates main element
     * @return {HTMLDivElement}
     * @private
     */
    _createPadElement: function () {
        let pad = d.createElement('div');
        pad.className = 'pad-main';
        return pad;
    },

    /**
     * Creates a spacing element
     * @return {string} HTML
     * @private
     */
    _createKeySpacer: function () {
        return '<span class="pad-space"></span>'
    },

    /**
     * Create a key
     * @param {String} value
     * @param {Boolean} isModifier
     * @return {string} HTML
     * @private
     */
    _createKey: function (value, isModifier) {
        let className = 'class="pad-key pad-key-' + value + '"';
        return '<div ' + className + ' aria-label="' + value + '">' + (!isModifier ? value : '') + '</div>';
    },

    /**
     * Return the input field the instance is currently linked to
     * @return {null|HTMLInputElement}
     */
    getField: function () {
        return this._dom.field;
    },

    /**
     * Return the next field in line (all `.pad-field` are cached in the instance)
     * @return {HTMLInputElement}
     */
    getNextField: function () {
        let next = ++this.fieldIdx;
        next = next >= this._dom.fields.length ? 0 : next;
        return this._dom.fields[next]
    },

    /**
     * Concatenate the pressed key value with the current string
     * @param {String} attr
     * @return void
     */
    appendValue: function (attr) {
        let current = this.getFieldValue();

        if (this.isUpper) attr = attr.toUpperCase();

        this.setFieldValue(current + attr);
    },

    /**
     * Get the value of the current field
     * @return {String}
     */
    getFieldValue: function () {
        return this._dom.field.value;
    },

    /**
     * Set the value of the current field
     * @param {String} newValue
     * @return void
     */
    setFieldValue: function (newValue) {
        if (this._trigger('update', newValue)) {
            this._dom.field.value = this.current = newValue;
        }
    },

    /**
     * Clear the current field's value
     * @return void
     */
    clear: function () {
        this.setFieldValue('');
    },

    /**
     * Show the keyboard
     * @return void
     */
    show: function () {
        this._dom.pad.style.display = 'block';
    },

    /**
     * Hide the keyboard
     * @return void
     */
    hide: function () {
        this._dom.pad.style.display = 'none';
    },

    /**
     * Unbind all events and clean up the DOM, optionally empty out the field
     * @param {Boolean} clearField
     * @return void
     */
    destroy: function (clearField) {
        let self = this;

        if (clearField) {
            self.clear();
        }

        // Hide remove the pad element
        self.hide();
        self._dom.root.removeChild(self._dom.pad);

        // Detach events
        self._domHandlers.forEach(function (obj) {
            obj.el.removeEventListener(obj.evt, obj.fn, true);
        });

        // Release references
        self._domHandlers = self._userHandlers = [];
        self._dom = self._o = null
    },
});
