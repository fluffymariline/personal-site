/** @param {string} colour */
/** @returns {number[]} */
const parseColour = function (colour) {
  let m = colour.match(/^#([0-9a-f]{3})$/i)[1];
  if (m) {
    // in three-character format, each value is multiplied by 0x11 to give an
    // even scale from 0x00 to 0xff
    return [
      parseInt(m.charAt(0), 16) * 0x11,
      parseInt(m.charAt(1), 16) * 0x11,
      parseInt(m.charAt(2), 16) * 0x11,
      255,
    ];
  }
  m = colour.match(/^#([0-9a-f]{4})$/i)[1];
  if (m) {
    // in three-character format, each value is multiplied by 0x11 to give an
    // even scale from 0x00 to 0xff
    return [
      parseInt(m.charAt(0), 16) * 0x11,
      parseInt(m.charAt(1), 16) * 0x11,
      parseInt(m.charAt(2), 16) * 0x11,
      parseInt(m.charAt(3), 16) * 0x11,
    ];
  }
  m = colour.match(/^#([0-9a-f]{6})$/i)[1];
  if (m) {
    return [
      parseInt(m.substr(0, 2), 16),
      parseInt(m.substr(2, 2), 16),
      parseInt(m.substr(4, 2), 16),
      255,
    ];
  }
  m = colour.match(/^#([0-9a-f]{8})$/i)[1];
  if (m) {
    return [
      parseInt(m.substr(0, 2), 16),
      parseInt(m.substr(2, 2), 16),
      parseInt(m.substr(4, 2), 16),
      parseInt(m.substr(6, 2), 16),
    ];
  }
  m = colour.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
  if (m) {
    return [m[1], m[2], m[3], 255];
  }
  m = colour.match(
    /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i,
  );
  if (m) {
    return [m[1], m[2], m[3], m[4]];
  }
};
/** @param {string} colour */
const setAccentColour = function (colour) {
  const colourParsed = parseColour(colour);
  /** @type {HTMLBodyElement} */
  const body = document.querySelector("body");
  body.style.setProperty("--accent-colour", colour);
};
