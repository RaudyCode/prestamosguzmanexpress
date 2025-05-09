/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/select.js":
/*!**************************!*\
  !*** ./src/js/select.js ***!
  \**************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\ndocument.addEventListener(\"DOMContentLoaded\", () => {\r\n    const inputvalue = document.querySelector(\"#inputvalue\");\r\n    const inputAgregar = document.querySelector(\"#agregar\");\r\n    const radios = document.querySelectorAll('input[name=\"monto\"]');\r\n    const botonPagar = document.getElementById(\"btnPagar\");\r\n    const dvContenedor = document.querySelector('#insertar');\r\n    const montoTotal = document.querySelector('#montoTotal')\r\n\r\n    // Deshabilita el botón al inicio\r\n    botonPagar.disabled = true;\r\n    botonPagar.classList.add(\"cursor-not-allowed\", \"opacity-50\");\r\n    botonPagar.classList.remove(\"hover:bg-green-700\", \"cursor-pointer\");\r\n\r\n    radios.forEach(radio => {\r\n        radio.addEventListener(\"change\", function () {\r\n            // Verifica si el radio seleccionado es \"Abono a capital\"\r\n            if (this.id === \"agregar\") {\r\n                inputvalue.disabled = false; // Habilita el input\r\n            } else {\r\n                inputvalue.disabled = true; // Lo deshabilita\r\n                inputvalue.value = \"0.00\"; // Restablece el valor\r\n            }\r\n\r\n            // Habilita el botón solo si algún radio está seleccionado\r\n            const algunaSeleccion = [...radios].some(r => r.checked);\r\n            if (algunaSeleccion) {\r\n                botonPagar.disabled = false;\r\n                botonPagar.classList.remove(\"cursor-not-allowed\", \"opacity-50\");\r\n                botonPagar.classList.add(\"hover:bg-green-700\", \"cursor-pointer\");\r\n            } else {\r\n                botonPagar.disabled = true;\r\n                botonPagar.classList.add(\"cursor-not-allowed\", \"opacity-50\");\r\n                botonPagar.classList.remove(\"hover:bg-green-700\", \"cursor-pointer\");\r\n            }\r\n        });\r\n    });\r\n\r\n    // Cambia el valor de \"Abono a capital\" cuando el usuario escribe\r\n    inputvalue.addEventListener(\"input\", (e) => {\r\n        inputAgregar.value =[e.target.value, \"abono\"];\r\n    });\r\n\r\n\r\n    if(montoTotal.value==\"0,saldoTotal\"){\r\n        dvContenedor.innerHTML= `<div class=\"bg-white shadow py-8 px-4 rounded-lg max-w-md mx-auto\">\r\n\r\n                                    <p class=\"bg-green-500 py-2 px-5 rounded-lg w-full font-bold text-center text-white uppercase\">Prestamo Totalmente Pagado</p>\r\n                                    \r\n                                    \r\n                                </div>`\r\n    }\r\n});\r\n\n\n//# sourceURL=webpack://03.prestamosguzman/./src/js/select.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The require scope
/******/ 	var __webpack_require__ = {};
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/js/select.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;