import prismadb from "@/lib/prismadb";
import { ProductClient } from "./components/client";

import { format } from "date-fns";
import { formatToKip } from "@/lib/utils";

// Define interfaces directly in the file

interface Image {
  url: string;
}

interface Category {
  name: string;
}

interface Size {
  name: string;
}

interface Color {
  value: string;
}

interface Product {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  price: number; // Assuming price is a number type in Prisma
  createdAt: Date; // Date type for Prisma Date
  category: Category;
  size: Size;
  color: Color;
  images: Image[];
}

interface ProductColumn {
  id: string;
  name: string;
  isFeatured: boolean;
  isArchived: boolean;
  image: string; // URL of the first image
  price: string; // Formatted price string
  category: string;
  size: string;
  color: string;
  createAt: string; // Formatted date string
}

const ProductsPage = async ({ params }: { params: { storeId: string } }) => {
  const products: Product[] = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
      images: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    image: item.images.length > 0 ? item.images[0].url : "",
    price: formatToKip(item.price),
    category: item.category.name,
    size: item.size.name,
    color: item.color.value,
    createAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
