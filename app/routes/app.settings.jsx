import { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  TextField,
  Checkbox,
  Banner,
  Button,
  ChoiceList,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useLoaderData } from "@remix-run/react"; // Import useLoaderData

export default function SettingsPage() {
  const settings = useLoaderData(); // Get settings from the loader

  const gtmIdInitial = settings?.accountID || "GTM-XXXXXX"; // Use optional chaining
  const [gtmId, setGtmId] = useState(gtmIdInitial); // Define gtmId state
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState({
    pageViews: settings?.pageViewsEnabled === 'true',
    productViews: settings?.productViewsEnabled === 'true',
    purchases: settings?.purchasesEnabled === 'true',
    cartViewed: settings?.cartViewedEnabled === 'true',
    checkoutAddressInfoSubmitted: settings?.checkoutAddressInfoSubmittedEnabled === 'true',
    checkoutCompleted: settings?.checkoutCompletedEnabled === 'true',
    checkoutContactInfoSubmitted: settings?.checkoutContactInfoSubmittedEnabled === 'true',
    checkoutShippingInfoSubmitted: settings?.checkoutShippingInfoSubmittedEnabled === 'true',
    checkoutStarted: settings?.checkoutStartedEnabled === 'true',
    collectionViewed: settings?.collectionViewedEnabled === 'true',
    paymentInfoSubmitted: settings?.paymentInfoSubmittedEnabled === 'true',
    productAddedToCart: settings?.productAddedToCartEnabled === 'true',
    productRemovedFromCart: settings?.productRemovedFromCartEnabled === 'true',
    productViewed: settings?.productViewedEnabled === 'true',
    searchSubmitted: settings?.searchSubmittedEnabled === 'true',
  });
  const [webpixelEnabled, setWebpixelEnabled] = useState(settings?.webpixelEnabled === 'true');
  const [selectedEventKeys, setSelectedEventKeys] = useState([]);

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
    event.preventDefault(); // Prevent default form submission behavior
    console.log("Save button clicked"); // Debugging log
    setLoading(true);

    if (!validateGtmId(gtmId)) {
      setFeedbackMessage({ type: "error", content: "Invalid GTM ID format." });
      setLoading(false);
      return;
    }

    const updatedSettings = {
      accountID: gtmId,
      webpixelEnabled: webpixelEnabled.toString(),
      ...events,
    };

    console.log("Updated settings:", updatedSettings); // Log the settings being sent

    try {
      const response = await fetch(`/api/webPixelUpdate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: updatedSettings }),
      });

      const result = await response.json();
      console.log("Response from server:", result); // Log the server response

      if (result.errors) {
        setFeedbackMessage({ type: "error", content: result.errors[0].message });
      } else {
        setFeedbackMessage({ type: "success", content: "Settings saved successfully!" });
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      setFeedbackMessage({ type: "error", content: "An error occurred while saving settings." });
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleEventsChange = useCallback((value) => {
    setSelectedEventKeys(value);
    const updatedEvents = { ...events };

    Object.keys(updatedEvents).forEach((key) => {
      updatedEvents[key] = false; // Reset all events to false
    });

    value.forEach(key => {
      updatedEvents[key] = true; // Enable selected events
    });

    setEvents(updatedEvents); // Update the events state
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
          <form onSubmit={handleSave}> {/* Added form element */}
            <Card sectioned title="Google Tag Manager" style={{ marginBottom: '20px' }}>
              <TextField
                label="GTM ID"
                value={gtmId}
                onChange={setGtmId} // Ensure setGtmId is defined
                placeholder="Enter your GTM ID"
              />
            </Card>
            <br />
            <Card sectioned title="Webpixel Extension" style={{ marginBottom: '20px' }}>
              <Checkbox
                label="Enable Webpixel Extension"
                checked={webpixelEnabled}
                onChange={setWebpixelEnabled}
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
                selected={selectedEventKeys}
                onChange={handleEventsChange}
                allowMultiple
              />
            </Card>
            <Button
              type="submit" // Ensure the button is of type submit
              disabled={!gtmId || !validateGtmId(gtmId) || loading}
              loading={loading} // Show loading state
              primary // Use primary variant for the button
              fullWidth // Optional: Makes the button full-width
              size="large" // Optional: Sets the button size to large
            >
              Save Settings
            </Button>
          </form>
        </Layout.Section>
      </Layout>
    </Page>
  );
}