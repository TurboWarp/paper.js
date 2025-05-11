/*
 * Paper.js - The Swiss Army Knife of Vector Graphics Scripting.
 * http://paperjs.org/
 *
 * Copyright (c) 2011 - 2020, Jürg Lehni & Jonathan Puckey
 * http://juerglehni.com/ & https://puckey.studio/
 *
 * Distributed under the MIT license. See LICENSE file for details.
 *
 * All rights reserved.
 */

/**
 * @name PaperScript
 * @namespace
 */
Base.exports.PaperScript = function() {
    // Operators to overload

    var binaryOperators = {
        // The hidden math methods are to be injected specifically, see below.
        '+': '__add',
        '-': '__subtract',
        '*': '__multiply',
        '/': '__divide',
        '%': '__modulo',
        '==': '__equals',
        '!=': '__equals'
    };

    var unaryOperators = {
        '-': '__negate',
        '+': '__self'
    };

    // Inject underscored math methods as aliases to Point, Size and Color.
    var fields = Base.each(
        ['add', 'subtract', 'multiply', 'divide', 'modulo', 'equals', 'negate'],
        function(name) {
            // Create an alias for each math method to be injected into the
            // classes using Straps.js' #inject()
            this['__' + name] = '#' + name;
        },
        {
            // Needed for '+' unary operator:
            __self: function() {
                return this;
            }
        }
    );
    Point.inject(fields);
    Size.inject(fields);
    Color.inject(fields);

    // Use very short name for the binary operator (__$__) as well as the
    // unary operator ($__), as operations will be replaced with then.
    // The underscores stands for the values, and the $ for the operators.

    // Binary Operator Handler
    function __$__(left, operator, right) {
        var handler = binaryOperators[operator];
        if (left && left[handler]) {
            var res = left[handler](right);
            return operator === '!=' ? !res : res;
        }
        switch (operator) {
        case '+': return left + right;
        case '-': return left - right;
        case '*': return left * right;
        case '/': return left / right;
        case '%': return left % right;
        case '==': return left == right;
        case '!=': return left != right;
        }
    }

    // Unary Operator Handler
    function $__(operator, value) {
        var handler = unaryOperators[operator];
        if (value && value[handler])
            return value[handler]();
        switch (operator) {
        case '+': return +value;
        case '-': return -value;
        }
    }

    return {
        calculateBinary: __$__,
        calculateUnary: $__
    };
// Pass on `this` as the binding object, so we can reference Acorn both in
// development and in the built library.
}.call(this);
