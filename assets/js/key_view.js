(function() {

  var WIDTH = 371;
  var KEY_HEIGHT = 20;
  var KEY_SPACING = 3;
  var LETTER_KEY_WIDTH = 22;
  var DELETE_KEY_WIDTH = WIDTH - (13*LETTER_KEY_WIDTH + 15*KEY_SPACING);
  var RETURN_KEY_WIDTH = (WIDTH - (11*LETTER_KEY_WIDTH + 14*KEY_SPACING)) / 2;
  var SHIFT_KEY_WIDTH = (WIDTH - (10*LETTER_KEY_WIDTH + 13*KEY_SPACING)) / 2;

  var SPACE_CODE = 32;

  function KeyView() {
    var height = KEY_HEIGHT*5 + KEY_SPACING*6
    this._element = window.svgUtil.createElement('svg');
    window.svgUtil.setAttributes(this._element, {
      viewBox: '0 0 ' + WIDTH + ' ' + height
    });

    this._keyElems = {};
    this._labelElems = {};

    var rowCodes = [
      [192, 49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 219, 221, 8],
      [9, 222, 188, 190, 80, 89, 70, 71, 67, 82, 76, 191, 187, 220],
      [20, 65, 79, 69, 85, 73, 68, 72, 84, 78, 83, 189, 13],
      [16, 186, 81, 74, 75, 88, 66, 77, 87, 86, 90, -16],
    ];
    var rowWidths = [
      repeatedArray(13, LETTER_KEY_WIDTH).concat([DELETE_KEY_WIDTH]),
      [DELETE_KEY_WIDTH].concat(repeatedArray(13, LETTER_KEY_WIDTH)),
      [RETURN_KEY_WIDTH].concat(repeatedArray(11, LETTER_KEY_WIDTH),
        [RETURN_KEY_WIDTH]),
      [SHIFT_KEY_WIDTH].concat(repeatedArray(10, LETTER_KEY_WIDTH),
        [SHIFT_KEY_WIDTH])
    ];

    for (var i = 0, len = rowCodes.length; i < len; ++i) {
      this._createRow(i, rowCodes[i], rowWidths[i]);
    }

    this._createKey(SPACE_CODE, SHIFT_KEY_WIDTH+LETTER_KEY_WIDTH*2+KEY_SPACING*4,
      KEY_HEIGHT*4+KEY_SPACING*5, LETTER_KEY_WIDTH*5+KEY_SPACING*4);

    this._updateLayout();
    window.keyLayout.addListener(this._updateLayout.bind(this));
  }

  KeyView.prototype.element = function() {
    return this._element;
  };

  KeyView.prototype.keyElement = function(code) {
    var prop = code + '';
    if (this._keyElems.hasOwnProperty(prop)) {
      return this._keyElems[prop];
    }
    return null;
  };

  KeyView.prototype.setPressed = function(code, pressed) {
    var prop = code + '';
    if (this._keyElems.hasOwnProperty(prop)) {
      var e = this._keyElems[prop];
      if (pressed) {
        window.svgUtil.setAttributes(e, {fill: '#555'});
      } else {
        window.svgUtil.setAttributes(e, {fill: '#000'});
      }
      return this._keyElems[prop];
    }
  };

  KeyView.prototype._createRow = function(rowIdx, codes, widths) {
    var x = KEY_SPACING;
    var y = rowIdx*KEY_HEIGHT + (rowIdx+1)*KEY_SPACING;
    for (var i = 0, len = codes.length; i < len; ++i) {
      this._createKey(codes[i], x, y, widths[i]);
      x += KEY_SPACING + widths[i];
    }
  };

  KeyView.prototype._createKey = function(code, x, y, width) {
    var key = window.svgUtil.createElement('rect');
    window.svgUtil.setAttributes(key, {
      x: x,
      y: y,
      width: width,
      height: KEY_HEIGHT,

      rx: 2.5,
      ry: 2.5,
    });
    this._element.appendChild(key);
    this._keyElems[code] = key;

    var label = window.svgUtil.createElement('text');
    window.svgUtil.setAttributes(label, {
      x: x+width/2,
      y: y+KEY_HEIGHT/2,
      stroke: 'none',
      fill: 'white',
      'font-family': 'sans-serif',
      'font-size': '8px',
      'text-anchor': 'middle',
      'alignment-baseline': 'middle'
    });
    this._element.appendChild(label);
    this._labelElems[code] = label;
  };

  KeyView.prototype._updateLayout = function() {
    var mapping = window.keyLayout.map();
    console.log(mapping);
    var codes = Object.keys(mapping);
    for (var i = 0, len = codes.length; i < len; ++i) {
      var code = codes[i];
      this._labelElems[code].textContent = mapping[code];
    }
  };

  function repeatedArray(count, elem) {
    var res = [];
    for (var i = 0; i < count; ++i) {
      res.push(elem);
    }
    return res;
  }

  window.KeyView = KeyView;

})();
