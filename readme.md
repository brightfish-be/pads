# Pads&mdash;lightweight and dependency-free on-screen keyboards

Out of the box the package contains three keyboards: a plain dial pad, and two iOS like keyboards, one for email fields 
and one for body copy. Of course one can add custom keyboards and layouts, along with the methods for their function and modifier keys.  
All fields having the `pad-field` class will be linked to the keyboard. Each field's `type` (or `data-pad`) attribute 
defines the layout of the keyboard.  
<br>
This is mostly written in ES5 as it was originally coded for touch platforms running older Android browsers. 
The ES6 parts were either supported by the devices or needed to concatenate the modules with Rollup.  
<br>

<a href="" target="_blank" rel="noopener">&rsaquo;_&thinsp;demo</a>

## Features

- Each keyboard can have multiple layouts
- All keys can have a custom click handler
- A keyboard for a field is active once the field is in focus
- Ability to cycle through the fields (eg. on `enter` set the focus on the next field)
- A single event listener is bound to the keyboard for all keys in all layouts

## Installation
```
npm i @brightfish/pads
```

## Usage
```
new Pad({
    root: document.querySelector('.where-to-append'),
});
```

## Options
```
root: null,          # Where to render the keyboard; if omitted the keyboard is appended after the first field
field: null,         # Field to bind the keyboard to; optional: all fields with .pad-field are elegible
keyboard: 'email',   # Default starting keyboard
layout: 'normal',    # Default starting layout (of the default keyboard)
```

## Listening to events & validation
```
(new Pad({...}))
    .on('update', value => {
        return value.length < 10
    })
    .on('b', value => {
        console.log("'b' key was pressed; current field value is", value)
        return true;
    })
    .on('enter', function(value) {
        // jump to the next field
        this.next();
        return true;
    })
```

## Defining custom keyboards
```
let layouts = {
        alpha: [
            ['a', 'b', 'c', 'custom1'],
            ['x', 'y', 'z', 'caps', 'num']
        ],
        num: [
            [1, 2, 3, 'f3'],
            [7, 8, 9, 'backspace', 'alpha']
        ]
    },
    methods = {
        custom1() {
            alert('alert')
        },
        f3() {
            console.log('funky')
        },
    }

Pad.addKeyboard('my-keyboard', layouts, methods);
```

## Key styling and textContent
Character keys have their key values as `textContent`, while modifier keys have no `textContent` and need to be styled 
through css (which allows custom icons), for example: `.pad-key-enter:after { content: '\21B5' }` for '↵'


## Main public methods

### instance.on(event, fn): instance
Listen to the `update` event or any key press (pass in the key value)

### instance.switchField(field, keyboard, layout): instance
Switch to another field having the `pad-field` class name, and optionally change the keyboard and the layout. The 
`layout` argument will take precedence over the `type` and `data-pad` attributes.

### instance.getField(): HTMLInputElement
Return the input field the instance is currently linked to

### instance.next(): void
Jump to the next `.pad-field` field 

### instance.getFieldValue(): String
Get the value of the current field

### instance.setFieldValue(string): void
Set the value of the current field

### instance.clear(): void
Clear the current field's value

### instance.show(): void
Show the keyboard

### instance.hide(): void
Hide the keyboard

### instance.destroy(boolean): void
Unbind all events and clean up the DOM, optionally empty out the field


## License
The GNU General Public License (GPL). Please see License File for more information.
