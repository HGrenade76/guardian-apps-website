// DECISIO on the web. Fill in apiToken from the CloudKit Console (see SETUP.md).
window.DX_CONFIG = {
  container: "iCloud.com.decisio.app",
  // CloudKit Console > iCloud.com.decisio.app > Tokens & Keys > API Tokens. Safe to publish: it only
  // lets a signed-in person reach their own private data.
  apiToken: "ac385a7c7f870910b17096bf33c0bd8cb1f1e69162478c6ef82431c9b7243833",
  // TestFlight and App Store builds use "production". Builds run from Xcode use "development".
  environment: "production",
};
