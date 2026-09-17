/*!
Staff Generator
Original source code Copyright (c) 2026 KoalaVisual
Licensed under the MIT License. See LICENSE.
This file embeds a converted subset of Bravura glyph outline data.
That derived glyph data remains licensed under the SIL Open Font License 1.1.
See THIRD_PARTY_NOTICES.md and the OFL notice next to the embedded glyph data.
*/
// #target aftereffects
(function (thisObj) {
    var TOOL_VERSION = "1.1.0";
    var SCORE_VERSION = 1;
    var DEBUG = false;
    var TICKS_PER_QUARTER = 480;
    var DEFAULT_TIME_SIGNATURE = { numerator: 4, denominator: 4, beatGroups: [1, 1, 1, 1] };
    var SUPPORTED_TIME_DENOMINATORS = { 2: true, 4: true, 8: true, 16: true };
    var MAX_TIME_SIGNATURE_NUMERATOR = 32;
    var BLACK = [0, 0, 0];
    var SETTINGS_SECTION = "AEStaffGenerator";
    var MIN_LENGTH = 300;
    var MAX_LENGTH = 20000;
    var MIN_STAFF_SIZE = 8;
    var MIN_SCALE = 1;
    var RENDERER_CATEGORY_LABELS = {
        STAFF: "Staff",
        LEDGER_LINES: "Ledger Lines",
        BARLINES: "Barlines",
        CLEF: "Clef",
        TIME_SIGNATURE: "Time Signature",
        ACCIDENTALS: "Accidentals",
        RESTS: "Rests",
        NOTES: "Notes",
        BEAMS: "Beams"
    };
    var RANDOMIZE_MAX_ATTEMPTS = 10;
    var RANDOM_PITCH_LOW_MIDI = 48;                      
    var RANDOM_PITCH_HIGH_MIDI = 96;                    
    var RANDOM_PITCH_MIN_SPAN = 12;
    var RANDOM_PITCH_MAX_SPAN = 30;
    var DURATION_TICKS = {
        whole: 1920,
        half: 960,
        quarter: 480,
        eighth: 240,
        sixteenth: 120
    };
    var DEFAULTS = {
        length: 1600,
        staffSize: 20,
        staffLineThickness: 2.6,
        positionX: 100,
        positionY: 100,
        overallScale: 100,
        measures: 4,
        masterSeed: "12345",
        pitchLow: "C4",
        pitchHigh: "C6",
        rhythmDensity: 56,
        restDensity: 18,
        melodyMotion: 30,
        repetitionTendency: 12,
        beam: true,
        accidentals: true,
        symbolScale: 100,
        noteScale: 100,
        stemThickness: 2.4,
        beamThickness: 10,
        barlineThickness: 3.2,
        ledgerLineThickness: 3.2,
        globalThickness: 100
    };
    var PRESET_GENERATION_KEYS = [
        "rhythmDensity", "restDensity", "melodyMotion",
        "repetitionTendency", "beam", "accidentals"
    ];
    var PRESETS = [
        {
            id: "default",
            name: "Default",
            values: { rhythmDensity: 56, restDensity: 18, melodyMotion: 30, repetitionTendency: 12, beam: true, accidentals: true }
        },
        {
            id: "simple",
            name: "Simple",
            values: { rhythmDensity: 30, restDensity: 12, melodyMotion: 15, repetitionTendency: 20, beam: true, accidentals: false }
        },
        {
            id: "balanced",
            name: "Balanced",
            values: { rhythmDensity: 52, restDensity: 10, melodyMotion: 30, repetitionTendency: 12, beam: true, accidentals: true }
        },
        {
            id: "dense",
            name: "Dense",
            values: { rhythmDensity: 70, restDensity: 5, melodyMotion: 40, repetitionTendency: 8, beam: true, accidentals: true }
        },
        {
            id: "calm",
            name: "Calm",
            values: { rhythmDensity: 28, restDensity: 25, melodyMotion: 12, repetitionTendency: 20, beam: true, accidentals: false }
        },
        {
            id: "dynamic",
            name: "Dynamic",
            values: { rhythmDensity: 58, restDensity: 8, melodyMotion: 65, repetitionTendency: 5, beam: true, accidentals: true }
        },
        {
            id: "chaotic",
            name: "Chaotic",
            values: { rhythmDensity: 72, restDensity: 3, melodyMotion: 88, repetitionTendency: 0, beam: true, accidentals: true }
        }
    ];
    var CUSTOM_PRESET = { id: "custom", name: "Custom", values: {} };
    var GLYPH_DATA_META = {"source": "Bravura", "sourceVersion": "1.482", "smuflVersion": "1.4", "sourceCommit": "37b194378b710cc40e406ab6c4b07608bb9548ae"};
    var ENGRAVING_DEFAULTS = {"arrowShaftThickness": 0.16, "barlineSeparation": 0.4, "beamSpacing": 0.25, "beamThickness": 0.5, "bracketThickness": 0.5, "dashedBarlineDashLength": 0.5, "dashedBarlineGapLength": 0.25, "dashedBarlineThickness": 0.16, "hBarThickness": 1.0, "hairpinThickness": 0.16, "legerLineExtension": 0.4, "legerLineThickness": 0.16, "lyricLineThickness": 0.16, "octaveLineThickness": 0.16, "pedalLineThickness": 0.16, "repeatBarlineDotSeparation": 0.16, "repeatEndingLineThickness": 0.16, "slurEndpointThickness": 0.1, "slurMidpointThickness": 0.22, "staffLineThickness": 0.13, "stemThickness": 0.12, "subBracketThickness": 0.16, "textEnclosureThickness": 0.16, "textFontFamily": ["Academico", "Century Schoolbook", "Edwin", "serif"], "thickBarlineThickness": 0.5, "thinBarlineThickness": 0.16, "thinThickBarlineSeparation": 0.4, "tieEndpointThickness": 0.1, "tieMidpointThickness": 0.22, "tupletBracketThickness": 0.16};
    var STEP_NAMES = ["C", "D", "E", "F", "G", "A", "B"];
    var STEP_INDEX = { C: 0, D: 1, E: 2, F: 3, G: 4, A: 5, B: 6 };
    var PITCH_CHOICE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    var PITCH_CHOICE_FLATS = ["", "Db", "", "Eb", "", "", "Gb", "", "Ab", "", "Bb", ""];
    var PITCH_MIN_OCTAVE = 2;
    var PITCH_MAX_OCTAVE = 7;
    var RHYTHM_PATTERNS = [
        { values: ["whole"], complexity: 0 },
        { values: ["half", "half"], complexity: 12 },
        { values: ["half", "quarter", "quarter"], complexity: 23 },
        { values: ["quarter", "quarter", "half"], complexity: 26 },
        { values: ["quarter", "quarter", "quarter", "quarter"], complexity: 36 },
        { values: ["half", "eighth", "eighth", "quarter"], complexity: 48 },
        { values: ["eighth", "eighth", "quarter", "quarter", "quarter"], complexity: 55 },
        { values: ["quarter", "eighth", "eighth", "quarter", "quarter"], complexity: 58 },
        { values: ["quarter", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "quarter", "quarter"], complexity: 76 },
        { values: ["eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth", "eighth"], complexity: 78 },
        { values: ["sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth", "sixteenth"], complexity: 100 }
    ];
    function clamp(value, minimum, maximum) {
        if (value < minimum) {
            return minimum;
        }
        if (value > maximum) {
            return maximum;
        }
        return value;
    }
    function trimString(value) {
        return String(value).replace(/^\s+|\s+$/g, "");
    }
    function own(object, key) {
        return Object.prototype.hasOwnProperty.call(object, key);
    }
    function defaultBeatGroupsForTimeSignature(numerator, denominator) {
        var groups = [];
        var i;
        if (denominator === 8 && numerator >= 6 && numerator % 3 === 0) {
            for (i = 0; i < numerator / 3; i += 1) { groups.push(3); }
            return groups;
        }
        if (denominator === 8 && numerator === 5) {
            return [2, 3];
        }
        if (denominator === 8 && numerator === 7) {
            return [2, 2, 3];
        }
        for (i = 0; i < numerator; i += 1) { groups.push(1); }
        return groups;
    }
    function normalizeTimeSignature(numerator, denominator, beatGroups) {
        var groups;
        var total = 0;
        var i;
        if (!isFiniteNumber(numerator) || !isFiniteNumber(denominator)) { return null; }
        numerator = Math.floor(numerator);
        denominator = Math.floor(denominator);
        if (numerator < 1 || numerator > MAX_TIME_SIGNATURE_NUMERATOR || !SUPPORTED_TIME_DENOMINATORS[denominator]) {
            return null;
        }
        groups = beatGroups && beatGroups.length ? beatGroups.slice(0) : defaultBeatGroupsForTimeSignature(numerator, denominator);
        for (i = 0; i < groups.length; i += 1) {
            if (!isFiniteNumber(groups[i]) || groups[i] < 1 || Math.floor(groups[i]) !== groups[i]) { return null; }
            total += groups[i];
        }
        if (total !== numerator) { return null; }
        return { numerator: numerator, denominator: denominator, beatGroups: groups };
    }
    function cloneTimeSignature(timeSignature) {
        var normalized = normalizeTimeSignature(timeSignature && timeSignature.numerator, timeSignature && timeSignature.denominator, timeSignature && timeSignature.beatGroups);
        return normalized || { numerator: DEFAULT_TIME_SIGNATURE.numerator, denominator: DEFAULT_TIME_SIGNATURE.denominator, beatGroups: DEFAULT_TIME_SIGNATURE.beatGroups.slice(0) };
    }
    function timeSignatureLabel(timeSignature) {
        var normalized = cloneTimeSignature(timeSignature);
        return normalized.numerator + "/" + normalized.denominator;
    }
    function timeSignatureTicks(timeSignature) {
        var normalized = cloneTimeSignature(timeSignature);
        return TICKS_PER_QUARTER * 4 * normalized.numerator / normalized.denominator;
    }
    function timeSignatureBeatTicks(timeSignature) {
        var normalized = cloneTimeSignature(timeSignature);
        return TICKS_PER_QUARTER * 4 / normalized.denominator;
    }
    function timeSignatureEquals(first, second) {
        var a = cloneTimeSignature(first);
        var b = cloneTimeSignature(second);
        return a.numerator === b.numerator && a.denominator === b.denominator && a.beatGroups.join(",") === b.beatGroups.join(",");
    }
    function timeSignatureForMeasure(measure, fallback) {
        return cloneTimeSignature(measure && measure.timeSignature ? measure.timeSignature : (fallback || DEFAULT_TIME_SIGNATURE));
    }
    function timeSignatureBeatGroupIndex(timeSignature, tick) {
        var normalized = cloneTimeSignature(timeSignature);
        var beatTicks = timeSignatureBeatTicks(normalized);
        var cursor = 0;
        var i;
        var end;
        for (i = 0; i < normalized.beatGroups.length; i += 1) {
            end = cursor + normalized.beatGroups[i] * beatTicks;
            if (tick < end) { return i; }
            cursor = end;
        }
        return normalized.beatGroups.length - 1;
    }
    function timeSignatureBeatGroupEnd(timeSignature, tick) {
        var normalized = cloneTimeSignature(timeSignature);
        var beatTicks = timeSignatureBeatTicks(normalized);
        var cursor = 0;
        var i;
        for (i = 0; i < normalized.beatGroups.length; i += 1) {
            cursor += normalized.beatGroups[i] * beatTicks;
            if (tick < cursor) { return cursor; }
        }
        return timeSignatureTicks(normalized);
    }
    function zeroTangents(count) {
        var result = [];
        var i;
        for (i = 0; i < count; i += 1) {
            result.push([0, 0]);
        }
        return result;
    }
    /*!
    BEGIN BRAVURA-DERIVED GLYPH DATA
    Source: Bravura 1.482, fixed commit 37b194378b710cc40e406ab6c4b07608bb9548ae
    Converted data name: Staff Generator Outline Subset
    Copyright © 2026, Steinberg Media Technologies GmbH (http://www.steinberg.net/),
    with Reserved Font Name "Bravura".
    This Font Software is licensed under the SIL Open Font License, Version 1.1.
    This license is copied below, and is also available with a FAQ at:
    http://scripts.sil.org/OFL
    -----------------------------------------------------------
    SIL OPEN FONT LICENSE Version 1.1 - 26 February 2007
    -----------------------------------------------------------
    PREAMBLE
    The goals of the Open Font License (OFL) are to stimulate worldwide
    development of collaborative font projects, to support the font creation
    efforts of academic and linguistic communities, and to provide a free and
    open framework in which fonts may be shared and improved in partnership
    with others.
    The OFL allows the licensed fonts to be used, studied, modified and
    redistributed freely as long as they are not sold by themselves. The
    fonts, including any derivative works, can be bundled, embedded,
    redistributed and/or sold with any software provided that any reserved
    names are not used by derivative works. The fonts and derivatives,
    however, cannot be released under any other type of license. The
    requirement for fonts to remain under this license does not apply
    to any document created using the fonts or their derivatives.
    DEFINITIONS
    "Font Software" refers to the set of files released by the Copyright
    Holder(s) under this license and clearly marked as such. This may
    include source files, build scripts and documentation.
    "Reserved Font Name" refers to any names specified as such after the
    copyright statement(s).
    "Original Version" refers to the collection of Font Software components as
    distributed by the Copyright Holder(s).
    "Modified Version" refers to any derivative made by adding to, deleting,
    or substituting -- in part or in whole -- any of the components of the
    Original Version, by changing formats or by porting the Font Software to a
    new environment.
    "Author" refers to any designer, engineer, programmer, technical
    writer or other person who contributed to the Font Software.
    PERMISSION AND CONDITIONS
    Permission is hereby granted, free of charge, to any person obtaining
    a copy of the Font Software, to use, study, copy, merge, embed, modify,
    redistribute, and sell modified and unmodified copies of the Font
    Software, subject to the following conditions:
    1) Neither the Font Software nor any of its individual components,
    in Original or Modified Versions, may be sold by itself.
    2) Original or Modified Versions of the Font Software may be bundled,
    redistributed and/or sold with any software, provided that each copy
    contains the above copyright notice and this license. These can be
    included either as stand-alone text files, human-readable headers or
    in the appropriate machine-readable metadata fields within text or
    binary files as long as those fields can be easily viewed by the user.
    3) No Modified Version of the Font Software may use the Reserved Font
    Name(s) unless explicit written permission is granted by the corresponding
    Copyright Holder. This restriction only applies to the primary font name as
    presented to the users.
    4) The name(s) of the Copyright Holder(s) or the Author(s) of the Font
    Software shall not be used to promote, endorse or advertise any
    Modified Version, except to acknowledge the contribution(s) of the
    Copyright Holder(s) and the Author(s) or with their explicit written
    permission.
    5) The Font Software, modified or unmodified, in part or in whole,
    must be distributed entirely under this license, and must not be
    distributed under any other license. The requirement for fonts to
    remain under this license does not apply to any document created
    using the Font Software.
    TERMINATION
    This license becomes null and void if any of the above conditions are
    not met.
    DISCLAIMER
    THE FONT SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO ANY WARRANTIES OF
    MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT
    OF COPYRIGHT, PATENT, TRADEMARK, OR OTHER RIGHT. IN NO EVENT SHALL THE
    COPYRIGHT HOLDER BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    INCLUDING ANY GENERAL, SPECIAL, INDIRECT, INCIDENTAL, OR CONSEQUENTIAL
    DAMAGES, WHETHER IN CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF THE USE OR INABILITY TO USE THE FONT SOFTWARE OR FROM
    OTHER DEALINGS IN THE FONT SOFTWARE.
    END LICENSE NOTICE
    */
    var GLYPHS = {
        "gClef": {"contours":[{"vertices":[[0.162,-1.66],[0.186,-1.736],[0.41,-1.964],[0.946,-3.26],[0.686,-4.192],[0.478,-4.392],[0.218,-4.2],[-0.174,-2.956],[-0.118,-2.3],[-0.154,-2.204],[-0.894,-1.492],[-1.342,-0.348],[0.114,1.008],[0.39,0.984],[0.45,1.02],[0.558,1.824],[-0.078,2.488],[-0.398,2.372],[-0.27,2.304],[-0.002,1.928],[-0.386,1.52],[-0.814,1.98],[-0.054,2.632],[0.734,1.832],[0.618,0.976],[0.67,0.908],[1.342,-0.044],[0.378,-1.008],[0.262,-1.08]],"inTangents":[[0,0],[-0.024,0.024],[-0.076,0.084],[0.0,0.452],[0.164,0.24],[0.044,0.0],[0.08,-0.088],[0.0,-0.416],[-0.028,-0.164],[0.048,-0.04],[0.208,-0.256],[0.0,-0.428],[-0.98,0.0],[-0.08,0.016],[-0.008,-0.048],[0.0,-0.188],[0.236,0.0],[0.0,0.052],[-0.092,0.028],[0.0,0.232],[0.244,0.0],[0.0,-0.248],[-0.604,0.0],[0.0,0.68],[0.044,0.248],[-0.056,0.024],[0.0,0.452],[0.588,0.0],[0.012,0.072]],"outTangents":[[-0.008,-0.048],[0.064,-0.06],[0.336,-0.368],[0.0,-0.348],[-0.06,-0.088],[-0.056,0.0],[-0.296,0.328],[0.0,0.232],[0.008,0.048],[-0.256,0.212],[-0.276,0.344],[0.0,0.696],[0.092,0.0],[0.044,-0.008],[0.048,0.268],[0.0,0.592],[-0.216,0.0],[0.0,-0.028],[0.124,-0.036],[0.0,-0.22],[-0.268,0.0],[0.0,0.26],[0.268,0.0],[0.0,-0.228],[-0.008,-0.048],[0.404,-0.16],[0.0,-0.512],[-0.104,0.0],[0,0]],"closed":true},{"vertices":[[0.538,-3.772],[0.778,-3.444],[0.334,-2.6],[0.082,-2.364],[0.03,-2.396],[0.006,-2.764]],"inTangents":[[-0.244,0.0],[0.0,-0.22],[0.312,-0.312],[0.092,-0.08],[0.008,0.052],[0.0,0.128]],"outTangents":[[0.132,0.0],[0.0,0.276],[-0.064,0.064],[-0.028,0.024],[-0.016,-0.104],[0.0,-0.624]],"closed":true},{"vertices":[[0.102,-1.048],[0.042,-0.952],[-0.538,-0.176],[-0.078,0.532],[0.03,0.556],[0.078,0.512],[0.018,0.46],[-0.27,0.032],[0.13,-0.436],[0.21,-0.404],[0.41,0.788],[0.354,0.844],[0.13,0.864],[-1.022,-0.08],[-0.65,-1.008],[-0.038,-1.576],[0.018,-1.56]],"inTangents":[[0,0],[0.072,-0.024],[0.0,-0.34],[-0.272,-0.092],[-0.028,0.0],[0.0,0.024],[0.028,0.012],[0.0,0.184],[-0.244,0.068],[-0.008,-0.044],[0,0],[0.06,-0.012],[0.08,0.0],[0.0,0.556],[-0.332,0.376],[-0.188,0.152],[-0.008,-0.044]],"outTangents":[[0.012,0.076],[-0.352,0.12],[0.0,0.36],[0.032,0.012],[0.032,0.0],[0.0,-0.028],[-0.168,-0.072],[0.0,-0.228],[0.064,-0.016],[0,0],[0.008,0.044],[-0.064,0.012],[-0.7,0.0],[0.0,-0.236],[0.24,-0.268],[0.04,-0.032],[0,0]],"closed":true},{"vertices":[[0.378,-0.412],[0.422,-0.468],[1.014,0.184],[0.638,0.752],[0.574,0.728]],"inTangents":[[0,0],[-0.048,-0.004],[0.0,-0.352],[0.224,-0.112],[0.008,0.048]],"outTangents":[[-0.008,-0.048],[0.324,0.028],[0.0,0.252],[-0.048,0.024],[0,0]],"closed":true}],"bbox":{"sw":[-1.342,-4.392],"ne":[1.342,2.632]},"advanceWidth":2.684,"nominalWidth":2.684,"anchors":{}},
        "noteheadWhole": {"contours":[{"vertices":[[0.02,-0.5],[-0.844,-0.008],[-0.02,0.5],[0.844,-0.008]],"inTangents":[[0.372,0.0],[0.0,-0.272],[-0.596,0.0],[0.0,0.28]],"outTangents":[[-0.532,0.0],[0.0,0.268],[0.656,0.0],[0.0,-0.284]],"closed":true},{"vertices":[[-0.4,-0.252],[-0.084,-0.412],[0.412,0.124],[0.404,0.2],[0.228,0.392],[0.104,0.408],[0.0,0.392],[-0.188,0.288],[-0.272,0.2],[-0.412,-0.156]],"inTangents":[[-0.008,0.032],[-0.124,0.0],[0.0,-0.24],[0.004,-0.024],[0.1,-0.024],[0.04,0.0],[0.036,0.012],[0.056,0.048],[0.024,0.032],[0.0,0.128]],"outTangents":[[0.044,-0.14],[0.276,0.0],[0.0,0.028],[-0.02,0.1],[-0.04,0.012],[-0.036,0.0],[-0.068,-0.02],[-0.032,-0.028],[-0.08,-0.092],[0.0,-0.032]],"closed":true}],"bbox":{"sw":[-0.844,-0.5],"ne":[0.844,0.5]},"advanceWidth":1.688,"nominalWidth":1.688,"anchors":{"cutOutNW":[-0.672,-0.332],"cutOutSE":[0.688,0.364]}},
        "noteheadHalf": {"contours":[{"vertices":[[-0.202,0.5],[0.59,-0.168],[0.194,-0.5],[-0.59,0.168]],"inTangents":[[-0.22,0.0],[0.0,0.132],[0.232,0.0],[0.0,-0.208]],"outTangents":[[0.66,0.0],[0.0,-0.204],[-0.596,0.0],[0.0,0.212]],"closed":true},{"vertices":[[0.102,0.184],[-0.29,0.348],[-0.45,0.256],[-0.474,0.176],[-0.11,-0.18],[0.294,-0.336],[0.442,-0.252],[0.466,-0.176]],"inTangents":[[0.28,-0.184],[0.088,0.0],[0.028,0.048],[0.0,0.028],[-0.276,0.16],[-0.08,0.0],[-0.028,-0.048],[0.0,-0.028]],"outTangents":[[-0.18,0.12],[-0.084,0.0],[-0.012,-0.024],[0.0,-0.088],[0.2,-0.116],[0.076,0.0],[0.012,0.024],[0.0,0.08]],"closed":true}],"bbox":{"sw":[-0.59,-0.5],"ne":[0.59,0.5]},"advanceWidth":1.18,"nominalWidth":1.18,"anchors":{"cutOutNW":[-0.386,-0.296],"cutOutSE":[0.39,0.3],"splitStemDownNE":[0.366,0.3],"splitStemDownNW":[-0.462,0.428],"splitStemUpSE":[0.518,-0.372],"splitStemUpSW":[-0.262,-0.38],"stemDownNW":[-0.59,0.168],"stemUpSE":[0.59,-0.168]}},
        "noteheadBlack": {"contours":[{"vertices":[[-0.202,0.5],[0.59,-0.168],[0.202,-0.5],[-0.59,0.168]],"inTangents":[[-0.216,0.0],[0.0,0.34],[0.228,0.0],[0.0,-0.344]],"outTangents":[[0.356,0.0],[0.0,-0.204],[-0.44,0.0],[0.0,0.208]],"closed":true}],"bbox":{"sw":[-0.59,-0.5],"ne":[0.59,0.5]},"advanceWidth":1.18,"nominalWidth":1.18,"anchors":{"cutOutNW":[-0.382,-0.3],"cutOutSE":[0.35,0.296],"splitStemDownNE":[0.378,0.248],"splitStemDownNW":[-0.47,0.416],"splitStemUpSE":[0.502,-0.392],"splitStemUpSW":[-0.278,-0.356],"stemDownNW":[-0.59,0.168],"stemUpSE":[0.59,-0.168]}},
        "augmentationDot": {"contours":[{"vertices":[[0.2,0.0],[0.0,-0.2],[-0.2,0.0],[0.0,0.2]],"inTangents":[[0.0,0.112],[0.112,0.0],[0.0,-0.112],[-0.112,0.0]],"outTangents":[[0.0,-0.112],[-0.112,0.0],[0.0,0.112],[0.112,0.0]],"closed":true}],"bbox":{"sw":[-0.2,-0.2],"ne":[0.2,0.2]},"advanceWidth":0.4,"nominalWidth":0.4,"anchors":{}},
        "restWhole": {"contours":[{"vertices":[[0.564,0.436],[0.564,0.068],[0.46,-0.036],[-0.46,-0.036],[-0.564,0.068],[-0.564,0.436],[-0.46,0.54],[0.46,0.54]],"inTangents":[[0.0,0.056],[0,0],[0.056,0.0],[0,0],[0.0,-0.06],[0,0],[-0.06,0.0],[0,0]],"outTangents":[[0,0],[0.0,-0.06],[0,0],[-0.06,0.0],[0,0],[0.0,0.056],[0,0],[0.056,0.0]],"closed":true}],"bbox":{"sw":[-0.564,-0.036],"ne":[0.564,0.54]},"advanceWidth":1.132,"nominalWidth":1.128,"anchors":{}},
        "restHalf": {"contours":[{"vertices":[[0.564,-0.096],[0.564,-0.464],[0.46,-0.568],[-0.46,-0.568],[-0.564,-0.464],[-0.564,-0.096],[-0.46,0.008],[0.46,0.008]],"inTangents":[[0.0,0.056],[0,0],[0.056,0.0],[0,0],[0.0,-0.06],[0,0],[-0.06,0.0],[0,0]],"outTangents":[[0,0],[0.0,-0.06],[0,0],[-0.06,0.0],[0,0],[0.0,0.056],[0,0],[0.056,0.0]],"closed":true}],"bbox":{"sw":[-0.564,-0.568],"ne":[0.564,0.008]},"advanceWidth":1.132,"nominalWidth":1.128,"anchors":{}},
        "restQuarter": {"contours":[{"vertices":[[-0.23,0.152],[-0.058,0.392],[-0.034,0.448],[-0.038,0.464],[-0.082,0.484],[-0.146,0.472],[-0.21,0.46],[-0.538,0.844],[-0.074,1.464],[0.03,1.5],[0.09,1.476],[0.098,1.448],[0.034,1.352],[-0.07,1.208],[-0.086,1.104],[0.102,0.816],[0.166,0.812],[0.478,0.88],[0.49,0.884],[0.518,0.888],[0.538,0.872],[0.39,0.644],[0.114,0.088],[0.118,0.036],[0.382,-0.552],[0.398,-0.612],[0.382,-0.688],[-0.278,-1.46],[-0.35,-1.492],[-0.43,-1.408],[-0.414,-1.344],[-0.17,-0.808],[-0.41,-0.3],[-0.466,-0.184],[-0.426,-0.088]],"inTangents":[[0,0],[-0.052,-0.084],[0.0,-0.008],[0.004,-0.004],[0.02,0.0],[0.016,0.004],[0.02,0.0],[0.0,-0.212],[-0.292,-0.224],[-0.032,0.0],[-0.004,0.016],[0.0,0.008],[0.032,0.028],[0.008,0.036],[0.0,0.036],[-0.128,0.024],[-0.024,0.0],[-0.064,-0.024],[-0.004,0.0],[-0.008,0.0],[0.0,0.012],[0.044,0.048],[0.0,0.224],[0.0,0.016],[-0.104,0.164],[0.0,0.02],[0.0,0.0],[0.068,0.068],[0.024,0.0],[0.0,-0.056],[-0.012,-0.024],[0.0,-0.288],[0.18,-0.188],[0.0,-0.032],[0.0,0.0]],"outTangents":[[0.064,0.08],[0.008,0.016],[0.0,0.004],[-0.008,0.016],[-0.016,0.0],[-0.02,0.0],[-0.172,0.0],[0.0,0.2],[0.032,0.024],[0.028,0.0],[0.004,-0.012],[0.0,-0.036],[-0.052,0.0],[-0.012,-0.032],[0.0,-0.124],[0.02,-0.004],[0.116,0.0],[0.004,0.0],[0.012,0.004],[0.012,0.0],[0.0,-0.048],[-0.152,-0.184],[0.0,-0.016],[0.016,-0.232],[0.012,-0.02],[0.0,-0.04],[0.0,0.0],[-0.02,-0.02],[-0.04,0.0],[0.0,0.02],[0.016,0.044],[0.0,0.148],[-0.04,0.04],[0.0,0.056],[0,0]],"closed":true}],"bbox":{"sw":[-0.538,-1.492],"ne":[0.538,1.5]},"advanceWidth":1.08,"nominalWidth":1.076,"anchors":{}},
        "restEighth": {"contours":[{"vertices":[[0.042,-0.428],[-0.226,-0.696],[-0.494,-0.428],[-0.386,-0.224],[-0.274,-0.172],[-0.17,-0.156],[-0.014,-0.184],[0.13,-0.244],[0.15,-0.248],[0.17,-0.212],[0.166,-0.168],[-0.206,0.952],[-0.09,1.004],[0.05,0.964],[0.454,-0.448],[0.494,-0.604],[0.446,-0.668],[0.402,-0.652],[0.042,-0.388]],"inTangents":[[0,0],[0.148,0.0],[0.0,-0.148],[-0.06,-0.048],[-0.04,-0.008],[-0.036,0.0],[-0.044,0.016],[-0.052,0.028],[-0.004,0.0],[0.0,-0.02],[0.004,-0.016],[0.072,-0.264],[-0.024,0.0],[-0.04,0.032],[0.0,0.0],[-0.004,0.02],[0.008,0.004],[0.024,-0.016],[0.132,0.0]],"outTangents":[[0.0,-0.148],[-0.148,0.0],[0.0,0.084],[0.036,0.024],[0.032,0.008],[0.056,0.0],[0.056,-0.016],[0.008,-0.004],[0.016,0.0],[0.0,0.012],[-0.012,0.06],[0.0,0.048],[0.044,0.0],[0.012,-0.008],[0.016,-0.072],[0.0,-0.04],[-0.008,0.0],[-0.028,0.024],[0,0]],"closed":true}],"bbox":{"sw":[-0.494,-0.696],"ne":[0.494,1.004]},"advanceWidth":1.0,"nominalWidth":0.988,"anchors":{}},
        "restSixteenth": {"contours":[{"vertices":[[0.192,-0.444],[-0.08,-0.716],[-0.352,-0.444],[-0.24,-0.24],[-0.128,-0.184],[-0.032,-0.172],[0.136,-0.2],[0.28,-0.26],[0.308,-0.268],[0.328,-0.24],[0.316,-0.18],[0.096,0.48],[-0.1,0.604],[-0.096,0.564],[-0.368,0.292],[-0.64,0.564],[-0.528,0.768],[-0.42,0.824],[-0.32,0.836],[-0.152,0.808],[-0.02,0.752],[-0.004,0.772],[-0.008,0.784],[-0.388,1.916],[-0.392,1.928],[-0.268,2.0],[-0.116,1.908],[0.348,0.384],[0.528,-0.224],[0.636,-0.628],[0.64,-0.644],[0.6,-0.688],[0.556,-0.672],[0.192,-0.404]],"inTangents":[[0,0],[0.152,0.0],[0.0,-0.152],[-0.064,-0.048],[-0.04,-0.012],[-0.036,0.0],[-0.048,0.016],[-0.052,0.028],[-0.008,0.0],[0.0,-0.02],[0.008,-0.028],[0.036,-0.076],[0.056,0.0],[0.0,0.012],[0.148,0.0],[0.0,-0.152],[-0.064,-0.048],[-0.04,-0.012],[-0.036,0.0],[-0.048,0.016],[-0.052,0.028],[0.0,-0.012],[0.0,-0.004],[0,0],[0.0,-0.004],[-0.088,0.0],[-0.016,0.044],[0,0],[0.0,0.0],[-0.008,0.052],[0.0,0.004],[0.008,0.004],[0.012,-0.008],[0.136,-0.004]],"outTangents":[[0.0,-0.152],[-0.148,0.0],[0.0,0.08],[0.032,0.024],[0.028,0.008],[0.056,0.0],[0.056,-0.016],[0.012,-0.004],[0.012,0.0],[0.0,0.012],[-0.008,0.032],[-0.032,0.076],[0.004,-0.016],[0.0,-0.152],[-0.152,0.0],[0.0,0.08],[0.032,0.024],[0.032,0.008],[0.056,0.0],[0.056,-0.016],[0.008,0.0],[0.0,0.004],[0,0],[0.0,0.004],[0.0,0.032],[0.116,0.0],[0,0],[0.104,-0.34],[0.0,0.0],[0.0,-0.008],[0.0,-0.024],[-0.02,0.0],[-0.028,0.024],[0,0]],"closed":true}],"bbox":{"sw":[-0.64,-0.716],"ne":[0.64,2.0]},"advanceWidth":1.28,"nominalWidth":1.28,"anchors":{}},
        "accidentalFlat": {"contours":[{"vertices":[[-0.404,0.68],[-0.368,0.7],[-0.344,0.692],[-0.028,0.448],[0.452,-0.228],[0.092,-0.612],[0.008,-0.6],[-0.128,-0.544],[-0.216,-0.488],[-0.236,-0.492],[-0.28,-0.56],[-0.252,-1.688],[-0.328,-1.756],[-0.452,-1.644]],"inTangents":[[-0.032,-0.04],[-0.012,0.0],[0.0,0.0],[-0.1,0.068],[0.0,0.184],[0.184,0.012],[0.028,-0.008],[0.044,-0.028],[0.02,0.0],[0.008,0.004],[0.0,0.028],[0.0,0.08],[0.04,0.0],[0.004,-0.072]],"outTangents":[[0.012,0.016],[0.012,0.0],[0.12,-0.068],[0.356,-0.248],[0.0,-0.228],[-0.028,0.0],[-0.044,0.012],[-0.024,0.02],[-0.008,0.0],[-0.028,-0.012],[0.004,-0.088],[0.0,-0.044],[-0.056,0.0],[0.0,0.0]],"closed":true},{"vertices":[[-0.264,0.324],[-0.276,-0.076],[-0.268,-0.204],[-0.092,-0.372],[0.012,-0.4],[0.112,-0.356],[0.176,-0.168],[0.108,0.072],[-0.18,0.372],[-0.22,0.384]],"inTangents":[[0.0,0.02],[0.0,0.16],[-0.004,0.016],[-0.056,0.032],[-0.032,0.0],[-0.024,-0.028],[0.0,-0.076],[0.048,-0.084],[0.12,-0.076],[0.012,0.0]],"outTangents":[[0.0,0.0],[0.0,-0.064],[0.016,-0.048],[0.036,-0.02],[0.04,0.0],[0.04,0.044],[0.0,0.072],[-0.052,0.096],[-0.016,0.008],[-0.036,0.0]],"closed":true}],"bbox":{"sw":[-0.452,-1.756],"ne":[0.452,0.7]},"advanceWidth":0.904,"nominalWidth":0.904,"anchors":{"cutOutNE":[-0.2,-0.656],"cutOutSE":[0.052,0.476]}},
        "accidentalNatural": {"contours":[{"vertices":[[0.228,-0.724],[0.212,-0.72],[-0.148,-0.628],[-0.188,-0.648],[-0.188,-1.316],[-0.236,-1.364],[-0.288,-1.364],[-0.336,-1.316],[-0.336,0.744],[-0.304,0.78],[-0.288,0.776],[-0.276,0.772],[0.12,0.652],[0.188,0.696],[0.188,1.292],[0.236,1.34],[0.288,1.34],[0.336,1.292],[0.336,-0.716],[0.304,-0.748],[0.288,-0.744]],"inTangents":[[0,0],[0.004,0.0],[0.104,0.0],[0.0,0.016],[0,0],[0.024,0.0],[0,0],[0.0,-0.028],[0,0],[-0.02,0.0],[-0.004,0.0],[-0.004,0.004],[-0.116,0.0],[0.0,-0.032],[0,0],[-0.028,0.0],[0,0],[0.0,0.028],[0,0],[0.016,0.0],[0.004,-0.004]],"outTangents":[[-0.008,0.0],[0.0,0.0],[-0.024,0.0],[0,0],[0.0,-0.028],[0,0],[-0.028,0.0],[0,0],[0.0,0.024],[0.004,0.0],[0.0,0.0],[0.056,-0.024],[0.04,0.0],[0,0],[0.0,0.028],[0,0],[0.024,0.0],[0,0],[0.0,-0.02],[-0.004,0.0],[0,0]],"closed":true},{"vertices":[[-0.188,-0.156],[0.152,-0.316],[0.188,-0.296],[0.188,0.116],[-0.14,0.28],[-0.188,0.256]],"inTangents":[[0,0],[-0.096,0.0],[0.0,-0.016],[0,0],[0.1,0.0],[0.0,0.016]],"outTangents":[[0.0,-0.056],[0.024,0.0],[0,0],[0.0,0.072],[-0.028,0.0],[0,0]],"closed":true}],"bbox":{"sw":[-0.336,-1.364],"ne":[0.336,1.34]},"advanceWidth":0.672,"nominalWidth":0.672,"anchors":{"cutOutNE":[-0.144,-0.776],"cutOutSW":[0.14,0.828]}},
        "accidentalSharp": {"contours":[{"vertices":[[0.45,-0.472],[0.498,-0.54],[0.498,-0.824],[0.47,-0.856],[0.45,-0.852],[0.35,-0.816],[0.294,-0.868],[0.294,-1.356],[0.238,-1.4],[0.174,-1.356],[0.174,-0.836],[0.122,-0.72],[-0.13,-0.62],[-0.178,-0.7],[-0.178,-1.18],[-0.234,-1.224],[-0.298,-1.18],[-0.298,-0.64],[-0.346,-0.532],[-0.45,-0.488],[-0.498,-0.424],[-0.498,-0.14],[-0.466,-0.104],[-0.45,-0.108],[-0.362,-0.148],[-0.35,-0.152],[-0.298,-0.08],[-0.298,0.316],[-0.342,0.408],[-0.45,0.452],[-0.498,0.516],[-0.498,0.8],[-0.466,0.836],[-0.45,0.832],[-0.358,0.796],[-0.346,0.792],[-0.298,0.856],[-0.298,1.348],[-0.246,1.392],[-0.178,1.348],[-0.178,0.792],[-0.138,0.704],[0.106,0.604],[0.122,0.6],[0.174,0.672],[0.174,1.172],[0.226,1.216],[0.294,1.172],[0.294,0.604],[0.338,0.512],[0.45,0.468],[0.498,0.4],[0.498,0.116],[0.47,0.084],[0.45,0.088],[0.346,0.128],[0.294,0.056],[0.294,-0.316],[0.346,-0.432]],"inTangents":[[0,0],[0.0,0.024],[0,0],[0.016,0.0],[0.008,-0.004],[0.02,-0.004],[0.0,0.032],[0,0],[0.032,0.0],[0.0,-0.024],[0,0],[0.036,-0.024],[0.068,-0.016],[0.0,0.032],[0,0],[0.028,0.0],[0.0,-0.024],[0,0],[0.024,-0.012],[0.0,0.0],[0.0,-0.024],[0,0],[-0.02,0.0],[-0.004,0.0],[-0.028,0.016],[-0.004,0.0],[0.0,-0.032],[0,0],[0.024,-0.012],[0.0,0.0],[0.0,-0.024],[0,0],[-0.02,0.0],[-0.004,0.0],[-0.036,0.012],[-0.004,0.0],[0.0,-0.02],[0,0],[-0.028,0.0],[0.0,0.024],[0,0],[-0.02,0.008],[0,0],[-0.004,0.0],[0.0,-0.024],[0,0],[-0.028,0.0],[0.0,0.024],[0,0],[-0.028,0.012],[0.0,0.0],[0.0,0.024],[0,0],[0.016,0.0],[0.008,-0.004],[0,0],[0.0,0.048],[0,0],[-0.032,0.012]],"outTangents":[[0.028,-0.012],[0,0],[0.0,-0.02],[-0.008,0.0],[0.0,0.0],[-0.028,0.0],[0,0],[0.0,-0.024],[-0.04,0.0],[0,0],[-0.004,0.04],[-0.048,0.028],[-0.036,0.0],[0,0],[0.0,-0.024],[-0.04,0.0],[0,0],[0.0,0.056],[-0.024,0.012],[-0.028,0.008],[0,0],[0.0,0.024],[0.004,0.0],[0.0,0.0],[0.004,0.0],[0.028,0.0],[0,0],[0.0,0.044],[-0.024,0.008],[-0.028,0.008],[0,0],[0.0,0.024],[0.004,0.0],[0.0,0.0],[0.004,-0.004],[0.028,0.0],[0,0],[0.0,0.024],[0.04,0.0],[0,0],[0.0,-0.052],[0,0],[0.004,0.0],[0.032,0.0],[0,0],[0.0,0.024],[0.044,0.0],[0,0],[0.0,-0.032],[0.028,-0.012],[0.028,-0.012],[0,0],[0.0,-0.02],[-0.008,0.0],[0,0],[-0.024,0.0],[0,0],[0.0,-0.028],[0,0]],"closed":true},{"vertices":[[0.174,0.18],[-0.13,0.34],[-0.178,0.32],[-0.19,0.12],[-0.178,-0.176],[0.114,-0.328],[0.174,-0.304],[0.19,-0.076]],"inTangents":[[0.008,-0.036],[0.092,0.0],[0.004,0.012],[0.0,0.096],[-0.008,0.032],[-0.1,0.0],[-0.008,-0.016],[0.0,-0.108]],"outTangents":[[-0.024,0.08],[-0.024,0.0],[-0.008,-0.016],[0.0,-0.124],[0.008,-0.068],[0.028,0.0],[0.008,0.02],[0.0,0.108]],"closed":true}],"bbox":{"sw":[-0.498,-1.4],"ne":[0.498,1.392]},"advanceWidth":0.996,"nominalWidth":0.996,"anchors":{"cutOutNE":[0.342,-0.896],"cutOutNW":[-0.354,-0.568],"cutOutSE":[0.342,0.596],"cutOutSW":[-0.354,0.896]}},
        "flagEighthUp": {"contours":[{"vertices":[[0.952,3.16],[1.056,2.468],[0.596,1.096],[0.16,0.052],[0.076,-0.036],[0.0,0.024],[0.0,0.98],[0.788,1.912],[0.884,2.512],[0.788,3.06],[0.776,3.12],[0.84,3.236],[0.86,3.24]],"inTangents":[[-0.016,0.056],[0.0,0.312],[0.252,0.4],[0.064,0.384],[0.04,0.0],[0.0,-0.048],[0,0],[-0.144,-0.34],[0.0,-0.236],[0.068,-0.18],[0.0,-0.016],[-0.024,-0.016],[-0.008,0.0]],"outTangents":[[0.0,0.0],[0.0,-0.5],[-0.204,-0.316],[-0.012,-0.064],[-0.044,0.0],[0,0],[0.264,0.048],[0.06,0.136],[0.0,0.18],[-0.008,0.024],[0.0,0.064],[0.004,0.004],[0.028,0.0]],"closed":true}],"bbox":{"sw":[0.0,-0.036],"ne":[1.056,3.24]},"advanceWidth":1.056,"nominalWidth":1.056,"anchors":{"graceNoteSlashNE":[1.284,0.796],"graceNoteSlashSW":[-0.644,2.456],"stemUpNW":[0.0,0.04]}},
        "flagEighthDown": {"contours":[{"vertices":[[0.96,-3.04],[1.044,-2.492],[0.884,-1.784],[0.0,-0.944],[0.0,-0.004],[0.064,0.056],[0.16,-0.032],[0.728,-1.076],[1.224,-2.448],[1.112,-3.172],[1.048,-3.232],[0.948,-3.108]],"inTangents":[[-0.008,-0.024],[0.0,-0.18],[0.06,-0.136],[0.536,-0.18],[0,0],[-0.032,0.0],[-0.008,0.064],[-0.204,0.316],[0.0,0.5],[0.032,0.128],[0.028,0.0],[0.0,-0.076]],"outTangents":[[0.056,0.168],[0.0,0.236],[-0.148,0.336],[0,0],[0.0,0.04],[0.036,0.0],[0.068,-0.38],[0.252,-0.396],[0.0,-0.312],[-0.012,-0.044],[-0.048,0.0],[0.0,0.02]],"closed":true}],"bbox":{"sw":[0.0,-3.232],"ne":[1.224,0.056]},"advanceWidth":1.224,"nominalWidth":1.224,"anchors":{"graceNoteSlashNW":[-0.596,-2.168],"graceNoteSlashSE":[1.328,-0.628],"stemDownSW":[0.0,-0.132]}},
        "flagSixteenthUp": {"contours":[{"vertices":[[1.088,3.184],[1.116,2.744],[1.116,2.656],[1.0,2.176],[0.996,2.14],[1.0,2.112],[1.1,1.604],[1.088,1.46],[0.656,0.764],[0.148,0.044],[0.068,-0.008],[0.0,0.032],[0.0,1.584],[0.02,1.584],[0.828,2.16],[0.956,2.756],[0.924,3.112],[0.92,3.148],[0.976,3.244],[1.008,3.252]],"inTangents":[[-0.024,0.052],[0.0,0.192],[0,0],[0.072,0.148],[0.0,0.016],[-0.004,0.012],[0.0,0.244],[0.008,0.048],[0.288,0.312],[0.068,0.424],[0.024,0.0],[0.0,-0.028],[0,0],[0,0],[-0.276,-0.56],[0.0,-0.208],[0.02,-0.12],[0.0,-0.012],[-0.028,-0.008],[-0.012,0.0]],"outTangents":[[0.016,-0.02],[0,0],[0.0,-0.168],[0.0,-0.012],[0.0,-0.008],[0.012,-0.024],[0.0,-0.052],[-0.04,-0.272],[-0.216,-0.232],[-0.008,-0.044],[-0.024,0.0],[0,0],[0,0],[0.248,0.008],[0.092,0.192],[0.0,0.116],[-0.004,0.016],[0.0,0.056],[0.012,0.004],[0.028,0.0]],"closed":true},{"vertices":[[0.836,1.836],[0.62,1.56],[0.164,0.92],[0.16,0.908],[0.216,0.868],[0.248,0.868],[0.84,1.288],[0.948,1.644],[0.944,1.724],[0.916,1.828],[0.864,1.852]],"inTangents":[[0.008,0.012],[0.084,0.096],[0.084,0.328],[0.0,0.004],[-0.032,0.0],[0,0],[-0.132,-0.196],[0.0,-0.128],[0.004,-0.028],[0.02,-0.032],[0.02,0.0]],"outTangents":[[-0.064,-0.1],[-0.188,-0.216],[-0.004,-0.004],[0.0,-0.016],[0,0],[0.244,0.0],[0.072,0.104],[0.0,0.028],[-0.008,0.032],[-0.004,0.012],[-0.012,0.0]],"closed":true}],"bbox":{"sw":[0.0,-0.008],"ne":[1.116,3.252]},"advanceWidth":1.116,"nominalWidth":1.116,"anchors":{"stemUpNW":[0.0,0.088]}},
        "flagSixteenthDown": {"contours":[{"vertices":[[0.96,-3.144],[0.996,-2.748],[0.868,-2.132],[0.02,-1.552],[0.0,-1.552],[0.0,-0.004],[0.068,0.036],[0.148,-0.016],[1.128,-1.432],[1.14,-1.576],[1.04,-2.084],[1.036,-2.112],[1.04,-2.148],[1.164,-2.764],[1.124,-3.16],[1.028,-3.248]],"inTangents":[[-0.012,-0.068],[0.0,-0.132],[0.092,-0.192],[0.248,-0.008],[0,0],[0,0],[-0.04,0.0],[-0.008,0.044],[-0.096,0.628],[0.0,0.052],[0.012,0.024],[0.0,0.012],[0.0,0.012],[0.0,0.216],[0.024,0.124],[0.048,0.0]],"outTangents":[[0.024,0.128],[0.0,0.212],[-0.276,0.56],[0,0],[0,0],[0.0,0.02],[0.028,0.0],[0.096,-0.616],[0.008,-0.044],[0.0,-0.244],[-0.004,-0.008],[0.0,-0.016],[0.088,-0.184],[0.0,-0.136],[-0.02,-0.092],[-0.048,0.004]],"closed":true},{"vertices":[[0.904,-1.824],[0.956,-1.796],[0.984,-1.696],[0.988,-1.616],[0.88,-1.26],[0.248,-0.84],[0.216,-0.84],[0.16,-0.88],[0.164,-0.892],[0.66,-1.532],[0.876,-1.808]],"inTangents":[[-0.012,0.0],[-0.004,-0.016],[-0.008,-0.032],[0.0,-0.024],[0.072,-0.104],[0.244,0.0],[0,0],[0.0,0.02],[-0.004,0.004],[-0.188,0.22],[-0.064,0.104]],"outTangents":[[0.02,0.0],[0.02,0.028],[0.004,0.028],[0.0,0.132],[-0.132,0.196],[0,0],[-0.032,0.0],[0.0,-0.004],[0.084,-0.328],[0.084,-0.092],[0.008,-0.012]],"closed":true}],"bbox":{"sw":[0.0,-3.248026],"ne":[1.164,0.036]},"advanceWidth":1.168,"nominalWidth":1.164,"anchors":{"stemDownSW":[0.0,-0.128]}},
        "timeSig0": {"contours":[{"vertices":[[0.86,0.0],[0.0,-1.004],[-0.86,0.0],[0.0,1.0]],"inTangents":[[0.0,0.552],[0.476,0.0],[0.0,-0.556],[-0.476,0.0]],"outTangents":[[0.0,-0.556],[-0.476,0.0],[0.0,0.552],[0.476,0.0]],"closed":true},{"vertices":[[0.0,-0.88],[0.3,-0.028],[0.0,0.82],[-0.3,-0.028]],"inTangents":[[-0.168,0.0],[0.0,-0.472],[0.164,0.0],[0.0,0.468]],"outTangents":[[0.164,0.0],[0.0,0.468],[-0.168,0.0],[0.0,-0.472]],"closed":true}],"bbox":{"sw":[-0.86,-1.004],"ne":[0.86,1.0]},"advanceWidth":1.88,"nominalWidth":1.72,"anchors":{}},
        "timeSig1": {"contours":[{"vertices":[[-0.572,-0.052],[-0.588,0.0],[-0.544,0.056],[-0.508,0.064],[-0.452,0.028],[-0.236,-0.324],[-0.196,-0.364],[-0.172,-0.308],[-0.172,0.724],[-0.348,0.876],[-0.416,0.936],[-0.328,1.0],[0.524,1.0],[0.588,0.936],[0.528,0.876],[0.4,0.736],[0.4,-0.912],[0.32,-1.004],[0.112,-0.988],[-0.096,-1.0],[-0.116,-1.004],[-0.188,-0.928]],"inTangents":[[0,0],[0.0,-0.028],[-0.032,-0.012],[-0.004,0.0],[0.0,0.0],[-0.044,0.076],[-0.008,0.0],[0.0,-0.024],[0,0],[0.084,0.0],[0.0,-0.048],[-0.052,0.0],[0,0],[0.0,0.0],[0.06,0.0],[0.0,0.068],[0,0],[0.056,0.004],[0.052,0.0],[0.06,0.008],[0.004,0.0],[0.016,-0.036]],"outTangents":[[0.0,0.0],[0.0,0.02],[0.016,0.004],[0.04,0.0],[0.0,0.0],[0.016,-0.028],[0.016,0.0],[0,0],[0.0,0.092],[-0.028,0.0],[0.0,0.044],[0,0],[0.064,0.0],[0.0,0.0],[-0.056,0.0],[0,0],[0.0,-0.064],[-0.056,0.0],[-0.076,0.0],[-0.008,0.0],[-0.04,0.0],[0,0]],"closed":true}],"bbox":{"sw":[-0.588,-1.004],"ne":[0.588,1.0]},"advanceWidth":1.336,"nominalWidth":1.176,"anchors":{}},
        "timeSig2": {"contours":[{"vertices":[[0.792,0.364],[0.744,0.308],[0.692,0.348],[0.688,0.36],[0.532,0.532],[0.464,0.52],[0.344,0.476],[-0.088,0.38],[-0.236,0.404],[0.28,0.116],[0.64,-0.04],[0.812,-0.408],[0.628,-0.82],[0.024,-1.016],[-0.324,-0.988],[-0.7,-0.764],[-0.812,-0.472],[-0.776,-0.3],[-0.448,-0.08],[-0.168,-0.432],[-0.444,-0.764],[-0.128,-0.916],[0.232,-0.532],[0.096,-0.124],[-0.356,0.284],[-0.8,0.872],[-0.804,0.896],[-0.732,1.02],[-0.7,1.028],[-0.328,0.784],[0.248,1.0]],"inTangents":[[-0.064,0.62],[0.028,0.0],[0.008,-0.024],[0.0,-0.004],[0.084,0.0],[0.028,0.008],[0.04,0.02],[0.164,0.0],[0.044,-0.016],[-0.088,0.024],[-0.132,0.108],[0.0,0.176],[0.104,0.088],[0.088,0.0],[0.104,-0.024],[0.096,-0.112],[0.0,-0.108],[-0.024,-0.06],[-0.144,0.0],[0.0,0.1],[0.0,0.08],[-0.236,0.0],[0.0,-0.116],[0.088,-0.116],[0.196,-0.12],[0.068,-0.252],[0.0,-0.008],[-0.044,-0.028],[-0.008,0.0],[-0.236,0.0],[-0.356,0.0]],"outTangents":[[0.0,-0.048],[-0.032,0.0],[0.0,0.004],[-0.04,0.096],[-0.02,0.0],[-0.052,-0.02],[-0.08,-0.032],[-0.052,0.0],[0.088,-0.144],[0.06,-0.016],[0.096,-0.076],[0.0,-0.188],[-0.204,-0.172],[-0.108,0.0],[-0.14,0.028],[-0.068,0.084],[0.0,0.056],[0.06,0.124],[0.244,0.0],[0.0,-0.24],[0.008,-0.056],[0.356,0.0],[0.0,0.152],[-0.144,0.192],[-0.22,0.14],[0.0,0.008],[0.0,0.044],[0.012,0.008],[0.088,0.0],[0.16,0.0],[0.172,0.0]],"closed":true}],"bbox":{"sw":[-0.812,-1.016],"ne":[0.812,1.028]},"advanceWidth":1.784,"nominalWidth":1.624,"anchors":{}},
        "timeSig3": {"contours":[{"vertices":[[0.01,-0.992],[-0.05,-0.996],[-0.738,-0.556],[-0.414,-0.232],[-0.394,-0.232],[-0.13,-0.492],[-0.13,-0.524],[-0.262,-0.688],[-0.342,-0.744],[-0.342,-0.76],[-0.174,-0.86],[0.198,-0.552],[0.198,-0.524],[-0.29,-0.1],[-0.386,-0.032],[-0.286,0.016],[0.21,0.38],[-0.094,0.852],[-0.13,0.848],[-0.242,0.784],[-0.242,0.764],[-0.15,0.5],[-0.17,0.376],[-0.438,0.212],[-0.482,0.216],[-0.674,0.32],[-0.762,0.564],[-0.078,1.004],[-0.042,1.004],[0.762,0.448],[0.762,0.42],[0.726,0.256],[0.65,0.14],[0.554,0.056],[0.47,0.008],[0.338,-0.028],[0.298,-0.048],[0.294,-0.068],[0.31,-0.104],[0.434,-0.14],[0.59,-0.248],[0.678,-0.504]],"inTangents":[[0.168,0.012],[0.02,0.0],[0.0,-0.212],[-0.248,-0.016],[0,0],[0.0,0.132],[0,0],[0.02,0.008],[0.0,0.056],[0,0],[-0.036,0.0],[0.0,-0.096],[0,0],[0.252,-0.012],[0.0,-0.044],[-0.032,0.0],[0.0,-0.052],[0.088,0.0],[0.004,0.0],[0.004,0.06],[0,0],[-0.004,0.116],[0.016,0.04],[0.108,0.0],[0.016,-0.004],[0.048,-0.052],[0.0,-0.088],[-0.392,-0.008],[0,0],[0.0,0.352],[0,0],[0.024,0.052],[0.032,0.036],[0.04,0.024],[0,0],[0,0],[0.008,0.016],[0.0,0.008],[-0.012,0.004],[-0.036,0.02],[-0.044,0.052],[0.0,0.092]],"outTangents":[[-0.02,0.0],[-0.344,0.0],[0.0,0.132],[0,0],[0.176,0.0],[0,0],[-0.012,-0.148],[-0.02,-0.008],[0,0],[0.008,-0.068],[0.34,0.0],[0,0],[0.0,0.296],[-0.04,0.004],[0.0,0.048],[0.46,0.0],[0.0,0.424],[-0.016,0.0],[-0.032,-0.004],[0,0],[0.0,-0.088],[0.0,-0.04],[-0.044,-0.1],[-0.016,0.0],[-0.068,0.012],[-0.068,0.06],[0.008,0.312],[0,0],[0.396,0.0],[0,0],[-0.004,-0.056],[-0.016,-0.04],[-0.024,-0.032],[0,0],[0,0],[-0.02,-0.004],[-0.004,-0.008],[0.0,-0.016],[0.044,-0.012],[0.06,-0.028],[0.064,-0.072],[0.0,-0.368]],"closed":true}],"bbox":{"sw":[-0.762,-0.996],"ne":[0.762,1.004]},"advanceWidth":1.684,"nominalWidth":1.524,"anchors":{}},
        "timeSig4": {"contours":[{"vertices":[[0.508,0.296],[0.508,-0.56],[0.46,-0.628],[0.38,-0.592],[0.0,-0.132],[-0.036,-0.04],[-0.036,0.296],[-0.576,0.296],[0.396,-0.928],[0.4,-0.948],[0.34,-1.004],[0.068,-0.996],[-0.216,-1.004],[-0.308,-0.928],[-0.82,0.292],[-0.844,0.324],[-0.848,0.336],[-0.86,0.38],[-0.78,0.448],[-0.036,0.448],[-0.036,0.7],[-0.196,0.84],[-0.288,0.916],[-0.212,1.0],[0.64,1.0],[0.72,0.916],[0.632,0.836],[0.508,0.684],[0.508,0.448],[0.8,0.448],[0.86,0.372],[0.8,0.296]],"inTangents":[[0,0],[0,0],[0.044,0.0],[0.024,-0.028],[0,0],[0.0,-0.048],[0,0],[0,0],[-0.012,0.044],[0.0,0.008],[0.032,0.0],[0.072,0.0],[0.032,0.0],[0.0,-0.064],[0.12,-0.168],[0,0],[0.0,-0.004],[0.0,-0.012],[-0.048,0.0],[0,0],[0,0],[0.072,0.0],[0.0,-0.04],[-0.06,0.0],[0,0],[0.0,0.056],[0.04,0.0],[0.0,0.128],[0,0],[0,0],[0.0,0.048],[0.044,0.0]],"outTangents":[[0,0],[0.0,-0.032],[-0.036,0.0],[0,0],[-0.016,0.02],[0,0],[0,0],[0.32,-0.272],[0.0,-0.008],[0.0,-0.032],[-0.036,0.0],[-0.072,0.0],[-0.036,0.0],[0.0,0.496],[0,0],[0.0,0.004],[-0.008,0.016],[0.0,0.04],[0,0],[0,0],[0.0,0.108],[-0.064,0.0],[0.0,0.04],[0,0],[0.04,0.0],[0.0,-0.056],[-0.04,0.0],[0,0],[0,0],[0.04,0.0],[0.0,-0.048],[0,0]],"closed":true}],"bbox":{"sw":[-0.86,-1.004],"ne":[0.86,1.0]},"advanceWidth":1.88,"nominalWidth":1.72,"anchors":{}},
        "timeSig5": {"contours":[{"vertices":[[-0.502,-0.236],[-0.482,-0.496],[-0.422,-0.548],[-0.406,-0.548],[-0.014,-0.512],[0.562,-0.896],[0.506,-0.98],[0.014,-0.944],[-0.526,-0.984],[-0.622,-0.916],[-0.666,-0.028],[-0.666,-0.02],[-0.586,0.04],[-0.498,-0.04],[-0.226,-0.172],[0.186,0.348],[-0.154,0.844],[-0.246,0.832],[-0.294,0.776],[-0.246,0.72],[-0.094,0.452],[-0.406,0.14],[-0.722,0.436],[-0.726,0.508],[-0.018,1.004],[0.726,0.348],[0.066,-0.312],[-0.466,-0.196],[-0.486,-0.192],[-0.502,-0.22]],"inTangents":[[0,0],[-0.004,0.036],[-0.036,0.0],[0,0],[-0.164,0.0],[0.0,0.064],[0.044,0.0],[0.128,0.0],[0.068,0.008],[0.004,-0.032],[0,0],[0,0],[-0.04,0.0],[-0.044,0.044],[-0.136,0.0],[0.0,-0.444],[0.104,0.0],[0.028,0.012],[0.004,0.028],[-0.02,0.012],[0.0,0.112],[0.172,0.0],[0.012,-0.14],[0.0,-0.024],[-0.492,0.0],[0.0,0.36],[0.364,0.0],[0.128,-0.076],[0.004,0.0],[0.0,0.012]],"outTangents":[[0.0,0.0],[0.004,-0.032],[0,0],[0.04,0.008],[0.556,0.0],[0.0,-0.052],[-0.052,0.0],[-0.128,0.0],[-0.072,0.0],[0,0],[0,0],[0.0,0.052],[0.04,0.0],[0.04,-0.04],[0.136,0.0],[0.0,0.44],[-0.032,0.0],[-0.02,-0.012],[0.0,-0.028],[0.092,-0.056],[0.0,-0.176],[-0.216,0.0],[-0.004,0.024],[0.0,0.332],[0.48,0.0],[0.0,-0.364],[-0.232,0.0],[-0.008,0.004],[-0.016,0.0],[0,0]],"closed":true}],"bbox":{"sw":[-0.726,-0.984],"ne":[0.726,1.004]},"advanceWidth":1.612,"nominalWidth":1.452,"anchors":{}},
        "timeSig6": {"contours":[{"vertices":[[0.172,-0.4],[0.352,-0.332],[0.452,-0.348],[0.672,-0.636],[0.668,-0.68],[0.416,-0.952],[0.1,-1.004],[-0.632,-0.58],[-0.788,-0.012],[-0.788,0.004],[-0.664,0.556],[-0.288,0.94],[0.032,0.996],[0.556,0.852],[0.788,0.38],[0.54,-0.076],[0.184,-0.2],[-0.18,-0.06],[-0.204,-0.052],[-0.24,-0.148],[0.092,-0.908],[0.224,-0.848],[0.124,-0.696],[0.096,-0.58],[0.156,-0.416]],"inTangents":[[-0.004,-0.004],[-0.064,0.0],[-0.032,0.008],[0.0,0.128],[0.004,0.016],[0.12,0.044],[0.104,0.0],[0.144,-0.272],[0.0,-0.188],[0,0],[-0.088,-0.16],[-0.156,-0.068],[-0.1,0.0],[-0.144,0.116],[0.0,0.18],[0.128,0.096],[0.124,0.0],[0.104,-0.092],[0.008,0.0],[0.0,0.064],[-0.084,0.0],[0.0,-0.04],[0.024,-0.048],[0.0,-0.04],[-0.04,-0.044]],"outTangents":[[0.048,0.048],[0.032,0.0],[0.124,-0.032],[0.0,-0.016],[-0.02,-0.132],[-0.096,-0.04],[-0.304,0.004],[-0.088,0.168],[0,0],[0.004,0.184],[0.084,0.152],[0.1,0.044],[0.18,0.0],[0.14,-0.112],[0.0,-0.224],[-0.108,-0.08],[-0.128,0.0],[-0.008,0.008],[-0.024,0.0],[0.012,-0.74],[0.08,0.0],[0.0,0.056],[-0.02,0.036],[0.0,0.06],[0.004,0.008]],"closed":true},{"vertices":[[0.02,-0.008],[0.256,0.44],[0.02,0.888],[-0.212,0.44]],"inTangents":[[-0.128,0.0],[0.0,-0.248],[0.128,0.0],[0.0,0.248]],"outTangents":[[0.128,0.0],[0.0,0.248],[-0.128,0.0],[0.0,-0.248]],"closed":true}],"bbox":{"sw":[-0.788,-1.004],"ne":[0.788,0.996]},"advanceWidth":1.736,"nominalWidth":1.576,"anchors":{}},
        "timeSig7": {"contours":[{"vertices":[[0.802,-0.816],[0.734,-0.976],[0.65,-0.932],[0.466,-0.656],[-0.154,-0.996],[-0.502,-0.852],[-0.61,-0.78],[-0.714,-0.876],[-0.762,-0.904],[-0.802,-0.856],[-0.802,-0.196],[-0.758,-0.132],[-0.698,-0.212],[-0.426,-0.544],[0.158,-0.244],[0.358,-0.328],[0.394,-0.344],[0.422,-0.308],[-0.126,0.312],[-0.402,0.876],[-0.326,1.0],[-0.066,0.964],[0.262,1.0],[0.326,0.852],[0.802,-0.8]],"inTangents":[[0,0],[0.068,0.0],[0.016,-0.028],[0.1,0.0],[0.332,0.0],[0.056,-0.052],[0.028,-0.004],[0.02,0.04],[0.02,0.0],[0.0,-0.036],[0,0],[-0.04,0.0],[-0.016,0.044],[-0.18,0.0],[-0.232,0.0],[-0.032,0.024],[-0.008,0.0],[-0.004,-0.024],[0.24,-0.284],[0.0,-0.156],[-0.076,0.0],[-0.1,0.0],[-0.04,0.0],[0.0,0.116],[0.0,0.412]],"outTangents":[[0.0,-0.108],[-0.004,0.0],[-0.028,0.048],[-0.1,0.0],[-0.232,0.0],[-0.056,0.052],[-0.032,0.0],[-0.008,-0.016],[-0.02,0.0],[0,0],[0.0,0.0],[0.032,0.0],[0.04,-0.1],[0.16,0.0],[0.112,0.0],[0.012,-0.008],[0.016,0.0],[0.0,0.112],[-0.152,0.176],[0.0,0.084],[0.072,0.0],[0.1,0.0],[0.04,0.0],[0.0,-0.668],[0,0]],"closed":true}],"bbox":{"sw":[-0.802,-0.996],"ne":[0.802,1.0]},"advanceWidth":1.764,"nominalWidth":1.604,"anchors":{}},
        "timeSig8": {"contours":[{"vertices":[[0.464,-0.144],[0.704,-0.568],[0.008,-1.036],[-0.772,-0.488],[-0.424,0.044],[-0.792,0.528],[-0.036,1.036],[0.792,0.324]],"inTangents":[[0.188,0.096],[0.0,0.2],[0.108,0.0],[0.0,-0.336],[-0.192,-0.108],[0.0,-0.252],[-0.396,0.0],[0.0,0.54]],"outTangents":[[0.144,-0.092],[0.0,-0.408],[-0.464,0.0],[0.0,0.276],[-0.208,0.1],[0.0,0.348],[0.4,0.0],[0.0,-0.24]],"closed":true},{"vertices":[[0.256,-0.236],[-0.404,-0.668],[0.0,-0.92],[0.468,-0.576]],"inTangents":[[0.132,-0.076],[0.0,0.252],[-0.176,0.0],[0.0,-0.28]],"outTangents":[[-0.32,-0.112],[0.0,-0.168],[0.128,0.0],[0.0,0.16]],"closed":true},{"vertices":[[-0.052,0.904],[-0.564,0.508],[-0.248,0.132],[0.34,0.608]],"inTangents":[[0.268,0.0],[0.0,0.26],[-0.176,0.068],[0.0,-0.264]],"outTangents":[[-0.268,0.0],[0.0,-0.16],[0.292,0.128],[0.0,0.16]],"closed":true}],"bbox":{"sw":[-0.792,-1.036],"ne":[0.792,1.036]},"advanceWidth":1.744,"nominalWidth":1.584,"anchors":{}},
        "timeSig9": {"contours":[{"vertices":[[-0.172,0.392],[-0.352,0.324],[-0.452,0.34],[-0.672,0.628],[-0.668,0.672],[-0.416,0.944],[-0.1,0.996],[0.632,0.572],[0.788,0.004],[0.788,-0.012],[0.664,-0.564],[0.288,-0.948],[-0.032,-1.004],[-0.556,-0.86],[-0.788,-0.388],[-0.54,0.068],[-0.184,0.192],[0.18,0.052],[0.204,0.044],[0.24,0.14],[-0.092,0.9],[-0.224,0.84],[-0.124,0.688],[-0.096,0.572],[-0.156,0.408]],"inTangents":[[0.004,0.004],[0.064,0.0],[0.032,-0.008],[0.0,-0.128],[-0.004,-0.016],[-0.12,-0.044],[-0.104,0.0],[-0.144,0.272],[0.0,0.188],[0,0],[0.088,0.16],[0.156,0.068],[0.1,0.0],[0.144,-0.116],[0.0,-0.18],[-0.128,-0.096],[-0.124,0.0],[-0.104,0.092],[-0.008,0.0],[0.0,-0.064],[0.084,0.0],[0.0,0.04],[-0.024,0.048],[0.0,0.04],[0.04,0.044]],"outTangents":[[-0.048,-0.048],[-0.032,0.0],[-0.124,0.032],[0.0,0.016],[0.02,0.132],[0.096,0.04],[0.304,-0.004],[0.088,-0.168],[0,0],[-0.004,-0.184],[-0.084,-0.152],[-0.1,-0.044],[-0.18,0.0],[-0.14,0.112],[0.0,0.224],[0.108,0.08],[0.128,0.0],[0.008,-0.008],[0.024,0.0],[-0.012,0.74],[-0.08,0.0],[0.0,-0.056],[0.02,-0.036],[0.0,-0.06],[-0.004,-0.008]],"closed":true},{"vertices":[[-0.02,0.0],[-0.256,-0.448],[-0.02,-0.896],[0.212,-0.448]],"inTangents":[[0.128,0.0],[0.0,0.248],[-0.128,0.0],[0.0,-0.248]],"outTangents":[[-0.128,0.0],[0.0,-0.248],[0.128,0.0],[0.0,0.248]],"closed":true}],"bbox":{"sw":[-0.788,-1.004],"ne":[0.788,0.996]},"advanceWidth":1.736,"nominalWidth":1.576,"anchors":{}}
    };
    function hashString(value) {
        var text = String(value);
        var hash = 2166136261;
        var i;
        for (i = 0; i < text.length; i += 1) {
            hash = (hash ^ text.charCodeAt(i)) >>> 0;
            hash = (hash * 31 + 17) >>> 0;
        }
        return hash >>> 0;
    }
    function normalizeSeed(value) {
        var text = trimString(value);
        var numeric = parseInt(text, 10);
        if (text !== "" && !isNaN(numeric) && String(numeric) === text) {
            return numeric >>> 0;
        }
        return hashString(text === "" ? "0" : text);
    }
    function createRNG(seed) {
        var state = (seed >>> 0);
        return {
            next: function () {
                state = (state * 1664525 + 1013904223) >>> 0;
                return (state >>> 0) / 4294967296;
            },
            nextInt: function (minimum, maximum) {
                return minimum + Math.floor(this.next() * (maximum - minimum + 1));
            }
        };
    }
    function deriveSeeds(masterSeed) {
        return {
            masterSeed: masterSeed >>> 0,
            pitchSeed: hashString(String(masterSeed) + "|pitch"),
            rhythmSeed: hashString(String(masterSeed) + "|rhythm"),
            symbolSeed: hashString(String(masterSeed) + "|symbol")
        };
    }
    function pitchToMidi(pitch) {
        var pitchClass = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }[pitch.step];
        return (pitch.octave + 1) * 12 + pitchClass + pitch.alter;
    }
    function diatonicIndex(pitch) {
        return pitch.octave * 7 + STEP_INDEX[pitch.step];
    }
    function isPitchedEvent(event) {
        return !!event && (event.type === "note" || event.type === "chord");
    }
    function eventPitchList(event) {
        if (!event) {
            return [];
        }
        if (event.type === "chord") {
            return event.pitches || [];
        }
        return event.type === "note" && event.pitch ? [event.pitch] : [];
    }
    function eventPrimaryPitch(event) {
        var pitches = eventPitchList(event);
        return pitches.length > 0 ? pitches[0] : null;
    }
    function eventBaseNoteValue(event) {
        return event ? event.noteValue : null;
    }
    function eventDotCount(event) {
        return event && event.dots === 1 ? 1 : 0;
    }
    function durationTicksForValue(noteValue, dots) {
        if (!own(DURATION_TICKS, noteValue) || (dots !== 0 && dots !== 1) ||
                (dots === 1 && (noteValue === "whole" || noteValue === "sixteenth"))) {
            return null;
        }
        return DURATION_TICKS[noteValue] * (dots === 1 ? 1.5 : 1);
    }
    function pitchNotation(pitch, event) {
        if (pitch && pitch.notation) {
            return pitch.notation;
        }
        return event && event.type === "note" ? event.notation : null;
    }
    function makePitchFromDiatonic(index, alter) {
        var octave = Math.floor(index / 7);
        var stepIndex = index - octave * 7;
        if (stepIndex < 0) {
            stepIndex += 7;
            octave -= 1;
        }
        return {
            step: STEP_NAMES[stepIndex],
            alter: alter,
            octave: octave
        };
    }
    function parsePitchText(value) {
        var text = trimString(value).replace(/♯/g, "#").replace(/♭/g, "b");
        var match = /^([A-Ga-g])([#b]?)(-?[0-9]+)$/.exec(text);
        var alter = 0;
        var pitch;
        if (!match) {
            return null;
        }
        if (match[2] === "#") {
            alter = 1;
        } else if (match[2] === "b") {
            alter = -1;
        }
        pitch = {
            step: match[1].toUpperCase(),
            alter: alter,
            octave: parseInt(match[3], 10)
        };
        pitch.midi = pitchToMidi(pitch);
        return pitch;
    }
    function accidentalStateKey(pitch) {
        return pitch.step + String(pitch.octave);
    }
    function getAllowedDiatonicIndices(lowMidi, highMidi, allowAccidentals) {
        var result = [];
        var octave;
        var step;
        var pitch;
        var naturalMidi;
        var minimumAlter = allowAccidentals ? -1 : 0;
        var maximumAlter = allowAccidentals ? 1 : 0;
        for (octave = -1; octave <= 9; octave += 1) {
            for (step = 0; step < 7; step += 1) {
                pitch = makePitchFromDiatonic(octave * 7 + step, 0);
                naturalMidi = pitchToMidi(pitch);
                if (naturalMidi + maximumAlter >= lowMidi && naturalMidi + minimumAlter <= highMidi) {
                    result.push(octave * 7 + step);
                }
            }
        }
        return result;
    }
    function deriveGenerationControls(settings) {
        var density = clamp(settings.rhythmDensity, 0, 100);
        var motion = clamp(settings.melodyMotion, 0, 100);
        settings.noteDensity = density;
        settings.rhythmComplexity = density;
        settings.stepwiseMotion = clamp(90 - motion * 0.60, 30, 90);
        settings.leapProbability = clamp(5 + motion * 0.50, 5, 55);
        return settings;
    }
    function estimateRhythmEventLimit(settings) {
        var widthPerMeasure = calculateAvailableWidthPerMeasure(settings);
        var scaleFactor = Math.max(settings.noteScale, settings.symbolScale) / 100;
        var accidentalFactor = settings.accidentals ? 0.18 : 0;
        var estimatedEventSpan = settings.staffSize * (0.55 + 1.25 * scaleFactor + accidentalFactor);
        if (widthPerMeasure <= settings.staffSize || estimatedEventSpan <= 0) {
            return 1;
        }
        return clamp(Math.floor((widthPerMeasure - settings.staffSize) / estimatedEventSpan), 1, 16);
    }
    function chooseRhythmPattern(settings, rng) {
        var target = settings.rhythmComplexity * 0.70 + settings.noteDensity * 0.30;
        var weights = [];
        var total = 0;
        var i;
        var distance;
        var weight;
        var cursor;
        var selected;
        var eventLimit = estimateRhythmEventLimit(settings);
        var maximumComplexity = settings.rhythmComplexity <= 0 ? 0 :
            Math.min(100, Math.max(36, settings.rhythmComplexity + 40));
        for (i = 0; i < RHYTHM_PATTERNS.length; i += 1) {
            if (RHYTHM_PATTERNS[i].complexity > maximumComplexity || RHYTHM_PATTERNS[i].values.length > eventLimit) {
                weights.push(0);
                continue;
            }
            distance = Math.abs(target - RHYTHM_PATTERNS[i].complexity);
            weight = 1 + Math.max(0, 100 - distance) * 0.08;
            if (settings.rhythmComplexity < 20 && RHYTHM_PATTERNS[i].complexity > 60) {
                weight *= 0.18;
            }
            if (settings.rhythmComplexity > 75 && RHYTHM_PATTERNS[i].complexity < 25) {
                weight *= 0.28;
            }
            weights.push(weight);
            total += weight;
        }
        if (total <= 0) {
            return RHYTHM_PATTERNS[0];
        }
        cursor = rng.next() * total;
        for (i = 0; i < weights.length; i += 1) {
            cursor -= weights[i];
            if (cursor <= 0 && weights[i] > 0) {
                selected = RHYTHM_PATTERNS[i];
                break;
            }
        }
        return selected || RHYTHM_PATTERNS[0];
    }
    function chooseAlter(settings, rng) {
        if (!settings.accidentals || rng.next() >= 0.16) {
            return 0;
        }
        return rng.next() < 0.5 ? -1 : 1;
    }
    function nearestAllowedIndex(candidate, allowed) {
        var best = allowed[0];
        var bestDistance = Math.abs(best - candidate);
        var i;
        var distance;
        for (i = 1; i < allowed.length; i += 1) {
            distance = Math.abs(allowed[i] - candidate);
            if (distance < bestDistance) {
                best = allowed[i];
                bestDistance = distance;
            }
        }
        return best;
    }
    function getMotionWeights(settings) {
        var repetition = clamp(settings.repetitionTendency, 0, 100);
        var stepwise = clamp(settings.stepwiseMotion, 0, 100);
        var leap = clamp(settings.leapProbability, 0, 100);
        var medium = Math.max(0, 100 - repetition - stepwise - leap);
        var total = repetition + stepwise + medium + leap;
        if (total <= 0) {
            repetition = 10;
            stepwise = 60;
            medium = 20;
            leap = 10;
            total = 100;
        }
        return {
            repetition: repetition / total,
            stepwise: stepwise / total,
            medium: medium / total,
            leap: leap / total
        };
    }
    function chooseMotionDelta(settings, rng) {
        var weights = getMotionWeights(settings);
        var repetition = weights.repetition;
        var stepwise = repetition + weights.stepwise;
        var medium = stepwise + weights.medium;
        var roll = rng.next();
        var sign;
        if (roll < repetition) {
            return 0;
        }
        if (roll < stepwise) {
            sign = rng.next() < 0.5 ? -1 : 1;
            return sign * (rng.next() < 0.72 ? 1 : 2);
        }
        if (roll < medium) {
            sign = rng.next() < 0.5 ? -1 : 1;
            return sign * (2 + rng.nextInt(0, 2));
        }
        {
            sign = rng.next() < 0.5 ? -1 : 1;
            return sign * (3 + rng.nextInt(0, 4));
        }
    }
    function isPitchAllowed(pitch, settings) {
        if (!pitch || pitch.midi < settings.pitchLowMidi || pitch.midi > settings.pitchHighMidi) {
            return false;
        }
        if (!settings.accidentals && pitch.alter !== 0) {
            return false;
        }
        return true;
    }
    function makePitchCandidate(index, alter) {
        var pitch = makePitchFromDiatonic(index, alter);
        pitch.midi = pitchToMidi(pitch);
        pitch.diatonicIndex = index;
        return pitch;
    }
    function generatePitch(settings, pitchRng, symbolRng, allowed, previousPitch) {
        var candidateIndex;
        var delta;
        var alter;
        var pitch;
        var attempts;
        var startIndex;
        var offset;
        var candidate;
        var fallbackAlters;
        var fallbackIndex;
        if (previousPitch) {
            delta = chooseMotionDelta(settings, pitchRng);
            candidateIndex = nearestAllowedIndex(diatonicIndex(previousPitch) + delta, allowed);
        } else {
            candidateIndex = allowed[pitchRng.nextInt(0, allowed.length - 1)];
        }
        for (attempts = 0; attempts < 8; attempts += 1) {
            alter = chooseAlter(settings, symbolRng);
            pitch = makePitchCandidate(candidateIndex, alter);
            if (isPitchAllowed(pitch, settings)) {
                return pitch;
            }
        }
        fallbackAlters = settings.accidentals ? [0, -1, 1] : [0];
        startIndex = 0;
        for (attempts = 0; attempts < allowed.length; attempts += 1) {
            if (allowed[attempts] === candidateIndex) {
                startIndex = attempts;
                break;
            }
        }
        for (offset = 0; offset < allowed.length; offset += 1) {
            fallbackIndex = allowed[(startIndex + offset) % allowed.length];
            for (attempts = 0; attempts < fallbackAlters.length; attempts += 1) {
                candidate = makePitchCandidate(fallbackIndex, fallbackAlters[attempts]);
                if (isPitchAllowed(candidate, settings)) {
                    return candidate;
                }
            }
        }
        throw new Error("No playable pitches are available in the selected Pitch Range. Enable Accidentals or widen the range.");
    }
    function shouldGenerateNote(settings, rng) {
        return rng.next() >= settings.restDensity / 100;
    }
    function assignBeamGroups(measure, beamEnabled) {
        var current = [];
        var currentBeat = -1;
        var groupId = 0;
        var timeSignature = timeSignatureForMeasure(measure, DEFAULT_TIME_SIGNATURE);
        var i;
        var event;
        var beat;
        var endTick;
        var previous;
        function flush() {
            var j;
            if (current.length >= 2 && beamEnabled) {
                groupId += 1;
                for (j = 0; j < current.length; j += 1) {
                    current[j].beamGroupId = groupId;
                    current[j].beamRole = j === 0 ? "begin" : (j === current.length - 1 ? "end" : "continue");
                    current[j].beamLevel = eventBaseNoteValue(current[j]) === "sixteenth" ? 2 : 1;
                    current[j].notation.beamGroupId = groupId;
                    current[j].notation.beamRole = current[j].beamRole;
                    current[j].notation.beamLevel = current[j].beamLevel;
                }
            }
            current = [];
            currentBeat = -1;
        }
        for (i = 0; i < measure.events.length; i += 1) {
            event = measure.events[i];
            if (!isPitchedEvent(event) || (eventBaseNoteValue(event) !== "eighth" && eventBaseNoteValue(event) !== "sixteenth")) {
                flush();
                continue;
            }
            beat = timeSignatureBeatGroupIndex(timeSignature, event.startTicks);
            endTick = event.startTicks + event.durationTicks;
            if (endTick > timeSignatureBeatGroupEnd(timeSignature, event.startTicks)) {
                flush();
                continue;
            }
            if (current.length === 0) {
                currentBeat = beat;
                current.push(event);
            } else {
                previous = current[current.length - 1];
                if (beat !== currentBeat || previous.startTicks + previous.durationTicks !== event.startTicks) {
                    flush();
                    currentBeat = beat;
                }
                current.push(event);
            }
        }
        flush();
    }
    function generateScore(settings) {
        var seeds = deriveSeeds(normalizeSeed(settings.masterSeed));
        var pitchRng = createRNG(seeds.pitchSeed);
        var rhythmRng = createRNG(seeds.rhythmSeed);
        var symbolRng = createRNG(seeds.symbolSeed);
        var allowed = getAllowedDiatonicIndices(settings.pitchLowMidi, settings.pitchHighMidi, settings.accidentals);
        var score = {
            version: SCORE_VERSION,
            timeSignature: { numerator: 4, denominator: 4, beatGroups: [1, 1, 1, 1] },
            clef: "treble",
            key: { tonic: "C", mode: "major" },
            ticksPerQuarter: TICKS_PER_QUARTER,
            seeds: seeds,
            measures: []
        };
        var previousPitch = null;
        var measureIndex;
        var pattern;
        var measure;
        var tick;
        var i;
        var noteValue;
        var isNote;
        var event;
        var accidentalState;
        var currentAlter;
        var stateKey;
        if (allowed.length === 0) {
            throw new Error("No playable pitches are available in the selected Pitch Range. Enable Accidentals or widen the range.");
        }
        for (measureIndex = 0; measureIndex < settings.measures; measureIndex += 1) {
            pattern = chooseRhythmPattern(settings, rhythmRng);
            measure = { number: measureIndex + 1, events: [], tickTotal: 0 };
            accidentalState = {};
            tick = 0;
            for (i = 0; i < pattern.values.length; i += 1) {
                noteValue = pattern.values[i];
                isNote = shouldGenerateNote(settings, rhythmRng);
                event = {
                    type: isNote ? "note" : "rest",
                    startTicks: tick,
                    durationTicks: DURATION_TICKS[noteValue],
                    noteValue: noteValue,
                    dots: 0,
                    notation: { accidental: null, beamRole: null, beamGroupId: null }
                };
                if (isNote) {
                    event.pitch = generatePitch(settings, pitchRng, symbolRng, allowed, previousPitch);
                    previousPitch = event.pitch;
                    stateKey = accidentalStateKey(event.pitch);
                    currentAlter = own(accidentalState, stateKey) ? accidentalState[stateKey] : 0;
                    if (event.pitch.alter !== currentAlter) {
                        if (event.pitch.alter === 1) {
                            event.notation.accidental = "sharp";
                        } else if (event.pitch.alter === -1) {
                            event.notation.accidental = "flat";
                        } else {
                            event.notation.accidental = "natural";
                        }
                    }
                    accidentalState[stateKey] = event.pitch.alter;
                }
                measure.events.push(event);
                tick += event.durationTicks;
            }
            measure.tickTotal = tick;
            assignBeamGroups(measure, settings.beam);
            score.measures.push(measure);
        }
        return score;
    }
    function isFiniteNumber(value) {
        return typeof value === "number" && isFinite(value);
    }
    function validateScore(score, settings) {
        var errors = [];
        var measureIndex;
        var eventIndex;
        var measure;
        var event;
        var total;
        var expected;
        var duration;
        var dots;
        var stateKey;
        var accidentalState;
        var currentAlter;
        var expectedAccidental;
        var pitches;
        var pitch;
        var pitchIndex;
        var pitchKey;
        var seenPitches;
        var notation;
        var beamGroups;
        var beamGroup;
        var timeSignature;
        var expectedMeasureTicks;
        var beat;
        var endTick;
        var key;
        if (!score || !score.measures || !isFiniteNumber(score.ticksPerQuarter)) {
            return ["Score data is missing or malformed."];
        }
        if (score.ticksPerQuarter !== TICKS_PER_QUARTER) {
            errors.push("Invalid ticksPerQuarter.");
        }
        timeSignature = normalizeTimeSignature(score.timeSignature && score.timeSignature.numerator, score.timeSignature && score.timeSignature.denominator, score.timeSignature && score.timeSignature.beatGroups);
        if (!timeSignature) { errors.push("Unsupported or invalid time signature."); }
        if (settings && score.measures.length !== settings.measures) {
            errors.push("Measure count does not match settings.");
        }
        for (measureIndex = 0; measureIndex < score.measures.length; measureIndex += 1) {
            measure = score.measures[measureIndex];
            if (!measure || !measure.events || measure.events.length === 0) {
                errors.push("Measure " + (measureIndex + 1) + " has no events.");
                continue;
            }
            timeSignature = normalizeTimeSignature(
                measure.timeSignature && measure.timeSignature.numerator !== undefined ? measure.timeSignature.numerator : (score.timeSignature && score.timeSignature.numerator),
                measure.timeSignature && measure.timeSignature.denominator !== undefined ? measure.timeSignature.denominator : (score.timeSignature && score.timeSignature.denominator),
                measure.timeSignature && measure.timeSignature.beatGroups
            );
            if (!timeSignature) {
                errors.push("Unsupported or invalid time signature at measure " + (measureIndex + 1) + ".");
                timeSignature = cloneTimeSignature(score.timeSignature || DEFAULT_TIME_SIGNATURE);
            }
            expectedMeasureTicks = timeSignatureTicks(timeSignature);
            total = 0;
            accidentalState = {};
            beamGroups = {};
            for (eventIndex = 0; eventIndex < measure.events.length; eventIndex += 1) {
                event = measure.events[eventIndex];
                if (!event || !own(DURATION_TICKS, event.noteValue)) {
                    errors.push("Invalid duration at measure " + (measureIndex + 1) + ".");
                    continue;
                }
                dots = eventDotCount(event);
                if (event.dots !== undefined && event.dots !== 0 && event.dots !== 1) {
                    errors.push("Unsupported dot count at measure " + (measureIndex + 1) + ". Only one augmentation dot is supported.");
                }
                duration = durationTicksForValue(event.noteValue, dots);
                if (event.durationTicks !== duration || !isFiniteNumber(event.durationTicks)) {
                    errors.push("Invalid duration at measure " + (measureIndex + 1) + ".");
                }
                if (!isFiniteNumber(event.startTicks) || event.startTicks !== total) {
                    errors.push("Invalid event start tick at measure " + (measureIndex + 1) + ".");
                }
                if (event.type !== "note" && event.type !== "chord" && event.type !== "rest") {
                    errors.push("Invalid event type at measure " + (measureIndex + 1) + ".");
                }
                total += duration;
                pitches = eventPitchList(event);
                if (event.type === "note" && pitches.length !== 1) {
                    errors.push("Note pitch data is missing at measure " + (measureIndex + 1) + ".");
                }
                if (event.type === "chord" && pitches.length < 2) {
                    errors.push("Chord at measure " + (measureIndex + 1) + " must contain at least two pitches.");
                }
                seenPitches = {};
                for (pitchIndex = 0; pitchIndex < pitches.length; pitchIndex += 1) {
                    pitch = pitches[pitchIndex];
                    if (!pitch || !own(STEP_INDEX, pitch.step) || !isFiniteNumber(pitch.alter) ||
                            pitch.alter < -1 || pitch.alter > 1 || !isFiniteNumber(pitch.octave)) {
                        errors.push("Invalid pitch spelling at measure " + (measureIndex + 1) + ".");
                        continue;
                    }
                    expected = pitchToMidi(pitch);
                    pitchKey = isFiniteNumber(pitch.midi) ? "midi:" + pitch.midi :
                        "spelling:" + pitch.step + ":" + pitch.alter + ":" + pitch.octave;
                    if (own(seenPitches, pitchKey)) {
                        errors.push("Chord at measure " + (measureIndex + 1) + " contains a duplicate pitch.");
                    }
                    seenPitches[pitchKey] = true;
                    if (pitch.midi !== expected) {
                        errors.push("Pitch MIDI mismatch at measure " + (measureIndex + 1) + ".");
                    }
                    if (settings && (expected < settings.pitchLowMidi || expected > settings.pitchHighMidi)) {
                        errors.push("Pitch range violation at measure " + (measureIndex + 1) + ".");
                    }
                    if (settings && !settings.accidentals && pitch.alter !== 0) {
                        errors.push("Accidental is disabled at measure " + (measureIndex + 1) + ".");
                    }
                    stateKey = accidentalStateKey(pitch);
                    currentAlter = own(accidentalState, stateKey) ? accidentalState[stateKey] : 0;
                    expectedAccidental = pitch.alter === currentAlter ? null :
                        (pitch.alter === 1 ? "sharp" : (pitch.alter === -1 ? "flat" : "natural"));
                    notation = pitchNotation(pitch, event);
                    if (!notation || notation.accidental !== expectedAccidental) {
                        errors.push("Accidental state mismatch at measure " + (measureIndex + 1) + ".");
                    }
                    accidentalState[stateKey] = pitch.alter;
                }
                if (event.beamGroupId) {
                    if (!isPitchedEvent(event) || (eventBaseNoteValue(event) !== "eighth" && eventBaseNoteValue(event) !== "sixteenth")) {
                        errors.push("Invalid Beam Group event at measure " + (measureIndex + 1) + ".");
                    }
                    beat = timeSignatureBeatGroupIndex(timeSignature, event.startTicks);
                    endTick = event.startTicks + event.durationTicks;
                    if (endTick > timeSignatureBeatGroupEnd(timeSignature, event.startTicks)) {
                        errors.push("Beam Group crosses a beat at measure " + (measureIndex + 1) + ".");
                    }
                    if (!beamGroups[event.beamGroupId]) {
                        beamGroups[event.beamGroupId] = { count: 0, beat: beat, endTick: event.startTicks };
                    }
                    beamGroup = beamGroups[event.beamGroupId];
                    if (beamGroup.beat !== beat || beamGroup.endTick !== event.startTicks) {
                        errors.push("Beam Group is not contiguous at measure " + (measureIndex + 1) + ".");
                    }
                    beamGroup.count += 1;
                    beamGroup.endTick = event.startTicks + event.durationTicks;
                    if (!event.notation || event.notation.beamGroupId !== event.beamGroupId) {
                        errors.push("Beam metadata mismatch at measure " + (measureIndex + 1) + ".");
                    }
                }
            }
            for (key in beamGroups) {
                if (own(beamGroups, key) && beamGroups[key].count < 2) {
                    errors.push("Beam Group has fewer than two events at measure " + (measureIndex + 1) + ".");
                }
            }
            if (measure.tickTotal !== total || total !== expectedMeasureTicks) {
                errors.push("Measure " + (measureIndex + 1) + " does not total " + expectedMeasureTicks + " ticks for " + timeSignatureLabel(timeSignature) + ".");
            }
        }
        return errors;
    }
    function effectiveThickness(value, staffSpace, globalScale) {
        return value * (staffSpace / 20) * (globalScale / 100);
    }
    function tieThicknessForStaff(stemThickness, staffSpace, globalScale) {
        var scale = globalScale / 100;
        var minimum = 0.055 * staffSpace * scale;
        var maximum = 0.12 * staffSpace * scale;
        var stemBased = stemThickness * 0.70;
        return clamp(Math.max(minimum, stemBased), minimum, Math.max(minimum, maximum));
    }
    function addCommand(plan, command) {
        plan.commands.push(command);
    }
    function addLineCommand(plan, group, name, x1, y1, x2, y2, thickness) {
        addCommand(plan, {
            type: "line",
            group: group,
            name: name,
            points: [[x1, y1], [x2, y2]],
            thickness: thickness,
            color: BLACK
        });
    }
    function addPolylineCommand(plan, group, name, points, thickness) {
        addCommand(plan, {
            type: "line",
            group: group,
            name: name,
            points: points,
            thickness: thickness,
            color: BLACK
        });
    }
    function addGlyphCommand(plan, group, name, glyphName, x, y, scale, options) {
        var command = {
            type: "glyph",
            group: group,
            name: name,
            glyphName: glyphName,
            x: x,
            y: y,
            scale: scale,
            fillColor: BLACK,
            strokeColor: null,
            strokeThickness: 0
        };
        var key;
        if (options) {
            for (key in options) {
                if (own(options, key)) {
                    command[key] = options[key];
                }
            }
        }
        addCommand(plan, command);
    }
    function addBeamCommand(plan, name, x1, y1, x2, y2, thickness) {
        addCommand(plan, {
            type: "beam",
            group: "BEAMS",
            name: name,
            p1: [x1, y1],
            p2: [x2, y2],
            thickness: thickness,
            color: BLACK
        });
    }
    function restY(noteValue, space) {
        if (noteValue === "whole") {
            return space;
        }
        if (noteValue === "half") {
            return 2 * space;
        }
        return 2.0 * space;
    }
    function noteHeadGlyphName(noteValue) {
        if (noteValue === "whole") {
            return "noteheadWhole";
        }
        if (noteValue === "half") {
            return "noteheadHalf";
        }
        return "noteheadBlack";
    }
    function staffPositionForPitch(pitch) {
        var e4 = 4 * 7 + STEP_INDEX.E;
        return diatonicIndex(pitch) - e4;
    }
    function yForStaffPosition(staffPosition, space) {
        return 4 * space - staffPosition * 0.5 * space;
    }
    function eventStaffPositionRange(event) {
        var pitches = eventPitchList(event);
        var minimum = 4;
        var maximum = 4;
        var i;
        var position;
        if (pitches.length > 0) {
            minimum = staffPositionForPitch(pitches[0]);
            maximum = minimum;
            for (i = 1; i < pitches.length; i += 1) {
                position = staffPositionForPitch(pitches[i]);
                minimum = Math.min(minimum, position);
                maximum = Math.max(maximum, position);
            }
        }
        return { min: minimum, max: maximum, center: (minimum + maximum) / 2 };
    }
    function eventStemDirection(event) {
        return eventStaffPositionRange(event).center < 4 ? "up" : "down";
    }
    function orderedEventPitches(event) {
        var result = [];
        var pitches = eventPitchList(event);
        var i;
        var j;
        var value;
        var valuePosition;
        var currentPosition;
        for (i = 0; i < pitches.length; i += 1) {
            value = pitches[i];
            valuePosition = staffPositionForPitch(value);
            j = result.length;
            while (j > 0) {
                currentPosition = staffPositionForPitch(result[j - 1]);
                if (currentPosition < valuePosition ||
                        (currentPosition === valuePosition && result[j - 1].midi <= value.midi)) {
                    break;
                }
                j -= 1;
            }
            result.splice(j, 0, value);
        }
        return result;
    }
    function eventNoteheadLayouts(event, noteScale, space) {
        var pitches = orderedEventPitches(event);
        var result = [];
        var direction = eventStemDirection(event);
        var shift = Math.max(0.55 * noteScale, 0.45 * space);
        var i;
        var j;
        var runEnd;
        var position;
        var notation;
        for (i = 0; i < pitches.length; i += 1) {
            notation = pitchNotation(pitches[i], event);
            result.push({
                pitch: pitches[i],
                staffPosition: staffPositionForPitch(pitches[i]),
                y: yForStaffPosition(staffPositionForPitch(pitches[i]), space),
                xOffset: 0,
                accidental: notation && notation.accidental ? notation.accidental : null,
                accidentalColumn: 0
            });
        }
        if (event.type !== "chord" || result.length < 2) {
            return result;
        }
        i = 0;
        while (i < result.length) {
            runEnd = i;
            while (runEnd + 1 < result.length && result[runEnd + 1].staffPosition - result[runEnd].staffPosition === 1) {
                runEnd += 1;
            }
            if (runEnd > i) {
                for (j = i; j <= runEnd; j += 1) {
                    position = j - i;
                    if (direction === "up") {
                        result[j].xOffset = position % 2 === 0 ? -shift : 0;
                    } else {
                        result[j].xOffset = position % 2 === 0 ? 0 : shift;
                    }
                }
            }
            i = runEnd + 1;
        }
        return result;
    }
    function assignAccidentalColumns(noteheads) {
        var columns = [];
        var i;
        var j;
        var column;
        var occupied;
        for (i = 0; i < noteheads.length; i += 1) {
            if (!noteheads[i].accidental) {
                continue;
            }
            column = 0;
            occupied = true;
            while (occupied) {
                occupied = false;
                for (j = 0; j < columns.length; j += 1) {
                    if (columns[j] && columns[j].column === column &&
                            Math.abs(columns[j].staffPosition - noteheads[i].staffPosition) < 2) {
                        occupied = true;
                        break;
                    }
                }
                if (occupied) {
                    column += 1;
                }
            }
            noteheads[i].accidentalColumn = column;
            columns.push({ column: column, staffPosition: noteheads[i].staffPosition });
        }
    }
    function addLedgerCommands(plan, eventLayout, space, thickness, extension) {
        var noteheads = eventLayout.noteheads || eventNoteheadLayouts(eventLayout.event, eventLayout.noteScale, space);
        var ledgerPositions = {};
        var halfWidth = glyphWidthPixels(noteHeadGlyphName(eventLayout.event.noteValue), eventLayout.noteScale) / 2;
        var left = eventLayout.x - halfWidth - extension;
        var right = eventLayout.x + halfWidth + extension;
        var i;
        var j;
        var position;
        var ledgerPosition;
        for (i = 0; i < noteheads.length; i += 1) {
            position = noteheads[i].staffPosition;
            left = Math.min(left, eventLayout.x + noteheads[i].xOffset - halfWidth - extension);
            right = Math.max(right, eventLayout.x + noteheads[i].xOffset + halfWidth + extension);
            if (position > 8) {
                for (ledgerPosition = 10; ledgerPosition <= position; ledgerPosition += 2) {
                    ledgerPositions[ledgerPosition] = true;
                }
            } else if (position < 0) {
                for (ledgerPosition = -2; ledgerPosition >= position; ledgerPosition -= 2) {
                    ledgerPositions[ledgerPosition] = true;
                }
            }
        }
        for (j in ledgerPositions) {
            if (own(ledgerPositions, j)) {
                ledgerPosition = parseInt(j, 10);
                addLineCommand(plan, "LEDGER_LINES", "Ledger " + eventLayout.name + " " + ledgerPosition,
                    left, yForStaffPosition(ledgerPosition, space),
                    right, yForStaffPosition(ledgerPosition, space), thickness);
            }
        }
    }
    function glyphWidthPixels(glyphName, scale) {
        var glyph = GLYPHS[glyphName];
        if (!glyph || !glyph.bbox) {
            return 0;
        }
        return (glyph.bbox.ne[0] - glyph.bbox.sw[0]) * scale;
    }
    function eventExtents(event, space, symbolScale, noteScale) {
        var glyphName;
        var halfWidth;
        var accidentalName;
        var left;
        var right;
        var noteheads;
        var i;
        var head;
        var accidentalWidth;
        var accidentalGap = 0.25 * space * symbolScale;
        var dotWidth = glyphWidthPixels("augmentationDot", space * symbolScale);
        var dotGap = 0.25 * space * symbolScale;
        if (isPitchedEvent(event)) {
            glyphName = noteHeadGlyphName(eventBaseNoteValue(event));
            halfWidth = glyphWidthPixels(glyphName, noteScale) / 2;
            noteheads = eventNoteheadLayouts(event, noteScale, space);
            assignAccidentalColumns(noteheads);
            left = halfWidth;
            right = halfWidth;
            for (i = 0; i < noteheads.length; i += 1) {
                head = noteheads[i];
                left = Math.max(left, halfWidth - head.xOffset);
                right = Math.max(right, halfWidth + head.xOffset);
                if (head.staffPosition < 0 || head.staffPosition > 8) {
                    left = Math.max(left, halfWidth + ENGRAVING_DEFAULTS.legerLineExtension * space - head.xOffset);
                    right = Math.max(right, halfWidth + ENGRAVING_DEFAULTS.legerLineExtension * space + head.xOffset);
                }
                if (head.accidental) {
                    accidentalName = head.accidental === "sharp" ? "accidentalSharp" :
                        (head.accidental === "flat" ? "accidentalFlat" : "accidentalNatural");
                    accidentalWidth = glyphWidthPixels(accidentalName, space * symbolScale);
                    left = Math.max(left, halfWidth + accidentalWidth + accidentalGap +
                        head.accidentalColumn * (accidentalWidth + accidentalGap) - head.xOffset);
                }
                if (eventDotCount(event) > 0) {
                    right = Math.max(right, halfWidth + head.xOffset + dotGap + dotWidth);
                }
            }
            if (!event.beamGroupId && (eventBaseNoteValue(event) === "eighth" || eventBaseNoteValue(event) === "sixteenth")) {
                right += 1.3 * space * symbolScale;
            }
            return { left: left, right: right };
        }
        glyphName = "rest" + event.noteValue.charAt(0).toUpperCase() + event.noteValue.substr(1);
        halfWidth = glyphWidthPixels(glyphName, space * symbolScale) / 2;
        right = halfWidth;
        if (eventDotCount(event) > 0) {
            right += dotGap + dotWidth;
        }
        return { left: halfWidth, right: right };
    }
    function accidentalGlyphName(accidental) {
        if (accidental === "sharp") {
            return "accidentalSharp";
        }
        if (accidental === "flat") {
            return "accidentalFlat";
        }
        return "accidentalNatural";
    }
    function addImportedAccidentalCommands(plan, eventLayout, space, symbolScale) {
        var event = eventLayout.event;
        var noteheads = eventLayout.noteheads || [];
        var headName = noteHeadGlyphName(eventBaseNoteValue(event));
        var halfWidth = glyphWidthPixels(headName, eventLayout.noteScale) / 2;
        var scale = space * symbolScale;
        var gap = 0.25 * scale;
        var i;
        var head;
        var name;
        var width;
        var x;
        for (i = 0; i < noteheads.length; i += 1) {
            head = noteheads[i];
            if (!head.accidental) {
                continue;
            }
            name = accidentalGlyphName(head.accidental);
            width = glyphWidthPixels(name, scale);
            x = eventLayout.x + head.xOffset - halfWidth - gap - width / 2 -
                head.accidentalColumn * (width + gap);
            addGlyphCommand(plan, "ACCIDENTALS", eventLayout.name + " accidental " + (i + 1), name, x,
                head.y, scale, {});
        }
    }
    function dotStaffPositionForNotehead(notehead, occupied) {
        var position = notehead.staffPosition % 2 === 0 ? notehead.staffPosition + 1 : notehead.staffPosition;
        while (occupied[String(position)]) {
            position += 2;
        }
        occupied[String(position)] = true;
        return position;
    }
    function addAugmentationDots(plan, eventLayout, space, symbolScale) {
        var event = eventLayout.event;
        var scale = space * symbolScale;
        var dotWidth = glyphWidthPixels("augmentationDot", scale);
        var gap = 0.25 * scale;
        var noteheads;
        var occupied = {};
        var headName;
        var halfWidth;
        var i;
        var head;
        var dotPosition;
        var x;
        var y;
        if (eventDotCount(event) === 0) {
            return;
        }
        if (isPitchedEvent(event)) {
            noteheads = eventLayout.noteheads || [];
            headName = noteHeadGlyphName(eventBaseNoteValue(event));
            halfWidth = glyphWidthPixels(headName, eventLayout.noteScale) / 2;
            for (i = 0; i < noteheads.length; i += 1) {
                head = noteheads[i];
                dotPosition = dotStaffPositionForNotehead(head, occupied);
                x = eventLayout.x + head.xOffset + halfWidth + gap + dotWidth / 2;
                y = yForStaffPosition(dotPosition, space);
                addGlyphCommand(plan, "NOTES", eventLayout.name + " dot " + (i + 1), "augmentationDot", x, y, scale, {});
            }
            return;
        }
        x = eventLayout.x + GLYPHS["rest" + event.noteValue.charAt(0).toUpperCase() + event.noteValue.substr(1)].bbox.ne[0] * scale + gap + dotWidth / 2;
        addGlyphCommand(plan, "RESTS", eventLayout.name + " dot", "augmentationDot", x, eventLayout.y, scale, {});
    }
    function tiePitchKey(pitch) {
        if (!pitch) {
            return "";
        }
        if (isFiniteNumber(pitch.midi)) {
            return "midi:" + pitch.midi;
        }
        return pitch.step + ":" + pitch.alter + ":" + pitch.octave;
    }
    function findTieNotehead(noteheads, pitch) {
        var key = tiePitchKey(pitch);
        var i;
        if (!key) {
            return null;
        }
        for (i = 0; i < noteheads.length; i += 1) {
            if (tiePitchKey(noteheads[i].pitch) === key) {
                return noteheads[i];
            }
        }
        return null;
    }
    function addTieCurveCommand(plan, name, x1, y1, x2, y2, direction, space, thickness) {
        var points = [];
        var side = direction === "up" ? 1 : -1;
        var endpointOffset = 0.10 * space;
        var depth = clamp(Math.abs(x2 - x1) * 0.12, 0.25 * space, 0.55 * space);
        var i;
        var t;
        var x;
        var y;
        if (!isFiniteNumber(x1) || !isFiniteNumber(y1) || !isFiniteNumber(x2) || !isFiniteNumber(y2) || x2 <= x1) {
            return;
        }
        for (i = 0; i <= 8; i += 1) {
            t = i / 8;
            x = x1 + (x2 - x1) * t;
            y = (y1 + side * endpointOffset) * (1 - t) + (y2 + side * endpointOffset) * t + side * depth * 4 * t * (1 - t);
            points.push([x, y]);
        }
        addPolylineCommand(plan, "NOTES", name, points, thickness);
    }
    function addTieBetweenEventLayouts(plan, first, second, groupId, tieIndex, space, thickness) {
        var firstHeads = first.noteheads || [];
        var secondHeads = second.noteheads || [];
        var firstHead;
        var secondHead;
        var headName;
        var firstHalfWidth;
        var secondHalfWidth;
        var x1;
        var x2;
        var direction = first.direction || eventStemDirection(first.event);
        var name = "Tie " + groupId + " " + tieIndex;
        var boundaryGap = 0.20 * space;
        var firstBoundary;
        var secondBoundary;
        var i;
        for (i = 0; i < firstHeads.length; i += 1) {
            firstHead = firstHeads[i];
            secondHead = findTieNotehead(secondHeads, firstHead.pitch);
            if (!secondHead) {
                continue;
            }
            headName = noteHeadGlyphName(first.event.noteValue);
            firstHalfWidth = glyphWidthPixels(headName, first.noteScale) / 2;
            headName = noteHeadGlyphName(second.event.noteValue);
            secondHalfWidth = glyphWidthPixels(headName, second.noteScale) / 2;
            x1 = first.x + firstHead.xOffset + firstHalfWidth;
            x2 = second.x + secondHead.xOffset - secondHalfWidth;
            if (first.measureIndex !== second.measureIndex && isFiniteNumber(first.measureEndX) && isFiniteNumber(second.measureStart)) {
                firstBoundary = first.measureEndX - boundaryGap;
                secondBoundary = second.measureStart + boundaryGap;
                if (firstBoundary > x1) {
                    addTieCurveCommand(plan, name + " before", x1, firstHead.y, firstBoundary, firstHead.y, direction, space, thickness);
                }
                if (x2 > secondBoundary) {
                    addTieCurveCommand(plan, name + " after", secondBoundary, secondHead.y, x2, secondHead.y, direction, space, thickness);
                }
            } else {
                addTieCurveCommand(plan, name, x1, firstHead.y, x2, secondHead.y, direction, space, thickness);
            }
        }
    }
    function addMidiTieCommands(plan, tiedEventLayouts, space, thickness) {
        var groups = {};
        var groupKeys = [];
        var eventLayout;
        var event;
        var key;
        var group;
        var i;
        var j;
        if (!tiedEventLayouts || tiedEventLayouts.length === 0) {
            return;
        }
        for (i = 0; i < tiedEventLayouts.length; i += 1) {
            eventLayout = tiedEventLayouts[i];
            event = eventLayout.event;
            if (!event || event.tieGroupId === undefined || event.tieGroupId === null) {
                continue;
            }
            key = String(event.tieGroupId);
            if (!groups[key]) {
                groups[key] = [];
                groupKeys.push(key);
            }
            groups[key].push(eventLayout);
        }
        for (i = 0; i < groupKeys.length; i += 1) {
            group = groups[groupKeys[i]];
            group.sort(function (a, b) {
                var aIndex = isFiniteNumber(a.event.tieIndex) ? a.event.tieIndex : 0;
                var bIndex = isFiniteNumber(b.event.tieIndex) ? b.event.tieIndex : 0;
                return aIndex - bIndex;
            });
            for (j = 0; j + 1 < group.length; j += 1) {
                if (group[j].event.tieStart && group[j + 1].event.tieStop) {
                    addTieBetweenEventLayouts(plan, group[j], group[j + 1], groupKeys[i], j, space, thickness);
                }
            }
        }
    }
    function timeSignatureRowWidth(value, timeScale) {
        var text = String(value);
        var width = 0;
        var i;
        var glyph;
        var gap = 0.15 * timeScale;
        for (i = 0; i < text.length; i += 1) {
            glyph = GLYPHS["timeSig" + text.charAt(i)];
            if (!glyph) { return 0; }
            width += glyph.nominalWidth * timeScale;
            if (i > 0) { width += gap; }
        }
        return width;
    }
    function timeSignatureAreaWidth(timeSignature, space, symbolScale) {
        var normalized = cloneTimeSignature(timeSignature);
        return timeSignatureContentWidth(normalized, space, symbolScale) + 0.8 * space;
    }
    function timeSignatureContentWidth(timeSignature, space, symbolScale) {
        var normalized = cloneTimeSignature(timeSignature);
        var timeScale = space * symbolScale;
        return Math.max(timeSignatureRowWidth(normalized.numerator, timeScale), timeSignatureRowWidth(normalized.denominator, timeScale));
    }
    function measureHasTimeSignatureChange(score, measureIndex) {
        if (measureIndex <= 0) { return false; }
        return !timeSignatureEquals(
            timeSignatureForMeasure(score.measures[measureIndex], score.timeSignature),
            timeSignatureForMeasure(score.measures[measureIndex - 1], score.timeSignature)
        );
    }
    function addTimeSignatureCommands(plan, timeSignature, centerX, space, symbolScale, namePrefix) {
        var normalized = cloneTimeSignature(timeSignature);
        var timeScale = space * symbolScale;
        var values = [normalized.numerator, normalized.denominator];
        var labels = ["Numerator", "Denominator"];
        var i;
        var j;
        var text;
        var rowWidth;
        var cursor;
        var glyph;
        var glyphName;
        var gap = 0.15 * timeScale;
        var label;
        for (i = 0; i < values.length; i += 1) {
            text = String(values[i]);
            rowWidth = timeSignatureRowWidth(values[i], timeScale);
            cursor = centerX - rowWidth / 2;
            label = namePrefix || "Time Signature";
            for (j = 0; j < text.length; j += 1) {
                glyphName = "timeSig" + text.charAt(j);
                glyph = GLYPHS[glyphName];
                addGlyphCommand(plan, "TIME_SIGNATURE", label + " " + labels[i] + (text.length > 1 ? " " + (j + 1) : ""), glyphName,
                    cursor + glyph.nominalWidth * timeScale / 2, i === 0 ? space : 3 * space, timeScale, {});
                cursor += glyph.nominalWidth * timeScale + gap;
            }
        }
    }
    function calculateMeasureRequiredWidth(measure, space, symbolScale, noteScale) {
        var required = space;
        var gap = 0.4 * space;
        var i;
        var extent;
        for (i = 0; i < measure.events.length; i += 1) {
            extent = eventExtents(measure.events[i], space, symbolScale, noteScale);
            required += extent.left + extent.right;
            if (i > 0) { required += gap; }
        }
        return required;
    }
    function calculateMinimumLength(score, settings) {
        var space = settings.staffSize;
        var symbolScale = settings.symbolScale / 100;
        var noteScale = space * settings.noteScale / 100;
        var leftMargin = 1.00 * space;
        var clefArea = (GLYPHS.gClef.nominalWidth * symbolScale + 0.8) * space;
        var initialTimeSignature = score.measures.length > 0 ? timeSignatureForMeasure(score.measures[0], score.timeSignature) : cloneTimeSignature(score.timeSignature || DEFAULT_TIME_SIGNATURE);
        var timeArea = timeSignatureAreaWidth(initialTimeSignature, space, symbolScale);
        var rightMargin = 0.80 * space;
        var contentStart = leftMargin + clefArea + timeArea;
        var maximumMeasureWidth = 0;
        var i;
        var required;
        for (i = 0; i < score.measures.length; i += 1) {
            required = calculateMeasureRequiredWidth(score.measures[i], space, symbolScale, noteScale);
            if (measureHasTimeSignatureChange(score, i)) {
                required += timeSignatureAreaWidth(timeSignatureForMeasure(score.measures[i], score.timeSignature), space, symbolScale);
            }
            maximumMeasureWidth = Math.max(maximumMeasureWidth, required);
        }
        return contentStart + rightMargin + maximumMeasureWidth * score.measures.length;
    }
    function measurePositions(measure, start, width, space, symbolScale, noteScale, timeSignature) {
        var extents = [];
        var positions = [];
        var required = calculateMeasureRequiredWidth(measure, space, symbolScale, noteScale);
        var meterTicks = timeSignatureTicks(timeSignature || measure.timeSignature || DEFAULT_TIME_SIGNATURE);
        var gap = 0.4 * space;
        var i;
        var cursor;
        var extra;
        for (i = 0; i < measure.events.length; i += 1) {
            extents.push(eventExtents(measure.events[i], space, symbolScale, noteScale));
        }
        if (required > width) {
            throw new Error("Measure " + measure.number + " is too narrow. Click Auto Adjust or increase Length. Required: " + Math.ceil(required) + " px / Current: " + Math.floor(width) + " px");
        }
        extra = width - required;
        cursor = start + space / 2;
        for (i = 0; i < measure.events.length; i += 1) {
            positions.push(cursor + extents[i].left + extra * measure.events[i].startTicks / meterTicks);
            cursor += extents[i].left + extents[i].right + gap;
        }
        if (measure.events.length === 1) { positions[0] = start + width / 2; }
        return positions;
    }
    function findBeamGroup(groups, id) {
        var i;
        for (i = 0; i < groups.length; i += 1) {
            if (groups[i].id === id) {
                return groups[i];
            }
        }
        return null;
    }
    function collectBeamGroups(measureLayout) {
        var groups = [];
        var i;
        var eventLayout;
        var group;
        for (i = 0; i < measureLayout.events.length; i += 1) {
            eventLayout = measureLayout.events[i];
            if (!eventLayout.event.beamGroupId) {
                continue;
            }
            group = findBeamGroup(groups, eventLayout.event.beamGroupId);
            if (!group) {
                group = { id: eventLayout.event.beamGroupId, events: [], direction: "up" };
                groups.push(group);
            }
            group.events.push(eventLayout);
        }
        return groups;
    }
    function chooseBeamStemDirection(events) {
        var upperDistance = 0;
        var lowerDistance = 0;
        var upperCount = 0;
        var lowerCount = 0;
        var averagePosition = 0;
        var i;
        var position;
        var distance;
        if (!events || events.length === 0) {
            return "up";
        }
        for (i = 0; i < events.length; i += 1) {
            position = events[i].staffPosition;
            averagePosition += position;
            distance = position - 4;
            if (distance > 0) {
                upperDistance = Math.max(upperDistance, distance);
                upperCount += 1;
            } else if (distance < 0) {
                lowerDistance = Math.max(lowerDistance, -distance);
                lowerCount += 1;
            }
        }
        if (upperDistance > lowerDistance) {
            return "down";
        }
        if (lowerDistance > upperDistance) {
            return "up";
        }
        if (upperCount > lowerCount) {
            return "down";
        }
        if (lowerCount > upperCount) {
            return "up";
        }
        return averagePosition / events.length < 4 ? "up" : "down";
    }
    function setEventStemGeometry(eventLayout, direction, stemLength, stemWidth, space) {
        var noteheads = eventLayout.noteheads || eventNoteheadLayouts(eventLayout.event, eventLayout.noteScale, space);
        var head = direction === "up" ? noteheads[noteheads.length - 1] : noteheads[0];
        var headName;
        var anchor;
        if (!head) {
            return;
        }
        headName = noteHeadGlyphName(eventBaseNoteValue(eventLayout.event));
        anchor = direction === "up" ? GLYPHS[headName].anchors.stemUpSE : GLYPHS[headName].anchors.stemDownNW;
        eventLayout.direction = direction;
        eventLayout.stemAnchor = anchor;
        eventLayout.stemX = eventLayout.x + head.xOffset + anchor[0] * eventLayout.noteScale +
            (direction === "up" ? -stemWidth / 2 : stemWidth / 2);
        eventLayout.stemBaseY = head.y + anchor[1] * eventLayout.noteScale;
        eventLayout.stemEndY = eventLayout.stemBaseY + (direction === "up" ? -stemLength : stemLength);
    }
    function beamLevelForEventLayout(eventLayout) {
        var event = eventLayout ? eventLayout.event : null;
        var notationLevel = event && event.notation ? event.notation.beamLevel : null;
        if (event && isFiniteNumber(event.beamLevel)) { return event.beamLevel; }
        if (isFiniteNumber(notationLevel)) { return notationLevel; }
        return event && eventBaseNoteValue(event) === "sixteenth" ? 2 : 1;
    }
    function secondaryBeamYAtX(groupGeometry, x) {
        var primaryY = groupGeometry.startY + groupGeometry.slope * (x - groupGeometry.firstStemX);
        return primaryY + (groupGeometry.direction === "up" ? groupGeometry.beamSpacing : -groupGeometry.beamSpacing);
    }
    function addSecondaryBeamRun(plan, group, startIndex, endIndex, geometry) {
        var start = group.events[startIndex];
        var end = group.events[endIndex];
        addBeamCommand(plan, "Beam " + group.id + " secondary " + startIndex,
            start.stemX,
            secondaryBeamYAtX(geometry, start.stemX),
            end.stemX,
            secondaryBeamYAtX(geometry, end.stemX),
            geometry.beamWidth);
    }
    function choosePartialBeamDirection(group, index) {
        var current = group && group.events ? group.events[index] : null;
        var event = current ? current.event : null;
        var explicit = event ? event.partialBeamDirection : null;
        var previous;
        var next;
        var currentLevel;
        var groupStart;
        var groupEnd;
        var currentStart;
        var previousDistance;
        var nextDistance;
        if (!explicit && event && event.notation) { explicit = event.notation.partialBeamDirection; }
        if (explicit === "forward" || explicit === "backward") { return explicit; }
        if (!group || !group.events || !current) { return "forward"; }
        if (index === 0) { return "forward"; }
        if (index === group.events.length - 1) { return "backward"; }
        currentLevel = beamLevelForEventLayout(current);
        previous = group.events[index - 1];
        next = group.events[index + 1];
        if (beamLevelForEventLayout(previous) === currentLevel && currentLevel >= 2) { return "backward"; }
        if (beamLevelForEventLayout(next) === currentLevel && currentLevel >= 2) { return "forward"; }
        groupStart = group.events[0].event.startTicks;
        groupEnd = group.events[group.events.length - 1].event.startTicks + group.events[group.events.length - 1].event.durationTicks;
        currentStart = current.event.startTicks;
        if (isFiniteNumber(groupStart) && isFiniteNumber(groupEnd) && isFiniteNumber(currentStart) && groupEnd > groupStart) {
            if (currentStart - groupStart < (groupEnd - groupStart) / 2) { return "forward"; }
            if (currentStart - groupStart > (groupEnd - groupStart) / 2) { return "backward"; }
        }
        previousDistance = Math.abs(current.stemX - previous.stemX);
        nextDistance = Math.abs(next.stemX - current.stemX);
        return nextDistance < previousDistance ? "forward" : "backward";
    }
    function addPartialBeam(plan, group, index, direction, geometry) {
        var current = group.events[index];
        var adjacentIndex = direction === "backward" ? index - 1 : index + 1;
        var adjacent = group.events[adjacentIndex];
        var distance;
        var hookLength;
        var x1;
        var x2;
        if (!current || !adjacent) { return; }
        distance = Math.abs(adjacent.stemX - current.stemX);
        hookLength = Math.min(1.2 * geometry.space, distance * 0.45);
        if (!isFiniteNumber(hookLength) || hookLength <= 0) { return; }
        if (direction === "backward") {
            x1 = current.stemX - hookLength;
            x2 = current.stemX;
        } else {
            x1 = current.stemX;
            x2 = current.stemX + hookLength;
        }
        addBeamCommand(plan, "Beam " + group.id + " partial " + index + " " + direction,
            x1,
            secondaryBeamYAtX(geometry, x1),
            x2,
            secondaryBeamYAtX(geometry, x2),
            geometry.beamWidth);
    }
    function setStemAndBeamGeometry(measureLayout, settings, space) {
        var groups = collectBeamGroups(measureLayout);
        var i;
        var j;
        var group;
        var first;
        var last;
        var startY;
        var endY;
        var maxSlope;
        var dx;
        var eventLayout;
        var x;
        var lineY;
        var runStart;
        var runEnd;
        var beamGeometry;
        var beamWidth = effectiveThickness(settings.beamThickness, space, settings.globalThickness);
        var beamSpacing = beamWidth + ENGRAVING_DEFAULTS.beamSpacing * space;
        var stemLength = Math.max(3.5 * space, 3.5 * space * settings.noteScale / 100);
        var stemWidth = effectiveThickness(settings.stemThickness, space, settings.globalThickness);
        var shift;
        for (i = 0; i < measureLayout.events.length; i += 1) {
            eventLayout = measureLayout.events[i];
            if (!isPitchedEvent(eventLayout.event) || eventBaseNoteValue(eventLayout.event) === "whole") {
                continue;
            }
            setEventStemGeometry(eventLayout, eventLayout.direction, stemLength, stemWidth, space);
        }
        for (i = 0; i < groups.length; i += 1) {
            group = groups[i];
            group.direction = chooseBeamStemDirection(group.events);
            for (j = 0; j < group.events.length; j += 1) {
                group.events[j].direction = group.direction;
                setEventStemGeometry(group.events[j], group.direction, stemLength, stemWidth, space);
            }
            first = group.events[0];
            last = group.events[group.events.length - 1];
            startY = first.stemBaseY + (group.direction === "up" ? -stemLength : stemLength);
            endY = last.stemBaseY + (group.direction === "up" ? -stemLength : stemLength);
            maxSlope = 0.65 * space;
            dx = last.stemX - first.stemX;
            if (dx !== 0) {
                if (Math.abs(endY - startY) > maxSlope) {
                    endY = startY + (endY > startY ? maxSlope : -maxSlope);
                }
            }
            shift = 0;
            for (j = 0; j < group.events.length; j += 1) {
                eventLayout = group.events[j];
                lineY = startY + (endY - startY) * ((eventLayout.stemX - first.stemX) / (last.stemX - first.stemX || 1));
                if (group.direction === "up") {
                    shift = Math.min(shift, eventLayout.stemBaseY - stemLength - lineY);
                } else {
                    shift = Math.max(shift, eventLayout.stemBaseY + stemLength - lineY);
                }
            }
            startY += shift;
            endY += shift;
            beamGeometry = {
                firstStemX: first.stemX,
                lastStemX: last.stemX,
                startY: startY,
                endY: endY,
                slope: dx !== 0 ? (endY - startY) / dx : 0,
                direction: group.direction,
                beamSpacing: beamSpacing,
                beamWidth: beamWidth,
                space: space
            };
            for (j = 0; j < group.events.length; j += 1) {
                eventLayout = group.events[j];
                x = eventLayout.stemX;
                lineY = startY + (endY - startY) * ((x - first.stemX) / (last.stemX - first.stemX || 1));
                eventLayout.stemEndY = lineY;
            }
            addBeamCommand(measureLayout.plan, "Beam " + group.id, first.stemX, startY, last.stemX, endY,
                beamWidth);
            runStart = -1;
            for (j = 0; j <= group.events.length; j += 1) {
                if (j < group.events.length && beamLevelForEventLayout(group.events[j]) >= 2) {
                    if (runStart < 0) {
                        runStart = j;
                    }
                } else if (runStart >= 0) {
                    runEnd = j - 1;
                    if (runEnd - runStart >= 1) {
                        addSecondaryBeamRun(measureLayout.plan, group, runStart, runEnd, beamGeometry);
                    } else {
                        addPartialBeam(measureLayout.plan, group, runStart,
                            choosePartialBeamDirection(group, runStart), beamGeometry);
                    }
                    runStart = -1;
                }
            }
        }
    }
    function buildRenderPlan(score, settings) {
        var space = settings.staffSize;
        var symbolScale = settings.symbolScale / 100;
        var noteScaleMultiplier = settings.noteScale / 100;
        var staffThickness = effectiveThickness(settings.staffLineThickness, space, settings.globalThickness);
        var ledgerThickness = effectiveThickness(settings.ledgerLineThickness, space, settings.globalThickness);
        var barlineThickness = effectiveThickness(settings.barlineThickness, space, settings.globalThickness);
        var leftMargin = 1.00 * space;
        var clefArea = (GLYPHS.gClef.nominalWidth * symbolScale + 0.8) * space;
        var initialTimeSignature = score.measures.length > 0 ? timeSignatureForMeasure(score.measures[0], score.timeSignature) : cloneTimeSignature(score.timeSignature || DEFAULT_TIME_SIGNATURE);
        var timeArea = timeSignatureAreaWidth(initialTimeSignature, space, symbolScale);
        var rightMargin = 0.80 * space;
        var contentStart = leftMargin + clefArea + timeArea;
        var usableWidth = settings.length - contentStart - rightMargin;
        var measureWidth;
        var plan = { version: 1, space: space, width: settings.length, height: 5 * space, commands: [] };
        var measureIndex;
        var lineIndex;
        var measureStart;
        var boundaryX;
        var measure;
        var measureLayout;
        var eventIndex;
        var event;
        var eventX;
        var positions;
        var noteScale;
        var eventLayout;
        var stemThickness = effectiveThickness(settings.stemThickness, space, settings.globalThickness);
        var tieThickness = tieThicknessForStaff(stemThickness, space, settings.globalThickness);
        var tiedEventLayouts = [];
        var headName;
        var anchor;
        var flagName;
        var staffRange;
        var noteheads;
        var noteheadIndex;
        var noteheadLayout;
        var timeSignature;
        var leadingTimeArea;
        var eventStart;
        var eventWidth;
        if (usableWidth <= 0) {
            throw new Error("Length is too short. Click Auto Adjust or increase Length.");
        }
        measureWidth = usableWidth / settings.measures;
        noteScale = space * noteScaleMultiplier;
        for (lineIndex = 0; lineIndex < 5; lineIndex += 1) {
            addLineCommand(plan, "STAFF", "Line " + (lineIndex + 1), 0, lineIndex * space, settings.length, lineIndex * space, staffThickness);
        }
        addGlyphCommand(plan, "CLEF", "Treble Clef", "gClef", leftMargin + GLYPHS.gClef.nominalWidth * space * symbolScale / 2, 3 * space, space * symbolScale, {});
        addTimeSignatureCommands(plan, initialTimeSignature,
            leftMargin + clefArea + timeSignatureContentWidth(initialTimeSignature, space, symbolScale) / 2,
            space, symbolScale, "Time Signature");
        for (measureIndex = 1; measureIndex <= settings.measures; measureIndex += 1) {
            boundaryX = contentStart + measureWidth * measureIndex;
            addLineCommand(plan, "BARLINES", "Barline " + measureIndex, boundaryX, 0, boundaryX, 4 * space, barlineThickness);
        }
        for (measureIndex = 0; measureIndex < score.measures.length; measureIndex += 1) {
            measure = score.measures[measureIndex];
            timeSignature = timeSignatureForMeasure(measure, score.timeSignature);
            measureStart = contentStart + measureWidth * measureIndex;
            leadingTimeArea = measureHasTimeSignatureChange(score, measureIndex) ? timeSignatureAreaWidth(timeSignature, space, symbolScale) : 0;
            eventStart = measureStart + leadingTimeArea;
            eventWidth = measureWidth - leadingTimeArea;
            if (eventWidth <= 0) { throw new Error("Measure " + (measureIndex + 1) + " has no room after its time signature change."); }
            if (leadingTimeArea > 0) {
                addTimeSignatureCommands(plan, timeSignature,
                    measureStart + timeSignatureContentWidth(timeSignature, space, symbolScale) / 2,
                    space, symbolScale, "Time Signature " + (measureIndex + 1));
            }
            measureLayout = { plan: plan, measure: measure, events: [], startX: eventStart, width: eventWidth };
            positions = measurePositions(measure, eventStart, eventWidth, space, symbolScale, noteScale, timeSignature);
            for (eventIndex = 0; eventIndex < measure.events.length; eventIndex += 1) {
                event = measure.events[eventIndex];
                eventX = positions[eventIndex];
                if (isPitchedEvent(event)) {
                    staffRange = eventStaffPositionRange(event);
                    noteheads = eventNoteheadLayouts(event, noteScale, space);
                    assignAccidentalColumns(noteheads);
                    eventLayout = {
                        event: event,
                        name: (event.type === "chord" ? "Chord " : "Note ") + (measureIndex + 1) + "-" + (eventIndex + 1),
                        x: eventX,
                        y: yForStaffPosition(staffRange.center, space),
                        staffPosition: staffRange.center,
                        staffRange: staffRange,
                        noteheads: noteheads,
                        noteScale: noteScale,
                        direction: eventStemDirection(event),
                        measureStart: eventStart,
                        measureIndex: measureIndex,
                        measureEndX: eventStart + eventWidth
                    };
                } else {
                    eventLayout = {
                        event: event,
                        name: "Rest " + (measureIndex + 1) + "-" + (eventIndex + 1),
                        x: eventX,
                        y: restY(event.noteValue, space),
                        staffPosition: 4,
                        noteScale: noteScale,
                        direction: "up",
                        measureStart: eventStart,
                        measureIndex: measureIndex,
                        measureEndX: eventStart + eventWidth
                    };
                }
                measureLayout.events.push(eventLayout);
                if (event.tieGroupId !== undefined && event.tieGroupId !== null) {
                    tiedEventLayouts.push(eventLayout);
                }
            }
            setStemAndBeamGeometry(measureLayout, settings, space);
            for (eventIndex = 0; eventIndex < measureLayout.events.length; eventIndex += 1) {
                eventLayout = measureLayout.events[eventIndex];
                event = eventLayout.event;
                if (event.type === "rest") {
                    addGlyphCommand(plan, "RESTS", eventLayout.name, "rest" + event.noteValue.charAt(0).toUpperCase() + event.noteValue.substr(1), eventLayout.x, eventLayout.y, space * symbolScale, {});
                    addAugmentationDots(plan, eventLayout, space, symbolScale);
                    continue;
                }
                addLedgerCommands(plan, eventLayout, space, ledgerThickness, ENGRAVING_DEFAULTS.legerLineExtension * space);
                headName = noteHeadGlyphName(event.noteValue);
                for (noteheadIndex = 0; noteheadIndex < eventLayout.noteheads.length; noteheadIndex += 1) {
                    noteheadLayout = eventLayout.noteheads[noteheadIndex];
                    addGlyphCommand(plan, "NOTES", eventLayout.name + " head " + (noteheadIndex + 1), headName,
                        eventLayout.x + noteheadLayout.xOffset, noteheadLayout.y, noteScale, {});
                }
                addImportedAccidentalCommands(plan, eventLayout, space, symbolScale);
                if (event.noteValue !== "whole") {
                    addLineCommand(plan, "NOTES", eventLayout.name + " stem", eventLayout.stemX, eventLayout.stemBaseY, eventLayout.stemX, eventLayout.stemEndY, stemThickness);
                    if (!event.beamGroupId) {
                        flagName = null;
                        if (eventBaseNoteValue(event) === "eighth") {
                            flagName = eventLayout.direction === "up" ? "flagEighthUp" : "flagEighthDown";
                        } else if (eventBaseNoteValue(event) === "sixteenth") {
                            flagName = eventLayout.direction === "up" ? "flagSixteenthUp" : "flagSixteenthDown";
                        }
                        if (flagName) {
                            anchor = eventLayout.direction === "up" ? GLYPHS[flagName].anchors.stemUpNW : GLYPHS[flagName].anchors.stemDownSW;
                            addGlyphCommand(plan, "BEAMS", eventLayout.name + " flag", flagName, eventLayout.stemX - stemThickness / 2 - anchor[0] * space * symbolScale, eventLayout.stemEndY - anchor[1] * space * symbolScale, space * symbolScale, {});
                        }
                    }
                }
                addAugmentationDots(plan, eventLayout, space, symbolScale);
            }
        }
        addMidiTieCommands(plan, tiedEventLayouts, space, tieThickness);
        return plan;
    }
    function validateRenderPlan(plan) {
        var errors = [];
        var i;
        var command;
        var j;
        var point;
        if (!plan || !plan.commands) {
            return ["Render Plan is missing."];
        }
        for (i = 0; i < plan.commands.length; i += 1) {
            command = plan.commands[i];
            if (!command || !command.type) {
                errors.push("Invalid render command at index " + i + ".");
                continue;
            }
            if (command.type === "glyph") {
                if (!GLYPHS[command.glyphName]) {
                    errors.push("Missing glyph: " + command.glyphName);
                }
                if (!isFiniteNumber(command.x) || !isFiniteNumber(command.y) ||
                        !isFiniteNumber(command.scale) || command.scale <= 0) {
                    errors.push("Invalid glyph geometry: " + command.name);
                }
            } else if (command.type === "line") {
                if (!command.points || command.points.length < 2 || !isFiniteNumber(command.thickness) || command.thickness <= 0) {
                    errors.push("Invalid line command: " + command.name);
                } else {
                    for (j = 0; j < command.points.length; j += 1) {
                        point = command.points[j];
                        if (!point || !isFiniteNumber(point[0]) || !isFiniteNumber(point[1])) {
                            errors.push("Invalid line geometry: " + command.name);
                            break;
                        }
                    }
                }
            } else if (command.type === "beam") {
                if (!command.p1 || !command.p2 || !isFiniteNumber(command.thickness) || command.thickness <= 0 ||
                        !isFiniteNumber(command.p1[0]) || !isFiniteNumber(command.p1[1]) ||
                        !isFiniteNumber(command.p2[0]) || !isFiniteNumber(command.p2[1])) {
                    errors.push("Invalid beam command: " + command.name);
                }
            } else {
                errors.push("Unknown render command type: " + command.type);
            }
        }
        return errors;
    }
    function copySettings(settings) {
        var result = {};
        var key;
        for (key in settings) {
            if (own(settings, key)) {
                result[key] = settings[key];
            }
        }
        return result;
    }
    function roundToTenth(value) {
        return Math.round(value * 10) / 10;
    }
    function formatSettingValue(value) {
        var rounded = Math.round(value * 100) / 100;
        return String(rounded);
    }
    function autoFitSettings(settings) {
        var fitted = copySettings(settings);
        var score = generateScore(fitted);
        var minimumLength = calculateMinimumLength(score, fitted);
        var previous;
        var targetLength;
        var changes = [];
        var changeKeys = ["length", "staffSize", "noteScale", "symbolScale"];
        var changeLabels = {
            length: "Length",
            staffSize: "Staff Space",
            noteScale: "Note Scale",
            symbolScale: "Symbol Scale"
        };
        var i;
        while (minimumLength > MAX_LENGTH && fitted.staffSize > MIN_STAFF_SIZE) {
            previous = fitted.staffSize;
            fitted.staffSize = Math.max(MIN_STAFF_SIZE, roundToTenth(fitted.staffSize * 0.9));
            if (fitted.staffSize === previous) {
                break;
            }
            minimumLength = calculateMinimumLength(score, fitted);
        }
        while (minimumLength > MAX_LENGTH && fitted.noteScale > MIN_SCALE) {
            previous = fitted.noteScale;
            fitted.noteScale = Math.max(MIN_SCALE, roundToTenth(fitted.noteScale * 0.9));
            if (fitted.noteScale === previous) {
                break;
            }
            minimumLength = calculateMinimumLength(score, fitted);
        }
        while (minimumLength > MAX_LENGTH && fitted.symbolScale > MIN_SCALE) {
            previous = fitted.symbolScale;
            fitted.symbolScale = Math.max(MIN_SCALE, roundToTenth(fitted.symbolScale * 0.9));
            if (fitted.symbolScale === previous) {
                break;
            }
            minimumLength = calculateMinimumLength(score, fitted);
        }
        if (minimumLength > MAX_LENGTH) {
            throw new Error("The current settings do not fit within the maximum Length of " + MAX_LENGTH + " px. Adjust Staff Space, Note Scale, Symbol Scale, or Measures manually.");
        }
        targetLength = Math.max(fitted.length, Math.ceil(minimumLength));
        fitted.length = clamp(targetLength, MIN_LENGTH, MAX_LENGTH);
        for (i = 0; i < changeKeys.length; i += 1) {
            if (fitted[changeKeys[i]] !== settings[changeKeys[i]]) {
                changes.push(changeLabels[changeKeys[i]] + " " + formatSettingValue(settings[changeKeys[i]]) + " -> " + formatSettingValue(fitted[changeKeys[i]]));
            }
        }
        return {
            settings: fitted,
            minimumLength: minimumLength,
            changes: changes
        };
    }
    function getPresetById(id) {
        var i;
        if (id === CUSTOM_PRESET.id) {
            return CUSTOM_PRESET;
        }
        for (i = 0; i < PRESETS.length; i += 1) {
            if (PRESETS[i].id === id) {
                return PRESETS[i];
            }
        }
        return null;
    }
    function applyPreset(settings, preset) {
        var result = copySettings(settings);
        var i;
        var key;
        if (!preset || !preset.values) {
            return result;
        }
        for (i = 0; i < PRESET_GENERATION_KEYS.length; i += 1) {
            key = PRESET_GENERATION_KEYS[i];
            if (own(preset.values, key)) {
                result[key] = preset.values[key];
            }
        }
        result.presetId = preset.id;
        deriveGenerationControls(result);
        return result;
    }
    function buildPresetChoices() {
        var choices = [];
        var i;
        for (i = 0; i < PRESETS.length; i += 1) {
            choices.push({ id: PRESETS[i].id, label: PRESETS[i].name });
        }
        choices.push({ id: CUSTOM_PRESET.id, label: CUSTOM_PRESET.name });
        return choices;
    }
    function getPresetChoiceId(control, choices) {
        var selection = control ? control.selection : null;
        var index;
        if (!selection && selection !== 0) {
            return CUSTOM_PRESET.id;
        }
        index = typeof selection === "number" ? selection : selection.index;
        if (typeof index !== "number" || index < 0 || !choices[index]) {
            return CUSTOM_PRESET.id;
        }
        return choices[index].id;
    }
    function selectPresetChoice(control, choices, id) {
        var index = -1;
        var i;
        for (i = 0; i < choices.length; i += 1) {
            if (choices[i].id === id) {
                index = i;
                break;
            }
        }
        if (index < 0) {
            index = choices.length - 1;
        }
        control.selection = index;
    }
    function allowResponsiveShrink(control) {
        var minimumSize;
        if (!control) {
            return;
        }
        try {
            minimumSize = control.minimumSize;
            if (minimumSize) {
                if (isFiniteNumber(minimumSize.width)) {
                    minimumSize.width = 0;
                } else if (isFiniteNumber(minimumSize[0])) {
                    minimumSize[0] = 0;
                }
            }
        } catch (error) {
        }
    }
    function registerResponsiveRow(rows, row, labelControl, valueControl, kind, secondaryControl) {
        if (!rows) {
            return;
        }
        allowResponsiveShrink(row);
        allowResponsiveShrink(labelControl);
        allowResponsiveShrink(valueControl);
        allowResponsiveShrink(secondaryControl);
        rows.push({
            row: row,
            labelControl: labelControl,
            valueControl: valueControl,
            kind: kind || "field",
            secondaryControl: secondaryControl || null
        });
    }
    function addPresetField(parent, savedId, responsiveRows) {
        var row = parent.add("group");
        var labelControl = row.add("statictext", undefined, "Preset");
        var dropdown = row.add("dropdownlist", undefined, []);
        var choices = buildPresetChoices();
        var i;
        row.orientation = "row";
        row.alignChildren = ["fill", "center"];
        row.alignment = ["fill", "top"];
        row.spacing = 6;
        for (i = 0; i < choices.length; i += 1) {
            dropdown.add("item", choices[i].label);
        }
        selectPresetChoice(dropdown, choices, savedId);
        labelControl.helpTip = "Select a built-in style for generated scores. Import preserves source notation and does not use this preset.";
        dropdown.helpTip = "Select a style for generated scores, review the values, then click Generate. Import ignores this preset.";
        registerResponsiveRow(responsiveRows, row, labelControl, dropdown, "preset");
        return { control: dropdown, choices: choices };
    }
    function markPresetCustom(ui) {
        if (!ui || ui.suppressPresetTracking) {
            return;
        }
        ui.activePresetId = CUSTOM_PRESET.id;
        if (ui.preset) {
            selectPresetChoice(ui.preset.control, ui.preset.choices, CUSTOM_PRESET.id);
        }
        saveSetting("presetId", CUSTOM_PRESET.id);
    }
    function calculateAvailableWidthPerMeasure(settings) {
        var space = settings.staffSize;
        var symbolScale = settings.symbolScale / 100;
        var leftMargin = 1.00 * space;
        var clefArea = (GLYPHS.gClef.nominalWidth * symbolScale + 0.8) * space;
        var timeArea = timeSignatureAreaWidth(DEFAULT_TIME_SIGNATURE, space, symbolScale);
        var rightMargin = 0.80 * space;
        var contentStart = leftMargin + clefArea + timeArea;
        var usableWidth = settings.length - contentStart - rightMargin;
        return usableWidth > 0 ? usableWidth / settings.measures : 0;
    }
    function calculateRandomizeBudget(settings) {
        var widthPerMeasure = calculateAvailableWidthPerMeasure(settings);
        var widthPerSpace = widthPerMeasure / Math.max(settings.staffSize, 1);
        if (widthPerSpace < 14) {
            return { rhythmMin: 20, rhythmMax: 42, restMin: 10, restMax: 30 };
        }
        if (widthPerSpace < 24) {
            return { rhythmMin: 30, rhythmMax: 62, restMin: 5, restMax: 25 };
        }
        return { rhythmMin: 38, rhythmMax: 78, restMin: 0, restMax: 20 };
    }
    function randomInteger(minimum, maximum) {
        return minimum + Math.floor(Math.random() * (maximum - minimum + 1));
    }
    function pitchTextFromMidi(midi) {
        var pitchClass = ((midi % 12) + 12) % 12;
        var octave = Math.floor(midi / 12) - 1;
        return PITCH_CHOICE_NAMES[pitchClass] + octave;
    }
    function makeRandomPitchRange(allowAccidentals) {
        var pool = [];
        var lowIndex;
        var highIndex;
        var lowMidi;
        var highMidi;
        var pitchClass;
        var midi;
        var attempts;
        for (midi = RANDOM_PITCH_LOW_MIDI; midi <= RANDOM_PITCH_HIGH_MIDI; midi += 1) {
            pitchClass = midi % 12;
            if (allowAccidentals || PITCH_CHOICE_NAMES[pitchClass].indexOf("#") < 0) {
                pool.push(midi);
            }
        }
        for (attempts = 0; attempts < 40; attempts += 1) {
            lowIndex = randomInteger(0, pool.length - 1);
            lowMidi = pool[lowIndex];
            highMidi = lowMidi + randomInteger(RANDOM_PITCH_MIN_SPAN, RANDOM_PITCH_MAX_SPAN);
            if (highMidi <= RANDOM_PITCH_HIGH_MIDI) {
                for (highIndex = 0; highIndex < pool.length; highIndex += 1) {
                    if (pool[highIndex] >= highMidi) {
                        highMidi = pool[highIndex];
                        break;
                    }
                }
                if (highMidi > lowMidi && highMidi - lowMidi <= RANDOM_PITCH_MAX_SPAN) {
                    return {
                        lowText: pitchTextFromMidi(lowMidi),
                        highText: pitchTextFromMidi(highMidi),
                        lowMidi: lowMidi,
                        highMidi: highMidi
                    };
                }
            }
        }
        return { lowText: "C4", highText: "C6", lowMidi: 60, highMidi: 84 };
    }
    function createRandomizedCandidate(settings, budget) {
        var result = copySettings(settings);
        var allowAccidentals = Math.random() < 0.70;
        var range = makeRandomPitchRange(allowAccidentals);
        result.masterSeed = String(Math.floor(Math.random() * 2147483647));
        result.rhythmDensity = randomInteger(budget.rhythmMin, budget.rhythmMax);
        result.restDensity = randomInteger(budget.restMin, budget.restMax);
        result.melodyMotion = randomInteger(10, 85);
        result.repetitionTendency = randomInteger(0, 25);
        result.beam = Math.random() < 0.85;
        result.accidentals = allowAccidentals;
        result.pitchLowText = range.lowText;
        result.pitchHighText = range.highText;
        result.pitchLowMidi = range.lowMidi;
        result.pitchHighMidi = range.highMidi;
        result.presetId = CUSTOM_PRESET.id;
        deriveGenerationControls(result);
        return result;
    }
    function validateSettingsOutput(settings) {
        var score = generateScoreToFit(settings);
        var scoreErrors = validateScore(score, settings);
        var minimumLength;
        if (scoreErrors.length > 0) {
            throw new Error("Score validation failed:\n" + scoreErrors.join("\n"));
        }
        minimumLength = calculateMinimumLength(score, settings);
        if (minimumLength > settings.length) {
            throw new Error("The current settings do not fit within Length. Required: " + Math.ceil(minimumLength) + " px / Current: " + Math.floor(settings.length) + " px");
        }
        return true;
    }
    function randomizeGenerationSettings(settings) {
        var budget = calculateRandomizeBudget(settings);
        var candidate;
        var result;
        var attempt;
        var lastError = null;
        var fallback;
        var fallbackRange;
        for (attempt = 0; attempt < RANDOMIZE_MAX_ATTEMPTS; attempt += 1) {
            candidate = createRandomizedCandidate(settings, budget);
            try {
                result = validateSettingsOutput(candidate);
                if (result) {
                    return candidate;
                }
            } catch (error) {
                lastError = error;
            }
        }
        fallback = copySettings(settings);
        fallback.masterSeed = String(Math.floor(Math.random() * 2147483647));
        fallback.rhythmDensity = Math.min(30, budget.rhythmMax);
        fallback.restDensity = Math.max(20, budget.restMin);
        fallback.melodyMotion = 12;
        fallback.repetitionTendency = 15;
        deriveGenerationControls(fallback);
        fallback.beam = true;
        fallback.accidentals = false;
        fallbackRange = { lowText: "C4", highText: "C5", lowMidi: 60, highMidi: 72 };
        fallback.pitchLowText = fallbackRange.lowText;
        fallback.pitchHighText = fallbackRange.highText;
        fallback.pitchLowMidi = fallbackRange.lowMidi;
        fallback.pitchHighMidi = fallbackRange.highMidi;
        fallback.presetId = CUSTOM_PRESET.id;
        for (attempt = 0; attempt < RANDOMIZE_MAX_ATTEMPTS; attempt += 1) {
            try {
                result = validateSettingsOutput(fallback);
                if (result) {
                    return fallback;
                }
            } catch (fallbackError) {
                lastError = fallbackError;
                fallback.masterSeed = String((normalizeSeed(fallback.masterSeed) + 1) >>> 0);
            }
        }
        throw new Error("Could not create a Randomize result that fits the current layout. Click Auto Adjust, increase Length, or reduce Measures." +
            (lastError ? "\nDetails: " + lastError.toString() : ""));
    }
    function makeAEShapeFromContour(contour, x, y, scale) {
        var shape = new Shape();
        var vertices = [];
        var inTangents = [];
        var outTangents = [];
        var i;
        for (i = 0; i < contour.vertices.length; i += 1) {
            vertices.push([
                x + contour.vertices[i][0] * scale,
                y + contour.vertices[i][1] * scale
            ]);
            inTangents.push([
                contour.inTangents[i][0] * scale,
                contour.inTangents[i][1] * scale
            ]);
            outTangents.push([
                contour.outTangents[i][0] * scale,
                contour.outTangents[i][1] * scale
            ]);
        }
        shape.vertices = vertices;
        shape.inTangents = inTangents;
        shape.outTangents = outTangents;
        shape.closed = contour.closed;
        return shape;
    }
    function makeAEShapeFromPoints(points, closed) {
        var shape = new Shape();
        shape.vertices = points;
        shape.inTangents = zeroTangents(points.length);
        shape.outTangents = zeroTangents(points.length);
        shape.closed = closed;
        return shape;
    }
    function getVectorsGroup(group) {
        var vectors;
        if (!group) {
            throw new Error("Shape Renderer: vector group is null.");
        }
        vectors = group.property("ADBE Vectors Group");
        if (!vectors) {
            throw new Error("Shape Renderer: ADBE Vectors Group was not found.");
        }
        return vectors;
    }
    function getCategoryGroup(root, categoryIndex) {
        var category;
        if (!root) {
            throw new Error("Shape Renderer: root vector group is null.");
        }
        category = root.property(categoryIndex);
        if (!category) {
            throw new Error("Shape Renderer: category index " + categoryIndex + " was not found.");
        }
        return category;
    }
    function getRootVectorsGroup(layer) {
        var root;
        if (!layer) {
            throw new Error("Shape Renderer: Shape Layer is null.");
        }
        root = layer.property("ADBE Root Vectors Group");
        if (!root) {
            throw new Error("Shape Renderer: ADBE Root Vectors Group was not found.");
        }
        return root;
    }
    function getChildVectorGroup(root, categoryIndex, childIndex) {
        var category = getCategoryGroup(root, categoryIndex);
        var vectors = getVectorsGroup(category);
        var child = vectors.property(childIndex);
        if (!child) {
            throw new Error("Shape Renderer: child vector group " + childIndex + " was not found.");
        }
        return child;
    }
    function addPathToGroup(group, name, shape) {
        var vectors = getVectorsGroup(group);
        var path = vectors.addProperty("ADBE Vector Shape - Group");
        if (!path) {
            throw new Error("Shape Renderer: could not add ADBE Vector Shape - Group.");
        }
        path.name = name;
        if (!path.property("ADBE Vector Shape")) {
            throw new Error("Shape Renderer: ADBE Vector Shape value was not found.");
        }
        path.property("ADBE Vector Shape").setValue(shape);
    }
    function addFillToGroup(group, color) {
        var vectors = getVectorsGroup(group);
        var fill = vectors.addProperty("ADBE Vector Graphic - Fill");
        if (!fill) {
            throw new Error("Shape Renderer: could not add ADBE Vector Graphic - Fill.");
        }
        fill.name = "Fill";
        if (!fill.property("ADBE Vector Fill Color") || !fill.property("ADBE Vector Fill Opacity")) {
            throw new Error("Shape Renderer: fill properties were not found.");
        }
        fill.property("ADBE Vector Fill Color").setValue(color);
        fill.property("ADBE Vector Fill Opacity").setValue(100);
        fill.property("ADBE Vector Fill Rule").setValue(1);
    }
    function addStrokeToGroup(group, color, width) {
        var vectors = getVectorsGroup(group);
        var stroke = vectors.addProperty("ADBE Vector Graphic - Stroke");
        if (!stroke) {
            throw new Error("Shape Renderer: could not add ADBE Vector Graphic - Stroke.");
        }
        stroke.name = "Stroke";
        if (!stroke.property("ADBE Vector Stroke Color") || !stroke.property("ADBE Vector Stroke Opacity") || !stroke.property("ADBE Vector Stroke Width")) {
            throw new Error("Shape Renderer: stroke properties were not found.");
        }
        stroke.property("ADBE Vector Stroke Color").setValue(color);
        stroke.property("ADBE Vector Stroke Opacity").setValue(100);
        stroke.property("ADBE Vector Stroke Width").setValue(width);
    }
    function addCategoryPath(layer, categoryIndex, name, shape, color, thickness) {
        var root = getRootVectorsGroup(layer);
        var category = getCategoryGroup(root, categoryIndex);
        var child = getVectorsGroup(category).addProperty("ADBE Vector Group");
        var childIndex = child.propertyIndex;
        child.name = name;
        addPathToGroup(child, name, shape);
        root = getRootVectorsGroup(layer);
        child = getChildVectorGroup(root, categoryIndex, childIndex);
        addStrokeToGroup(child, color, thickness);
    }
    function addCategoryFill(layer, categoryIndex, name, shape, color) {
        var root = getRootVectorsGroup(layer);
        var category = getCategoryGroup(root, categoryIndex);
        var child = getVectorsGroup(category).addProperty("ADBE Vector Group");
        var childIndex = child.propertyIndex;
        child.name = name;
        addPathToGroup(child, name, shape);
        root = getRootVectorsGroup(layer);
        child = getChildVectorGroup(root, categoryIndex, childIndex);
        addFillToGroup(child, color);
    }
    function beamShape(p1, p2, thickness) {
        var dx = p2[0] - p1[0];
        var dy = p2[1] - p1[1];
        var length = Math.sqrt(dx * dx + dy * dy);
        var nx;
        var ny;
        var half = thickness * 0.5;
        if (length === 0) {
            return makeAEShapeFromPoints([
                [p1[0] - half, p1[1] - half], [p1[0] + half, p1[1] - half],
                [p1[0] + half, p1[1] + half], [p1[0] - half, p1[1] + half]
            ], true);
        }
        nx = -dy / length * half;
        ny = dx / length * half;
        return makeAEShapeFromPoints([
            [p1[0] + nx, p1[1] + ny],
            [p2[0] + nx, p2[1] + ny],
            [p2[0] - nx, p2[1] - ny],
            [p1[0] - nx, p1[1] - ny]
        ], true);
    }
    function addGlyphToRenderer(layer, categoryIndex, command, serial) {
        var root = getRootVectorsGroup(layer);
        var category = getCategoryGroup(root, categoryIndex);
        var vectors = getVectorsGroup(category);
        var glyphIndex;
        var glyph = GLYPHS[command.glyphName];
        var i;
        var child;
        var pathName;
        if (!vectors.addProperty("ADBE Vector Group")) {
            throw new Error("Shape Renderer: could not add glyph group.");
        }
        root = getRootVectorsGroup(layer);
        category = getCategoryGroup(root, categoryIndex);
        vectors = getVectorsGroup(category);
        glyphIndex = vectors.numProperties;
        if (!vectors.property(glyphIndex)) {
            throw new Error("Shape Renderer: newly-created glyph group was not found.");
        }
        vectors.property(glyphIndex).name = command.name || (command.glyphName + " " + serial);
        for (i = 0; i < glyph.contours.length; i += 1) {
            root = getRootVectorsGroup(layer);
            child = getChildVectorGroup(root, categoryIndex, glyphIndex);
            pathName = "Contour " + (i + 1);
            addPathToGroup(child, pathName, makeAEShapeFromContour(glyph.contours[i], command.x, command.y, command.scale));
        }
        root = getRootVectorsGroup(layer);
        child = getChildVectorGroup(root, categoryIndex, glyphIndex);
        if (command.fillColor) {
            addFillToGroup(child, command.fillColor);
        }
        if (command.strokeColor && command.strokeThickness > 0) {
            root = getRootVectorsGroup(layer);
            child = getChildVectorGroup(root, categoryIndex, glyphIndex);
            addStrokeToGroup(child, command.strokeColor, command.strokeThickness);
        }
    }
    function getUsedRendererCategories(plan, categories) {
        var used = {};
        var result = [];
        var i;
        var j;
        var command;
        if (!plan || !plan.commands) {
            return result;
        }
        for (i = 0; i < plan.commands.length; i += 1) {
            command = plan.commands[i];
            if (!command || !command.group) {
                continue;
            }
            for (j = 0; j < categories.length; j += 1) {
                if (categories[j] === command.group) {
                    used[command.group] = true;
                    break;
                }
            }
        }
        for (i = 0; i < categories.length; i += 1) {
            if (used[categories[i]]) {
                result.push(categories[i]);
            }
        }
        return result;
    }
    function renderPlanToShapeLayer(comp, plan, settings, score) {
        var layer = comp.layers.addShape();
        var root;
        var transform;
        var categories = [
            "STAFF", "LEDGER_LINES", "BARLINES", "CLEF", "TIME_SIGNATURE",
            "ACCIDENTALS", "RESTS", "NOTES", "BEAMS"
        ];
        var categoryIndices = {};
        var i;
        var category;
        var command;
        var shape;
        var index;
        categories = getUsedRendererCategories(plan, categories);
        try {
        if (!layer) {
            throw new Error("Shape Renderer: could not create a Shape Layer.");
        }
        root = getRootVectorsGroup(layer);
        transform = layer.property("ADBE Transform Group");
        if (!root) {
            throw new Error("Shape Renderer: ADBE Root Vectors Group was not found.");
        }
        if (!transform) {
            throw new Error("Shape Renderer: ADBE Transform Group was not found.");
        }
        layer.name = "Staff Generator";
        if (!transform.property("ADBE Anchor Point") || !transform.property("ADBE Position") || !transform.property("ADBE Scale")) {
            throw new Error("Shape Renderer: transform properties were not found.");
        }
        transform.property("ADBE Anchor Point").setValue([0, 0]);
        transform.property("ADBE Position").setValue([settings.positionX, settings.positionY]);
        transform.property("ADBE Scale").setValue([settings.overallScale, settings.overallScale]);
        for (i = 0; i < categories.length; i += 1) {
            root = getRootVectorsGroup(layer);
            category = root.addProperty("ADBE Vector Group");
            if (!category) {
                throw new Error("Shape Renderer: could not add category " + categories[i] + ".");
            }
            root = getRootVectorsGroup(layer);
            categoryIndices[categories[i]] = root.numProperties;
            root.property(categoryIndices[categories[i]]).name = RENDERER_CATEGORY_LABELS[categories[i]] || categories[i];
        }
        for (i = 0; i < plan.commands.length; i += 1) {
            command = plan.commands[i];
            index = categoryIndices[command.group];
            if (!index) {
                throw new Error("Shape Renderer: no category is available for " + command.group + ".");
            }
            if (command.type === "glyph") {
                addGlyphToRenderer(layer, index, command, i + 1);
            } else if (command.type === "line") {
                shape = makeAEShapeFromPoints(command.points, false);
                addCategoryPath(layer, index, command.name, shape, command.color || BLACK, command.thickness);
            } else if (command.type === "beam") {
                shape = beamShape(command.p1, command.p2, command.thickness);
                addCategoryFill(layer, index, command.name, shape, command.color || BLACK);
            }
        }
        layer.comment = serializeMetadata(score, settings);
        return layer;
        } catch (error) {
            if (layer) {
                try {
                    layer.remove();
                } catch (removeError) {
                }
            }
            throw error;
        }
    }
    function encodeMetadataValue(value) {
        return encodeURIComponent(String(value));
    }
    function serializeMetadata(score, settings) {
        var fields = [];
        var metadataTimeSignature = score.measures && score.measures.length > 0 ? timeSignatureForMeasure(score.measures[0], score.timeSignature) : cloneTimeSignature(score.timeSignature || DEFAULT_TIME_SIGNATURE);
        function add(key, value) {
            fields.push(key + "=" + encodeMetadataValue(value));
        }
        add("toolVersion", TOOL_VERSION);
        add("scoreVersion", score.version);
        add("masterSeed", score.seeds.masterSeed);
        add("pitchSeed", score.seeds.pitchSeed);
        add("rhythmSeed", score.seeds.rhythmSeed);
        add("symbolSeed", score.seeds.symbolSeed);
        add("glyphSource", GLYPH_DATA_META.source);
        add("glyphSourceVersion", GLYPH_DATA_META.sourceVersion);
        add("smuflVersion", GLYPH_DATA_META.smuflVersion);
        add("staff.length", settings.length);
        add("staff.staffSize", settings.staffSize);
        add("staff.lineThickness", settings.staffLineThickness);
        add("staff.positionX", settings.positionX);
        add("staff.positionY", settings.positionY);
        add("staff.overallScale", settings.overallScale);
        add("score.measures", settings.measures);
        add("score.timeSignature", timeSignatureLabel(metadataTimeSignature));
        add("score.key", "C Major");
        add("score.clef", "treble");
        add("generation.rhythmDensity", settings.rhythmDensity);
        add("generation.effectiveRhythmDensity", score.effectiveRhythmDensity !== undefined ? score.effectiveRhythmDensity : settings.rhythmDensity);
        add("generation.layoutAdjusted", score.layoutAdjusted ? true : false);
        add("generation.restDensity", settings.restDensity);
        add("generation.melodyMotion", settings.melodyMotion);
        add("generation.noteDensityDerived", settings.noteDensity);
        add("generation.preset", settings.presetId || CUSTOM_PRESET.id);
        add("generation.pitchLow", settings.pitchLowText);
        add("generation.pitchHigh", settings.pitchHighText);
        add("generation.rhythmComplexityDerived", settings.rhythmComplexity);
        add("generation.stepwiseMotionDerived", settings.stepwiseMotion);
        add("generation.leapProbabilityDerived", settings.leapProbability);
        add("generation.repetitionTendency", settings.repetitionTendency);
        add("notation.beam", settings.beam);
        add("notation.accidentals", settings.accidentals);
        add("style.symbolScale", settings.symbolScale);
        add("style.noteScale", settings.noteScale);
        add("style.stemThickness", settings.stemThickness);
        add("style.beamThickness", settings.beamThickness);
        add("style.barlineThickness", settings.barlineThickness);
        add("style.ledgerLineThickness", settings.ledgerLineThickness);
        add("style.globalThickness", settings.globalThickness);
        return "STAFF_GENERATOR_V1\n" + fields.join("\n");
    }
    function getSavedSetting(key, fallback) {
        try {
            if (/^(staffLineThickness|stemThickness|beamThickness|barlineThickness|ledgerLineThickness)$/.test(key) && !app.settings.haveSetting(SETTINGS_SECTION, "outlineStyleVersion")) {
                return fallback;
            }
            if (app.settings && app.settings.haveSetting(SETTINGS_SECTION, key)) {
                return app.settings.getSetting(SETTINGS_SECTION, key);
            }
        } catch (error) {
        }
        return fallback;
    }
    function saveSetting(key, value) {
        try {
            if (app.settings) {
                app.settings.saveSetting(SETTINGS_SECTION, key, String(value));
            }
        } catch (error) {
        }
    }
    function saveUISettings(settings, presetId) {
        saveSetting("outlineStyleVersion", "1");
        saveSetting("presetId", presetId || settings.presetId || CUSTOM_PRESET.id);
        saveSetting("length", settings.length);
        saveSetting("staffSize", settings.staffSize);
        saveSetting("staffLineThickness", settings.staffLineThickness);
        saveSetting("positionX", settings.positionX);
        saveSetting("positionY", settings.positionY);
        saveSetting("overallScale", settings.overallScale);
        saveSetting("measures", settings.measures);
        saveSetting("masterSeed", settings.masterSeed);
        saveSetting("pitchLow", settings.pitchLowText);
        saveSetting("pitchHigh", settings.pitchHighText);
        saveSetting("rhythmDensity", settings.rhythmDensity);
        saveSetting("restDensity", settings.restDensity);
        saveSetting("melodyMotion", settings.melodyMotion);
        saveSetting("noteDensity", settings.noteDensity);
        saveSetting("rhythmComplexity", settings.rhythmComplexity);
        saveSetting("stepwiseMotion", settings.stepwiseMotion);
        saveSetting("leapProbability", settings.leapProbability);
        saveSetting("repetitionTendency", settings.repetitionTendency);
        saveSetting("beam", settings.beam);
        saveSetting("accidentals", settings.accidentals);
        saveSetting("symbolScale", settings.symbolScale);
        saveSetting("noteScale", settings.noteScale);
        saveSetting("stemThickness", settings.stemThickness);
        saveSetting("beamThickness", settings.beamThickness);
        saveSetting("barlineThickness", settings.barlineThickness);
        saveSetting("ledgerLineThickness", settings.ledgerLineThickness);
        saveSetting("globalThickness", settings.globalThickness);
    }
    function getSavedRhythmDensity() {
        var explicitValue = getSavedSetting("rhythmDensity", "");
        var noteValue;
        var complexityValue;
        if (trimString(explicitValue) !== "" && !isNaN(parseFloat(explicitValue))) {
            return clamp(parseFloat(explicitValue), 0, 100);
        }
        noteValue = parseFloat(getSavedSetting("noteDensity", 82));
        complexityValue = parseFloat(getSavedSetting("rhythmComplexity", 45));
        if (isNaN(noteValue)) { noteValue = 82; }
        if (isNaN(complexityValue)) { complexityValue = 45; }
        return Math.round((complexityValue * 0.70 + noteValue * 0.30) * 10) / 10;
    }
    function getSavedMelodyMotion() {
        var explicitValue = getSavedSetting("melodyMotion", "");
        var stepwise;
        var leap;
        var fromStep;
        var fromLeap;
        if (trimString(explicitValue) !== "" && !isNaN(parseFloat(explicitValue))) {
            return clamp(parseFloat(explicitValue), 0, 100);
        }
        stepwise = parseFloat(getSavedSetting("stepwiseMotion", 70));
        leap = parseFloat(getSavedSetting("leapProbability", 15));
        if (isNaN(stepwise)) { stepwise = 70; }
        if (isNaN(leap)) { leap = 15; }
        fromStep = (90 - stepwise) / 0.60;
        fromLeap = (leap - 5) / 0.50;
        return clamp(Math.round(((fromStep + fromLeap) / 2) * 10) / 10, 0, 100);
    }
    function addField(parent, label, value, characters, helpText, responsiveRows) {
        var row = parent.add("group");
        var labelControl = row.add("statictext", undefined, label);
        var edit = row.add("edittext", undefined, String(value));
        row.orientation = "row";
        row.alignChildren = ["fill", "center"];
        row.alignment = ["fill", "top"];
        row.spacing = 6;
        edit.characters = characters || 8;
        if (helpText) {
            labelControl.helpTip = helpText;
            edit.helpTip = helpText;
        }
        registerResponsiveRow(responsiveRows, row, labelControl, edit, "field");
        return edit;
    }
    function buildPitchChoices() {
        var choices = [];
        var octave;
        var i;
        var value;
        var label;
        for (octave = PITCH_MIN_OCTAVE; octave <= PITCH_MAX_OCTAVE; octave += 1) {
            for (i = 0; i < PITCH_CHOICE_NAMES.length; i += 1) {
                value = PITCH_CHOICE_NAMES[i] + octave;
                label = value;
                if (PITCH_CHOICE_FLATS[i] !== "") {
                    label += " / " + PITCH_CHOICE_FLATS[i] + octave;
                }
                choices.push({
                    value: value,
                    label: label
                });
            }
        }
        return choices;
    }
    function getPitchChoiceValue(control, choices) {
        var selection = control ? control.selection : null;
        var index;
        if (!selection && selection !== 0) {
            return "";
        }
        index = typeof selection === "number" ? selection : selection.index;
        if (typeof index !== "number" || index < 0 || !choices[index]) {
            return "";
        }
        return choices[index].value;
    }
    function selectPitchChoice(control, choices, value) {
        var pitch = parsePitchText(value);
        var index = -1;
        var choicePitch;
        var i;
        for (i = 0; i < choices.length; i += 1) {
            if (choices[i].value === value) {
                index = i;
                break;
            }
        }
        if (index < 0 && pitch) {
            for (i = 0; i < choices.length; i += 1) {
                choicePitch = parsePitchText(choices[i].value);
                if (choicePitch && choicePitch.midi === pitch.midi) {
                    index = i;
                    break;
                }
            }
        }
        if (index < 0) {
            index = 0;
        }
        control.selection = index;
    }
    function addPitchRangeFields(parent, label, low, high, helpText, responsiveRows) {
        var row = parent.add("group");
        var labelControl = row.add("statictext", undefined, label);
        var rangeGroup = row.add("group");
        var lowDropdown;
        var separator;
        var highDropdown;
        var choices = buildPitchChoices();
        var i;
        row.orientation = "row";
        row.alignChildren = ["fill", "center"];
        row.alignment = ["fill", "top"];
        row.spacing = 6;
        rangeGroup.orientation = "row";
        rangeGroup.alignChildren = ["fill", "center"];
        rangeGroup.alignment = ["fill", "top"];
        rangeGroup.spacing = 4;
        lowDropdown = rangeGroup.add("dropdownlist", undefined, []);
        separator = rangeGroup.add("statictext", undefined, "→");
        highDropdown = rangeGroup.add("dropdownlist", undefined, []);
        for (i = 0; i < choices.length; i += 1) {
            lowDropdown.add("item", choices[i].label);
            highDropdown.add("item", choices[i].label);
        }
        selectPitchChoice(lowDropdown, choices, low);
        selectPitchChoice(highDropdown, choices, high);
        if (helpText) {
            labelControl.helpTip = helpText;
            lowDropdown.helpTip = helpText;
            highDropdown.helpTip = helpText;
        }
        registerResponsiveRow(responsiveRows, row, labelControl, rangeGroup, "pitchRange", rangeGroup);
        allowResponsiveShrink(lowDropdown);
        allowResponsiveShrink(highDropdown);
        allowResponsiveShrink(separator);
        return {
            low: lowDropdown,
            high: highDropdown,
            choices: choices,
            labelControl: labelControl,
            separator: separator,
            row: row,
            rangeGroup: rangeGroup
        };
    }
    function addSection(window, title) {
        var panel = window.add("panel", undefined, title);
        panel.orientation = "column";
        panel.alignChildren = ["fill", "top"];
        panel.margins = 8;
        allowResponsiveShrink(panel);
        return panel;
    }
    function readNumber(control, label, minimum, maximum, integer, errors, rangeErrors) {
        var value = parseFloat(trimString(control.text));
        var message;
        if (isNaN(value)) {
            errors.push(label + " must be a number.");
            return minimum;
        }
        if (integer) {
            value = Math.round(value);
        }
        if (value < minimum || value > maximum) {
            message = label + " must be between " + minimum + " and " + maximum + ".";
            errors.push(message);
            if (rangeErrors) {
                rangeErrors.push(message);
            }
            value = clamp(value, minimum, maximum);
        }
        return value;
    }
    function collectSettings(ui, options) {
        var errors = [];
        var numericErrors = [];
        var rangeErrors = [];
        var allowNumericClamp = options && options.allowNumericClamp;
        var lowText = getPitchChoiceValue(ui.pitchRange.low, ui.pitchRange.choices);
        var highText = getPitchChoiceValue(ui.pitchRange.high, ui.pitchRange.choices);
        var lowPitch = parsePitchText(lowText);
        var highPitch = parsePitchText(highText);
        var settings = {};
        settings.length = readNumber(ui.length, "Length", MIN_LENGTH, MAX_LENGTH, false, numericErrors, rangeErrors);
        settings.staffSize = readNumber(ui.staffSize, "Staff Space", MIN_STAFF_SIZE, 100, false, numericErrors, rangeErrors);
        settings.staffLineThickness = readNumber(ui.staffLineThickness, "Staff Line Thickness", 0.1, 20, false, numericErrors, rangeErrors);
        settings.positionX = readNumber(ui.positionX, "Position X", -100000, 100000, false, numericErrors, rangeErrors);
        settings.positionY = readNumber(ui.positionY, "Position Y", -100000, 100000, false, numericErrors, rangeErrors);
        settings.overallScale = readNumber(ui.overallScale, "Overall Scale", 1, 1000, false, numericErrors, rangeErrors);
        settings.measures = readNumber(ui.measures, "Measures", 1, 64, true, numericErrors, rangeErrors);
        settings.masterSeed = trimString(ui.masterSeed.text);
        if (settings.masterSeed === "") {
            errors.push("Enter a Master Seed.");
        }
        settings.pitchLowText = lowText;
        settings.pitchHighText = highText;
        if (!lowPitch) {
            errors.push("Select the lower Pitch Range note.");
        }
        if (!highPitch) {
            errors.push("Select the upper Pitch Range note.");
        }
        if (lowPitch && highPitch && lowPitch.midi >= highPitch.midi) {
            errors.push("Pitch Range must go from the lower note on the left to the higher note on the right.");
        }
        settings.pitchLowMidi = lowPitch ? lowPitch.midi : 0;
        settings.pitchHighMidi = highPitch ? highPitch.midi : 127;
        settings.rhythmDensity = readNumber(ui.rhythmDensity, "Rhythm Density", 0, 100, false, numericErrors, rangeErrors);
        settings.restDensity = readNumber(ui.restDensity, "Rest Amount", 0, 100, false, numericErrors, rangeErrors);
        settings.melodyMotion = readNumber(ui.melodyMotion, "Melody Motion", 0, 100, false, numericErrors, rangeErrors);
        settings.repetitionTendency = readNumber(ui.repetitionTendency, "Repetition Tendency", 0, 100, false, numericErrors, rangeErrors);
        deriveGenerationControls(settings);
        settings.beam = ui.beam.value;
        settings.accidentals = ui.accidentals.value;
        settings.symbolScale = readNumber(ui.symbolScale, "Symbol Scale", 1, 500, false, numericErrors, rangeErrors);
        settings.noteScale = readNumber(ui.noteScale, "Note Scale", 1, 500, false, numericErrors, rangeErrors);
        settings.stemThickness = readNumber(ui.stemThickness, "Stem Thickness", 0.1, 20, false, numericErrors, rangeErrors);
        settings.beamThickness = readNumber(ui.beamThickness, "Beam Thickness", 0.1, 20, false, numericErrors, rangeErrors);
        settings.barlineThickness = readNumber(ui.barlineThickness, "Barline Thickness", 0.1, 20, false, numericErrors, rangeErrors);
        settings.ledgerLineThickness = readNumber(ui.ledgerLineThickness, "Ledger Line Thickness", 0.1, 20, false, numericErrors, rangeErrors);
        settings.globalThickness = readNumber(ui.globalThickness, "Global Thickness Scale", 1, 500, false, numericErrors, rangeErrors);
        settings.presetId = ui.activePresetId || (ui.preset ? getPresetChoiceId(ui.preset.control, ui.preset.choices) : CUSTOM_PRESET.id);
        errors = errors.concat(numericErrors);
        if (allowNumericClamp && numericErrors.length === rangeErrors.length && errors.length === numericErrors.length) {
            settings.numericInputsClamped = numericErrors.length > 0;
            return settings;
        }
        if (errors.length > 0) {
            alert(errors.join("\n"), "Staff Generator");
            return null;
        }
        return settings;
    }
    function makeDefaultSettings() {
        var settings = copySettings(DEFAULTS);
        var lowPitch = parsePitchText(DEFAULTS.pitchLow);
        var highPitch = parsePitchText(DEFAULTS.pitchHigh);
        settings.pitchLowText = DEFAULTS.pitchLow;
        settings.pitchHighText = DEFAULTS.pitchHigh;
        settings.pitchLowMidi = lowPitch ? lowPitch.midi : 0;
        settings.pitchHighMidi = highPitch ? highPitch.midi : 127;
        settings.presetId = "default";
        deriveGenerationControls(settings);
        return settings;
    }
    function setFieldText(control, value) {
        control.text = formatSettingValue(value);
    }
    function applySettingsToUI(ui, settings) {
        setFieldText(ui.length, settings.length);
        setFieldText(ui.staffSize, settings.staffSize);
        setFieldText(ui.staffLineThickness, settings.staffLineThickness);
        setFieldText(ui.positionX, settings.positionX);
        setFieldText(ui.positionY, settings.positionY);
        setFieldText(ui.overallScale, settings.overallScale);
        setFieldText(ui.measures, settings.measures);
        ui.masterSeed.text = String(settings.masterSeed);
        selectPitchChoice(ui.pitchRange.low, ui.pitchRange.choices, settings.pitchLowText);
        selectPitchChoice(ui.pitchRange.high, ui.pitchRange.choices, settings.pitchHighText);
        setFieldText(ui.rhythmDensity, settings.rhythmDensity);
        setFieldText(ui.restDensity, settings.restDensity);
        setFieldText(ui.melodyMotion, settings.melodyMotion);
        setFieldText(ui.repetitionTendency, settings.repetitionTendency);
        ui.beam.value = settings.beam;
        ui.accidentals.value = settings.accidentals;
        setFieldText(ui.symbolScale, settings.symbolScale);
        setFieldText(ui.noteScale, settings.noteScale);
        setFieldText(ui.stemThickness, settings.stemThickness);
        setFieldText(ui.beamThickness, settings.beamThickness);
        setFieldText(ui.barlineThickness, settings.barlineThickness);
        setFieldText(ui.ledgerLineThickness, settings.ledgerLineThickness);
        setFieldText(ui.globalThickness, settings.globalThickness);
        if (ui.preset && settings.presetId) {
            ui.activePresetId = settings.presetId;
            selectPresetChoice(ui.preset.control, ui.preset.choices, settings.presetId);
        }
    }
    function bindPresetTracking(ui) {
        var controls = [
            ui.rhythmDensity, ui.restDensity, ui.melodyMotion, ui.repetitionTendency
        ];
        var i;
        var mark = function () { markPresetCustom(ui); };
        for (i = 0; i < controls.length; i += 1) {
            controls[i].onChange = mark;
        }
        ui.beam.onClick = mark;
        ui.accidentals.onClick = mark;
    }
    function generateScoreToFit(settings) {
        var working = copySettings(settings);
        var originalDensity = settings.rhythmDensity;
        var score;
        var minimumLength;
        var attempt;
        for (attempt = 0; attempt < 12; attempt += 1) {
            deriveGenerationControls(working);
            score = generateScore(working);
            minimumLength = calculateMinimumLength(score, settings);
            if (minimumLength <= settings.length) {
                score.layoutAdjusted = working.rhythmDensity !== originalDensity;
                score.effectiveRhythmDensity = working.rhythmDensity;
                return score;
            }
            if (working.rhythmDensity <= 0) {
                break;
            }
            working.rhythmDensity = Math.max(0, working.rhythmDensity - 8);
        }
        score.layoutAdjusted = working.rhythmDensity !== originalDensity;
        score.effectiveRhythmDensity = working.rhythmDensity;
        return score;
    }
    function generateStaff(settings) {
        var comp = app.project ? app.project.activeItem : null;
        var score;
        var scoreErrors;
        var plan;
        var planErrors;
        var layer = null;
        var undoStarted = false;
        if (!comp || !(comp instanceof CompItem)) {
            throw new Error("Open and select a composition before clicking Generate.");
        }
        score = generateScoreToFit(settings);
        scoreErrors = validateScore(score, settings);
        if (scoreErrors.length > 0) {
            throw new Error("Score validation failed:\n" + scoreErrors.join("\n"));
        }
        plan = buildRenderPlan(score, settings);
        planErrors = validateRenderPlan(plan);
        if (planErrors.length > 0) {
            throw new Error("Render Plan validation failed:\n" + planErrors.join("\n"));
        }
        try {
            app.beginUndoGroup("Generate Staff");
            undoStarted = true;
            layer = renderPlanToShapeLayer(comp, plan, settings, score);
            layer.selected = true;
            saveUISettings(settings);
            app.endUndoGroup();
            undoStarted = false;
        } catch (error) {
            if (layer) {
                try {
                    layer.remove();
                } catch (removeError) {
                }
            }
            if (undoStarted) {
                app.endUndoGroup();
            }
            throw error;
        }
        return { layer: layer, score: score, plan: plan };
    }
    function debugLog(message) {
        if (DEBUG && typeof $ !== "undefined" && $.writeln) {
            $.writeln("[Staff Generator] " + message);
        }
    }
    function getResponsiveWindowWidth(window) {
        var size;
        try {
            size = window ? window.size : null;
            if (size && isFiniteNumber(size.width) && size.width > 0) {
                return size.width;
            }
            if (size && isFiniteNumber(size[0]) && size[0] > 0) {
                return size[0];
            }
        } catch (error) {
        }
        return 0;
    }
    function setResponsivePreferredDimension(control, dimension, index, value) {
        var size;
        var current;
        if (!control || !isFiniteNumber(value)) {
            return false;
        }
        try {
            size = control.preferredSize;
            if (!size) {
                return false;
            }
            current = isFiniteNumber(size[dimension]) ? size[dimension] : size[index];
            if (current === value) {
                return false;
            }
            if (isFiniteNumber(size[dimension])) {
                size[dimension] = value;
            } else if (isFiniteNumber(size[index])) {
                size[index] = value;
            }
            return true;
        } catch (error) {
            return false;
        }
    }
    function setResponsivePreferredWidth(control, width) {
        return setResponsivePreferredDimension(control, "width", 0, width);
    }
    function setResponsivePreferredHeight(control, height) {
        return setResponsivePreferredDimension(control, "height", 1, height);
    }
    function setResponsiveTruncate(control) {
        if (!control) {
            return;
        }
        try {
            control.truncate = "end";
        } catch (error) {
        }
    }
    function clearButtonFocus(button) {
        if (!button) {
            return;
        }
        try {
            button.active = false;
        } catch (error) {
        }
    }
    function safeResizePanel(window) {
        if (!window || !window.layout) {
            return;
        }
        try {
            window.layout.resize();
        } catch (error) {
            debugLog("Panel resize skipped: " + error.toString());
        }
    }
    function addActionControls(parent) {
        var actionGroup = parent.add("group");
        var actionRow1;
        var actionRow2;
        var controls = {};
        actionGroup.orientation = "column";
        actionGroup.alignChildren = ["fill", "top"];
        actionGroup.alignment = ["fill", "top"];
        actionGroup.spacing = 4;
        actionGroup.margins = 0;
        actionRow1 = actionGroup.add("group");
        actionRow2 = actionGroup.add("group");
        actionRow1.orientation = "row";
        actionRow1.alignChildren = ["fill", "center"];
        actionRow1.alignment = ["fill", "top"];
        actionRow1.spacing = 4;
        actionRow1.margins = 0;
        actionRow2.orientation = "row";
        actionRow2.alignChildren = ["fill", "center"];
        actionRow2.alignment = ["fill", "top"];
        actionRow2.spacing = 4;
        actionRow2.margins = 0;
        controls.reset = actionRow1.add("button", undefined, "Reset");
        controls.autoAdjust = actionRow1.add("button", undefined, "Auto Adjust");
        controls.randomize = actionRow2.add("button", undefined, "Randomize");
        controls.generate = actionRow2.add("button", undefined, "Generate");
        controls.reset.alignment = ["fill", "center"];
        controls.autoAdjust.alignment = ["fill", "center"];
        controls.randomize.alignment = ["fill", "center"];
        controls.generate.alignment = ["fill", "center"];
        setResponsivePreferredHeight(actionRow1, 30);
        setResponsivePreferredHeight(actionRow2, 30);
        setResponsivePreferredHeight(controls.reset, 30);
        setResponsivePreferredHeight(controls.autoAdjust, 30);
        setResponsivePreferredHeight(controls.randomize, 30);
        setResponsivePreferredHeight(controls.generate, 30);
        allowResponsiveShrink(actionGroup);
        allowResponsiveShrink(actionRow1);
        allowResponsiveShrink(actionRow2);
        allowResponsiveShrink(controls.reset);
        allowResponsiveShrink(controls.autoAdjust);
        allowResponsiveShrink(controls.randomize);
        allowResponsiveShrink(controls.generate);
        controls.group = actionGroup;
        controls.status = parent.add("statictext", undefined, "Ready");
        controls.status.alignment = ["fill", "top"];
        allowResponsiveShrink(controls.status);
        return controls;
    }
    function setActionStatus(actionControls, text) {
        var i;
        if (!actionControls) {
            return;
        }
        for (i = 0; i < actionControls.length; i += 1) {
            if (actionControls[i] && actionControls[i].status) {
                actionControls[i].status.text = text;
            }
        }
    }
    function updateResponsiveActionGroup(actionGroup, actionGroupWidth, actionButtonWidth) {
        var actionRow;
        var i;
        var j;
        if (!actionGroup || !actionGroup.children) {
            return;
        }
        for (i = 0; i < actionGroup.children.length; i += 1) {
            actionRow = actionGroup.children[i];
            if (!actionRow || !actionRow.children) {
                continue;
            }
            setResponsivePreferredWidth(actionRow, actionGroupWidth);
            setResponsivePreferredHeight(actionRow, 30);
            for (j = 0; j < actionRow.children.length; j += 1) {
                setResponsivePreferredWidth(actionRow.children[j], actionButtonWidth);
                setResponsivePreferredHeight(actionRow.children[j], 30);
            }
        }
    }
    function updateResponsivePanelLayout(window, pitchRange, responsiveRows, actionGroups, resizeState) {
        var actualWidth = getResponsiveWindowWidth(window);
        var width;
        var layoutKey;
        var fieldLabelWidth;
        var fieldValueWidth;
        var pitchDropdownWidth;
        var presetDropdownWidth;
        var actionGroupWidth;
        var actionSpacing;
        var actionButtonWidth;
        var i;
        var rowInfo;
        var updated = false;
        resizeState = resizeState || {};
        if (resizeState.disposed || resizeState.inLayout) {
            return false;
        }
        if (actualWidth <= 0 && resizeState.initialized) {
            return false;
        }
        width = actualWidth > 0 ? actualWidth : 460;
        width = Math.max(300, Math.min(width, 720));
        layoutKey = String(Math.floor(width / 32));
        if (resizeState.lastLayoutKey === layoutKey) {
            return false;
        }
        fieldLabelWidth = Math.max(96, Math.min(156, Math.floor(width * 0.34)));
        fieldValueWidth = Math.max(72, Math.min(96, Math.floor(width * 0.20)));
        presetDropdownWidth = Math.max(132, Math.min(220, Math.floor(width - fieldLabelWidth - 56)));
        pitchDropdownWidth = Math.max(68, Math.min(118, Math.floor((width - fieldLabelWidth - 78) / 2)));
        resizeState.inLayout = true;
        try {
            if (responsiveRows) {
                for (i = 0; i < responsiveRows.length; i += 1) {
                    rowInfo = responsiveRows[i];
                    if (!rowInfo || rowInfo.kind === "pitchRange") {
                        continue;
                    }
                    setResponsiveTruncate(rowInfo.labelControl);
                    setResponsivePreferredWidth(rowInfo.labelControl, fieldLabelWidth);
                    setResponsivePreferredWidth(
                        rowInfo.valueControl,
                        rowInfo.kind === "preset" ? presetDropdownWidth : fieldValueWidth
                    );
                }
            }
            if (pitchRange) {
                setResponsiveTruncate(pitchRange.labelControl);
                setResponsivePreferredWidth(pitchRange.labelControl, fieldLabelWidth);
                setResponsivePreferredWidth(pitchRange.low, pitchDropdownWidth);
                setResponsivePreferredWidth(pitchRange.high, pitchDropdownWidth);
                setResponsivePreferredWidth(pitchRange.separator, 18);
            }
            if (actionGroups && actionGroups.length > 0) {
                actionGroupWidth = Math.max(180, width - 16);
                actionSpacing = 4;
                actionButtonWidth = Math.max(72, Math.floor((actionGroupWidth - actionSpacing) / 2));
                for (i = 0; i < actionGroups.length; i += 1) {
                    updateResponsiveActionGroup(actionGroups[i], actionGroupWidth, actionButtonWidth);
                }
            }
            resizeState.lastLayoutKey = layoutKey;
            resizeState.initialized = true;
            updated = true;
        } catch (error) {
            debugLog("Responsive width update skipped: " + error.toString());
            resizeState.lastLayoutKey = layoutKey;
        } finally {
            resizeState.inLayout = false;
        }
        return updated;
    }
var IMPORT_GRID_TICKS = 120;
var IMPORT_MAX_MEASURES = 64;
var IMPORT_EXTENSIONS = { mid: true, midi: true, musicxml: true, xml: true, mxl: true };
var IMPORT_DURATION_TABLE = [
    { ticks: 1920, noteValue: "whole", dots: 0 },
    { ticks: 1440, noteValue: "half", dots: 1 },
    { ticks: 960, noteValue: "half", dots: 0 },
    { ticks: 720, noteValue: "quarter", dots: 1 },
    { ticks: 480, noteValue: "quarter", dots: 0 },
    { ticks: 360, noteValue: "eighth", dots: 1 },
    { ticks: 240, noteValue: "eighth", dots: 0 },
    { ticks: 120, noteValue: "sixteenth", dots: 0 }
];
function importExtension(pathText) {
    var text = trimString(pathText || "");
    var slash = Math.max(text.lastIndexOf("/"), text.lastIndexOf("\\"));
    var dot = text.lastIndexOf(".");
    if (dot <= slash) { return ""; }
    return text.substr(dot + 1).toLowerCase();
}
function normalizeImportPath(pathText) {
    var text = trimString(pathText || "");
    if (text.length >= 2 && ((text.charAt(0) === '"' && text.charAt(text.length - 1) === '"') ||
            (text.charAt(0) === "'" && text.charAt(text.length - 1) === "'"))) {
        text = text.substring(1, text.length - 1);
    }
    return trimString(text);
}
function isMacOSForImport() {
    try { return typeof $ !== "undefined" && /mac/i.test($.os); } catch (error) { return false; }
}
function browseImportFile() {
    var filter;
    if (isMacOSForImport()) {
        filter = function (entry) {
            if (typeof Folder !== "undefined" && entry instanceof Folder) { return true; }
            return /\.(mid|midi|musicxml|xml|mxl)$/i.test(entry.name || "");
        };
    } else {
        filter = "MIDI / MusicXML:*.mid;*.midi;*.musicxml;*.xml;*.mxl";
    }
    return File.openDialog("Select a MIDI or MusicXML file", filter, false);
}
function readImportBinary(file) {
    var bytes = [];
    var text;
    var i;
    if (!file || !file.exists) { throw new Error("Import file was not found."); }
    file.encoding = "BINARY";
    if (!file.open("r")) { throw new Error("Could not open import file: " + file.fsName); }
    try { text = file.read(); } finally { file.close(); }
    for (i = 0; i < text.length; i += 1) { bytes.push(text.charCodeAt(i) & 255); }
    return bytes;
}
function readImportText(file) {
    var text;
    if (!file || !file.exists) { throw new Error("Import file was not found."); }
    file.encoding = "UTF-8";
    if (!file.open("r")) { throw new Error("Could not open import file: " + file.fsName); }
    try { text = file.read(); } finally { file.close(); }
    return text;
}
function importReadU16(bytes, offset) { return ((bytes[offset] << 8) | bytes[offset + 1]) >>> 0; }
function importReadU32(bytes, offset) {
    return (((bytes[offset] * 16777216) + (bytes[offset + 1] << 16) + (bytes[offset + 2] << 8) + bytes[offset + 3]) >>> 0);
}
function importAscii(bytes, offset, count) {
    var result = "";
    var i;
    for (i = 0; i < count; i += 1) { result += String.fromCharCode(bytes[offset + i]); }
    return result;
}
function importReadVlq(bytes, state, limit) {
    var value = 0;
    var count = 0;
    var b;
    do {
        if (state.offset >= limit || count >= 4) { throw new Error("Invalid MIDI variable-length quantity."); }
        b = bytes[state.offset++];
        value = (value * 128) + (b & 127);
        count += 1;
    } while (b & 128);
    return value;
}
function midiDataLength(status) {
    var high = status & 240;
    if (high === 192 || high === 208) { return 1; }
    if (high >= 128 && high <= 224) { return 2; }
    return -1;
}
function midiSignedByte(value) { return value > 127 ? value - 256 : value; }
function midiText(data) {
    var text = "";
    var i;
    for (i = 0; i < data.length; i += 1) {
        if (data[i] >= 32 && data[i] <= 126) { text += String.fromCharCode(data[i]); }
    }
    return text;
}
function parseMidiBytes(bytes) {
    var headerLength;
    var format;
    var trackCount;
    var division;
    var offset;
    var trackIndex;
    var trackLength;
    var trackEnd;
    var state;
    var absoluteTick;
    var runningStatus;
    var first;
    var status;
    var dataLength;
    var data1;
    var data2;
    var metaType;
    var dataCount;
    var data;
    var i;
    var channel;
    var pitch;
    var velocity;
    var key;
    var active;
    var laneMap = {};
    var lanes = [];
    var trackNames = [];
    var timeSignatures = [];
    var keySignatures = [];
    var lane;
    var activeKey;
    var note;
    if (!bytes || bytes.length < 14 || importAscii(bytes, 0, 4) !== "MThd") {
        throw new Error("This is not a Standard MIDI File (missing MThd header).");
    }
    headerLength = importReadU32(bytes, 4);
    if (headerLength < 6 || 8 + headerLength > bytes.length) { throw new Error("Invalid MIDI header length."); }
    format = importReadU16(bytes, 8);
    trackCount = importReadU16(bytes, 10);
    division = importReadU16(bytes, 12);
    if (format !== 0 && format !== 1) { throw new Error("MIDI format " + format + " is not supported. Use Standard MIDI File format 0 or 1."); }
    if (division & 32768) { throw new Error("SMPTE-timed MIDI files are not supported. Export MIDI using ticks-per-quarter-note timing."); }
    if (division <= 0) { throw new Error("MIDI ticks-per-quarter-note value is invalid."); }
    offset = 8 + headerLength;
    active = {};
    for (trackIndex = 0; trackIndex < trackCount; trackIndex += 1) {
        if (offset + 8 > bytes.length || importAscii(bytes, offset, 4) !== "MTrk") { throw new Error("Invalid MIDI track chunk at track " + (trackIndex + 1) + "."); }
        trackLength = importReadU32(bytes, offset + 4);
        offset += 8;
        trackEnd = offset + trackLength;
        if (trackEnd > bytes.length) { throw new Error("MIDI track " + (trackIndex + 1) + " extends past the end of the file."); }
        state = { offset: offset };
        absoluteTick = 0;
        runningStatus = -1;
        active[trackIndex] = {};
        while (state.offset < trackEnd) {
            absoluteTick += importReadVlq(bytes, state, trackEnd);
            if (state.offset >= trackEnd) { break; }
            first = bytes[state.offset++];
            if (first < 128) {
                if (runningStatus < 128 || runningStatus >= 240) { throw new Error("Invalid MIDI running status in track " + (trackIndex + 1) + "."); }
                status = runningStatus;
                data1 = first;
            } else {
                status = first;
                data1 = null;
                if (status < 240) { runningStatus = status; }
                else if (status === 240 || status === 247 || status === 255) { runningStatus = -1; }
            }
            if (status === 255) {
                if (state.offset >= trackEnd) { throw new Error("Truncated MIDI meta event."); }
                metaType = bytes[state.offset++];
                dataCount = importReadVlq(bytes, state, trackEnd);
                if (state.offset + dataCount > trackEnd) { throw new Error("Truncated MIDI meta event data."); }
                data = bytes.slice(state.offset, state.offset + dataCount);
                state.offset += dataCount;
                if (metaType === 3) { trackNames[trackIndex] = midiText(data); }
                else if (metaType === 88 && data.length >= 2) {
                    timeSignatures.push({ tick: absoluteTick, numerator: data[0], denominator: Math.pow(2, data[1]), track: trackIndex });
                } else if (metaType === 89 && data.length >= 1) {
                    keySignatures.push({ tick: absoluteTick, fifths: midiSignedByte(data[0]), track: trackIndex });
                } else if (metaType === 47) { break; }
                continue;
            }
            if (status === 240 || status === 247) {
                dataCount = importReadVlq(bytes, state, trackEnd);
                if (state.offset + dataCount > trackEnd) { throw new Error("Truncated MIDI SysEx event."); }
                state.offset += dataCount;
                continue;
            }
            dataLength = midiDataLength(status);
            if (dataLength < 0) { throw new Error("Unsupported MIDI status 0x" + status.toString(16) + "."); }
            if (data1 === null) {
                if (state.offset >= trackEnd) { throw new Error("Truncated MIDI channel event."); }
                data1 = bytes[state.offset++];
            }
            data2 = 0;
            if (dataLength === 2) {
                if (state.offset >= trackEnd) { throw new Error("Truncated MIDI channel event."); }
                data2 = bytes[state.offset++];
            }
            channel = status & 15;
            if ((status & 240) === 144 || (status & 240) === 128) {
                pitch = data1;
                velocity = data2;
                key = channel + ":" + pitch;
                activeKey = active[trackIndex][key];
                if ((status & 240) === 144 && velocity > 0) {
                    if (!activeKey) { activeKey = []; active[trackIndex][key] = activeKey; }
                    activeKey.push({ tick: absoluteTick, velocity: velocity });
                } else if (activeKey && activeKey.length > 0) {
                    note = activeKey.shift();
                    key = trackIndex + ":" + channel;
                    lane = laneMap[key];
                    if (!lane) {
                        lane = { id: key, trackIndex: trackIndex, channel: channel, name: "", rawNotes: [], sourceType: "midi" };
                        laneMap[key] = lane;
                        lanes.push(lane);
                    }
                    if (absoluteTick > note.tick) { lane.rawNotes.push({ start: note.tick, end: absoluteTick, midi: pitch, velocity: note.velocity }); }
                }
            }
        }
        offset = trackEnd;
    }
    for (i = 0; i < lanes.length; i += 1) {
        lanes[i].name = (trackNames[lanes[i].trackIndex] || ("Track " + (lanes[i].trackIndex + 1))) + " / Ch " + (lanes[i].channel + 1);
        lanes[i].isPercussion = lanes[i].channel === 9;
        lanes[i].rawNotes.sort(function (a, b) { return a.start - b.start || a.midi - b.midi; });
    }
    timeSignatures.sort(function (a, b) { return a.tick - b.tick; });
    keySignatures.sort(function (a, b) { return a.tick - b.tick; });
    return { type: "midi", format: format, division: division, lanes: lanes, timeSignatures: timeSignatures, keySignatures: keySignatures, warnings: [] };
}
function keyFifthsAtMidiTick(document, tick) {
    var fifths = 0;
    var i;
    for (i = 0; i < document.keySignatures.length; i += 1) {
        if (document.keySignatures[i].tick > tick) { break; }
        fifths = document.keySignatures[i].fifths;
    }
    return fifths;
}
function midiPitchToSpelledPitch(midi, fifths) {
    var sharpNames = [["C",0],["C",1],["D",0],["D",1],["E",0],["F",0],["F",1],["G",0],["G",1],["A",0],["A",1],["B",0]];
    var flatNames = [["C",0],["D",-1],["D",0],["E",-1],["E",0],["F",0],["G",-1],["G",0],["A",-1],["A",0],["B",-1],["B",0]];
    var pitchClass = ((midi % 12) + 12) % 12;
    var item = fifths < 0 ? flatNames[pitchClass] : sharpNames[pitchClass];
    return { step: item[0], alter: item[1], octave: Math.floor(midi / 12) - 1, midi: midi };
}
function normalizedMidiTimeSignatureChanges(document) {
    var result = [];
    var i;
    var source;
    var signature;
    var tick;
    var last;
    for (i = 0; i < document.timeSignatures.length; i += 1) {
        source = document.timeSignatures[i];
        signature = normalizeTimeSignature(source.numerator, source.denominator);
        if (!signature) {
            throw new Error("Unsupported MIDI time signature " + source.numerator + "/" + source.denominator + " at tick " + source.tick + ". Supported denominators are 2, 4, 8, and 16; numerator must be 1-32.");
        }
        tick = Math.round(source.tick * TICKS_PER_QUARTER / document.division);
        last = result.length > 0 ? result[result.length - 1] : null;
        if (last && last.tick === tick) {
            if (!timeSignatureEquals(last.signature, signature)) {
                throw new Error("MIDI contains conflicting time signatures at tick " + source.tick + ".");
            }
            continue;
        }
        if (last && timeSignatureEquals(last.signature, signature)) { continue; }
        result.push({ tick: tick, signature: signature });
    }
    if (result.length === 0 || result[0].tick > 0) {
        result.unshift({ tick: 0, signature: cloneTimeSignature(DEFAULT_TIME_SIGNATURE) });
    }
    return result;
}
function buildMidiMeasureMap(document, maxEnd) {
    var changes = normalizedMidiTimeSignatureChanges(document);
    var result = [];
    var changeIndex = 0;
    var start = 0;
    var end;
    var signature = cloneTimeSignature(DEFAULT_TIME_SIGNATURE);
    var change;
    var nextChange;
    var limit = Math.max(1, IMPORT_MAX_MEASURES + 1);
    while (result.length === 0 || start < maxEnd) {
        while (changeIndex < changes.length && changes[changeIndex].tick < start) {
            throw new Error("MIDI time signature change at tick " + changes[changeIndex].tick + " is not aligned to a measure boundary.");
        }
        if (changeIndex < changes.length && changes[changeIndex].tick === start) {
            signature = cloneTimeSignature(changes[changeIndex].signature);
            changeIndex += 1;
        }
        end = start + timeSignatureTicks(signature);
        nextChange = changeIndex < changes.length ? changes[changeIndex] : null;
        if (nextChange && nextChange.tick < end && nextChange.tick < maxEnd) {
            throw new Error("MIDI time signature change at tick " + nextChange.tick + " is not aligned to a measure boundary. The current importer supports changes between measures only.");
        }
        result.push({ index: result.length, start: start, end: end, timeSignature: cloneTimeSignature(signature) });
        start = end;
        if (result.length > limit) {
            throw new Error("Import contains more than " + IMPORT_MAX_MEASURES + " measures. The current importer supports up to " + IMPORT_MAX_MEASURES + " measures per generated staff.");
        }
    }
    return result;
}
function midiMeasureIndexForTick(measureMap, tick) {
    var i;
    for (i = 0; i < measureMap.length; i += 1) {
        if (tick >= measureMap[i].start && tick < measureMap[i].end) { return i; }
    }
    return -1;
}
function quantizeMidiLane(document, lane) {
    var result = [];
    var i;
    var raw;
    var start;
    var end;
    for (i = 0; i < lane.rawNotes.length; i += 1) {
        raw = lane.rawNotes[i];
        start = Math.round((raw.start * TICKS_PER_QUARTER / document.division) / IMPORT_GRID_TICKS) * IMPORT_GRID_TICKS;
        end = Math.round((raw.end * TICKS_PER_QUARTER / document.division) / IMPORT_GRID_TICKS) * IMPORT_GRID_TICKS;
        if (end <= start) { end = start + IMPORT_GRID_TICKS; }
        result.push({ start: start, end: end, pitch: midiPitchToSpelledPitch(raw.midi, keyFifthsAtMidiTick(document, raw.start)) });
    }
    result.sort(function (a, b) { return a.start - b.start || a.pitch.midi - b.pitch.midi; });
    return result;
}
function importXmlDecode(text) {
    return String(text || "").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&").replace(/&#(x[0-9a-fA-F]+|[0-9]+);/g, function (match, value) {
        var number = value.charAt(0).toLowerCase() === "x" ? parseInt(value.substr(1), 16) : parseInt(value, 10);
        return isNaN(number) ? match : String.fromCharCode(number);
    });
}
function importXmlName(name) {
    var colon = name.indexOf(":");
    return colon >= 0 ? name.substr(colon + 1) : name;
}
function parseImportXml(text) {
    var source = String(text || "").replace(/^\uFEFF/, "");
    var root = { name: "#document", attrs: {}, children: [], text: "" };
    var stack = [root];
    var tokenRe = /<!--[\s\S]*?-->|<\?[^>]*\?>|<!\[CDATA\[[\s\S]*?\]\]>|<!DOCTYPE[\s\S]*?>|<[^>]+>|[^<]+/g;
    var token;
    var node;
    var closing;
    var selfClosing;
    var inside;
    var nameMatch;
    var attrRe;
    var attrMatch;
    while ((token = tokenRe.exec(source)) !== null) {
        token = token[0];
        if (token.indexOf("<!--") === 0 || token.indexOf("<?") === 0 || token.indexOf("<!DOCTYPE") === 0) { continue; }
        if (token.indexOf("<![CDATA[") === 0) {
            stack[stack.length - 1].text += token.substring(9, token.length - 3);
            continue;
        }
        if (token.charAt(0) !== "<") {
            stack[stack.length - 1].text += importXmlDecode(token);
            continue;
        }
        closing = /^<\//.test(token);
        if (closing) {
            if (stack.length <= 1) { throw new Error("Malformed MusicXML: unexpected closing tag."); }
            stack.pop();
            continue;
        }
        if (/^<!/.test(token)) { continue; }
        selfClosing = /\/\s*>$/.test(token);
        inside = token.substring(1, token.length - (selfClosing ? 2 : 1));
        nameMatch = /^\s*([^\s\/>]+)/.exec(inside);
        if (!nameMatch) { continue; }
        node = { name: importXmlName(nameMatch[1]), attrs: {}, children: [], text: "" };
        attrRe = /([^\s=]+)\s*=\s*("[^"]*"|'[^']*')/g;
        while ((attrMatch = attrRe.exec(inside)) !== null) {
            node.attrs[importXmlName(attrMatch[1])] = importXmlDecode(attrMatch[2].substring(1, attrMatch[2].length - 1));
        }
        stack[stack.length - 1].children.push(node);
        if (!selfClosing) { stack.push(node); }
    }
    if (stack.length !== 1 || root.children.length === 0) { throw new Error("Malformed or empty MusicXML file."); }
    return root.children[0];
}
function xmlChildren(node, name) {
    var result = [];
    var i;
    if (!node || !node.children) { return result; }
    for (i = 0; i < node.children.length; i += 1) { if (node.children[i].name === name) { result.push(node.children[i]); } }
    return result;
}
function xmlChild(node, name) {
    var children = xmlChildren(node, name);
    return children.length > 0 ? children[0] : null;
}
function xmlText(node, name, fallback) {
    var child = name ? xmlChild(node, name) : node;
    var value;
    if (!child) { return fallback; }
    value = trimString(child.text || "");
    return value === "" ? fallback : value;
}
function xmlNumber(node, name, fallback) {
    var value = parseFloat(xmlText(node, name, ""));
    return isNaN(value) ? fallback : value;
}
function applyMusicXmlAttributes(attributes, state, measureNumber) {
    var timeNode;
    var beatsText;
    var beatTypeText;
    var signature;
    var clefs;
    var i;
    var clef;
    state.divisions = xmlNumber(attributes, "divisions", state.divisions);
    if (state.divisions <= 0) {
        throw new Error("MusicXML divisions must be positive (measure " + measureNumber + ").");
    }
    timeNode = xmlChild(attributes, "time");
    if (timeNode) {
        beatsText = xmlText(timeNode, "beats", null);
        beatTypeText = xmlText(timeNode, "beat-type", null);
        if (!/^\d+$/.test(trimString(beatsText || "")) || !/^\d+$/.test(trimString(beatTypeText || ""))) {
            throw new Error("Unsupported MusicXML time signature at measure " + measureNumber + ". Only numeric simple meters are supported.");
        }
        signature = normalizeTimeSignature(parseInt(beatsText, 10), parseInt(beatTypeText, 10));
        if (!signature) {
            throw new Error("Unsupported MusicXML time signature " + beatsText + "/" + beatTypeText + " at measure " + measureNumber + ". Supported denominators are 2, 4, 8, and 16; numerator must be 1-32.");
        }
        state.beats = signature.numerator;
        state.beatType = signature.denominator;
        state.timeSignature = signature;
    }
    clefs = xmlChildren(attributes, "clef");
    for (i = 0; i < clefs.length; i += 1) {
        clef = xmlText(clefs[i], "sign", "G") + xmlText(clefs[i], "line", "2");
        state.clefByStaff[clefs[i].attrs.number || "1"] = clef;
    }
}
function musicXmlPartNames(root) {
    var map = {};
    var partList = xmlChild(root, "part-list");
    var parts = xmlChildren(partList, "score-part");
    var i;
    for (i = 0; i < parts.length; i += 1) { map[parts[i].attrs.id || ("P" + (i + 1))] = xmlText(parts[i], "part-name", "Part " + (i + 1)); }
    return map;
}
function musicXmlPartwiseMeasures(root) {
    var result = [];
    var parts = xmlChildren(root, "part");
    var names = musicXmlPartNames(root);
    var i;
    for (i = 0; i < parts.length; i += 1) { result.push({ id: parts[i].attrs.id || ("P" + (i + 1)), name: names[parts[i].attrs.id] || ("Part " + (i + 1)), measures: xmlChildren(parts[i], "measure") }); }
    return result;
}
function musicXmlTimewiseMeasures(root) {
    var names = musicXmlPartNames(root);
    var measures = xmlChildren(root, "measure");
    var map = {};
    var order = [];
    var i;
    var j;
    var parts;
    var id;
    for (i = 0; i < measures.length; i += 1) {
        parts = xmlChildren(measures[i], "part");
        for (j = 0; j < parts.length; j += 1) {
            id = parts[j].attrs.id || ("P" + (j + 1));
            if (!map[id]) { map[id] = { id: id, name: names[id] || id, measures: [] }; order.push(id); }
            map[id].measures.push(parts[j]);
        }
    }
    parts = [];
    for (i = 0; i < order.length; i += 1) { parts.push(map[order[i]]); }
    return parts;
}
function musicXmlTypeToNoteValue(sourceType) {
    var value = trimString(sourceType || "").toLowerCase();
    if (value === "16th" || value === "sixteenth") {
        return "sixteenth";
    }
    if (value === "whole" || value === "half" || value === "quarter" || value === "eighth") {
        return value;
    }
    return null;
}
function musicXmlNoteLocation(measureNumber, staff, voice) {
    return "measure " + measureNumber + " / Staff " + staff + " / Voice " + voice;
}
function parseMusicXmlText(text) {
    var root = parseImportXml(text);
    var parts;
    var lanes = [];
    var laneMap = {};
    var p;
    var m;
    var i;
    var part;
    var measure;
    var state;
    var cursor;
    var previousStartByLane;
    var lastNoteRecord;
    var sourceOrder;
    var child;
    var duration;
    var voice;
    var staff;
    var laneKey;
    var lane;
    var pitchNode;
    var step;
    var alter;
    var octave;
    var isChord;
    var startTicks;
    var durationTicks;
    var beams;
    var b;
    var sourceType;
    var sourceDots;
    var chordBaseKey;
    var chordBaseOrder;
    var notationNode;
    var measureNumber;
    var record;
    var bi;
    var partMeasureSignatures;
    var measureSignature;
    var laneIndex;
    if (root.name !== "score-partwise" && root.name !== "score-timewise") { throw new Error("Unsupported MusicXML root: " + root.name + "."); }
    parts = root.name === "score-partwise" ? musicXmlPartwiseMeasures(root) : musicXmlTimewiseMeasures(root);
    for (p = 0; p < parts.length; p += 1) {
        part = parts[p];
        state = { divisions: 1, beats: 4, beatType: 4, timeSignature: cloneTimeSignature(DEFAULT_TIME_SIGNATURE), clefByStaff: { "1": "G2" } };
        partMeasureSignatures = [];
        for (m = 0; m < part.measures.length; m += 1) {
            measure = part.measures[m];
            measureNumber = measure.attrs.number || String(m + 1);
            for (b = 0; b < measure.children.length; b += 1) {
                if (measure.children[b].name === "attributes") {
                    applyMusicXmlAttributes(measure.children[b], state, measureNumber);
                }
            }
            measureSignature = cloneTimeSignature(state.timeSignature || { numerator: state.beats, denominator: state.beatType });
            partMeasureSignatures[m] = measureSignature;
            cursor = 0;
            previousStartByLane = {};
            lastNoteRecord = null;
            sourceOrder = 0;
            for (i = 0; i < measure.children.length; i += 1) {
                child = measure.children[i];
                if (child.name === "attributes") {
                    continue;
                }
                if (child.name === "backup") { cursor -= xmlNumber(child, "duration", 0); if (cursor < 0) { cursor = 0; } continue; }
                if (child.name === "forward") { cursor += xmlNumber(child, "duration", 0); continue; }
                if (child.name !== "note") { continue; }
                sourceOrder += 1;
                voice = xmlText(child, "voice", "1");
                staff = xmlText(child, "staff", "1");
                if (xmlChild(child, "grace") || xmlChild(child, "cue")) {
                    throw new Error("Grace and cue notes are not supported yet (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                }
                if (xmlChild(child, "time-modification") || xmlChild(xmlChild(child, "notations"), "tuplet")) {
                    throw new Error("Tuplets are not supported yet (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                }
                notationNode = xmlChild(child, "notations");
                if (xmlChild(child, "tie") || xmlChild(notationNode, "tied") || xmlChild(notationNode, "slur")) {
                    throw new Error("Tie / Slur notation is not supported yet (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                }
                duration = xmlNumber(child, "duration", 0);
                if (duration <= 0 || state.divisions <= 0) {
                    throw new Error("MusicXML note duration is missing or invalid (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                }
                laneKey = part.id + "|" + staff + "|" + voice;
                lane = laneMap[laneKey];
                if (!lane) {
                    lane = { id: laneKey, name: part.name + " / Staff " + staff + " / Voice " + voice, sourceType: "musicxml", partId: part.id, staff: staff, voice: voice, measureCount: part.measures.length, divisions: state.divisions, timeSignature: { numerator: measureSignature.numerator, denominator: measureSignature.denominator }, measureSignatures: partMeasureSignatures.slice(0), events: [], clef: state.clefByStaff[staff] || "G2", clefByMeasure: [], timeSignatureValid: true };
                    laneMap[laneKey] = lane;
                    lanes.push(lane);
                }
                lane.measureCount = Math.max(lane.measureCount || 0, m + 1);
                lane.divisions = state.divisions;
                lane.timeSignature = { numerator: measureSignature.numerator, denominator: measureSignature.denominator };
                lane.measureSignatures[m] = cloneTimeSignature(measureSignature);
                lane.clefByMeasure[m] = state.clefByStaff[staff] || "G2";
                if ((state.clefByStaff[staff] || "G2") !== "G2") { lane.clef = state.clefByStaff[staff] || "G2"; }
                isChord = !!xmlChild(child, "chord");
                chordBaseKey = lastNoteRecord ? lastNoteRecord.laneKey : null;
                chordBaseOrder = lastNoteRecord ? lastNoteRecord.sourceOrder : -1;
                startTicks = Math.round(((isChord && previousStartByLane[laneKey] !== undefined ? previousStartByLane[laneKey] : cursor) / state.divisions) * TICKS_PER_QUARTER);
                durationTicks = Math.round((duration / state.divisions) * TICKS_PER_QUARTER);
                sourceType = xmlText(child, "type", null);
                sourceDots = xmlChildren(child, "dot").length;
                if (sourceDots > 1) {
                    throw new Error("Double-dotted values are not supported yet (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                }
                beams = xmlChildren(child, "beam");
                b = null;
                for (bi = 0; bi < beams.length; bi += 1) { if (!beams[bi].attrs.number || beams[bi].attrs.number === "1") { b = trimString(beams[bi].text || "").toLowerCase(); break; } }
                record = { measure: m, measureNumber: measureNumber, start: startTicks, duration: durationTicks, sourceDuration: duration, sourceDivisions: state.divisions, sourceType: sourceType, sourceDots: sourceDots, beam: b, laneKey: laneKey, sourceOrder: sourceOrder, sourceChildOrder: i, chordContinuation: isChord, chordBaseKey: chordBaseKey, chordBaseOrder: chordBaseOrder, chordBaseChildOrder: lastNoteRecord ? lastNoteRecord.sourceChildOrder : -1, sourceStaff: staff, sourceVoice: voice };
                if (xmlChild(child, "rest")) {
                    if (isChord) {
                        throw new Error("A <chord/> continuation cannot be a rest (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                    }
                    record.rest = true;
                } else {
                    pitchNode = xmlChild(child, "pitch");
                    if (!pitchNode) {
                        throw new Error("Unpitched notes are not supported yet (" + musicXmlNoteLocation(measureNumber, staff, voice) + ").");
                    }
                    step = xmlText(pitchNode, "step", "C").toUpperCase();
                    alter = xmlNumber(pitchNode, "alter", 0);
                    octave = parseInt(xmlText(pitchNode, "octave", "4"), 10);
                    record.rest = false;
                    record.pitch = { step: step, alter: alter, octave: octave, midi: pitchToMidi({ step: step, alter: alter, octave: octave }) };
                }
                lane.events.push(record);
                if (!isChord) { previousStartByLane[laneKey] = cursor; }
                lastNoteRecord = record;
                if (!isChord) { cursor += duration; }
            }
            for (laneIndex = 0; laneIndex < lanes.length; laneIndex += 1) {
                if (lanes[laneIndex].partId === part.id) {
                    lanes[laneIndex].measureSignatures[m] = cloneTimeSignature(measureSignature);
                    lanes[laneIndex].measureCount = part.measures.length;
                    lanes[laneIndex].clefByMeasure[m] = state.clefByStaff[lanes[laneIndex].staff] || "G2";
                    lanes[laneIndex].timeSignature = { numerator: measureSignature.numerator, denominator: measureSignature.denominator };
                }
            }
        }
    }
    return { type: "musicxml", format: root.name, lanes: lanes, warnings: [] };
}
function durationSpecForImport(ticks) {
    var i;
    var spec;
    for (i = 0; i < IMPORT_DURATION_TABLE.length; i += 1) {
        spec = IMPORT_DURATION_TABLE[i];
        if (spec.ticks === ticks) {
            return { ticks: spec.ticks, noteValue: spec.noteValue, dots: spec.dots };
        }
    }
    return null;
}
function importItemLocation(item) {
    var measure = item && item.measureNumber !== undefined ? item.measureNumber : (item ? item.measure + 1 : "?");
    var staff = item && item.sourceStaff !== undefined ? item.sourceStaff : "1";
    var voice = item && item.sourceVoice !== undefined ? item.sourceVoice : "1";
    return musicXmlNoteLocation(measure, staff, voice);
}
function importDurationSpec(item) {
    var sourceType = item ? trimString(item.sourceType || "") : "";
    var sourceDots = item && item.sourceDots !== undefined ? item.sourceDots : 0;
    var noteValue;
    var expected;
    var actual;
    var spec;
    if (sourceType !== "") {
        noteValue = musicXmlTypeToNoteValue(sourceType);
        if (!noteValue) {
            throw new Error("Unsupported MusicXML note type '" + sourceType + "' at " + importItemLocation(item) + ". 32nd notes and other smaller values are not supported yet.");
        }
        expected = durationTicksForValue(noteValue, sourceDots);
        actual = item.duration;
        if (expected === null || actual !== expected) {
            throw new Error("MusicXML duration mismatch at " + importItemLocation(item) + ": <type>" + sourceType + "</type> with " + sourceDots + " dot(s) expects " + expected + " ticks, but <duration>" + item.sourceDuration + "</duration> converts to " + actual + " ticks.");
        }
        return { ticks: actual, noteValue: noteValue, dots: sourceDots };
    }
    spec = durationSpecForImport(item.duration);
    if (!spec) {
        throw new Error("Unsupported note/rest duration " + item.duration + " ticks at measure " + (item.measure + 1) + ". Supported values are whole, half, quarter, eighth, sixteenth, and their single-dotted half/quarter/eighth forms.");
    }
    if (sourceDots > 0 && spec.dots !== sourceDots) {
        throw new Error("MusicXML duration mismatch at " + importItemLocation(item) + ": <dot/> count is " + sourceDots + " but " + item.duration + " ticks map to " + spec.noteValue + " with " + spec.dots + " dot(s).");
    }
    return spec;
}
function copyImportPitch(pitch) {
    return {
        step: pitch.step,
        alter: pitch.alter,
        octave: pitch.octave,
        midi: pitch.midi,
        notation: { accidental: null }
    };
}
function copyImportPitches(pitches) {
    var result = [];
    var i;
    for (i = 0; i < pitches.length; i += 1) {
        result.push(copyImportPitch(pitches[i]));
    }
    return result;
}
function unsupportedPolyphonyError(measure, detail) {
    return new Error("Unsupported polyphony in measure " + measure + ": " + detail + " Simple simultaneous chords are supported.");
}
function normalizeMusicXmlLaneEvents(events) {
    var result = [];
    var previousSource = null;
    var lastEvent = null;
    var item;
    var normalized;
    var pitch;
    var location;
    var sourceType;
    var sourceDots;
    var j;
    for (j = 0; j < events.length; j += 1) {
        item = events[j];
        location = importItemLocation(item);
        if (item.chordContinuation) {
            if (!previousSource || item.chordBaseKey !== item.laneKey || item.chordBaseOrder !== previousSource.sourceOrder || item.sourceOrder !== previousSource.sourceOrder + 1 || item.chordBaseChildOrder !== previousSource.sourceChildOrder || item.sourceChildOrder !== previousSource.sourceChildOrder + 1) {
                throw new Error("Unsupported MusicXML chord at " + location + ": the <chord/> member does not immediately follow a base note in the same Staff / Voice.");
            }
            if (!lastEvent || lastEvent.rest || lastEvent.measure !== item.measure || lastEvent.start !== item.start || lastEvent.duration !== item.duration) {
                throw new Error("Unsupported MusicXML chord at " + location + ": the chord member has no matching base note with the same start and duration.");
            }
            sourceType = lastEvent.sourceType || "";
            sourceDots = lastEvent.sourceDots || 0;
            if (sourceType !== (item.sourceType || "") || sourceDots !== (item.sourceDots || 0)) {
                throw new Error("Unsupported MusicXML chord at " + location + ": chord members use different duration types or dot counts.");
            }
            if (!item.pitch) {
                throw new Error("Unsupported MusicXML chord at " + location + ": chord member has no pitched note.");
            }
            pitch = copyImportPitch(item.pitch);
            if (!lastEvent.pitches) {
                lastEvent.pitches = [copyImportPitch(lastEvent.pitch)];
                lastEvent.pitch = null;
                lastEvent.type = "chord";
            }
            lastEvent.pitches.push(pitch);
        } else {
            normalized = {
                type: item.rest ? "rest" : "note",
                measure: item.measure,
                measureNumber: item.measureNumber,
                start: item.start,
                duration: item.duration,
                sourceDuration: item.sourceDuration,
                sourceDivisions: item.sourceDivisions,
                sourceType: item.sourceType,
                sourceDots: item.sourceDots || 0,
                beam: item.beam,
                laneKey: item.laneKey,
                sourceStaff: item.sourceStaff,
                sourceVoice: item.sourceVoice,
                rest: !!item.rest
            };
            if (!normalized.rest) {
                if (!item.pitch) {
                    throw new Error("Unsupported MusicXML note at " + location + ": no pitched note data was found.");
                }
                normalized.pitch = copyImportPitch(item.pitch);
            }
            result.push(normalized);
            lastEvent = normalized;
        }
        previousSource = item;
    }
    return result;
}
function midiDurationFragments(duration) {
    var result = [];
    var remaining = duration;
    var i;
    var spec;
    while (remaining > 0) {
        spec = null;
        for (i = 0; i < IMPORT_DURATION_TABLE.length; i += 1) {
            if (IMPORT_DURATION_TABLE[i].ticks <= remaining) {
                spec = IMPORT_DURATION_TABLE[i];
                break;
            }
        }
        if (!spec) {
            return null;
        }
        result.push({ ticks: spec.ticks, noteValue: spec.noteValue, dots: spec.dots });
        remaining -= spec.ticks;
    }
    return result;
}
function appendMidiNoteSegments(result, measureMap, measureIndex, start, end, pitches, tieSerial) {
    var fragments = [];
    var cursor = start;
    var currentMeasure = measureIndex;
    var segmentEnd;
    var localStart;
    var segmentDuration;
    var durationFragments;
    var fragmentIndex;
    var durationIndex;
    var duration;
    var fragment;
    var tieGroupId;
    while (cursor < end) {
        if (!measureMap[currentMeasure]) {
            throw new Error("An imported MIDI note extends beyond the calculated measure map.");
        }
        segmentEnd = Math.min(end, measureMap[currentMeasure].end);
        segmentDuration = segmentEnd - cursor;
        if (segmentDuration <= 0) {
            currentMeasure += 1;
            continue;
        }
        durationFragments = midiDurationFragments(segmentDuration);
        if (!durationFragments) {
            throw new Error("A MIDI note crossing a barline cannot be represented on the 1/16-note grid without changing its duration.");
        }
        localStart = cursor - measureMap[currentMeasure].start;
        for (durationIndex = 0; durationIndex < durationFragments.length; durationIndex += 1) {
            duration = durationFragments[durationIndex];
            fragment = {
                type: pitches.length > 1 ? "chord" : "note",
                measure: currentMeasure,
                start: localStart,
                duration: duration.ticks,
                rest: false,
                pitch: pitches.length === 1 ? copyImportPitch(pitches[0]) : null,
                pitches: pitches.length > 1 ? copyImportPitches(pitches) : null,
                beam: null
            };
            fragments.push(fragment);
            localStart += duration.ticks;
        }
        cursor = segmentEnd;
        currentMeasure += 1;
    }
    if (fragments.length > 1) {
        tieGroupId = "midi-tie-" + tieSerial;
        for (fragmentIndex = 0; fragmentIndex < fragments.length; fragmentIndex += 1) {
            fragments[fragmentIndex].tieGroupId = tieGroupId;
            fragments[fragmentIndex].tieIndex = fragmentIndex;
            fragments[fragmentIndex].tieStart = fragmentIndex < fragments.length - 1;
            fragments[fragmentIndex].tieStop = fragmentIndex > 0;
        }
    }
    for (fragmentIndex = 0; fragmentIndex < fragments.length; fragmentIndex += 1) {
        result.push(fragments[fragmentIndex]);
    }
}
function normalizeMidiLaneEvents(notes, measureMap) {
    var result = [];
    var i = 0;
    var j;
    var start;
    var end;
    var measureIndex;
    var pitches;
    var tieSerial = 0;
    while (i < notes.length) {
        start = notes[i].start;
        end = notes[i].end;
        measureIndex = midiMeasureIndexForTick(measureMap, start);
        if (measureIndex < 0) { throw new Error("An imported MIDI event falls outside the calculated measure map at tick " + start + "."); }
        j = i + 1;
        while (j < notes.length && notes[j].start === start) {
            if (notes[j].end !== end) {
                throw unsupportedPolyphonyError(measureIndex + 1, "simultaneous notes have different durations or end times.");
            }
            j += 1;
        }
        pitches = [];
        while (i < j) {
            pitches.push(copyImportPitch(notes[i].pitch));
            i += 1;
        }
        appendMidiNoteSegments(result, measureMap, measureIndex, start, end, pitches, tieSerial);
        tieSerial += 1;
    }
    return result;
}
function appendImportRestEvents(target, startTick, durationTicks) {
    var remaining = durationTicks;
    var cursor = startTick;
    var values = [1920, 960, 480, 240, 120];
    var i;
    var value;
    var spec;
    for (i = 0; i < values.length; i += 1) {
        value = values[i];
        while (remaining >= value) {
            spec = durationSpecForImport(value);
            target.push({ type: "rest", startTicks: cursor, durationTicks: value, noteValue: spec.noteValue, dots: 0, notation: { accidental: null, beamRole: null, beamGroupId: null } });
            cursor += value;
            remaining -= value;
        }
    }
    if (remaining !== 0) { throw new Error("A rest could not be represented on the 1/16-note grid."); }
}
function applyImportedAccidentalsAndBeams(score, preserveXmlBeams, beamEnabled) {
    var m;
    var measure;
    var accidentalState;
    var i;
    var event;
    var stateKey;
    var currentAlter;
    var nextGroupId;
    var activeGroup = null;
    var beam;
    var pitches;
    var pitchIndex;
    var pitch;
    var accidental;
    for (m = 0; m < score.measures.length; m += 1) {
        measure = score.measures[m];
        accidentalState = {};
        nextGroupId = 0;
        activeGroup = null;
        for (i = 0; i < measure.events.length; i += 1) {
            event = measure.events[i];
            if (isPitchedEvent(event)) {
                pitches = eventPitchList(event);
                for (pitchIndex = 0; pitchIndex < pitches.length; pitchIndex += 1) {
                    pitch = pitches[pitchIndex];
                    if (!pitch.notation) { pitch.notation = { accidental: null }; }
                    stateKey = accidentalStateKey(pitch);
                    currentAlter = own(accidentalState, stateKey) ? accidentalState[stateKey] : 0;
                    accidental = pitch.alter === currentAlter ? null : (pitch.alter === 1 ? "sharp" : (pitch.alter === -1 ? "flat" : "natural"));
                    pitch.notation.accidental = accidental;
                    if (event.type === "note") { event.notation.accidental = accidental; }
                    accidentalState[stateKey] = pitch.alter;
                }
            }
        }
        if (!preserveXmlBeams) { assignBeamGroups(measure, beamEnabled); continue; }
        for (i = 0; i < measure.events.length; i += 1) {
            event = measure.events[i];
            beam = event.importBeam;
            if (!isPitchedEvent(event) || (eventBaseNoteValue(event) !== "eighth" && eventBaseNoteValue(event) !== "sixteenth") || !beam) { activeGroup = null; continue; }
            if (beam === "begin") { nextGroupId += 1; activeGroup = nextGroupId; }
            if (activeGroup !== null) {
                event.beamGroupId = activeGroup;
                event.notation.beamGroupId = activeGroup;
            }
            if (beam === "end") { activeGroup = null; }
        }
        for (i = 0; i < measure.events.length; i += 1) {
            event = measure.events[i];
            if (event.beamGroupId) {
                var groupEvents = [];
                var j;
                for (j = 0; j < measure.events.length; j += 1) { if (measure.events[j].beamGroupId === event.beamGroupId) { groupEvents.push(measure.events[j]); } }
                for (j = 0; j < groupEvents.length; j += 1) {
                    groupEvents[j].beamRole = j === 0 ? "begin" : (j === groupEvents.length - 1 ? "end" : "continue");
                    groupEvents[j].beamLevel = eventBaseNoteValue(groupEvents[j]) === "sixteenth" ? 2 : 1;
                    groupEvents[j].notation.beamRole = groupEvents[j].beamRole;
                    groupEvents[j].notation.beamLevel = groupEvents[j].beamLevel;
                }
            }
        }
    }
}
function importEventsToScore(events, measureCount, sourceType, settings, measureSignatures) {
    var firstTimeSignature = measureSignatures && measureSignatures.length ? cloneTimeSignature(measureSignatures[0]) : cloneTimeSignature(DEFAULT_TIME_SIGNATURE);
    var score = { version: SCORE_VERSION, timeSignature: firstTimeSignature, clef: "treble", key: { tonic: "C", mode: "major" }, ticksPerQuarter: TICKS_PER_QUARTER, measures: [], importSource: sourceType, seeds: { masterSeed: "import", pitchSeed: "import", rhythmSeed: "import", symbolSeed: "import" } };
    var m;
    var measureEvents;
    var cursor;
    var i;
    var item;
    var localStart;
    var durationSpec;
    var event;
    var previousEnd;
    var pitches;
    var pitchIndex;
    var pitch;
    var copiedPitch;
    var eventType;
    var timeSignature;
    var measureTicks;
    if (measureCount < 1) { measureCount = 1; }
    if (measureCount > IMPORT_MAX_MEASURES) { throw new Error("Import contains " + measureCount + " measures. The current importer supports up to " + IMPORT_MAX_MEASURES + " measures per generated staff."); }
    for (m = 0; m < measureCount; m += 1) {
        measureEvents = [];
        for (i = 0; i < events.length; i += 1) { if (events[i].measure === m) { measureEvents.push(events[i]); } }
        measureEvents.sort(function (a, b) { return a.start - b.start || (a.rest ? 1 : -1); });
        timeSignature = cloneTimeSignature(measureSignatures && measureSignatures[m] ? measureSignatures[m] : (m === 0 ? firstTimeSignature : score.timeSignature));
        measureTicks = timeSignatureTicks(timeSignature);
        cursor = 0;
        previousEnd = 0;
        score.measures.push({ number: m + 1, events: [], tickTotal: measureTicks, timeSignature: timeSignature });
        for (i = 0; i < measureEvents.length; i += 1) {
            item = measureEvents[i];
            localStart = item.start;
            if (localStart < previousEnd) {
                throw unsupportedPolyphonyError(m + 1, "notes overlap with different start/end times" + (sourceType === "musicxml" ? " at " + importItemLocation(item) + "." : "."));
            }
            if (localStart < 0 || localStart >= measureTicks) {
                if (sourceType === "musicxml") {
                    throw new Error("MusicXML measure " + (item.measureNumber || (m + 1)) + " contains content outside its declared " + timeSignatureLabel(timeSignature) + " span at " + importItemLocation(item) + " (event starts at " + localStart + " ticks). The source must be corrected; no notes were discarded.");
                }
                throw new Error("An imported event falls outside measure " + (m + 1) + ".");
            }
            if (localStart > cursor) { appendImportRestEvents(score.measures[m].events, cursor, localStart - cursor); }
            durationSpec = importDurationSpec(item);
            if (localStart + durationSpec.ticks > measureTicks) {
                if (sourceType === "musicxml") {
                    throw new Error("MusicXML measure " + (item.measureNumber || (m + 1)) + " contains a note crossing its declared " + timeSignatureLabel(timeSignature) + " barline at " + importItemLocation(item) + ". The source must be corrected; ties across barlines are not supported yet.");
                }
                throw new Error("A note crosses a barline in measure " + (m + 1) + ". Ties across barlines are not supported yet.");
            }
            pitches = item.pitches && item.pitches.length ? item.pitches : (item.pitch ? [item.pitch] : []);
            eventType = item.rest ? "rest" : (pitches.length > 1 ? "chord" : "note");
            if (!item.rest && pitches.length === 0) { throw new Error("Imported note has no pitch at measure " + (m + 1) + "."); }
            if (eventType === "chord" && pitches.length < 2) { throw new Error("Chord at measure " + (m + 1) + " must contain at least two pitches."); }
            event = { type: eventType, startTicks: localStart, durationTicks: durationSpec.ticks, noteValue: durationSpec.noteValue, dots: durationSpec.dots, notation: { accidental: null, beamRole: null, beamGroupId: null }, importBeam: item.beam || null };
            if (item.tieGroupId !== undefined && item.tieGroupId !== null) {
                event.tieGroupId = item.tieGroupId;
                event.tieIndex = item.tieIndex;
                event.tieStart = item.tieStart === true;
                event.tieStop = item.tieStop === true;
            }
            if (!item.rest) {
                if (eventType === "chord") { event.pitches = []; }
                for (pitchIndex = 0; pitchIndex < pitches.length; pitchIndex += 1) {
                    pitch = pitches[pitchIndex];
                    if (!pitch || !own(STEP_INDEX, pitch.step) || !isFiniteNumber(pitch.alter) || pitch.alter < -1 || pitch.alter > 1 || !isFiniteNumber(pitch.octave)) { throw new Error("Unsupported imported pitch spelling at measure " + (m + 1) + ". Double sharps/flats are not supported yet."); }
                    copiedPitch = copyImportPitch(pitch);
                    if (eventType === "chord") { event.pitches.push(copiedPitch); }
                    else { event.pitch = copiedPitch; }
                }
            }
            score.measures[m].events.push(event);
            cursor = localStart + durationSpec.ticks;
            previousEnd = cursor;
        }
        if (cursor < measureTicks) { appendImportRestEvents(score.measures[m].events, cursor, measureTicks - cursor); }
    }
    applyImportedAccidentalsAndBeams(score, sourceType === "musicxml", settings ? settings.beam : true);
    return score;
}
function midiLaneToScore(document, lane, settings) {
    var notes = quantizeMidiLane(document, lane);
    var i;
    var maxEnd = 0;
    var measureMap;
    var events;
    var measureSignatures = [];
    for (i = 0; i < notes.length; i += 1) {
        maxEnd = Math.max(maxEnd, notes[i].end);
    }
    measureMap = buildMidiMeasureMap(document, maxEnd);
    events = normalizeMidiLaneEvents(notes, measureMap);
    for (i = 0; i < measureMap.length; i += 1) { measureSignatures.push(measureMap[i].timeSignature); }
    return importEventsToScore(events, measureMap.length, "midi", settings, measureSignatures);
}
function musicXmlLaneToScore(document, lane, settings) {
    var maxMeasure = 0;
    var events;
    var i;
    var measureCount = Math.max(1, lane.measureCount || 0);
    var measureSignatures = [];
    var sourceSignature;
    var clef;
    events = normalizeMusicXmlLaneEvents(lane.events);
    for (i = 0; i < events.length; i += 1) { maxMeasure = Math.max(maxMeasure, events[i].measure); }
    measureCount = Math.max(measureCount, maxMeasure + 1);
    for (i = 0; i < measureCount; i += 1) {
        sourceSignature = lane.measureSignatures && lane.measureSignatures[i] ? lane.measureSignatures[i] : (i > 0 ? measureSignatures[i - 1] : (lane.timeSignature || DEFAULT_TIME_SIGNATURE));
        sourceSignature = normalizeTimeSignature(sourceSignature.numerator, sourceSignature.denominator, sourceSignature.beatGroups);
        if (!sourceSignature) {
            throw new Error("Unsupported MusicXML time signature at measure " + (i + 1) + ". Supported denominators are 2, 4, 8, and 16; numerator must be 1-32.");
        }
        measureSignatures.push(sourceSignature);
        clef = lane.clefByMeasure && lane.clefByMeasure[i] ? lane.clefByMeasure[i] : lane.clef;
        if (clef && clef !== "G2") {
            throw new Error("The selected MusicXML source uses clef " + clef + " at measure " + (i + 1) + ". The current renderer supports treble clef (G on line 2) only.");
        }
    }
    return importEventsToScore(events, measureCount, "musicxml", settings, measureSignatures);
}
function chooseDefaultImportLane(document) {
    var best = -1;
    var bestCount = -1;
    var i;
    var count;
    for (i = 0; i < document.lanes.length; i += 1) {
        if (document.lanes[i].isPercussion) { continue; }
        count = document.lanes[i].sourceType === "midi" ? document.lanes[i].rawNotes.length : document.lanes[i].events.length;
        if (count > bestCount) { best = i; bestCount = count; }
    }
    if (best < 0 && document.lanes.length > 0) { best = 0; }
    return best;
}
function parseImportFile(file) {
    var extension = importExtension(file.fsName || file.name || "");
    if (!IMPORT_EXTENSIONS[extension]) { throw new Error("Unsupported file type: ." + extension + ". Select .mid, .midi, .musicxml, or .xml."); }
    if (extension === "mxl") { throw new Error("Compressed .mxl MusicXML is not supported yet. Export an uncompressed .musicxml or .xml file from MuseScore."); }
    if (extension === "mid" || extension === "midi") { return parseMidiBytes(readImportBinary(file)); }
    return parseMusicXmlText(readImportText(file));
}
function importDocumentFromPath(pathText) {
    var normalized = normalizeImportPath(pathText);
    var file;
    if (!normalized) { throw new Error("Choose a MIDI or MusicXML file, or enter its path manually."); }
    file = new File(normalized);
    if (!file.exists) { throw new Error("File not found: " + normalized); }
    return { file: file, document: parseImportFile(file) };
}
function importedScorePitchBounds(score) {
    var low = 127;
    var high = 0;
    var found = false;
    var m;
    var i;
    var event;
    for (m = 0; m < score.measures.length; m += 1) {
        for (i = 0; i < score.measures[m].events.length; i += 1) {
            event = score.measures[m].events[i];
            if (isPitchedEvent(event)) {
                var pitches = eventPitchList(event);
                var pitchIndex;
                for (pitchIndex = 0; pitchIndex < pitches.length; pitchIndex += 1) {
                    low = Math.min(low, pitches[pitchIndex].midi);
                    high = Math.max(high, pitches[pitchIndex].midi);
                    found = true;
                }
            }
        }
    }
    return found ? { low: low, high: high } : { low: 60, high: 72 };
}
function fitImportedScoreSettings(score, settings) {
    var fitted = copySettings(settings);
    var minimumLength;
    var previous;
    var bounds = importedScorePitchBounds(score);
    fitted.measures = score.measures.length;
    fitted.pitchLowMidi = bounds.low;
    fitted.pitchHighMidi = bounds.high;
    fitted.accidentals = true;
    minimumLength = calculateMinimumLength(score, fitted);
    while (minimumLength > MAX_LENGTH && fitted.staffSize > MIN_STAFF_SIZE) {
        previous = fitted.staffSize;
        fitted.staffSize = Math.max(MIN_STAFF_SIZE, roundToTenth(fitted.staffSize * 0.9));
        if (fitted.staffSize === previous) { break; }
        minimumLength = calculateMinimumLength(score, fitted);
    }
    while (minimumLength > MAX_LENGTH && fitted.noteScale > MIN_SCALE) {
        previous = fitted.noteScale;
        fitted.noteScale = Math.max(MIN_SCALE, roundToTenth(fitted.noteScale * 0.9));
        if (fitted.noteScale === previous) { break; }
        minimumLength = calculateMinimumLength(score, fitted);
    }
    while (minimumLength > MAX_LENGTH && fitted.symbolScale > MIN_SCALE) {
        previous = fitted.symbolScale;
        fitted.symbolScale = Math.max(MIN_SCALE, roundToTenth(fitted.symbolScale * 0.9));
        if (fitted.symbolScale === previous) { break; }
        minimumLength = calculateMinimumLength(score, fitted);
    }
    if (minimumLength > MAX_LENGTH) { throw new Error("The imported score is too wide for the current single-system renderer. Reduce the source length or wait for multi-system layout support."); }
    fitted.length = clamp(Math.max(fitted.length, Math.ceil(minimumLength)), MIN_LENGTH, MAX_LENGTH);
    return fitted;
}
function buildScoreFromImportDocument(document, laneIndex, settings) {
    var lane;
    if (!document || !document.lanes || document.lanes.length === 0) { throw new Error("No note source was found in the selected file."); }
    if (laneIndex === undefined || laneIndex === null || laneIndex < 0 || laneIndex >= document.lanes.length) { laneIndex = chooseDefaultImportLane(document); }
    lane = document.lanes[laneIndex];
    if (!lane) { throw new Error("No import source is selected."); }
    return document.type === "midi" ? midiLaneToScore(document, lane, settings) : musicXmlLaneToScore(document, lane, settings);
}
function generateImportedStaff(settings, pathText, laneIndex, cachedDocument) {
    var comp = app.project ? app.project.activeItem : null;
    var loaded;
    var document;
    var score;
    var importSettings;
    var scoreErrors;
    var plan;
    var planErrors;
    var layer = null;
    var undoStarted = false;
    if (!comp || !(comp instanceof CompItem)) { throw new Error("Open and select a composition before importing a score."); }
    if (cachedDocument) { document = cachedDocument; }
    else { loaded = importDocumentFromPath(pathText); document = loaded.document; }
    score = buildScoreFromImportDocument(document, laneIndex, settings);
    importSettings = fitImportedScoreSettings(score, settings);
    scoreErrors = validateScore(score, importSettings);
    if (scoreErrors.length > 0) { throw new Error("Imported score validation failed:\n" + scoreErrors.join("\n")); }
    plan = buildRenderPlan(score, importSettings);
    planErrors = validateRenderPlan(plan);
    if (planErrors.length > 0) { throw new Error("Imported Render Plan validation failed:\n" + planErrors.join("\n")); }
    try {
        app.beginUndoGroup("Import Staff");
        undoStarted = true;
        layer = renderPlanToShapeLayer(comp, plan, importSettings, score);
        layer.name = "Staff Generator Import";
        layer.selected = true;
        app.endUndoGroup();
        undoStarted = false;
    } catch (error) {
        if (layer) { try { layer.remove(); } catch (removeError) {} }
        if (undoStarted) { app.endUndoGroup(); }
        throw error;
    }
    return { layer: layer, score: score, plan: plan, settings: importSettings, document: document, laneIndex: laneIndex };
}
function buildImportTab(importTab) {
    var importer = {};
    var filePanel = addSection(importTab, "MIDI / MusicXML Import");
    var fileRow = filePanel.add("group");
    var sourceRow = filePanel.add("group");
    var actionRow = filePanel.add("group");
    fileRow.orientation = "row";
    fileRow.alignChildren = ["fill", "center"];
    fileRow.alignment = ["fill", "top"];
    importer.path = fileRow.add("edittext", undefined, "");
    importer.path.alignment = ["fill", "center"];
    importer.path.helpTip = "Choose a MIDI/MusicXML file or type/paste the full path manually.";
    importer.browse = fileRow.add("button", undefined, "Browse...");
    sourceRow.orientation = "row";
    sourceRow.alignChildren = ["left", "center"];
    importer.sourceLabel = sourceRow.add("statictext", undefined, "Source");
    importer.sourceLabel.helpTip = "MIDI sources are Track / Channel. MusicXML sources are Part / Staff / Voice.";
    importer.source = sourceRow.add("dropdownlist");
    importer.source.alignment = ["fill", "center"];
    importer.source.enabled = false;
    actionRow.orientation = "row";
    actionRow.alignChildren = ["fill", "center"];
    actionRow.alignment = ["fill", "top"];
    importer.generate = actionRow.add("button", undefined, "Import & Generate");
    importer.generate.alignment = ["fill", "center"];
    importer.info = filePanel.add("statictext", undefined,
        "Source notation is preserved. Imported measures, pitches, rhythms, and meter are not generated from Basic/Advanced settings.\n" +
        "Length may increase; Staff Space, Note Scale, and Symbol Scale may adjust to fit the Shape Layer.\n" +
        "Supports MIDI format 0/1 and uncompressed MusicXML: treble clef, numeric meters with denominator 2/4/8/16, meter changes between bars, one voice with simple chords, and whole to sixteenth including single-dotted values.",
        { multiline: true });
    importer.info.alignment = ["fill", "top"];
    importer.status = filePanel.add("statictext", undefined, "Ready");
    importer.status.alignment = ["fill", "top"];
    allowResponsiveShrink(importer.status);
    importer.document = null;
    importer.loadedPath = "";
    return importer;
}
function populateImportSources(importer, document) {
    var i;
    var defaultIndex = chooseDefaultImportLane(document);
    if (importer.sourceLabel) {
        importer.sourceLabel.text = document.type === "midi" ? "Track / Channel" : "Part / Staff / Voice";
    }
    importer.source.removeAll();
    for (i = 0; i < document.lanes.length; i += 1) { importer.source.add("item", document.lanes[i].name); }
    importer.source.enabled = document.lanes.length > 0;
    if (document.lanes.length > 0) { importer.source.selection = defaultIndex >= 0 ? defaultIndex : 0; }
}
function importTimeSignatureSummary(document) {
    var labels = [];
    var seen = {};
    var addLabel = function (numerator, denominator) {
        var label;
        if (!isFiniteNumber(numerator) || !isFiniteNumber(denominator)) { return; }
        label = Math.floor(numerator) + "/" + Math.floor(denominator);
        if (!seen[label]) {
            seen[label] = true;
            labels.push(label);
        }
    };
    var i;
    var lane;
    var measureSignatures;
    var signature;
    if (!document) { return ""; }
    if (document.type === "midi") {
        for (i = 0; i < (document.timeSignatures || []).length; i += 1) {
            addLabel(document.timeSignatures[i].numerator, document.timeSignatures[i].denominator);
        }
        if (labels.length === 0) { addLabel(DEFAULT_TIME_SIGNATURE.numerator, DEFAULT_TIME_SIGNATURE.denominator); }
    } else {
        lane = document.lanes && document.lanes.length > 0 ? document.lanes[chooseDefaultImportLane(document)] : null;
        measureSignatures = lane && lane.measureSignatures ? lane.measureSignatures : [];
        for (i = 0; i < measureSignatures.length; i += 1) {
            signature = measureSignatures[i];
            if (signature) { addLabel(signature.numerator, signature.denominator); }
        }
    }
    if (labels.length === 0) { return ""; }
    if (labels.length > 4) { labels = labels.slice(0, 4); labels.push("..."); }
    return " Meter: " + labels.join(", ");
}
function setImportStatus(importer, text) {
    if (importer && importer.status) { importer.status.text = text; }
}
function importLayoutAdjustmentSummary(original, fitted) {
    var keys = ["length", "staffSize", "noteScale", "symbolScale"];
    var labels = { length: "Length", staffSize: "Staff Space", noteScale: "Note Scale", symbolScale: "Symbol Scale" };
    var changes = [];
    var i;
    var key;
    if (!original || !fitted) { return ""; }
    for (i = 0; i < keys.length; i += 1) {
        key = keys[i];
        if (original[key] !== fitted[key]) {
            changes.push(labels[key] + " " + formatSettingValue(original[key]) + " -> " + formatSettingValue(fitted[key]));
        }
    }
    return changes.length > 0 ? " / Layout adjusted: " + changes.join(", ") : "";
}
function refreshImportDocument(importer, quiet) {
    var loaded;
    try {
        loaded = importDocumentFromPath(importer.path.text);
        importer.document = loaded.document;
        importer.loadedPath = loaded.file.fsName;
        importer.path.text = loaded.file.fsName;
        populateImportSources(importer, loaded.document);
        setImportStatus(importer, "Loaded " + loaded.document.type.toUpperCase() + ": " + loaded.document.lanes.length + " source(s)." + importTimeSignatureSummary(loaded.document));
        return true;
    } catch (error) {
        importer.document = null;
        importer.loadedPath = "";
        try {
            if (importer.sourceLabel) { importer.sourceLabel.text = "Source"; }
            importer.source.removeAll();
            importer.source.enabled = false;
        } catch (ignore) {}
        setImportStatus(importer, "Import file not loaded");
        if (!quiet) { alert("Could not load import file.\n\n" + error.toString(), "Staff Generator"); }
        return false;
    }
}
function bindImportUI(importer, ui, window) {
    importer.browse.onClick = function () {
        var file;
        try {
            file = browseImportFile();
            if (!file) { return; }
            importer.path.text = file.fsName;
            refreshImportDocument(importer, false);
        } finally { clearButtonFocus(importer.browse); }
    };
    importer.path.onChange = function () { refreshImportDocument(importer, true); };
    importer.generate.onClick = function () {
        var settings;
        var laneIndex;
        var result;
        var normalizedPath = normalizeImportPath(importer.path.text);
        try {
            settings = collectSettings(ui);
            if (!settings) { return; }
            if (!importer.document || normalizeImportPath(importer.loadedPath) !== normalizedPath) {
                if (!refreshImportDocument(importer, false)) { return; }
                normalizedPath = normalizeImportPath(importer.path.text);
            }
            laneIndex = importer.source.selection ? importer.source.selection.index : chooseDefaultImportLane(importer.document);
            setImportStatus(importer, "Importing score...");
            if (window.update) { window.update(); }
            result = generateImportedStaff(settings, normalizedPath, laneIndex, importer.document);
            setImportStatus(importer, "Imported: " + result.score.measures.length + " measures / 1 Shape Layer" +
                importLayoutAdjustmentSummary(settings, result.settings));
        } catch (error) {
            setImportStatus(importer, "Import failed");
            alert("Import failed.\n\n" + error.toString(), "Staff Generator");
        } finally { clearButtonFocus(importer.generate); }
    };
}
    function buildUI(thisObj) {
        var window = thisObj instanceof Panel ? thisObj : new Window("palette", "Staff Generator", undefined, { resizeable: true });
        var ui = {};
        var responsiveRows = [];
        var resizeState = { inLayout: false, inResizeHandler: false, initialized: false, lastLayoutKey: "", disposed: false };
        var tabs;
        var basicTab;
        var importTab;
        var advancedTab;
        var staffPanel;
        var scorePanel;
        var generationPanel;
        var advancedGenerationPanel;
        var transformPanel;
        var fineStylePanel;
        var basicActions;
        var advancedActions;
        var actionControls;
        var actionGroups;
        var resetClickHandler;
        var autoAdjustClickHandler;
        var randomizeClickHandler;
        var generateClickHandler;
        var presetId;
        var preset;
        var currentSettings;
        var appliedSettings;
        var randomSettings;
        window.orientation = "column";
        window.alignChildren = ["fill", "top"];
        window.spacing = 6;
        window.margins = 8;
        allowResponsiveShrink(window);
        try { window.minimumSize = [300, 220]; } catch (error) {}
        if (!(thisObj instanceof Panel)) { setResponsivePreferredWidth(window, 460); }
        tabs = window.add("tabbedpanel");
        tabs.alignChildren = ["fill", "fill"];
        tabs.alignment = ["fill", "top"];
        tabs.spacing = 4;
        allowResponsiveShrink(tabs);
        basicTab = tabs.add("tab", undefined, "Basic");
        basicTab.orientation = "column";
        basicTab.alignChildren = ["fill", "top"];
        allowResponsiveShrink(basicTab);
        advancedTab = tabs.add("tab", undefined, "Advanced");
        advancedTab.orientation = "column";
        advancedTab.alignChildren = ["fill", "top"];
        allowResponsiveShrink(advancedTab);
        importTab = tabs.add("tab", undefined, "Import");
        importTab.orientation = "column";
        importTab.alignChildren = ["fill", "top"];
        allowResponsiveShrink(importTab);
        tabs.selection = basicTab;
        presetId = getSavedSetting("presetId", "default");
        preset = addPresetField(basicTab, presetId, responsiveRows);
        ui.preset = preset;
        ui.activePresetId = getPresetChoiceId(preset.control, preset.choices);
        staffPanel = addSection(basicTab, "Layout");
        ui.length = addField(staffPanel, "Length (px)", getSavedSetting("length", DEFAULTS.length), 8, "Total horizontal length of the staff. Import may increase this value automatically to preserve the source.", responsiveRows);
        ui.staffSize = addField(staffPanel, "Staff Space (px)", getSavedSetting("staffSize", DEFAULTS.staffSize), 8, "Distance between staff lines and the base symbol size. Used by generated and imported scores.", responsiveRows);
        ui.measures = addField(staffPanel, "Measures", getSavedSetting("measures", DEFAULTS.measures), 8, "Number of measures to generate (1-64). Import uses the source measure count instead.", responsiveRows);
        scorePanel = addSection(basicTab, "Score");
        ui.pitchRange = addPitchRangeFields(scorePanel, "Pitch Range", getSavedSetting("pitchLow", DEFAULTS.pitchLow), getSavedSetting("pitchHigh", DEFAULTS.pitchHigh), "Choose the lower note on the left and the higher note on the right for generated scores. Import uses the source pitch range.", responsiveRows);
        ui.rhythmDensity = addField(scorePanel, "Rhythm Density %", getSavedRhythmDensity(), 8, "Higher values use denser, shorter rhythm patterns when the current layout has enough room. Generated scores only; ignored by Import.", responsiveRows);
        ui.restDensity = addField(scorePanel, "Rest Amount %", getSavedSetting("restDensity", DEFAULTS.restDensity), 8, "Percentage of generated events that become rests. Generated scores only; ignored by Import.", responsiveRows);
        ui.accidentals = scorePanel.add("checkbox", undefined, "Allow generated accidentals");
        ui.accidentals.helpTip = "Allow generated pitches to use sharps and flats. Import preserves the source spelling.";
        ui.accidentals.value = String(getSavedSetting("accidentals", DEFAULTS.accidentals)) === "true";
        generationPanel = addSection(basicTab, "Style");
        ui.globalThickness = addField(generationPanel, "Global Line Weight %", getSavedSetting("globalThickness", DEFAULTS.globalThickness), 8, "Scale the thickness of staff lines, stems, beams, barlines, and ledger lines together. Used by generated and imported scores.", responsiveRows);
        basicActions = addActionControls(basicTab);
        advancedGenerationPanel = addSection(advancedTab, "Generation");
        ui.masterSeed = addField(advancedGenerationPanel, "Master Seed", getSavedSetting("masterSeed", DEFAULTS.masterSeed), 10, "Use the same seed and settings to reproduce the same generated score. Import uses the source timing and pitches.", responsiveRows);
        ui.melodyMotion = addField(advancedGenerationPanel, "Melody Motion %", getSavedMelodyMotion(), 8, "0 favors smooth stepwise motion; 100 allows wider leaps. Generated scores only; ignored by Import.", responsiveRows);
        ui.repetitionTendency = addField(advancedGenerationPanel, "Repetition %", getSavedSetting("repetitionTendency", DEFAULTS.repetitionTendency), 8, "Higher values favor repeating the same pitch. Generated scores only; ignored by Import.", responsiveRows);
        ui.beam = advancedGenerationPanel.add("checkbox", undefined, "Auto-beam generated / MIDI");
        ui.beam.helpTip = "Connect consecutive eighth and sixteenth notes in generated scores and MIDI imports. MusicXML beam metadata is preserved.";
        ui.beam.value = String(getSavedSetting("beam", DEFAULTS.beam)) === "true";
        transformPanel = addSection(advancedTab, "Layout / Scale");
        ui.positionX = addField(transformPanel, "Position X (px)", getSavedSetting("positionX", DEFAULTS.positionX), 8, "Horizontal position of the generated Shape Layer.", responsiveRows);
        ui.positionY = addField(transformPanel, "Position Y (px)", getSavedSetting("positionY", DEFAULTS.positionY), 8, "Vertical position of the generated Shape Layer.", responsiveRows);
        ui.overallScale = addField(transformPanel, "Overall Scale %", getSavedSetting("overallScale", DEFAULTS.overallScale), 8, "Overall scale of the generated Shape Layer.", responsiveRows);
        ui.noteScale = addField(transformPanel, "Note Scale %", getSavedSetting("noteScale", DEFAULTS.noteScale), 8, "Scale of noteheads and related stem and ledger placement.", responsiveRows);
        ui.symbolScale = addField(transformPanel, "Symbol Scale %", getSavedSetting("symbolScale", DEFAULTS.symbolScale), 8, "Scale of the clef, rests, accidentals, and time signature.", responsiveRows);
        fineStylePanel = addSection(advancedTab, "Line Thickness");
        ui.staffLineThickness = addField(fineStylePanel, "Staff Line", getSavedSetting("staffLineThickness", DEFAULTS.staffLineThickness), 8, "Base thickness of the five staff lines before Line Weight is applied.", responsiveRows);
        ui.stemThickness = addField(fineStylePanel, "Stem", getSavedSetting("stemThickness", DEFAULTS.stemThickness), 8, "Base note stem thickness.", responsiveRows);
        ui.beamThickness = addField(fineStylePanel, "Beam", getSavedSetting("beamThickness", DEFAULTS.beamThickness), 8, "Base beam thickness.", responsiveRows);
        ui.barlineThickness = addField(fineStylePanel, "Barline", getSavedSetting("barlineThickness", DEFAULTS.barlineThickness), 8, "Base measure barline thickness.", responsiveRows);
        ui.ledgerLineThickness = addField(fineStylePanel, "Ledger Line", getSavedSetting("ledgerLineThickness", DEFAULTS.ledgerLineThickness), 8, "Base ledger line thickness.", responsiveRows);
        advancedActions = addActionControls(advancedTab);
        ui.importer = buildImportTab(importTab);
        actionControls = [basicActions, advancedActions];
        actionGroups = [basicActions.group, advancedActions.group];
        ui.generate = basicActions.generate;
        ui.randomize = basicActions.randomize;
        bindImportUI(ui.importer, ui, window);
        bindPresetTracking(ui);
        preset.control.onChange = function () {
            var selectedId = getPresetChoiceId(preset.control, preset.choices);
            var previousId = ui.activePresetId;
            var selectedPreset;
            if (selectedId === CUSTOM_PRESET.id) {
                ui.activePresetId = CUSTOM_PRESET.id;
                saveSetting("presetId", CUSTOM_PRESET.id);
                setActionStatus(actionControls, "Custom selected.");
                return;
            }
            selectedPreset = getPresetById(selectedId);
            if (!selectedPreset) { return; }
            currentSettings = collectSettings(ui);
            if (!currentSettings) {
                selectPresetChoice(preset.control, preset.choices, previousId);
                return;
            }
            appliedSettings = applyPreset(currentSettings, selectedPreset);
            ui.suppressPresetTracking = true;
            applySettingsToUI(ui, appliedSettings);
            ui.activePresetId = selectedId;
            selectPresetChoice(preset.control, preset.choices, selectedId);
            ui.suppressPresetTracking = false;
            saveUISettings(appliedSettings, selectedId);
            setActionStatus(actionControls, selectedPreset.name + " applied. Click Generate.");
        };
        resetClickHandler = function () {
            var defaults;
            var clickedButton = this;
            try {
                defaults = makeDefaultSettings();
                ui.suppressPresetTracking = true;
                applySettingsToUI(ui, defaults);
                ui.activePresetId = "default";
                selectPresetChoice(preset.control, preset.choices, "default");
                ui.suppressPresetTracking = false;
                saveUISettings(defaults, "default");
                setActionStatus(actionControls, "Defaults restored. Click Generate.");
            } finally { clearButtonFocus(clickedButton); }
        };
        autoAdjustClickHandler = function () {
            var settings;
            var fitted;
            var message;
            var clickedButton = this;
            try {
                settings = collectSettings(ui, { allowNumericClamp: true });
                if (!settings) { return; }
                setActionStatus(actionControls, "Calculating width...");
                if (window.update) { window.update(); }
                fitted = autoFitSettings(settings);
                fitted.settings.presetId = ui.activePresetId;
                ui.suppressPresetTracking = true;
                applySettingsToUI(ui, fitted.settings);
                ui.suppressPresetTracking = false;
                saveUISettings(fitted.settings, ui.activePresetId);
                message = fitted.changes.length > 0 ? "Auto Adjust complete. Review values." : "Current settings fit.";
                if (settings.numericInputsClamped) { message += " Inputs were clamped."; }
                message += " Click Generate.";
                setActionStatus(actionControls, message);
            } catch (error) {
                setActionStatus(actionControls, "Auto Adjust failed");
                alert("Auto Adjust failed.\n\n" + error.toString(), "Staff Generator");
            } finally { clearButtonFocus(clickedButton); }
        };
        randomizeClickHandler = function () {
            var clickedButton = this;
            try {
                currentSettings = collectSettings(ui);
                if (!currentSettings) { return; }
                setActionStatus(actionControls, "Finding a fitting random setup...");
                if (window.update) { window.update(); }
                randomSettings = randomizeGenerationSettings(currentSettings);
                randomSettings.presetId = CUSTOM_PRESET.id;
                ui.suppressPresetTracking = true;
                applySettingsToUI(ui, randomSettings);
                ui.activePresetId = CUSTOM_PRESET.id;
                selectPresetChoice(preset.control, preset.choices, CUSTOM_PRESET.id);
                ui.suppressPresetTracking = false;
                saveUISettings(randomSettings, CUSTOM_PRESET.id);
                setActionStatus(actionControls, "Randomize complete. Click Generate.");
            } catch (error) {
                ui.suppressPresetTracking = false;
                setActionStatus(actionControls, "Randomize failed");
                alert("Randomize failed.\n\n" + error.toString(), "Staff Generator");
            } finally { clearButtonFocus(clickedButton); }
        };
        generateClickHandler = function () {
            var settings;
            var result;
            var clickedButton = this;
            try {
                settings = collectSettings(ui);
                if (!settings) { return; }
                settings.presetId = ui.activePresetId;
                setActionStatus(actionControls, "Generating...");
                if (window.update) { window.update(); }
                result = generateStaff(settings);
                debugLog("Generated " + result.score.measures.length + " measures and " + result.plan.commands.length + " commands.");
                setActionStatus(actionControls, "Generated: " + result.score.measures.length + " measures / 1 Shape Layer" +
                    (result.score.layoutAdjusted ? " / Density adjusted to " + formatSettingValue(result.score.effectiveRhythmDensity) + "%" : ""));
            } catch (error) {
                setActionStatus(actionControls, "Generation failed");
                alert("Generation failed.\n\n" + error.toString(), "Staff Generator");
            } finally { clearButtonFocus(clickedButton); }
        };
        basicActions.reset.onClick = resetClickHandler;
        advancedActions.reset.onClick = resetClickHandler;
        basicActions.autoAdjust.onClick = autoAdjustClickHandler;
        advancedActions.autoAdjust.onClick = autoAdjustClickHandler;
        basicActions.randomize.onClick = randomizeClickHandler;
        advancedActions.randomize.onClick = randomizeClickHandler;
        basicActions.generate.onClick = generateClickHandler;
        advancedActions.generate.onClick = generateClickHandler;
        window.onResize = function () {
            if (resizeState.inLayout || resizeState.inResizeHandler || resizeState.disposed || getResponsiveWindowWidth(this) <= 0) { return; }
            resizeState.inResizeHandler = true;
            try {
                if (updateResponsivePanelLayout(window, ui.pitchRange, responsiveRows, actionGroups, resizeState)) { safeResizePanel(this); }
            } finally { resizeState.inResizeHandler = false; }
        };
        window.onClose = function () { resizeState.disposed = true; };
        window.layout.layout(true);
        updateResponsivePanelLayout(window, ui.pitchRange, responsiveRows, actionGroups, resizeState);
        safeResizePanel(window);
        return window;
    }
    if (thisObj instanceof Panel) {
        buildUI(thisObj);
    } else {
        var palette = buildUI(thisObj);
        palette.center();
        palette.show();
    }
}(this));
