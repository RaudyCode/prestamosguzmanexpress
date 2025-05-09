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

/***/ "./src/js/apiPrestamos.js":
/*!********************************!*\
  !*** ./src/js/apiPrestamos.js ***!
  \********************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n(function () {\r\n    const selectPrestamo = document.querySelector(\"#prestamoAsociado\")\r\n    const cuotaDiv = document.querySelector(\"#cuota\")\r\n    const selecionAbonar = document.querySelector(\"#selecion\")\r\n    const abonarDiv = document.querySelector(\"#abonarDiv\")\r\n\r\n\r\n    // eventListtener\r\n    $(document).ready(function() {\r\n        $('#cliente').select2(); // Inicializar Select2\r\n    \r\n        $('#cliente').on('change', function() {\r\n            let selectedValue = $(this).val(); // Obtener el valor seleccionado\r\n            console.log(\"Cliente seleccionado:\", selectedValue);\r\n            apiPrestamos(selectedValue)\r\n        });\r\n    });\r\n\r\n    \r\n    selectPrestamo.addEventListener(\"change\", e =>{\r\n        const opcionSeleccionada = e.target.options[e.target.selectedIndex]; // Obtiene la opción seleccionada\r\n        mostrarCuota(opcionSeleccionada.dataset.cuota); \r\n    })\r\n\r\n    // check\r\n    selecionAbonar.addEventListener(\"change\", ()=>{\r\n        abonarDiv.classList.toggle('hidden')\r\n    })\r\n\r\n\r\n    // funciones\r\n    const apiPrestamos = async (clienteId) => {\r\n        try {\r\n            const url = `/api/prestamos`;\r\n            const respuesta = await fetch(url);\r\n            const prestamos = await respuesta.json();\r\n\r\n            filtrarPrestamos(prestamos, clienteId)\r\n        } catch (error) {\r\n            console.error(\"Error obteniendo los préstamos:\", error);\r\n        }\r\n    };\r\n\r\n    function filtrarPrestamos(prestamos, clienteId) {\r\n        const prestamosFiltrados = prestamos.filter(prestamo => prestamo.clienteId == clienteId);\r\n        mostrarPrestamos(prestamosFiltrados); \r\n        \r\n    }\r\n\r\n    const mostrarPrestamos = (prestamos) => {\r\n\r\n        limpiarHtml(selectPrestamo)\r\n        limpiarHtml(cuotaDiv)\r\n\r\n        const op = document.createElement(\"option\")\r\n        op.textContent=\"- Seleccione -\";\r\n        op.value=\"\"\r\n\r\n        selectPrestamo.appendChild(op)\r\n\r\n        prestamos.forEach(prestamo => {\r\n\r\n            if(prestamo.totalApagar === prestamo.totalPagado){\r\n                return;\r\n            }\r\n            const option = document.createElement(\"option\");\r\n            option.textContent=`${new Intl.NumberFormat(\"es-DO\", {maximumFractionDigits: 3,}).format(prestamo.monto)} - ${prestamo.fechaInicio}`\r\n            option.value=prestamo.id\r\n            option.setAttribute('data-cuota', new Intl.NumberFormat(\"es-DO\", {maximumFractionDigits: 3,}).format(prestamo.cuota))\r\n            \r\n            selectPrestamo.appendChild(option)\r\n        });\r\n           \r\n    };\r\n\r\n    const mostrarCuota= (cuota)=>{\r\n        \r\n        limpiarHtml(cuotaDiv)\r\n\r\n        const cuotaP= document.createElement('p');\r\n        cuotaP.classList.add(\"font-extrabold\")\r\n        cuotaP.innerHTML=`Cuota: <span class=\"font-normal\">${cuota}</span>`\r\n\r\n        cuotaDiv.appendChild(cuotaP)\r\n    }\r\n\r\n    function limpiarHtml(resultado){\r\n        while(resultado.firstChild){\r\n            resultado.removeChild(resultado.firstChild);\r\n        }\r\n    }\r\n\r\n\r\n})();\n\n//# sourceURL=webpack://03.prestamosguzman/./src/js/apiPrestamos.js?");

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
/******/ 	__webpack_modules__["./src/js/apiPrestamos.js"](0, __webpack_exports__, __webpack_require__);
/******/ 	
/******/ })()
;