import { useState, useCallback, useEffect } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Banner,
  Button,
  ChoiceList,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return json({ apiKey: process.env.SHOPIFY_API_KEY || "" });
};

export default function SettingsPage() {
  const { apiKey } = useLoaderData();
  const [gtmId, setGtmId] = useState("GTM-DUMMY-ID");
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({
    pageViews: false,
    productViews: false,
    purchases: false,
    cartViewed: false,
    checkoutAddressInfoSubmitted: false,
    checkoutCompleted: false,
    checkoutContactInfoSubmitted: false,
    checkoutShippingInfoSubmitted: false,
    checkoutStarted: false,
    collectionViewed: false,
    paymentInfoSubmitted: false,
    productAddedToCart: false,
    productRemovedFromCart: false,
    productViewed: false,
    searchSubmitted: false,
  });

  const eventChoices = [
    { label: "Page Views", value: "pageViews" },
    { label: "Product Views", value: "productViews" },
    { label: "Purchases", value: "purchases" },
    { label: "Cart Viewed", value: "cartViewed" },
    { label: "Checkout Address Info Submitted", value: "checkoutAddressInfoSubmitted" },
    { label: "Checkout Completed", value: "checkoutCompleted" },
    { label: "Checkout Contact Info Submitted", value: "checkoutContactInfoSubmitted" },
    { label: "Checkout Shipping Info Submitted", value: "checkoutShippingInfoSubmitted" },
    { label: "Checkout Started", value: "checkoutStarted" },
    { label: "Collection Viewed", value: "collectionViewed" },
    { label: "Payment Info Submitted", value: "paymentInfoSubmitted" },
    { label: "Product Added to Cart", value: "productAddedToCart" },
    { label: "Product Removed from Cart", value: "productRemovedFromCart" },
    { label: "Product Viewed", value: "productViewed" },
    { label: "Search Submitted", value: "searchSubmitted" },
  ];

  const validateGtmId = (id) => /^GTM-[A-Z0-9]+$/.test(id);

  const handleSave = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!validateGtmId(gtmId)) {
      setFeedbackMessage({ type: "error", content: "Invalid GTM ID format." });
      setLoading(false);
      return;
    }

    const updatedSettings = {
      accountID: gtmId,
      pageViewsEnabled: events.pageViews.toString(),
      productViewsEnabled: events.productViews.toString(),
      purchasesEnabled: events.purchases.toString(),
      cartViewedEnabled: events.cartViewed.toString(),
      checkoutAddressInfoSubmittedEnabled: events.checkoutAddressInfoSubmitted.toString(),
      checkoutCompletedEnabled: events.checkoutCompleted.toString(),
      checkoutContactInfoSubmittedEnabled: events.checkoutContactInfoSubmitted.toString(),
      checkoutShippingInfoSubmittedEnabled: events.checkoutShippingInfoSubmitted.toString(),
      checkoutStartedEnabled: events.checkoutStarted.toString(),
      collectionViewedEnabled: events.collectionViewed.toString(),
      paymentInfoSubmittedEnabled: events.paymentInfoSubmitted.toString(),
      productAddedToCartEnabled: events.productAddedToCart.toString(),
      productRemovedFromCartEnabled: events.productRemovedFromCart.toString(),
      productViewedEnabled: events.productViewed.toString(),
      searchSubmittedEnabled: events.searchSubmitted.toString(),
    };

    try {
      const response = await fetch(`/api/updateWebPixel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });

      const result = await response.json();
      if (response.ok) {
        setFeedbackMessage({ type: "success", content: "Settings saved successfully!" });
      } else {
        setFeedbackMessage({ type: "error", content: result.errors[0].message });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setFeedbackMessage({ type: "error", content: "An error occurred while saving settings." });
    } finally {
      setLoading(false);
    }
  };

  const handleEventsChange = useCallback((value) => {
    const updatedEvents = { ...events };
    Object.keys(updatedEvents).forEach((key) => {
      updatedEvents[key] = value.includes(key);
    });
    setEvents(updatedEvents);
  }, [events]);

  return (
    <Page title="Settings">
      <TitleBar title="Settings" />
      <Layout>
        <Layout.Section>
          {feedbackMessage && (
            <Banner status={feedbackMessage.type}>
              {feedbackMessage.content}
            </Banner>
          )}
          <form onSubmit={handleSave}>
            <Card sectioned title="Google Tag Manager" style={{ marginBottom: '20px' }}>
              <TextField
                label="GTM ID"
                value={gtmId}
                onChange={setGtmId}
                placeholder="Enter your GTM ID"
              />
            </Card>
            <br />
            <Card sectioned title="Customer Events Subscription">
              <p style={{ marginBottom: '10px', fontWeight: 'bold' }}>
                Select the events you would like to subscribe to. This helps in tracking specific user interactions on your store.
              </p>
              <ChoiceList
                title="Select Events"
                titleHidden
                choices={eventChoices}
                selected={Object.keys(events).filter((key) => events[key])}
                onChange={handleEventsChange}
                allowMultiple
              />
            </Card>
            <Button
              type="submit"
              disabled={!gtmId || !validateGtmId(gtmId) || loading}
              loading={loading}
              primary
              fullWidth
              size="large"
            >
              Save Settings
            </Button>
          </form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
