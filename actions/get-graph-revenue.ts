import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}
export const getGraphRevenue = async (storeId: string) => {
  const paidOrder = await prismadb.order.findMany({
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

  const mothlyRevenue: { [key: number]: number } = {};

  for (const order of paidOrder) {
    const moth = order.createdAt.getMonth();
    let revenueFororder = 0;

    for (const item of order.orderItems) {
      revenueFororder += item.product.price.toNumber();
    }
    mothlyRevenue[moth] = (mothlyRevenue[moth] || 0) + revenueFororder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Noc", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in mothlyRevenue) {
    graphData[parseInt(month)].total = mothlyRevenue[parseInt(month)];
  }

  return graphData;
};
