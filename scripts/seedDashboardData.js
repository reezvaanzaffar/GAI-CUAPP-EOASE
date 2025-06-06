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
        var user, workflow, product, salesUser, leadStatuses, leadSources, priorities, leads, i, status_1, source, priority, expectedValue, createdAt, expectedCloseDate, userId, lead, j, j, metrics, users, logs, orders;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, prisma.user.upsert({
                        where: { email: 'admin@example.com' },
                        update: {},
                        create: {
                            email: 'admin@example.com',
                            name: 'Admin User',
                            role: 'ADMIN',
                            password: 'testpassword',
                            emailVerified: true,
                        },
                    })];
                case 1:
                    user = _a.sent();
                    return [4 /*yield*/, prisma.automationWorkflow.create({
                            data: {
                                name: 'Test Workflow',
                                platform: 'ZAPIER',
                                type: 'WORKFLOW',
                                status: 'ACTIVE',
                                trigger: {},
                            },
                        })];
                case 2:
                    workflow = _a.sent();
                    // Create automation metrics
                    return [4 /*yield*/, prisma.automationMetrics.create({
                            data: {
                                successRate: 0.95,
                                averageProcessingTime: 1.5,
                                totalExecutions: 100,
                                lastExecution: new Date(),
                                workflow: { connect: { id: workflow.id } },
                            },
                        })];
                case 3:
                    // Create automation metrics
                    _a.sent();
                    // Create an automation log
                    return [4 /*yield*/, prisma.automationLog.create({
                            data: {
                                workflow: { connect: { id: workflow.id } },
                                platform: 'ZAPIER',
                                event: 'Test Event',
                                status: 'COMPLETED',
                                details: {},
                            },
                        })];
                case 4:
                    // Create an automation log
                    _a.sent();
                    return [4 /*yield*/, prisma.product.upsert({
                            where: { sku: 'TESTSKU' },
                            update: {},
                            create: {
                                name: 'Test Product',
                                description: 'A test product',
                                price: 19.99,
                                sku: 'TESTSKU',
                                stock: 10,
                                category: 'Test Category',
                                images: [],
                                user: { connect: { id: user.id } },
                            },
                        })];
                case 5:
                    product = _a.sent();
                    // Create an order
                    return [4 /*yield*/, prisma.order.create({
                            data: {
                                user: { connect: { id: user.id } },
                                items: {
                                    create: [{
                                            product: { connect: { id: product.id } },
                                            quantity: 1,
                                            price: 19.99,
                                        }],
                                },
                                status: 'DELIVERED',
                                total: 19.99,
                                shippingAddress: {},
                                paymentMethod: 'card',
                                paymentStatus: 'PAID',
                            },
                        })];
                case 6:
                    // Create an order
                    _a.sent();
                    return [4 /*yield*/, prisma.user.upsert({
                            where: { email: 'reezvaan@gmail.com' },
                            update: {},
                            create: {
                                email: 'reezvaan@gmail.com',
                                name: 'Reezvaan',
                                role: 'sales',
                                emailVerified: true,
                            },
                        })];
                case 7:
                    salesUser = _a.sent();
                    leadStatuses = ['NEW', 'CONTACTED', 'QUALIFIED', 'PROPOSAL', 'NEGOTIATION', 'WON', 'LOST'];
                    leadSources = ['Website', 'Referral', 'Ad', 'Event'];
                    priorities = ['HIGH', 'MEDIUM', 'LOW'];
                    leads = [];
                    i = 0;
                    _a.label = 8;
                case 8:
                    if (!(i < 20)) return [3 /*break*/, 20];
                    status_1 = leadStatuses[Math.floor(Math.random() * leadStatuses.length)];
                    source = leadSources[Math.floor(Math.random() * leadSources.length)];
                    priority = priorities[Math.floor(Math.random() * priorities.length)];
                    expectedValue = Math.floor(Math.random() * 90000) + 10000;
                    createdAt = new Date(Date.now() - Math.floor(Math.random() * 60) * 24 * 60 * 60 * 1000);
                    expectedCloseDate = new Date(createdAt.getTime() + Math.floor(Math.random() * 30 + 10) * 24 * 60 * 60 * 1000);
                    userId = i % 2 === 0 ? salesUser.id : user.id;
                    return [4 /*yield*/, prisma.lead.create({
                            data: {
                                name: "Lead ".concat(i + 1),
                                companyName: "Company ".concat(i + 1),
                                contactName: "Contact ".concat(i + 1),
                                contactEmail: "contact".concat(i + 1, "@example.com"),
                                contactPhone: "555-000".concat(i + 1),
                                status: status_1,
                                priority: priority,
                                expectedValue: expectedValue,
                                expectedCloseDate: expectedCloseDate,
                                userId: userId,
                                source: source,
                                createdAt: createdAt,
                                updatedAt: createdAt,
                            },
                        })];
                case 9:
                    lead = _a.sent();
                    leads.push(lead);
                    j = 0;
                    _a.label = 10;
                case 10:
                    if (!(j < 3)) return [3 /*break*/, 15];
                    return [4 /*yield*/, prisma.leadCommunication.create({
                            data: {
                                leadId: lead.id,
                                type: ['call', 'email', 'meeting'][j % 3],
                                content: "Sample ".concat(['call', 'email', 'meeting'][j % 3], " communication for lead ").concat(i + 1),
                                createdAt: new Date(createdAt.getTime() + j * 60 * 60 * 1000),
                            },
                        })];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, prisma.leadNote.create({
                            data: {
                                leadId: lead.id,
                                content: "Note ".concat(j + 1, " for lead ").concat(i + 1),
                                createdAt: new Date(createdAt.getTime() + j * 2 * 60 * 60 * 1000),
                            },
                        })];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, prisma.leadTask.create({
                            data: {
                                leadId: lead.id,
                                title: "Task ".concat(j + 1, " for lead ").concat(i + 1),
                                description: "Task description ".concat(j + 1, " for lead ").concat(i + 1),
                                dueDate: new Date(createdAt.getTime() + (j + 1) * 24 * 60 * 60 * 1000),
                            },
                        })];
                case 13:
                    _a.sent();
                    _a.label = 14;
                case 14:
                    j++;
                    return [3 /*break*/, 10];
                case 15:
                    j = 0;
                    _a.label = 16;
                case 16:
                    if (!(j < 2)) return [3 /*break*/, 19];
                    return [4 /*yield*/, prisma.leadDocument.create({
                            data: {
                                leadId: lead.id,
                                name: "Document ".concat(j + 1, " for lead ").concat(i + 1),
                                type: j % 2 === 0 ? 'PDF' : 'DOCX',
                                url: "https://example.com/docs/lead".concat(i + 1, "_doc").concat(j + 1, ".").concat(j % 2 === 0 ? 'pdf' : 'docx'),
                            },
                        })];
                case 17:
                    _a.sent();
                    _a.label = 18;
                case 18:
                    j++;
                    return [3 /*break*/, 16];
                case 19:
                    i++;
                    return [3 /*break*/, 8];
                case 20: return [4 /*yield*/, prisma.automationMetrics.findMany({ include: { workflow: true } })];
                case 21:
                    metrics = _a.sent();
                    return [4 /*yield*/, prisma.user.findMany()];
                case 22:
                    users = _a.sent();
                    return [4 /*yield*/, prisma.automationLog.findMany()];
                case 23:
                    logs = _a.sent();
                    return [4 /*yield*/, prisma.order.findMany()];
                case 24:
                    orders = _a.sent();
                    console.log('Seed complete. Metrics:', metrics);
                    console.log('Users:', users);
                    console.log('Logs:', logs);
                    console.log('Orders:', orders);
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error).finally(function () { return prisma.$disconnect(); });
