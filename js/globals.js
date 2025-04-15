/**
* globals.js
*
* Keep all the globals in one place, in case they
* need to be shared across modules/imports.
*
* Author:
*
*/

// Drawing / updating
export const CANVAS = document.getElementById('game_canvas');
export const CTX = CANVAS.getContext('2d', {
     powerPreference: "high-performance"
   });
 // FPS Trapping
export const FPS = 60;
export const MS_PER_FRAME = 1000 / FPS;

// Movement
export const GRAVITY = 1.5;
export const FLOOR = CANVAS.height - 28;  // Careful - if the height ever changes...

// Some convenient keyboard codes
const KEYS = {
 SPACE:32,
 UP_ARROW:38,
 LEFT_ARROW:37,
 DOWN_ARROW:40,
 RIGHT_ARROW:39,
 W:87,
 A:65,
 S:83,
 D:68
};

// What each set of keyboard codes 'does'
export const keyClasses = {
  jump: [KEYS.W, KEYS.UP_ARROW, KEYS.SPACE],
  duck: [KEYS.S, KEYS.DOWN_ARROW]
}

// Game properties
export const SPEED = 10
export const DEBUG = true
export let FOCUSED = true

/**
* Shortcut for the document.getElementById() function
* @param {String} id The unique identifier of the element being requested.
* @returns HTML Element Object
*/
export function $(id) { return document.getElementById(id); }

export function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min;}

export function adtLen(adt) {
 let len = 0
 
 for (let _ in adt) {
   len++
 }

 return len
}

export function cloneArray(a) {
 const n = []

 for (const i of a) {
   n.push(i)
 }

 return n
}

export function newImg(src) {
 const img = new Image()
 img.src = src || "../images/dino_large.png"

 return img
}

// Export all the constants by default
export default { CANVAS, CTX, FPS, MS_PER_FRAME, GRAVITY, FLOOR, $, randInt, adtLen, cloneArray, newImg, SPEED }