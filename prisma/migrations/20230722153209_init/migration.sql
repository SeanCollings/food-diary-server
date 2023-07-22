-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "avatar" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastLogin" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userPreferenceShowDayStreak" BOOLEAN NOT NULL DEFAULT true,
    "userPreferenceShowWeeklyExcercise" BOOLEAN,
    "userPreferenceShowWeeklyWater" BOOLEAN,
    "statLastActivity" TIMESTAMP(3),
    "statDayStreak" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShareLink" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "link" TEXT NOT NULL,
    "isShared" BOOLEAN NOT NULL,

    CONSTRAINT "ShareLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryDay" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "date" TEXT NOT NULL,
    "mealBreakfast" JSONB,
    "mealSnack1" JSONB,
    "mealLunch" JSONB,
    "mealSnack2" JSONB,
    "mealDinner" JSONB,
    "wellnessWater" DOUBLE PRECISION,
    "wellnessTeaCoffee" DOUBLE PRECISION,
    "wellnessAlcohol" DOUBLE PRECISION,
    "wellnessExcercise" TEXT,
    "wellnessExcerciseDetails" TEXT,
    "hasMealBreakfast" BOOLEAN,
    "hasMealSnack1" BOOLEAN,
    "hasMealLunch" BOOLEAN,
    "hasMealSnack2" BOOLEAN,
    "hasMealDinner" BOOLEAN,
    "hasWellnessExcercise" BOOLEAN,

    CONSTRAINT "DiaryDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_userId_key" ON "ShareLink"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ShareLink_link_key" ON "ShareLink"("link");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryDay_userId_date_key" ON "DiaryDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "ShareLink" ADD CONSTRAINT "ShareLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryDay" ADD CONSTRAINT "DiaryDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
