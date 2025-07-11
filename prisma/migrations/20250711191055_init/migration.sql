-- CreateTable
CREATE TABLE "flowchartData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "guj_name" TEXT NOT NULL,
    "connection_text" TEXT,
    "successors" INTEGER[],
    "parent" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flowchartData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loginData" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "loginTime" TEXT[],

    CONSTRAINT "loginData_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "loginData_username_key" ON "loginData"("username");
