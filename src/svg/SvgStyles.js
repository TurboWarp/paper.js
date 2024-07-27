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

var SvgStyles = Base.each({
    // Fill
    fillColor: ['fill', 'color'],
    fillRule: ['fill-rule', 'string', null, null, 'nonzero'],
    // Stroke
    strokeColor: ['stroke', 'color'],
    strokeWidth: ['stroke-width', 'number', null, null, 1],
    strokeCap: ['stroke-linecap', 'string', null, null, 'butt'],
    strokeJoin: ['stroke-linejoin', 'string', null, null, 'miter'],
    strokeScaling: ['vector-effect', 'lookup', {
        true: 'none',
        false: 'non-scaling-stroke'
    }, function(item, value) {
        // no inheritance, only applies to graphical elements
        return !value // false, meaning non-scaling-stroke
                && (item instanceof PathItem
                    || item instanceof Shape
                    || item instanceof TextItem);
    }],
    miterLimit: ['stroke-miterlimit', 'number', null, null, 4],
    dashArray: ['stroke-dasharray', 'array', null, null, []],
    dashOffset: ['stroke-dashoffset', 'number', null, null, 0],
    // Text
    fontFamily: ['font-family', 'string'],
    fontWeight: ['font-weight', 'string', null, null, 'normal'],
    fontSize: ['font-size', 'number'],
    justification: ['text-anchor', 'lookup', {
        left: 'start',
        center: 'middle',
        right: 'end'
    }, null, 'left'],
    // Item
    opacity: ['opacity', 'number', null, null, 1],
    blendMode: ['mix-blend-mode', 'style', null, null, 'normal']
}, function(entry, key) {
    var part = Base.capitalize(key),
        lookup = entry[2];
    this[key] = {
        type: entry[1],
        property: key,
        attribute: entry[0],
        toSVG: lookup,
        fromSVG: lookup && Base.each(lookup, function(value, name) {
            this[value] = name;
        }, {}),
        exportFilter: entry[3],
        get: 'get' + part,
        set: 'set' + part,
        rootDefault: entry[4]
    };
}, {});
