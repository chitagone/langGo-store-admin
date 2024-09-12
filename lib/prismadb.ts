import { PrismaClient } from "@prisma/client";

const PrismaClientSingletion = () => {
  return new PrismaClient();
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof PrismaClientSingletion>;
}

const prismadb = globalThis.prismaGlobal ?? PrismaClientSingletion();

export default prismadb;
