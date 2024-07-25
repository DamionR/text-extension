import {
  Page,
  Text,
  Card,
  BlockStack,
  Box,
  InlineGrid,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};

export default function Index() {
  return (
    <Page>
      <TitleBar title="GTM Integration App" />
      <InlineGrid columns={{ xs: 1, md: "2fr 1fr" }} gap="400">
        <BlockStack gap="400">
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Text as="h2" variant="headingMd" alignment="center">
                Welcome to the GTM Integration App 🎉
              </Text>
              <Box border="divider" borderRadius="base" minHeight="2rem" />
              <Text variant="bodyMd" as="p">
                This app allows you to easily integrate Google Tag Manager (GTM) with your Shopify store. You can input your GTM ID and subscribe to standard customer events on Shopify.
              </Text>
              <Box border="divider" borderRadius="base" minHeight="20rem" />
              <Text as="h3" variant="headingMd">Features</Text>
              - Input your GTM ID directly into the app.<br />
              - Subscribe to standard customer events such as page views, product views, and purchases.<br />
              - Utilize our webpixel extension for enhanced tracking capabilities.
            </BlockStack>
          </Card>
          <Card roundedAbove="sm">
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">Useful Links</Text>
              - <a href='https://shopify.dev/docs/api/web-pixels-api/standard-events'>Standard Events</a><br />
              - <a href='https://shopify.dev/docs/api/web-pixels-api#customer-events-reference'>Customer Events Reference</a><br />
              - <a href='https://support.google.com/tagmanager/answer/12002338?hl=en#zippy=%2Cin-google-ads%2Cin-google-analytics%2Cin-campaign-manager%2Cin-google-tag-manager'>Google Tag Manager Help</a><br />
              - <a href='https://support.google.com/tagmanager/answer/11994839'>About the Google tag - Tag Manager Help</a>
            </BlockStack>
          </Card>
        </BlockStack>
      </InlineGrid>
    </Page>
  );
}