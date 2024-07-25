import { json } from "@remix-run/node";
import { shopify } from "../../shopify.server";

export async function action({ request }) {
    const { admin } = await shopify.authenticate.admin(request);
    const formData = await request.formData();
    const accountID = formData.get("accountID");

    // Check if a pixel already exists
    const existingPixelQuery = `
    query {
      webPixels(first: 1) {
        edges {
          node {
            id
            settings
          }
        }
      }
    }
    `;

    let pixelId;
    try {
        const existingResponse = await admin.graphql(existingPixelQuery);
        const existingPixel = existingResponse.data.webPixels.edges[0]?.node;
        if (existingPixel) {
            pixelId = existingPixel.id; // Get the ID of the existing pixel
        }
    } catch (error) {
        console.error("Error fetching existing pixels:", error);
        return json({ error: "Failed to fetch existing pixels." }, { status: 500 });
    }

    let query;
    if (pixelId) {
        // Update existing pixel
        query = `
        mutation {
          webPixelUpdate(id: "${pixelId}", webPixel: { settings: "{\"accountID\":\"${accountID}\"}" }) {
            userErrors {
              code
              field
              message
            }
            webPixel {
              settings
              id
            }
          }
        }
        `;
    } else {
        // Create new pixel
        query = `
        mutation {
          webPixelCreate(webPixel: { settings: "{\"accountID\":\"${accountID}\"}" }) {
            userErrors {
              code
              field
              message
            }
            webPixel {
              settings
              id
            }
          }
        }
        `;
    }

    try {
        const response = await admin.graphql(query);
        const result = await response.json();

        if (result.data.webPixelCreate?.userErrors.length > 0 || result.data.webPixelUpdate?.userErrors.length > 0) {
            return json({ errors: result.data.webPixelCreate?.userErrors || result.data.webPixelUpdate?.userErrors }, { status: 400 });
        }

        return json({ success: true, webPixel: result.data.webPixelCreate?.webPixel || result.data.webPixelUpdate?.webPixel });
    } catch (error) {
        console.error("Error during GraphQL request:", error); // Log the error for debugging
        return json({ error: error.message }, { status: 500 });
    }
}