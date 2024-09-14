import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/strip";

import prismadb from "@/lib/prismadb";

interface Product {
  name: string;
  price: {
    toNumber: () => number;
  };
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// Handle preflight OPTIONS requests
export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

// Handle POST requests
export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // Parse request body
    const { productIds } = await req.json();
    if (!productIds || productIds.length === 0) {
      return new NextResponse("Product id is required", {
        status: 400,
        headers: corsHeaders,
      });
    }

    // Fetch products from the database
    const products = await prismadb.product.findMany({
      where: {
        id: {
          in: productIds,
        },
      },
    });

    // Create line items for Stripe checkout
    const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] =
      products.map((product: Product) => ({
        quantity: 1,
        price_data: {
          currency: "USD",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price.toNumber(),
        },
      }));

    // Create an order in the database
    const order = await prismadb.order.create({
      data: {
        storeId: params.storeId,
        isPaid: false,
        phone: "example-phone",
        address: "example-address",
        orderItems: {
          create: productIds.map((productId: string) => ({
            product: {
              connect: {
                id: productId,
              },
            },
          })),
        },
      },
    });

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      billing_address_collection: "required",
      phone_number_collection: {
        enabled: true,
      },
      success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
      metadata: {
        orderId: order.id,
      },
    });

    // Return the checkout session URL
    return new NextResponse(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    return new NextResponse(`Error: ${error}`, {
      status: 500,
      headers: corsHeaders,
    });
  }
}
