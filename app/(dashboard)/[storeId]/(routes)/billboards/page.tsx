import prismadb from "@/lib/prismadb";
import { BillboardClient } from "./components/client";
import { BillboardColumn } from "./components/columns";
import { format } from "date-fns";

interface Item {
  id: string;
  label: string;
  createdAt: string; // Ensure this matches the field name in Prisma
}

const BillboardsPage = async ({ params }: { params: { storeId: string } }) => {
  const billboards: Item[] = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedBillboards: BillboardColumn[] = billboards.map((item) => {
    // Convert createdAt string to Date object
    const createdAtDate = new Date(item.createdAt);

    // Check if the date is valid
    if (isNaN(createdAtDate.getTime())) {
      console.error(`Invalid date value: ${item.createdAt}`);
      return {
        id: item.id,
        label: item.label,
        createAt: "Invalid date",
      };
    }

    return {
      id: item.id,
      label: item.label,
      createAt: format(createdAtDate, "MMMM do, yyyy"),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6 ">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default BillboardsPage;
