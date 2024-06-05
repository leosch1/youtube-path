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

    const propsMap = {
        'WILTY Nope!': '{channel3Name}',
        '206 VIDEOS!': '{channel3VideoCountString}',
        'GM Hikaru': '{channel2Name}',
        '5389 VIDEOS!!!': '{channel2VideoCountString}',
        'PewDiePie': '{channel1Name}',
        '321 VIDEOS!!': '{channel1VideoCountString}'
    };

    const refMap = {
        '<text id="channel-3-name"': '<text id="channel-3-name" ref={channel3NameRef}',
        '<text id="channel-3-video-count"': '<text id="channel-3-video-count" ref={channel3VideoCountRef}',
        '<text id="channel-2-name"': '<text id="channel-2-name" ref={channel2NameRef}',
        '<text id="channel-2-video-count"': '<text id="channel-2-video-count" ref={channel2VideoCountRef}',
        '<text id="channel-1-name"': '<text id="channel-1-name" ref={channel1NameRef}',
        '<text id="channel-1-video-count"': '<text id="channel-1-video-count" ref={channel1VideoCountRef}'
    }

    const replaceMap = { ...attributesMap, ...propsMap, ...refMap };

    let convertedContent = svgContent;

    const replaceNameBackgroundWidths = (inputText) => {
        console.log('\n// State for channel name rectangle widths');
        return inputText.replace(/(<rect id="channel-(\d+)-name-bg"[^>]* width)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, width, postFix) => {
            console.log(`const [channel${channelNumber}NameBackgroundWidth, setChannel${channelNumber}NameBackgroundWidth] = useState(${width});`);
            return `${prefix}={channel${channelNumber}NameBackgroundWidth}${postFix}`;
        });
    }

    const replaceVideoCountBackgroundWidths = (inputText) => {
        console.log('\n// State for video count rectangle widths');
        return inputText.replace(/(<rect id="channel-(\d+)-video-count-bg"[^>]* width)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, width, postFix) => {
            console.log(`const [channel${channelNumber}VideoCountBackgroundWidth, setChannel${channelNumber}VideoCountBackgroundWidth] = useState(${width});`);
            return `${prefix}={channel${channelNumber}VideoCountBackgroundWidth}${postFix}`;
        });
    }

    const replaceNameBackgroundX = (inputText) => {
        console.log('\n// State for channel name rectangle x positions');
        return inputText.replace(/(<rect id="channel-(\d+)-name-bg"[^>]* x)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, x, postFix) => {
            console.log(`const [channel${channelNumber}NameBackgroundX, setChannel${channelNumber}NameBackgroundX] = useState(${x});`);
            return `${prefix}={channel${channelNumber}NameBackgroundX}${postFix}`;
        });
    }

    const replaceVideoCountBackgroundX = (inputText) => {
        console.log('\n// State for video count rectangle x positions')
        return inputText.replace(/(<rect id="channel-(\d+)-video-count-bg"[^>]* x)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, x, postFix) => {
            console.log(`const [channel${channelNumber}VideoCountBackgroundX, setChannel${channelNumber}VideoCountBackgroundX] = useState(${x});`);
            return `${prefix}={channel${channelNumber}VideoCountBackgroundX}${postFix}`;
        });
    }

    const replaceNameX = (inputText) => {
        console.log('\n// State for channel name x positions');
        return inputText.replace(/(<text id="channel-(\d+)-name"[^>]*><tspan x)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, x, postFix) => {
            console.log(`const [channel${channelNumber}NameX, setChannel${channelNumber}NameX] = useState(${x});`);
            return `${prefix}={channel${channelNumber}NameX}${postFix}`;
        });
    }

    const replaceVideoCountX = (inputText) => {
        console.log('\n// State for video count x positions');
        return inputText.replace(/(<text id="channel-(\d+)-video-count"[^>]*><tspan x)="(\d+.?\d*)"(.*)/g, (fullMatch, prefix, channelNumber, x, postFix) => {
            console.log(`const [channel${channelNumber}VideoCountX, setChannel${channelNumber}VideoCountX] = useState(${x});`);
            return `${prefix}={channel${channelNumber}VideoCountX}${postFix}`;
        });
    }

    const removeFilterWidth = (inputText) => {
        // Extract filter IDs
        const filterIdRegex = /<g id="(channel-name|video-count)-panel_?\d?" filter="url\(#(.*)\)"/g;
        let match;
        const filterIds = new Set();

        while (match = filterIdRegex.exec(inputText)) {
            filterIds.add(match[2]);
        }

        // Remove 'width' attribute from <filter> tags
        let newText = inputText.replace(/<filter ([^>]*id="([a-z_\d]+)".*) width="\d+.?\d*"(.*>)/g, (fullMatch, preWidth, id, postWidth) => {
            if (filterIds.has(id)) {
                return `<filter ${preWidth}${postWidth}`;
            }
            return fullMatch;
        });

        // Remove 'x' attribute from <filter> tags
        newText = newText.replace(/<filter ([^>]*id="([a-z_\d]+)".*) x="\d+.?\d*"(.*>)/g, (fullMatch, preX, id, postX) => {
            if (filterIds.has(id)) {
                return `<filter ${preX}${postX}`;
            }
            return fullMatch;
        });

        return newText;
    }

    convertedContent = replaceNameBackgroundWidths(convertedContent);
    convertedContent = replaceVideoCountBackgroundWidths(convertedContent);
    convertedContent = removeFilterWidth(convertedContent);
    convertedContent = replaceNameBackgroundX(convertedContent);
    convertedContent = replaceVideoCountBackgroundX(convertedContent);
    convertedContent = replaceNameX(convertedContent);
    convertedContent = replaceVideoCountX(convertedContent);

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
            console.log('\nFile has been converted and saved to:', outputFilePath);
        });
    });
}

// Usage
const inputFilePath = './share-youtube-path.svg';
convertSVG(inputFilePath);
