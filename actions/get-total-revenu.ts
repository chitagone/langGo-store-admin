import prismadb from "@/lib/prismadb";
import { Order, OrderItem, Product } from "@prisma/client"; // Adjust import according to your Prisma setup

export const getTotalRevenue = async (storeId: string): Promise<number> => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      storeId,
      isPaid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  });

  // Type the `paidOrders` as `Order[]`
  const totalRevenue = paidOrders.reduce(
    (
      total: number,
      order: Order & { orderItems: (OrderItem & { product: Product })[] }
    ) => {
      const orderTotal = order.orderItems.reduce(
        (orderSum: number, item: OrderItem & { product: Product }) => {
          return orderSum + item.product.price.toNumber();
        },
        0
      );
      return total + orderTotal;
    },
    0
  );

  return totalRevenue;
};
