const fs = require('fs');
const path = require('path');

function convertStyleToJsx(styleString) {
    const styleObject = styleString.split(';').reduce((styles, styleDeclaration) => {
        const [property, value] = styleDeclaration.split(':');
        if (!property) return styles;
        const formattedProperty = property.trim().replace(/-([a-z])/g, (match, letter) => letter.toUpperCase());
        return { ...styles, [formattedProperty]: value.trim() };
    }, {});
    return JSON.stringify(styleObject);
}

function camelCaseAttributes(svgContent) {
    const attributesMap = {
        'accent-height': 'accentHeight',
        'alignment-baseline': 'alignmentBaseline',
        'arabic-form': 'arabicForm',
        'baseline-shift': 'baselineShift',
        'cap-height': 'capHeight',
        'clip-path': 'clipPath',
        'clip-rule': 'clipRule',
        'color-interpolation': 'colorInterpolation',
        'color-interpolation-filters': 'colorInterpolationFilters',
        'color-profile': 'colorProfile',
        'color-rendering': 'colorRendering',
        'dominant-baseline': 'dominantBaseline',
        'enable-background': 'enableBackground',
        'fill-opacity': 'fillOpacity',
        'fill-rule': 'fillRule',
        'flood-color': 'floodColor',
        'flood-opacity': 'floodOpacity',
        'font-family': 'fontFamily',
        'font-size': 'fontSize',
        'font-size-adjust': 'fontSizeAdjust',
        'font-stretch': 'fontStretch',
        'font-style': 'fontStyle',
        'font-variant': 'fontVariant',
        'font-weight': 'fontWeight',
        'glyph-name': 'glyphName',
        'glyph-orientation-horizontal': 'glyphOrientationHorizontal',
        'glyph-orientation-vertical': 'glyphOrientationVertical',
        'horiz-adv-x': 'horizAdvX',
        'horiz-origin-x': 'horizOriginX',
        'image-rendering': 'imageRendering',
        'letter-spacing': 'letterSpacing',
        'lighting-color': 'lightingColor',
        'marker-end': 'markerEnd',
        'marker-mid': 'markerMid',
        'marker-start': 'markerStart',
        'overline-position': 'overlinePosition',
        'overline-thickness': 'overlineThickness',
        'paint-order': 'paintOrder',
        'panose-1': 'panose1',
        'pointer-events': 'pointerEvents',
        'rendering-intent': 'renderingIntent',
        'shape-rendering': 'shapeRendering',
        'stop-color': 'stopColor',
        'stop-opacity': 'stopOpacity',
        'strikethrough-position': 'strikethroughPosition',
        'strikethrough-thickness': 'strikethroughThickness',
        'stroke-dasharray': 'strokeDasharray',
        'stroke-dashoffset': 'strokeDashoffset',
        'stroke-linecap': 'strokeLinecap',
        'stroke-linejoin': 'strokeLinejoin',
        'stroke-miterlimit': 'strokeMiterlimit',
        'stroke-opacity': 'strokeOpacity',
        'stroke-width': 'strokeWidth',
        'text-anchor': 'textAnchor',
        'text-decoration': 'textDecoration',
        'text-rendering': 'textRendering',
        'underline-position': 'underlinePosition',
        'underline-thickness': 'underlineThickness',
        'unicode-bidi': 'unicodeBidi',
        'unicode-range': 'unicodeRange',
        'units-per-em': 'unitsPerEm',
        'v-alphabetic': 'vAlphabetic',
        'v-hanging': 'vHanging',
        'v-ideographic': 'vIdeographic',
        'v-mathematical': 'vMathematical',
        'vector-effect': 'vectorEffect',
        'vert-adv-y': 'vertAdvY',
        'vert-origin-x': 'vertOriginX',
        'vert-origin-y': 'vertOriginY',
        'word-spacing': 'wordSpacing',
        'writing-mode': 'writingMode',
        'x-height': 'xHeight',
        'xlink:actuate': 'xlinkActuate',
        'xlink:arcrole': 'xlinkArcrole',
        'xlink:href': 'xlinkHref',
        'xlink:role': 'xlinkRole',
        'xlink:show': 'xlinkShow',
        'xlink:title': 'xlinkTitle',
        'xlink:type': 'xlinkType',
        'xml:base': 'xmlBase',
        'xml:lang': 'xmlLang',
        'xml:space': 'xmlSpace',
        'xmlns:xlink': 'xmlnsXlink'
    };

    const propsMaps = {
        'WILTY Nope!': '{channel1Name}',
        '206 VIDEOS!': '{channel1VideoCount}',
        'GM Hikaru': '{channel2Name}',
        '5389 VIDEOS!!!': '{channel2VideoCount}',
        'PewDiePie': '{channel3Name}',
        '321 VIDEOS!!': '{channel3VideoCount}'
    };

    // combined both maps
    const replaceMap = { ...attributesMap, ...propsMaps };

    let convertedContent = svgContent;

    // Sort keys by length in descending order
    const sortedKeys = Object.keys(replaceMap).sort((a, b) => b.length - a.length);

    for (const key of sortedKeys) {
        const value = replaceMap[key];
        const regex = new RegExp(key, 'g');
        convertedContent = convertedContent.replace(regex, value);
    }

    // Convert style attributes to JSX
    convertedContent = convertedContent.replace(/style="([^"]*)"/g, (match, styleString) => {
        const jsxStyles = convertStyleToJsx(styleString);
        return `style={${jsxStyles}}`;
    });

    return convertedContent;
}

function convertSVG(filePath) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        const convertedData = camelCaseAttributes(data);
        const outputFilePath = path.join(path.dirname(filePath), 'converted-' + path.basename(filePath));

        fs.writeFile(outputFilePath, convertedData, 'utf8', (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return;
            }
            console.log('File has been converted and saved to:', outputFilePath);
        });
    });
}

// Usage
const inputFilePath = './share-youtube-path.svg';
convertSVG(inputFilePath);
