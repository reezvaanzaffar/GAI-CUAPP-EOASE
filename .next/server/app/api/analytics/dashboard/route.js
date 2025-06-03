"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "app/api/analytics/dashboard/route";
exports.ids = ["app/api/analytics/dashboard/route"];
exports.modules = {

/***/ "@prisma/client":
/*!*********************************!*\
  !*** external "@prisma/client" ***!
  \*********************************/
/***/ ((module) => {

module.exports = require("@prisma/client");

/***/ }),

/***/ "../../client/components/action-async-storage.external":
/*!*******************************************************************************!*\
  !*** external "next/dist/client/components/action-async-storage.external.js" ***!
  \*******************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/action-async-storage.external.js");

/***/ }),

/***/ "../../client/components/request-async-storage.external":
/*!********************************************************************************!*\
  !*** external "next/dist/client/components/request-async-storage.external.js" ***!
  \********************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/request-async-storage.external.js");

/***/ }),

/***/ "../../client/components/static-generation-async-storage.external":
/*!******************************************************************************************!*\
  !*** external "next/dist/client/components/static-generation-async-storage.external.js" ***!
  \******************************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/client/components/static-generation-async-storage.external.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-page.runtime.dev.js":
/*!*************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-page.runtime.dev.js" ***!
  \*************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-page.runtime.dev.js");

/***/ }),

/***/ "next/dist/compiled/next-server/app-route.runtime.dev.js":
/*!**************************************************************************!*\
  !*** external "next/dist/compiled/next-server/app-route.runtime.dev.js" ***!
  \**************************************************************************/
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/app-route.runtime.dev.js");

/***/ }),

/***/ "assert":
/*!*************************!*\
  !*** external "assert" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("assert");

/***/ }),

/***/ "buffer":
/*!*************************!*\
  !*** external "buffer" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("buffer");

/***/ }),

/***/ "crypto":
/*!*************************!*\
  !*** external "crypto" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("crypto");

/***/ }),

/***/ "events":
/*!*************************!*\
  !*** external "events" ***!
  \*************************/
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("http");

/***/ }),

/***/ "https":
/*!************************!*\
  !*** external "https" ***!
  \************************/
/***/ ((module) => {

module.exports = require("https");

/***/ }),

/***/ "querystring":
/*!******************************!*\
  !*** external "querystring" ***!
  \******************************/
/***/ ((module) => {

module.exports = require("querystring");

/***/ }),

/***/ "url":
/*!**********************!*\
  !*** external "url" ***!
  \**********************/
/***/ ((module) => {

module.exports = require("url");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/***/ ((module) => {

module.exports = require("zlib");

/***/ }),

/***/ "(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fanalytics%2Fdashboard%2Froute&page=%2Fapi%2Fanalytics%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fanalytics%2Fdashboard%2Froute.ts&appDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fanalytics%2Fdashboard%2Froute&page=%2Fapi%2Fanalytics%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fanalytics%2Fdashboard%2Froute.ts&appDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D! ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   originalPathname: () => (/* binding */ originalPathname),\n/* harmony export */   patchFetch: () => (/* binding */ patchFetch),\n/* harmony export */   requestAsyncStorage: () => (/* binding */ requestAsyncStorage),\n/* harmony export */   routeModule: () => (/* binding */ routeModule),\n/* harmony export */   serverHooks: () => (/* binding */ serverHooks),\n/* harmony export */   staticGenerationAsyncStorage: () => (/* binding */ staticGenerationAsyncStorage)\n/* harmony export */ });\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/dist/server/future/route-modules/app-route/module.compiled */ \"(rsc)/./node_modules/next/dist/server/future/route-modules/app-route/module.compiled.js\");\n/* harmony import */ var next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! next/dist/server/future/route-kind */ \"(rsc)/./node_modules/next/dist/server/future/route-kind.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next/dist/server/lib/patch-fetch */ \"(rsc)/./node_modules/next/dist/server/lib/patch-fetch.js\");\n/* harmony import */ var next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var E_ecommerce_outset_amazon_seller_ecosystem_7_app_api_analytics_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./app/api/analytics/dashboard/route.ts */ \"(rsc)/./app/api/analytics/dashboard/route.ts\");\n\n\n\n\n// We inject the nextConfigOutput here so that we can use them in the route\n// module.\nconst nextConfigOutput = \"standalone\"\nconst routeModule = new next_dist_server_future_route_modules_app_route_module_compiled__WEBPACK_IMPORTED_MODULE_0__.AppRouteRouteModule({\n    definition: {\n        kind: next_dist_server_future_route_kind__WEBPACK_IMPORTED_MODULE_1__.RouteKind.APP_ROUTE,\n        page: \"/api/analytics/dashboard/route\",\n        pathname: \"/api/analytics/dashboard\",\n        filename: \"route\",\n        bundlePath: \"app/api/analytics/dashboard/route\"\n    },\n    resolvedPagePath: \"E:\\\\ecommerce-outset---amazon-seller-ecosystem (7)\\\\app\\\\api\\\\analytics\\\\dashboard\\\\route.ts\",\n    nextConfigOutput,\n    userland: E_ecommerce_outset_amazon_seller_ecosystem_7_app_api_analytics_dashboard_route_ts__WEBPACK_IMPORTED_MODULE_3__\n});\n// Pull out the exports that we need to expose from the module. This should\n// be eliminated when we've moved the other routes to the new format. These\n// are used to hook into the route.\nconst { requestAsyncStorage, staticGenerationAsyncStorage, serverHooks } = routeModule;\nconst originalPathname = \"/api/analytics/dashboard/route\";\nfunction patchFetch() {\n    return (0,next_dist_server_lib_patch_fetch__WEBPACK_IMPORTED_MODULE_2__.patchFetch)({\n        serverHooks,\n        staticGenerationAsyncStorage\n    });\n}\n\n\n//# sourceMappingURL=app-route.js.map//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9ub2RlX21vZHVsZXMvbmV4dC9kaXN0L2J1aWxkL3dlYnBhY2svbG9hZGVycy9uZXh0LWFwcC1sb2FkZXIuanM/bmFtZT1hcHAlMkZhcGklMkZhbmFseXRpY3MlMkZkYXNoYm9hcmQlMkZyb3V0ZSZwYWdlPSUyRmFwaSUyRmFuYWx5dGljcyUyRmRhc2hib2FyZCUyRnJvdXRlJmFwcFBhdGhzPSZwYWdlUGF0aD1wcml2YXRlLW5leHQtYXBwLWRpciUyRmFwaSUyRmFuYWx5dGljcyUyRmRhc2hib2FyZCUyRnJvdXRlLnRzJmFwcERpcj1FJTNBJTVDZWNvbW1lcmNlLW91dHNldC0tLWFtYXpvbi1zZWxsZXItZWNvc3lzdGVtJTIwKDcpJTVDYXBwJnBhZ2VFeHRlbnNpb25zPXRzeCZwYWdlRXh0ZW5zaW9ucz10cyZwYWdlRXh0ZW5zaW9ucz1qc3gmcGFnZUV4dGVuc2lvbnM9anMmcm9vdERpcj1FJTNBJTVDZWNvbW1lcmNlLW91dHNldC0tLWFtYXpvbi1zZWxsZXItZWNvc3lzdGVtJTIwKDcpJmlzRGV2PXRydWUmdHNjb25maWdQYXRoPXRzY29uZmlnLmpzb24mYmFzZVBhdGg9JmFzc2V0UHJlZml4PSZuZXh0Q29uZmlnT3V0cHV0PXN0YW5kYWxvbmUmcHJlZmVycmVkUmVnaW9uPSZtaWRkbGV3YXJlQ29uZmlnPWUzMCUzRCEiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBQXNHO0FBQ3ZDO0FBQ2M7QUFDNEM7QUFDekg7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLGdIQUFtQjtBQUMzQztBQUNBLGNBQWMseUVBQVM7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLFlBQVk7QUFDWixDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0EsUUFBUSxpRUFBaUU7QUFDekU7QUFDQTtBQUNBLFdBQVcsNEVBQVc7QUFDdEI7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUN1SDs7QUFFdkgiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lY29tbWVyY2Utb3V0c2V0Lz9hNTZmIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwcFJvdXRlUm91dGVNb2R1bGUgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUtbW9kdWxlcy9hcHAtcm91dGUvbW9kdWxlLmNvbXBpbGVkXCI7XG5pbXBvcnQgeyBSb3V0ZUtpbmQgfSBmcm9tIFwibmV4dC9kaXN0L3NlcnZlci9mdXR1cmUvcm91dGUta2luZFwiO1xuaW1wb3J0IHsgcGF0Y2hGZXRjaCBhcyBfcGF0Y2hGZXRjaCB9IGZyb20gXCJuZXh0L2Rpc3Qvc2VydmVyL2xpYi9wYXRjaC1mZXRjaFwiO1xuaW1wb3J0ICogYXMgdXNlcmxhbmQgZnJvbSBcIkU6XFxcXGVjb21tZXJjZS1vdXRzZXQtLS1hbWF6b24tc2VsbGVyLWVjb3N5c3RlbSAoNylcXFxcYXBwXFxcXGFwaVxcXFxhbmFseXRpY3NcXFxcZGFzaGJvYXJkXFxcXHJvdXRlLnRzXCI7XG4vLyBXZSBpbmplY3QgdGhlIG5leHRDb25maWdPdXRwdXQgaGVyZSBzbyB0aGF0IHdlIGNhbiB1c2UgdGhlbSBpbiB0aGUgcm91dGVcbi8vIG1vZHVsZS5cbmNvbnN0IG5leHRDb25maWdPdXRwdXQgPSBcInN0YW5kYWxvbmVcIlxuY29uc3Qgcm91dGVNb2R1bGUgPSBuZXcgQXBwUm91dGVSb3V0ZU1vZHVsZSh7XG4gICAgZGVmaW5pdGlvbjoge1xuICAgICAgICBraW5kOiBSb3V0ZUtpbmQuQVBQX1JPVVRFLFxuICAgICAgICBwYWdlOiBcIi9hcGkvYW5hbHl0aWNzL2Rhc2hib2FyZC9yb3V0ZVwiLFxuICAgICAgICBwYXRobmFtZTogXCIvYXBpL2FuYWx5dGljcy9kYXNoYm9hcmRcIixcbiAgICAgICAgZmlsZW5hbWU6IFwicm91dGVcIixcbiAgICAgICAgYnVuZGxlUGF0aDogXCJhcHAvYXBpL2FuYWx5dGljcy9kYXNoYm9hcmQvcm91dGVcIlxuICAgIH0sXG4gICAgcmVzb2x2ZWRQYWdlUGF0aDogXCJFOlxcXFxlY29tbWVyY2Utb3V0c2V0LS0tYW1hem9uLXNlbGxlci1lY29zeXN0ZW0gKDcpXFxcXGFwcFxcXFxhcGlcXFxcYW5hbHl0aWNzXFxcXGRhc2hib2FyZFxcXFxyb3V0ZS50c1wiLFxuICAgIG5leHRDb25maWdPdXRwdXQsXG4gICAgdXNlcmxhbmRcbn0pO1xuLy8gUHVsbCBvdXQgdGhlIGV4cG9ydHMgdGhhdCB3ZSBuZWVkIHRvIGV4cG9zZSBmcm9tIHRoZSBtb2R1bGUuIFRoaXMgc2hvdWxkXG4vLyBiZSBlbGltaW5hdGVkIHdoZW4gd2UndmUgbW92ZWQgdGhlIG90aGVyIHJvdXRlcyB0byB0aGUgbmV3IGZvcm1hdC4gVGhlc2Vcbi8vIGFyZSB1c2VkIHRvIGhvb2sgaW50byB0aGUgcm91dGUuXG5jb25zdCB7IHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzIH0gPSByb3V0ZU1vZHVsZTtcbmNvbnN0IG9yaWdpbmFsUGF0aG5hbWUgPSBcIi9hcGkvYW5hbHl0aWNzL2Rhc2hib2FyZC9yb3V0ZVwiO1xuZnVuY3Rpb24gcGF0Y2hGZXRjaCgpIHtcbiAgICByZXR1cm4gX3BhdGNoRmV0Y2goe1xuICAgICAgICBzZXJ2ZXJIb29rcyxcbiAgICAgICAgc3RhdGljR2VuZXJhdGlvbkFzeW5jU3RvcmFnZVxuICAgIH0pO1xufVxuZXhwb3J0IHsgcm91dGVNb2R1bGUsIHJlcXVlc3RBc3luY1N0b3JhZ2UsIHN0YXRpY0dlbmVyYXRpb25Bc3luY1N0b3JhZ2UsIHNlcnZlckhvb2tzLCBvcmlnaW5hbFBhdGhuYW1lLCBwYXRjaEZldGNoLCAgfTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXBwLXJvdXRlLmpzLm1hcCJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fanalytics%2Fdashboard%2Froute&page=%2Fapi%2Fanalytics%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fanalytics%2Fdashboard%2Froute.ts&appDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!\n");

/***/ }),

/***/ "(rsc)/./app/api/analytics/dashboard/route.ts":
/*!**********************************************!*\
  !*** ./app/api/analytics/dashboard/route.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   GET: () => (/* binding */ GET)\n/* harmony export */ });\n/* harmony import */ var next_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next/server */ \"(rsc)/./node_modules/next/dist/api/server.js\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prisma/client */ \"@prisma/client\");\n/* harmony import */ var _prisma_client__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prisma_client__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! next-auth */ \"(rsc)/./node_modules/next-auth/index.js\");\n/* harmony import */ var next_auth__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_auth__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _lib_authOptions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @/lib/authOptions */ \"(rsc)/./lib/authOptions.ts\");\n\n\n\n\nconst prisma = new _prisma_client__WEBPACK_IMPORTED_MODULE_1__.PrismaClient();\nasync function GET() {\n    try {\n        const session = await (0,next_auth__WEBPACK_IMPORTED_MODULE_2__.getServerSession)(_lib_authOptions__WEBPACK_IMPORTED_MODULE_3__.authOptions);\n        console.log(\"Dashboard endpoint - Session retrieved by getServerSession:\", session);\n        if (!session?.user || session.user.role !== \"ADMIN\") {\n            console.log(\"Dashboard endpoint - Unauthorized access attempt:\", session);\n            return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n                error: \"Unauthorized\"\n            }, {\n                status: 401\n            });\n        }\n        // Fetch performance metrics from the database\n        const performanceMetrics = await prisma.automationMetrics.findFirst({\n            where: {\n                workflow: {\n                    type: \"WORKFLOW\"\n                }\n            },\n            orderBy: {\n                lastExecution: \"desc\"\n            }\n        });\n        // Fetch analytics data\n        const [visitors, pageViews, orders] = await Promise.all([\n            prisma.user.count(),\n            prisma.automationLog.count(),\n            prisma.order.count()\n        ]);\n        // Calculate bounce rate (simplified example)\n        const bounceRate = 35.5; // This would be calculated based on actual user behavior\n        // Calculate conversion rate\n        const conversionRate = orders > 0 ? orders / visitors * 100 : 0;\n        const dashboardData = {\n            performance: {\n                pageLoad: performanceMetrics?.averageProcessingTime || 0,\n                timeToInteractive: 1.2,\n                firstContentfulPaint: 0.8,\n                cumulativeLayoutShift: 0.1\n            },\n            analytics: {\n                visitors,\n                pageViews,\n                bounceRate,\n                averageSessionDuration: 180,\n                conversionRate\n            },\n            lastUpdated: new Date().toISOString()\n        };\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json(dashboardData);\n    } catch (error) {\n        console.error(\"Analytics API error:\", error);\n        return next_server__WEBPACK_IMPORTED_MODULE_0__.NextResponse.json({\n            error: \"Internal server error\"\n        }, {\n            status: 500\n        });\n    }\n}\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9hcHAvYXBpL2FuYWx5dGljcy9kYXNoYm9hcmQvcm91dGUudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUEyQztBQUNHO0FBQ0Q7QUFDRztBQUVoRCxNQUFNSSxTQUFTLElBQUlILHdEQUFZQTtBQUV4QixlQUFlSTtJQUNwQixJQUFJO1FBQ0YsTUFBTUMsVUFBVSxNQUFNSiwyREFBZ0JBLENBQUNDLHlEQUFXQTtRQUNsREksUUFBUUMsR0FBRyxDQUFDLCtEQUErREY7UUFFM0UsSUFBSSxDQUFDQSxTQUFTRyxRQUFRSCxRQUFRRyxJQUFJLENBQUNDLElBQUksS0FBSyxTQUFTO1lBQ25ESCxRQUFRQyxHQUFHLENBQUMscURBQXFERjtZQUNqRSxPQUFPTixxREFBWUEsQ0FBQ1csSUFBSSxDQUN0QjtnQkFBRUMsT0FBTztZQUFlLEdBQ3hCO2dCQUFFQyxRQUFRO1lBQUk7UUFFbEI7UUFFQSw4Q0FBOEM7UUFDOUMsTUFBTUMscUJBQXFCLE1BQU1WLE9BQU9XLGlCQUFpQixDQUFDQyxTQUFTLENBQUM7WUFDbEVDLE9BQU87Z0JBQ0xDLFVBQVU7b0JBQ1JDLE1BQU07Z0JBQ1I7WUFDRjtZQUNBQyxTQUFTO2dCQUNQQyxlQUFlO1lBQ2pCO1FBQ0Y7UUFFQSx1QkFBdUI7UUFDdkIsTUFBTSxDQUFDQyxVQUFVQyxXQUFXQyxPQUFPLEdBQUcsTUFBTUMsUUFBUUMsR0FBRyxDQUFDO1lBQ3REdEIsT0FBT0ssSUFBSSxDQUFDa0IsS0FBSztZQUNqQnZCLE9BQU93QixhQUFhLENBQUNELEtBQUs7WUFDMUJ2QixPQUFPeUIsS0FBSyxDQUFDRixLQUFLO1NBQ25CO1FBRUQsNkNBQTZDO1FBQzdDLE1BQU1HLGFBQWEsTUFBTSx5REFBeUQ7UUFFbEYsNEJBQTRCO1FBQzVCLE1BQU1DLGlCQUFpQlAsU0FBUyxJQUFJLFNBQVVGLFdBQVksTUFBTTtRQUVoRSxNQUFNVSxnQkFBZ0I7WUFDcEJDLGFBQWE7Z0JBQ1hDLFVBQVVwQixvQkFBb0JxQix5QkFBeUI7Z0JBQ3ZEQyxtQkFBbUI7Z0JBQ25CQyxzQkFBc0I7Z0JBQ3RCQyx1QkFBdUI7WUFDekI7WUFDQUMsV0FBVztnQkFDVGpCO2dCQUNBQztnQkFDQU87Z0JBQ0FVLHdCQUF3QjtnQkFDeEJUO1lBQ0Y7WUFDQVUsYUFBYSxJQUFJQyxPQUFPQyxXQUFXO1FBQ3JDO1FBRUEsT0FBTzNDLHFEQUFZQSxDQUFDVyxJQUFJLENBQUNxQjtJQUMzQixFQUFFLE9BQU9wQixPQUFPO1FBQ2RMLFFBQVFLLEtBQUssQ0FBQyx3QkFBd0JBO1FBQ3RDLE9BQU9aLHFEQUFZQSxDQUFDVyxJQUFJLENBQ3RCO1lBQUVDLE9BQU87UUFBd0IsR0FDakM7WUFBRUMsUUFBUTtRQUFJO0lBRWxCO0FBQ0YiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lY29tbWVyY2Utb3V0c2V0Ly4vYXBwL2FwaS9hbmFseXRpY3MvZGFzaGJvYXJkL3JvdXRlLnRzPzYzMDAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTmV4dFJlc3BvbnNlIH0gZnJvbSAnbmV4dC9zZXJ2ZXInO1xyXG5pbXBvcnQgeyBQcmlzbWFDbGllbnQgfSBmcm9tICdAcHJpc21hL2NsaWVudCc7XHJcbmltcG9ydCB7IGdldFNlcnZlclNlc3Npb24gfSBmcm9tICduZXh0LWF1dGgnO1xyXG5pbXBvcnQgeyBhdXRoT3B0aW9ucyB9IGZyb20gJ0AvbGliL2F1dGhPcHRpb25zJztcclxuXHJcbmNvbnN0IHByaXNtYSA9IG5ldyBQcmlzbWFDbGllbnQoKTtcclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBHRVQoKSB7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBnZXRTZXJ2ZXJTZXNzaW9uKGF1dGhPcHRpb25zKTtcclxuICAgIGNvbnNvbGUubG9nKCdEYXNoYm9hcmQgZW5kcG9pbnQgLSBTZXNzaW9uIHJldHJpZXZlZCBieSBnZXRTZXJ2ZXJTZXNzaW9uOicsIHNlc3Npb24pO1xyXG5cclxuICAgIGlmICghc2Vzc2lvbj8udXNlciB8fCBzZXNzaW9uLnVzZXIucm9sZSAhPT0gJ0FETUlOJykge1xyXG4gICAgICBjb25zb2xlLmxvZygnRGFzaGJvYXJkIGVuZHBvaW50IC0gVW5hdXRob3JpemVkIGFjY2VzcyBhdHRlbXB0OicsIHNlc3Npb24pO1xyXG4gICAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oXHJcbiAgICAgICAgeyBlcnJvcjogJ1VuYXV0aG9yaXplZCcgfSxcclxuICAgICAgICB7IHN0YXR1czogNDAxIH1cclxuICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGZXRjaCBwZXJmb3JtYW5jZSBtZXRyaWNzIGZyb20gdGhlIGRhdGFiYXNlXHJcbiAgICBjb25zdCBwZXJmb3JtYW5jZU1ldHJpY3MgPSBhd2FpdCBwcmlzbWEuYXV0b21hdGlvbk1ldHJpY3MuZmluZEZpcnN0KHtcclxuICAgICAgd2hlcmU6IHtcclxuICAgICAgICB3b3JrZmxvdzoge1xyXG4gICAgICAgICAgdHlwZTogJ1dPUktGTE9XJyxcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgICBvcmRlckJ5OiB7XHJcbiAgICAgICAgbGFzdEV4ZWN1dGlvbjogJ2Rlc2MnLFxyXG4gICAgICB9LFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gRmV0Y2ggYW5hbHl0aWNzIGRhdGFcclxuICAgIGNvbnN0IFt2aXNpdG9ycywgcGFnZVZpZXdzLCBvcmRlcnNdID0gYXdhaXQgUHJvbWlzZS5hbGwoW1xyXG4gICAgICBwcmlzbWEudXNlci5jb3VudCgpLFxyXG4gICAgICBwcmlzbWEuYXV0b21hdGlvbkxvZy5jb3VudCgpLFxyXG4gICAgICBwcmlzbWEub3JkZXIuY291bnQoKSxcclxuICAgIF0pO1xyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBib3VuY2UgcmF0ZSAoc2ltcGxpZmllZCBleGFtcGxlKVxyXG4gICAgY29uc3QgYm91bmNlUmF0ZSA9IDM1LjU7IC8vIFRoaXMgd291bGQgYmUgY2FsY3VsYXRlZCBiYXNlZCBvbiBhY3R1YWwgdXNlciBiZWhhdmlvclxyXG5cclxuICAgIC8vIENhbGN1bGF0ZSBjb252ZXJzaW9uIHJhdGVcclxuICAgIGNvbnN0IGNvbnZlcnNpb25SYXRlID0gb3JkZXJzID4gMCA/IChvcmRlcnMgLyB2aXNpdG9ycykgKiAxMDAgOiAwO1xyXG5cclxuICAgIGNvbnN0IGRhc2hib2FyZERhdGEgPSB7XHJcbiAgICAgIHBlcmZvcm1hbmNlOiB7XHJcbiAgICAgICAgcGFnZUxvYWQ6IHBlcmZvcm1hbmNlTWV0cmljcz8uYXZlcmFnZVByb2Nlc3NpbmdUaW1lIHx8IDAsXHJcbiAgICAgICAgdGltZVRvSW50ZXJhY3RpdmU6IDEuMiwgLy8gRXhhbXBsZSB2YWx1ZVxyXG4gICAgICAgIGZpcnN0Q29udGVudGZ1bFBhaW50OiAwLjgsIC8vIEV4YW1wbGUgdmFsdWVcclxuICAgICAgICBjdW11bGF0aXZlTGF5b3V0U2hpZnQ6IDAuMSwgLy8gRXhhbXBsZSB2YWx1ZVxyXG4gICAgICB9LFxyXG4gICAgICBhbmFseXRpY3M6IHtcclxuICAgICAgICB2aXNpdG9ycyxcclxuICAgICAgICBwYWdlVmlld3MsXHJcbiAgICAgICAgYm91bmNlUmF0ZSxcclxuICAgICAgICBhdmVyYWdlU2Vzc2lvbkR1cmF0aW9uOiAxODAsIC8vIEV4YW1wbGUgdmFsdWUgaW4gc2Vjb25kc1xyXG4gICAgICAgIGNvbnZlcnNpb25SYXRlLFxyXG4gICAgICB9LFxyXG4gICAgICBsYXN0VXBkYXRlZDogbmV3IERhdGUoKS50b0lTT1N0cmluZygpLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gTmV4dFJlc3BvbnNlLmpzb24oZGFzaGJvYXJkRGF0YSk7XHJcbiAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgIGNvbnNvbGUuZXJyb3IoJ0FuYWx5dGljcyBBUEkgZXJyb3I6JywgZXJyb3IpO1xyXG4gICAgcmV0dXJuIE5leHRSZXNwb25zZS5qc29uKFxyXG4gICAgICB7IGVycm9yOiAnSW50ZXJuYWwgc2VydmVyIGVycm9yJyB9LFxyXG4gICAgICB7IHN0YXR1czogNTAwIH1cclxuICAgICk7XHJcbiAgfVxyXG59Il0sIm5hbWVzIjpbIk5leHRSZXNwb25zZSIsIlByaXNtYUNsaWVudCIsImdldFNlcnZlclNlc3Npb24iLCJhdXRoT3B0aW9ucyIsInByaXNtYSIsIkdFVCIsInNlc3Npb24iLCJjb25zb2xlIiwibG9nIiwidXNlciIsInJvbGUiLCJqc29uIiwiZXJyb3IiLCJzdGF0dXMiLCJwZXJmb3JtYW5jZU1ldHJpY3MiLCJhdXRvbWF0aW9uTWV0cmljcyIsImZpbmRGaXJzdCIsIndoZXJlIiwid29ya2Zsb3ciLCJ0eXBlIiwib3JkZXJCeSIsImxhc3RFeGVjdXRpb24iLCJ2aXNpdG9ycyIsInBhZ2VWaWV3cyIsIm9yZGVycyIsIlByb21pc2UiLCJhbGwiLCJjb3VudCIsImF1dG9tYXRpb25Mb2ciLCJvcmRlciIsImJvdW5jZVJhdGUiLCJjb252ZXJzaW9uUmF0ZSIsImRhc2hib2FyZERhdGEiLCJwZXJmb3JtYW5jZSIsInBhZ2VMb2FkIiwiYXZlcmFnZVByb2Nlc3NpbmdUaW1lIiwidGltZVRvSW50ZXJhY3RpdmUiLCJmaXJzdENvbnRlbnRmdWxQYWludCIsImN1bXVsYXRpdmVMYXlvdXRTaGlmdCIsImFuYWx5dGljcyIsImF2ZXJhZ2VTZXNzaW9uRHVyYXRpb24iLCJsYXN0VXBkYXRlZCIsIkRhdGUiLCJ0b0lTT1N0cmluZyJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(rsc)/./app/api/analytics/dashboard/route.ts\n");

/***/ }),

/***/ "(rsc)/./lib/authOptions.ts":
/*!****************************!*\
  !*** ./lib/authOptions.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   authOptions: () => (/* binding */ authOptions)\n/* harmony export */ });\n/* harmony import */ var next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! next-auth/providers/credentials */ \"(rsc)/./node_modules/next-auth/providers/credentials.js\");\n\nconsole.log(\"NEXTAUTH_SECRET:\", process.env.NEXTAUTH_SECRET);\nconst authOptions = {\n    providers: [\n        (0,next_auth_providers_credentials__WEBPACK_IMPORTED_MODULE_0__[\"default\"])({\n            name: \"Credentials\",\n            credentials: {\n                email: {\n                    label: \"Email\",\n                    type: \"email\"\n                },\n                password: {\n                    label: \"Password\",\n                    type: \"password\"\n                }\n            },\n            async authorize (credentials) {\n                const user = {\n                    id: \"1\",\n                    name: \"Test User\",\n                    email: credentials?.email,\n                    role: \"ADMIN\"\n                };\n                return user;\n            }\n        })\n    ],\n    session: {\n        strategy: \"jwt\"\n    },\n    callbacks: {\n        async jwt ({ token, user }) {\n            console.log(\"JWT callback invoked. Token before update:\", token);\n            if (user) {\n                token.sub = user.id;\n                token.role = user.role;\n            }\n            console.log(\"JWT callback invoked. Token after update:\", token);\n            return token;\n        },\n        async session ({ session, token }) {\n            console.log(\"Session callback invoked. Token:\", token);\n            if (session.user) {\n                session.user.id = token.sub;\n                session.user.role = token.role;\n            }\n            console.log(\"Session callback invoked. Session:\", session);\n            return session;\n        }\n    }\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHJzYykvLi9saWIvYXV0aE9wdGlvbnMudHMiLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBa0U7QUFHbEVDLFFBQVFDLEdBQUcsQ0FBQyxvQkFBb0JDLFFBQVFDLEdBQUcsQ0FBQ0MsZUFBZTtBQUVwRCxNQUFNQyxjQUErQjtJQUMxQ0MsV0FBVztRQUNUUCwyRUFBbUJBLENBQUM7WUFDbEJRLE1BQU07WUFDTkMsYUFBYTtnQkFDWEMsT0FBTztvQkFBRUMsT0FBTztvQkFBU0MsTUFBTTtnQkFBUTtnQkFDdkNDLFVBQVU7b0JBQUVGLE9BQU87b0JBQVlDLE1BQU07Z0JBQVc7WUFDbEQ7WUFDQSxNQUFNRSxXQUFVTCxXQUFXO2dCQUN6QixNQUFNTSxPQUFPO29CQUFFQyxJQUFJO29CQUFLUixNQUFNO29CQUFhRSxPQUFPRCxhQUFhQztvQkFBT08sTUFBTTtnQkFBUTtnQkFDcEYsT0FBT0Y7WUFDVDtRQUNGO0tBQ0Q7SUFDREcsU0FBUztRQUFFQyxVQUFVO0lBQU07SUFDM0JDLFdBQVc7UUFDVCxNQUFNQyxLQUFJLEVBQUVDLEtBQUssRUFBRVAsSUFBSSxFQUFFO1lBQ3ZCZCxRQUFRQyxHQUFHLENBQUMsOENBQThDb0I7WUFDMUQsSUFBSVAsTUFBTTtnQkFDUk8sTUFBTUMsR0FBRyxHQUFHUixLQUFLQyxFQUFFO2dCQUNuQk0sTUFBTUwsSUFBSSxHQUFHRixLQUFLRSxJQUFJO1lBQ3hCO1lBQ0FoQixRQUFRQyxHQUFHLENBQUMsNkNBQTZDb0I7WUFDekQsT0FBT0E7UUFDVDtRQUNBLE1BQU1KLFNBQVEsRUFBRUEsT0FBTyxFQUFFSSxLQUFLLEVBQUU7WUFDOUJyQixRQUFRQyxHQUFHLENBQUMsb0NBQW9Db0I7WUFDaEQsSUFBSUosUUFBUUgsSUFBSSxFQUFFO2dCQUNoQkcsUUFBUUgsSUFBSSxDQUFDQyxFQUFFLEdBQUdNLE1BQU1DLEdBQUc7Z0JBQzNCTCxRQUFRSCxJQUFJLENBQUNFLElBQUksR0FBR0ssTUFBTUwsSUFBSTtZQUNoQztZQUNBaEIsUUFBUUMsR0FBRyxDQUFDLHNDQUFzQ2dCO1lBQ2xELE9BQU9BO1FBQ1Q7SUFDRjtBQUNGLEVBQUUiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9lY29tbWVyY2Utb3V0c2V0Ly4vbGliL2F1dGhPcHRpb25zLnRzPzkxMTEiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IENyZWRlbnRpYWxzUHJvdmlkZXIgZnJvbSAnbmV4dC1hdXRoL3Byb3ZpZGVycy9jcmVkZW50aWFscyc7XHJcbmltcG9ydCB0eXBlIHsgTmV4dEF1dGhPcHRpb25zIH0gZnJvbSAnbmV4dC1hdXRoJztcclxuXHJcbmNvbnNvbGUubG9nKCdORVhUQVVUSF9TRUNSRVQ6JywgcHJvY2Vzcy5lbnYuTkVYVEFVVEhfU0VDUkVUKTtcclxuXHJcbmV4cG9ydCBjb25zdCBhdXRoT3B0aW9uczogTmV4dEF1dGhPcHRpb25zID0ge1xyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ3JlZGVudGlhbHNQcm92aWRlcih7XHJcbiAgICAgIG5hbWU6ICdDcmVkZW50aWFscycsXHJcbiAgICAgIGNyZWRlbnRpYWxzOiB7XHJcbiAgICAgICAgZW1haWw6IHsgbGFiZWw6ICdFbWFpbCcsIHR5cGU6ICdlbWFpbCcgfSxcclxuICAgICAgICBwYXNzd29yZDogeyBsYWJlbDogJ1Bhc3N3b3JkJywgdHlwZTogJ3Bhc3N3b3JkJyB9LFxyXG4gICAgICB9LFxyXG4gICAgICBhc3luYyBhdXRob3JpemUoY3JlZGVudGlhbHMpIHtcclxuICAgICAgICBjb25zdCB1c2VyID0geyBpZDogJzEnLCBuYW1lOiAnVGVzdCBVc2VyJywgZW1haWw6IGNyZWRlbnRpYWxzPy5lbWFpbCwgcm9sZTogJ0FETUlOJyB9O1xyXG4gICAgICAgIHJldHVybiB1c2VyO1xyXG4gICAgICB9LFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBzZXNzaW9uOiB7IHN0cmF0ZWd5OiAnand0JyB9LFxyXG4gIGNhbGxiYWNrczoge1xyXG4gICAgYXN5bmMgand0KHsgdG9rZW4sIHVzZXIgfSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnSldUIGNhbGxiYWNrIGludm9rZWQuIFRva2VuIGJlZm9yZSB1cGRhdGU6JywgdG9rZW4pO1xyXG4gICAgICBpZiAodXNlcikge1xyXG4gICAgICAgIHRva2VuLnN1YiA9IHVzZXIuaWQ7XHJcbiAgICAgICAgdG9rZW4ucm9sZSA9IHVzZXIucm9sZTtcclxuICAgICAgfVxyXG4gICAgICBjb25zb2xlLmxvZygnSldUIGNhbGxiYWNrIGludm9rZWQuIFRva2VuIGFmdGVyIHVwZGF0ZTonLCB0b2tlbik7XHJcbiAgICAgIHJldHVybiB0b2tlbjtcclxuICAgIH0sXHJcbiAgICBhc3luYyBzZXNzaW9uKHsgc2Vzc2lvbiwgdG9rZW4gfSkge1xyXG4gICAgICBjb25zb2xlLmxvZygnU2Vzc2lvbiBjYWxsYmFjayBpbnZva2VkLiBUb2tlbjonLCB0b2tlbik7XHJcbiAgICAgIGlmIChzZXNzaW9uLnVzZXIpIHtcclxuICAgICAgICBzZXNzaW9uLnVzZXIuaWQgPSB0b2tlbi5zdWI7XHJcbiAgICAgICAgc2Vzc2lvbi51c2VyLnJvbGUgPSB0b2tlbi5yb2xlO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnNvbGUubG9nKCdTZXNzaW9uIGNhbGxiYWNrIGludm9rZWQuIFNlc3Npb246Jywgc2Vzc2lvbik7XHJcbiAgICAgIHJldHVybiBzZXNzaW9uO1xyXG4gICAgfSxcclxuICB9LFxyXG59OyJdLCJuYW1lcyI6WyJDcmVkZW50aWFsc1Byb3ZpZGVyIiwiY29uc29sZSIsImxvZyIsInByb2Nlc3MiLCJlbnYiLCJORVhUQVVUSF9TRUNSRVQiLCJhdXRoT3B0aW9ucyIsInByb3ZpZGVycyIsIm5hbWUiLCJjcmVkZW50aWFscyIsImVtYWlsIiwibGFiZWwiLCJ0eXBlIiwicGFzc3dvcmQiLCJhdXRob3JpemUiLCJ1c2VyIiwiaWQiLCJyb2xlIiwic2Vzc2lvbiIsInN0cmF0ZWd5IiwiY2FsbGJhY2tzIiwiand0IiwidG9rZW4iLCJzdWIiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(rsc)/./lib/authOptions.ts\n");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, ["vendor-chunks/openid-client","vendor-chunks/next-auth","vendor-chunks/next","vendor-chunks/oauth","vendor-chunks/@babel","vendor-chunks/preact","vendor-chunks/preact-render-to-string","vendor-chunks/cookie","vendor-chunks/oidc-token-hash","vendor-chunks/@panva"], () => (__webpack_exec__("(rsc)/./node_modules/next/dist/build/webpack/loaders/next-app-loader.js?name=app%2Fapi%2Fanalytics%2Fdashboard%2Froute&page=%2Fapi%2Fanalytics%2Fdashboard%2Froute&appPaths=&pagePath=private-next-app-dir%2Fapi%2Fanalytics%2Fdashboard%2Froute.ts&appDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)%5Capp&pageExtensions=tsx&pageExtensions=ts&pageExtensions=jsx&pageExtensions=js&rootDir=E%3A%5Cecommerce-outset---amazon-seller-ecosystem%20(7)&isDev=true&tsconfigPath=tsconfig.json&basePath=&assetPrefix=&nextConfigOutput=standalone&preferredRegion=&middlewareConfig=e30%3D!")));
module.exports = __webpack_exports__;

})();