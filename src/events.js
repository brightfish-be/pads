import helpers from './helpers';

export default {

    /**
     * Stash an event handler
     * @public
     * @param {string} event
     * @param {Function} fn
     * @return {{}}
     */
    on: function(event, fn) {
        this._userHandlers[event] = fn;
        return this;
    },

    /**
     * Trigger an event subscriber
     * @param {string} name
     * @param {string|undefined} value Value to pass to the event handler
     * @return {Boolean}
     * @private
     */
    _trigger: function (name, value) {
        let handler = this._userHandlers[name];
        if (handler && helpers.isFn(handler)) {
            return !!handler.call(this, value || this.current);
        }
        return true
    },

    /**
     * Bind all keys with a single event handler in capture phase
     * @param {Element} pad
     * @return {{el: Element, fn: Function, evt: string}}
     * @private
     */
    _bindKeys: function (pad) {
        let self = this,
            handler = function (e) {
                let key = e.target ? e.target.getAttribute('data-value') : null;

                e.stopPropagation();

                // spacer elements have no key values
                if (key === null) {
                    return;
                }

                // check if a library method is available for this key
                if (helpers.isFn(self[key])) {
                    return self[key](e, key);
                }

                // trigger user created key handlers for this key
                if (self._trigger(key)) {
                    self.appendValue(key);
                }
            };

        return helpers.addEvent(pad, 'click', handler);
    },

    /**
     * Register all `.pad-field` elements, so we can listen to their `focusin` events
     * @param {Array} fields
     * @return {Array}
     * @private
     */
    _bindFocus: function (fields) {
        let self = this,
            stash = [],
            handler = function () {
                if (self.getField() !== this) {
                    self.switchField(this);
                }
                self.show();
            };

        fields.forEach(function(field) {
            stash.push(helpers.addEvent(field, 'focusin', handler));
        });

        return stash;
    },
}
