-- CreateTable
CREATE TABLE "Clients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "clientTypeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "Clients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locals" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "Locals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peoples" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "documentNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" INTEGER NOT NULL,

    CONSTRAINT "Peoples_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "profile" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ClientsToLocals" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ClientsToPeoples" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ClientsToLocals_AB_unique" ON "_ClientsToLocals"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientsToLocals_B_index" ON "_ClientsToLocals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientsToPeoples_AB_unique" ON "_ClientsToPeoples"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientsToPeoples_B_index" ON "_ClientsToPeoples"("B");

-- AddForeignKey
ALTER TABLE "Clients" ADD CONSTRAINT "Clients_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locals" ADD CONSTRAINT "Locals_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peoples" ADD CONSTRAINT "Peoples_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientsToLocals" ADD CONSTRAINT "_ClientsToLocals_A_fkey" FOREIGN KEY ("A") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientsToLocals" ADD CONSTRAINT "_ClientsToLocals_B_fkey" FOREIGN KEY ("B") REFERENCES "Locals"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientsToPeoples" ADD CONSTRAINT "_ClientsToPeoples_A_fkey" FOREIGN KEY ("A") REFERENCES "Clients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientsToPeoples" ADD CONSTRAINT "_ClientsToPeoples_B_fkey" FOREIGN KEY ("B") REFERENCES "Peoples"("id") ON DELETE CASCADE ON UPDATE CASCADE;
