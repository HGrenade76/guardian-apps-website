// DECISIO on the web. Fill in apiToken from the CloudKit Console (see SETUP.md).
window.DX_CONFIG = {
  container: "iCloud.com.decisio.app",
  // CloudKit Console > iCloud.com.decisio.app > Tokens & Keys > API Tokens. Safe to publish: it only
  // lets a signed-in person reach their own private data.
  apiToken: "ea1a25153af192cf5e0ff03c0f3c5386045b2ed37e790aeb05869eb2ce28a997",
  // TestFlight and App Store builds use "production". Builds run from Xcode use "development".
  environment: "production",
};
