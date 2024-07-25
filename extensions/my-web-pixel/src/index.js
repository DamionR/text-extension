import { register } from '@shopify/web-pixels-extension';

register(async ({ analytics, browser, settings }) => {
  // Retrieve or set your tracking cookies
  const uid = await browser.cookie.get('your_visitor_cookie');
  const pixelEndpoint = `https://www.googletagmanager.com/gtm.js?id=${settings.accountID}&uid=${uid}`;

  // Helper function to send events to GTM
  const sendEvent = (event) => {
    fetch(pixelEndpoint, {
      method: 'POST',
      body: JSON.stringify(event),
      keepalive: true,
    });
  };

  // Subscribe to events based on settings
  if (settings.pageViewsEnabled === 'true') {
    analytics.subscribe('page_viewed', sendEvent);
  }

  if (settings.productViewsEnabled === 'true') {
    analytics.subscribe('product_viewed', sendEvent);
  }

  if (settings.purchasesEnabled === 'true') {
    analytics.subscribe('checkout_completed', sendEvent);
  }

  if (settings.cartViewedEnabled === "true") {
    analytics.subscribe("cart_viewed", sendEvent);
  }

  if (settings.checkoutAddressInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_address_info_submitted", sendEvent);
  }

  if (settings.checkoutCompletedEnabled === "true") {
    analytics.subscribe("checkout_completed", sendEvent);
  }

  if (settings.checkoutContactInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_contact_info_submitted", sendEvent);
  }

  if (settings.checkoutShippingInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_shipping_info_submitted", sendEvent);
  }

  if (settings.checkoutStartedEnabled === "true") {
    analytics.subscribe("checkout_started", sendEvent);
  }

  if (settings.collectionViewedEnabled === "true") {
    analytics.subscribe("collection_viewed", sendEvent);
  }

  if (settings.paymentInfoSubmittedEnabled === "true") {
    analytics.subscribe("payment_info_submitted", sendEvent);
  }

  if (settings.productAddedToCartEnabled === "true") {
    analytics.subscribe("product_added_to_cart", sendEvent);
  }

  if (settings.productRemovedFromCartEnabled === "true") {
    analytics.subscribe("product_removed_from_cart", sendEvent);
  }

  if (settings.searchSubmittedEnabled === "true") {
    analytics.subscribe("search_submitted", sendEvent);
  }
});