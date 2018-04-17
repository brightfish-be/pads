import helpers from './helpers.js';

const d = document,
    DEFAULTS = {
        field: '.pad-field',
        minLength: 1,
        maxLength: 10,
        fnKeys: [
            {name: 'backspace', text: '&#9003;'},
            {name: 'enter', text: '&#8629;'},
            {name: 'close', text: '&#215;'}
        ],
        onUpdate: null,
        onEnter: null,
        onError: null,
        onClose: null,
    };

/**
 * @constructor
 * @param {object} options
 */
export default function Pad(options) {
    let self = this;

    // private options object
    self._o = Object.assign({}, DEFAULTS, options = options || {});

    // elements
    self.dom = {
        field: options.field = (typeof self._o.field === 'string' ? d.querySelector(self._o.field) : self._o.field),
        root: options.root = (options.root ? options.root : helpers.wrap(options.field, 'pad-wrap'))
    };

    // element containing the keyboard,
    // ``_padElement`` tests for existence of ``pad`` in ``this.dom``
    self.dom.pad = self._padElement(options.root);

    // current value of the input field/text area
    self.current = this.getFieldValue();

    self.type = options.layout || 'normal';

    // todo do not do this on init
    self.render();

    // bind and stash events for later removal
    self.handlers = [
        self._bindFocus(self.dom.field),
        self._bindPad(self.dom.root)
    ]
}

Pad.prototype = {

    setLayout: function (type) {
        this.type = type;
        return this
    },

    setUpperCase: function (state) {
        this.setPadClassName('pad-upper', this.isUpper = state);
        return this
    },

    toggleKey: function (key) {
        return key.classList.toggle('active');
    },

    setPadClassName: function(className, state) {
        this._padElement().classList[state ? 'add' : 'remove'](className);
        return this
    },

    changeLayout: function (btn, name) {
        this.setUpperCase(false).setLayout(this.toggleKey(btn) ? name : 'normal').render();
    },

    render: function() {
        let self = this,
            pad = this._padElement(),
            keyboard = this._o.keyboard[this.type],
            html = '';

        keyboard.forEach(function (row) {
            html += '<div class="pad-row">';

            row.forEach(function (key) {
                html += key ? self._key(key, self.isModifierKey(key)) : self._keySpacer();
            });

            html += '</div>';
        });

        pad.innerHTML = html;

        if (!pad.parentNode) this.dom.root.appendChild(pad);

        return pad;
    },

    _padElement: function () {
        if (this.dom.pad) return this.dom.pad;
        let pad = d.createElement('div');
        pad.className = 'pad-keys';
        return pad;
    },

    _keySpacer: function () {
        return '<span class="pad-space"></span>'
    },

    _key: function (value, isModifier) {
        let className = 'class="key key-' + value + '"';
        return '<div ' + className + ' aria-label="' + value + '">' + (!isModifier ? value : '') + '</div>';
    },

    _bindPad: function (pad) {
        let self = this,
            handler = function (e) {
                let value = e.target ? e.target.getAttribute('aria-label') : null;

                if (!value) return;
                if (helpers.isFn(self[value])) return self[value](e, value);

                self.setValue(value);

                e.stopPropagation();
            }.bind(self);

        pad.addEventListener('click', handler, false);

        return {
            el: pad,
            fn: handler,
            evt: 'click'
        }
    },

    _bindFocus: function (input) {
        let self = this,
            handler = function () {
                self.show();
            }.bind(self);

        input.addEventListener('focusin', handler, false);

        return {
            el: input,
            fn: handler,
            evt: 'click'
        }
    },

    setValue: function (attr) {
        let current = this.getFieldValue();

        if (!this.validate(current + attr)) return;

        if (this.isUpper) attr = attr.toUpperCase();

        this.setField(current + attr);
    },

    validate: function (value) {

        if (value.length < this._o.minLength) {
            this._fireCB('Error', 'The input value is too short.');
            return false;
        }

        if (value.length > this._o.maxLength) {
            this._fireCB('Error', 'The input value is too long.');
            return false;
        }

        return true;
    },


    isModifierKey: function(key) {
        return helpers.isFn(this[key]);
    },

    getFieldValue: function () {
        return this.dom.field.value;
    },

    setField: function (value) {
        this.dom.field.value = this.current = value.toString();
        return this._fireCB('Update');
    },

    backspace: function () {
        this.setField(this.current.slice(0, -1));
    },

    clear: function () {
        return this.setField('');
    },

    close: function () {
        this.hide().clear()._fireCB('Close');
        return this;
    },

    enter: function () {
        if (this.validate(this.current)) this._fireCB('Enter');
    },

    _fireCB: function (fn, param) {
        fn = this._o['on' + fn];
        if (fn && helpers.isFn(fn)) fn.call(this, param || this.current, this);
        return this
    },

    show: function () {
        this.dom.pad.style.display = 'block';
        return this
    },

    hide: function () {
        this.dom.pad.style.display = 'none';
        return this
    },

    destroy: function () {
        let self = this, i = 0, l = self.handlers.length;

        // empty, close and remove the pad element
        self.close();
        self.dom.root.removeChild(self.dom.pad);

        // detach events
        for (i; i < l; i++) {
            self.handlers[i]['el'].removeEventListener(self.handlers[i]['evt'], self.handlers[i]['fn'], false);
        }

        // release references
        self.handlers = [];
        self.dom = self._o = null
    }
};
