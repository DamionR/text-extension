import { json } from "@remix-run/node";
import { authenticate } from "../../shopify.server";

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const { settings } = await request.json();

  const webPixelId = process.env.WEB_PIXEL_ID;

  const mutation = webPixelId
    ? `mutation webPixelUpdate($id: ID!, $webPixel: WebPixelInput!) {
        webPixelUpdate(id: $id, webPixel: $webPixel) {
          userErrors {
            field
            message
          }
          webPixel {
            id
            settings
          }
        }
      }`
    : `mutation webPixelCreate($webPixel: WebPixelInput!) {
        webPixelCreate(webPixel: $webPixel) {
          userErrors {
            field
            message
          }
          webPixel {
            id
            settings
          }
        }
      }`;

  const variables = {
    id: webPixelId,
    webPixel: {
      settings: JSON.stringify(settings),
    },
  };

  try {
    const response = await admin.graphql({
      query: mutation,
      variables: webPixelId ? variables : { webPixel: variables.webPixel },
    });

    const result = await response.json();

    if (result.errors) {
      return json({ errors: result.errors }, { status: 400 });
    }

    const webPixel = webPixelId ? result.data.webPixelUpdate.webPixel : result.data.webPixelCreate.webPixel;

    // Optionally store the new webPixel ID if it was created
    if (!webPixelId) {
      process.env.WEB_PIXEL_ID = webPixel.id;
    }

    return json({ success: true, webPixel });
  } catch (error) {
    console.error("Error updating web pixel:", error);
    return json({ errors: [{ message: error.message }] }, { status: 500 });
  }
};
