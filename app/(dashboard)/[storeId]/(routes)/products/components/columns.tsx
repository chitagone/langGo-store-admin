import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";
import Image from "next/image";

// Update the type to include the image field
export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  size: string;
  category: string;
  color: string;
  image: string; // New field for image URL
  isFeatured: boolean;
  isArchived: boolean;
  createAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => (
      <Image
        src={row.original?.image}
        alt={row.original?.name}
        width={50} // Fixed width
        height={50} // Fixed height
        className="object-cover rounded aspect-square"
      />
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "isArchived",
    header: "isArchived",
    cell: ({ row }) => (
      <div>
        {row.original.isArchived ? (
          <span className="text-green-500  font-medium">true</span>
        ) : (
          <span className="text-red-500 font-medium">false</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "isFeatured",
    cell: ({ row }) => (
      <div>
        {row.original.isFeatured ? (
          <span className="text-green-500  font-medium">true</span>
        ) : (
          <span className="text-red-500 font-medium">false</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "size",
    header: "Size",
  },
  {
    accessorKey: "color",
    header: "Color",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <div
          className="h-6 w-6 rounded-full border"
          style={{ backgroundColor: row.original.color }}
        />
      </div>
    ),
  },
  {
    accessorKey: "createAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
