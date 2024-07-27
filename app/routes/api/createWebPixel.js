import { json } from "@remix-run/node";
import { prisma } from "../../db.server";

const shopDomain = process.env.SHOP_DOMAIN; // Retrieve the shop domain from the environment variables

export async function action({ request }) {
  const { settings } = await request.json();

  const mutation = `
    mutation {
      webPixelCreate(webPixel: { settings: ${JSON.stringify(settings)} }) {
        userErrors {
          code
          field
          message
        }
        webPixel {
          id
          settings
        }
      }
    }
  `;

  try {
    const response = await fetch('shopify:admin/api/2024-07/graphql.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
      }),
    });

    const result = await response.json();

    if (result.errors) {
      return json({ errors: result.errors }, { status: 400 });
    }

    const pixel = result.data.webPixelCreate.webPixel;

    await prisma.session.update({
      where: { shop: shopDomain },
      data: { webPixelId: pixel.id },
    });

    return json({ success: true, webPixel: pixel });
  } catch (error) {
    console.error("Error creating pixel:", error);
    return json({ error: "Failed to create pixel." }, { status: 500 });
  }
}
