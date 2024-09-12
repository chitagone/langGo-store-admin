import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";

import { formatter } from "@/lib/utils";
import { format } from "date-fns";

// Define interfaces directly in the file

interface Product {
  name: string;
  price: number; // Ensure this matches the type in your database schema
}

interface OrderItem {
  product: Product;
}

interface Order {
  id: string;
  phone: string;
  address: string;
  orderItems: OrderItem[];
  isPaid: boolean;
  createdAt: Date; // Date type for Prisma Date
}

interface OrderColumn {
  id: string;
  phone: string;
  address: string;
  products: string; // Concatenated product names
  totalPrice: string; // Formatted price string
  isPaid: boolean;
  createAt: string; // Formatted date string
}

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders: Order[] = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(", "),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, orderItem) => {
        return total + Number(orderItem.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
