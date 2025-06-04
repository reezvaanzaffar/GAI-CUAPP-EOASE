"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var prisma = new client_1.PrismaClient();
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var contents, userEvents, userInteractions, performanceMetrics, contentAnalytics, alerts, recommendations;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        prisma.content.create({
                            data: {
                                title: 'Getting Started Guide',
                                type: 'article',
                                slug: 'getting-started',
                                description: 'Learn how to get started with our platform',
                                isPublished: true,
                                tags: ['guide', 'beginner'],
                                engagementScore: 0.85,
                            },
                        }),
                        prisma.content.create({
                            data: {
                                title: 'Advanced Features',
                                type: 'article',
                                slug: 'advanced-features',
                                description: 'Explore advanced platform features',
                                isPublished: true,
                                tags: ['advanced', 'features'],
                                engagementScore: 0.75,
                            },
                        }),
                    ])];
                case 1:
                    contents = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.userEvent.create({
                                data: {
                                    type: 'page_view',
                                    userId: '1', // Using the admin user ID
                                    metadata: {
                                        path: '/dashboard',
                                        referrer: 'google.com',
                                        userAgent: 'Mozilla/5.0',
                                    },
                                },
                            }),
                            prisma.userEvent.create({
                                data: {
                                    type: 'search',
                                    userId: '1',
                                    metadata: {
                                        query: 'analytics dashboard',
                                        results: 12,
                                    },
                                },
                            }),
                        ])];
                case 2:
                    userEvents = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.userInteraction.create({
                                data: {
                                    type: 'click',
                                    userId: '1',
                                    contentId: contents[0].id,
                                    metadata: {
                                        element: 'button',
                                        text: 'Read More',
                                    },
                                },
                            }),
                            prisma.userInteraction.create({
                                data: {
                                    type: 'scroll',
                                    userId: '1',
                                    contentId: contents[1].id,
                                    metadata: {
                                        depth: 0.75,
                                        duration: 120,
                                    },
                                },
                            }),
                        ])];
                case 3:
                    userInteractions = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.performanceMetric.create({
                                data: {
                                    type: 'page_load',
                                    value: 1200,
                                    metadata: {
                                        page: '/dashboard',
                                        browser: 'Chrome',
                                    },
                                },
                            }),
                            prisma.performanceMetric.create({
                                data: {
                                    type: 'api_response',
                                    value: 350,
                                    metadata: {
                                        endpoint: '/api/analytics',
                                        method: 'GET',
                                    },
                                },
                            }),
                        ])];
                case 4:
                    performanceMetrics = _a.sent();
                    return [4 /*yield*/, Promise.all(contents.map(function (content) {
                            return prisma.contentAnalytics.create({
                                data: {
                                    contentId: content.id,
                                    views: Math.floor(Math.random() * 1000),
                                    uniqueViews: Math.floor(Math.random() * 800),
                                    averageTimeOnPage: Math.random() * 300,
                                    bounceRate: Math.random() * 50,
                                    conversionRate: Math.random() * 10,
                                },
                            });
                        }))];
                case 5:
                    contentAnalytics = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.alert.create({
                                data: {
                                    type: 'performance',
                                    message: 'High page load time detected',
                                    severity: 'medium',
                                },
                            }),
                            prisma.alert.create({
                                data: {
                                    type: 'engagement',
                                    message: 'Low user engagement on homepage',
                                    severity: 'low',
                                },
                            }),
                        ])];
                case 6:
                    alerts = _a.sent();
                    return [4 /*yield*/, Promise.all([
                            prisma.optimizationRecommendation.create({
                                data: {
                                    type: 'performance',
                                    title: 'Optimize Image Loading',
                                    description: 'Implement lazy loading for images to improve page load time',
                                    impact: 'high',
                                    effort: 'medium',
                                    priority: 1,
                                },
                            }),
                            prisma.optimizationRecommendation.create({
                                data: {
                                    type: 'engagement',
                                    title: 'Add Call-to-Action',
                                    description: 'Add prominent CTAs to increase user engagement',
                                    impact: 'medium',
                                    effort: 'low',
                                    priority: 2,
                                },
                            }),
                        ])];
                case 7:
                    recommendations = _a.sent();
                    console.log('Analytics seed complete!');
                    console.log('Created:', {
                        contents: contents.length,
                        userEvents: userEvents.length,
                        userInteractions: userInteractions.length,
                        performanceMetrics: performanceMetrics.length,
                        contentAnalytics: contentAnalytics.length,
                        alerts: alerts.length,
                        recommendations: recommendations.length,
                    });
                    return [2 /*return*/];
            }
        });
    });
}
main()
    .catch(function (e) {
    console.error(e);
    process.exit(1);
})
    .finally(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, prisma.$disconnect()];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
