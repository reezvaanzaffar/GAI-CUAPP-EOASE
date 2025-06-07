#!/bin/bash

# Remove unused imports and variables
# Auth related files
sed -i '/import.*Typography.*from/d' ./app/auth/verify-email/page.tsx
sed -i '/const data =/d' ./app/auth/login/page.tsx
sed -i '/const getTotalPrice =/d' ./app/checkout/shipping/page.tsx
sed -i '/import.*Link.*from/d' ./app/dashboard/page.tsx
sed -i '/import.*Product.*from/d' ./app/products/[id]/page.tsx
sed -i '/import.*AddToCartButton.*from/d' ./app/products/[id]/page.tsx

# Admin components
sed -i '/import.*OrderStatus.*from/d' ./components/admin/OrderStatusForm.tsx
sed -i '/import.*PaymentStatus.*from/d' ./components/admin/OrderStatusForm.tsx
sed -i '/import.*UpdateProductData.*from/d' ./components/admin/ProductForm.tsx

# Analytics components
sed -i '/import.*PerformanceMetrics.*from/d' ./components/analytics/AnalyticsDashboard.tsx
sed -i '/import.*AnalyticsData.*from/d' ./components/analytics/AnalyticsDashboard.tsx
sed -i '/import.*Paper.*from/d' ./components/analytics/ConsolidatedAnalyticsDashboard.tsx
sed -i '/const user =/d' ./components/analytics/ConsolidatedAnalyticsDashboard.tsx
sed -i '/import.*TextField.*from/d' ./components/analytics/shared/TimeRangeSelector.tsx
sed -i '/import.*IconButton.*from/d' ./components/analytics/views/AlertsRecommendationsView.tsx
sed -i '/import.*CloseIcon.*from/d' ./components/analytics/views/AlertsRecommendationsView.tsx
sed -i '/const handleRangeChange =/d' ./components/analytics/views/AlertsRecommendationsView.tsx
sed -i '/const range =/d' ./components/analytics/views/AlertsRecommendationsView.tsx
sed -i '/import.*Paper.*from/d' ./components/analytics/views/AnalyticsOverview.tsx
sed -i '/import.*Typography.*from/d' ./components/analytics/views/AnalyticsOverview.tsx
sed -i '/import.*TableSortLabel.*from/d' ./components/analytics/views/ContentAnalyticsView.tsx
sed -i '/const analytics =/d' ./components/analytics/views/FunnelAnalysisView.tsx
sed -i '/const start =/d' ./components/analytics/views/FunnelAnalysisView.tsx

# Auth components
sed -i '/const user =/d' ./components/auth/LinkedAccounts.tsx
sed -i '/import.*useAuth.*from/d' ./components/auth/LoginForm.tsx
sed -i '/import.*useAuth.*from/d' ./components/auth/RegisterForm.tsx

# Dashboard components
sed -i '/const performance =/d' ./components/dashboard/AnalyticsDashboard.tsx

# Hub components
sed -i '/import.*CheckCircleIcon.*from/d' ./components/hubs/launch/LaunchSequenceRoadmapSection.tsx
sed -i '/const index =/d' ./components/hubs/launch/LaunchSequenceRoadmapSection.tsx
sed -i '/import.*CheckCircleIcon.*from/d' ./components/hubs/master/MasterHeroSection.tsx
sed -i '/import.*CheckCircleIcon.*from/d' ./components/hubs/scale/ScaleCaseStudyShowcaseSection.tsx
sed -i '/import.*ScaleHeroStat.*from/d' ./components/hubs/scale/ScaleHeroSection.tsx

# Integration components
sed -i '/import.*AnimatePresence.*from/d' ./components/integrations/IntegrationsDashboardPage.tsx
sed -i '/import.*SectionWrapper.*from/d' ./components/integrations/IntegrationsDashboardPage.tsx
sed -i '/import.*Button.*from/d' ./components/integrations/IntegrationsDashboardPage.tsx
sed -i '/const isLoading =/d' ./components/integrations/IntegrationsDashboardPage.tsx

# Personalized components
sed -i '/import.*LEAD_SCORING_POINTS.*from/d' ./components/personalized/LeadScoringDashboard.tsx

# Quiz components
sed -i '/import.*ALL_QUIZ_QUESTIONS_FROM_CONSTANTS.*from/d' ./components/quiz/QuizQuestionCard.tsx
sed -i '/const quizTitleId =/d' ./components/quiz/QuizQuestionCard.tsx
sed -i '/import.*ScaleIcon.*from/d' ./components/quiz/QuizResultsPage.tsx
sed -i '/import.*MasterIcon.*from/d' ./components/quiz/QuizResultsPage.tsx
sed -i '/import.*InvestIcon.*from/d' ./components/quiz/QuizResultsPage.tsx
sed -i '/const allScores =/d' ./components/quiz/QuizResultsPage.tsx
sed -i '/import.*trackQuizEvent.*from/d' ./components/quiz/QuizWelcomeScreen.tsx

# Auth options
sed -i '/const user =/d' ./lib/authOptions.ts

# Context files
sed -i '/import.*PersonaId.*from/d' ./lib/context/PersonalizationContext.tsx
sed -i '/import.*EngagementLevel.*from/d' ./lib/context/PersonalizationContext.tsx

# Security
sed -i '/const deviceId =/d' ./lib/security.ts

# Services
sed -i '/import.*prisma.*from/d' ./lib/services/analytics.ts
sed -i '/import.*AnalyticsPlatform.*from/d' ./lib/services/analytics.ts
sed -i '/import.*uuidv4.*from/d' ./lib/services/analytics.ts
sed -i '/const mailchimpClient =/d' ./lib/services/analytics.ts
sed -i '/const stripeClient =/d' ./lib/services/analytics.ts
sed -i '/import.*LeadCaptureEvent.*from/d' ./lib/services/analytics.ts
sed -i '/const data =/d' ./lib/services/analytics.ts
sed -i '/const normalizedData =/d' ./lib/services/analytics.ts
sed -i '/import.*GroupMember.*from/d' ./lib/services/facebook-integration.ts
sed -i '/import.*GroupResource.*from/d' ./lib/services/facebook-integration.ts
sed -i '/import.*IntegrationMetric.*from/d' ./lib/services/integration.ts
sed -i '/import.*IntegrationTimelineEvent.*from/d' ./lib/services/integration.ts
sed -i '/import.*IntegrationAuditLog.*from/d' ./lib/services/integration.ts
sed -i '/const test =/d' ./lib/services/integration.ts
sed -i '/const id =/d' ./lib/services/integration.ts
sed -i '/const interactionType =/d' ./lib/services/personalization.ts

# Test files
sed -i '/import.*FunnelMetrics.*from/d' ./lib/services/__tests__/analytics.test.ts
sed -i '/import.*PersonaMetrics.*from/d' ./lib/services/__tests__/analytics.test.ts
sed -i '/import.*ExitIntentMetrics.*from/d' ./lib/services/__tests__/analytics.test.ts
sed -i '/import.*LeadScoringMetrics.*from/d' ./lib/services/__tests__/analytics.test.ts
sed -i '/import.*RevenueMetrics.*from/d' ./lib/services/__tests__/analytics.test.ts
sed -i '/import.*RuleCondition.*from/d' ./lib/services/__tests__/personalization.test.ts
sed -i '/import.*RuleAction.*from/d' ./lib/services/__tests__/personalization.test.ts

# Learning components
sed -i '/import.*Button.*from/d' ./src/components/learning/LearningPath.tsx
sed -i '/const getNextStatus =/d' ./src/components/learning/LearningPath.tsx

# Auth pages
sed -i '/const req =/d' ./src/pages/api/auth/[...nextauth].js

# Dashboard pages
sed -i '/import.*Card.*from/d' ./src/pages/dashboard/index.tsx
sed -i '/import.*CardHeader.*from/d' ./src/pages/dashboard/index.tsx
sed -i '/import.*CardContent.*from/d' ./src/pages/dashboard/index.tsx
sed -i '/import.*CardTitle.*from/d' ./src/pages/dashboard/index.tsx
sed -i '/import.*BusinessMetric.*from/d' ./src/pages/dashboard/investor.tsx
sed -i '/import.*MetricType.*from/d' ./src/pages/dashboard/investor.tsx
sed -i '/import.*BusinessMetric.*from/d' ./src/pages/dashboard/sarah.tsx

# Other pages
sed -i '/const router =/d' ./src/pages/marketplace/services/[serviceId].tsx
sed -i '/const session =/d' ./src/pages/onboarding/select-persona.tsx