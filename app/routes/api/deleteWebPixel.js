import { json } from "@remix-run/node";
import { prisma } from "../../db.server";

const shopDomain = process.env.SHOP_DOMAIN; // Retrieve the shop domain from the environment variables

export async function action({ request }) {
  const session = await prisma.session.findUnique({
    where: { shop: shopDomain }
  });

  if (!session?.webPixelId) {
    return json({ success: true }); // No web pixel to delete
  }

  const mutation = `
    mutation {
      webPixelDelete(id: "${session.webPixelId}") {
        userErrors {
          code
          field
          message
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

    await prisma.session.update({
      where: { shop: shopDomain },
      data: { webPixelId: null },
    });

    return json({ success: true });
  } catch (error) {
    console.error("Error deleting pixel:", error);
    return json({ error: "Failed to delete pixel." }, { status: 500 });
  }
}
