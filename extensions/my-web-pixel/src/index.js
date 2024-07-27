import { register } from '@shopify/web-pixels-extension';

register(async ({ analytics, browser, settings }) => {
  // Initialize dataLayer
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}

  // Initialize GTM tag
  (function(w, d, s, l, i) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var f = d.getElementsByTagName(s)[0],
      j = d.createElement(s), dl = l !== 'dataLayer' ? '&l=' + l : '';
    j.async = true; j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
    f.parentNode.insertBefore(j, f);
  })(window, document, 'script', 'dataLayer', settings.accountID);

  // Google Consent Mode v2
  gtag('consent', 'update', {
    'ad_storage': 'granted',
    'analytics_storage': 'granted',
    'ad_user_data': 'granted',
    'ad_personalization': 'granted',
  });

  // Helper function to send events to GTM
  const sendEvent = (eventName, event) => {
    window.dataLayer.push({
      event: eventName,
      timestamp: event.timestamp,
      id: event.id,
      token: event.data?.checkout?.token,
      url: event.context.document.location.href,
      client_id: event.clientId,
      email: event.data?.checkout?.email,
      phone: event.data?.checkout?.phone,
      first_name: event.data?.checkout?.shippingAddress?.firstName,
      last_name: event.data?.checkout?.shippingAddress?.lastName,
      address1: event.data?.checkout?.shippingAddress?.address1,
      address2: event.data?.checkout?.shippingAddress?.address2,
      city: event.data?.checkout?.shippingAddress?.city,
      country: event.data?.checkout?.shippingAddress?.country,
      countryCode: event.data?.checkout?.shippingAddress?.countryCode,
      province: event.data?.checkout?.shippingAddress?.province,
      provinceCode: event.data?.checkout?.shippingAddress?.provinceCode,
      zip: event.data?.checkout?.shippingAddress?.zip,
      orderId: event.data?.checkout?.order?.id,
      currency: event.data?.checkout?.currencyCode,
      subtotal: event.data?.checkout?.subtotalPrice?.amount,
      shipping: event.data?.checkout?.shippingLine?.price?.amount,
      value: event.data?.checkout?.totalPrice?.amount,
      tax: event.data?.checkout?.totalTax?.amount,
    });
  };

  // Subscribe to events based on settings
  if (settings.pageViewsEnabled === 'true') {
    analytics.subscribe('page_viewed', (event) => sendEvent('page_viewed', event));
  }

  if (settings.productViewsEnabled === 'true') {
    analytics.subscribe('product_viewed', (event) => sendEvent('product_viewed', event));
  }

  if (settings.purchasesEnabled === 'true') {
    analytics.subscribe('checkout_completed', (event) => sendEvent('checkout_completed', event));
  }

  if (settings.cartViewedEnabled === "true") {
    analytics.subscribe("cart_viewed", (event) => sendEvent("cart_viewed", event));
  }

  if (settings.checkoutAddressInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_address_info_submitted", (event) => sendEvent("checkout_address_info_submitted", event));
  }

  if (settings.checkoutCompletedEnabled === "true") {
    analytics.subscribe("checkout_completed", (event) => sendEvent("checkout_completed", event));
  }

  if (settings.checkoutContactInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_contact_info_submitted", (event) => sendEvent("checkout_contact_info_submitted", event));
  }

  if (settings.checkoutShippingInfoSubmittedEnabled === "true") {
    analytics.subscribe("checkout_shipping_info_submitted", (event) => sendEvent("checkout_shipping_info_submitted", event));
  }

  if (settings.checkoutStartedEnabled === "true") {
    analytics.subscribe("checkout_started", (event) => sendEvent("checkout_started", event));
  }

  if (settings.collectionViewedEnabled === "true") {
    analytics.subscribe("collection_viewed", (event) => sendEvent("collection_viewed", event));
  }

  if (settings.paymentInfoSubmittedEnabled === "true") {
    analytics.subscribe("payment_info_submitted", (event) => sendEvent("payment_info_submitted", event));
  }

  if (settings.productAddedToCartEnabled === "true") {
    analytics.subscribe("product_added_to_cart", (event) => sendEvent("product_added_to_cart", event));
  }

  if (settings.productRemovedFromCartEnabled === "true") {
    analytics.subscribe("product_removed_from_cart", (event) => sendEvent("product_removed_from_cart", event));
  }

  if (settings.searchSubmittedEnabled === "true") {
    analytics.subscribe("search_submitted", (event) => sendEvent("search_submitted", event));
  }
});
