// MileGuard on the web. Fill these in from the CloudKit Console (see SETUP.md).
window.MG_CONFIG = {
  container: "iCloud.com.guardianapps.mileguard",
  // CloudKit Console > your container > Tokens & Keys > API Tokens. Safe to publish: it only
  // lets a signed-in person reach their own private data.
  apiToken: "89a9de3ca42f7d0650dda73e500296518f2ae41671a1223831b7eb45d535e981",
  // TestFlight and App Store builds use "production". Builds run from Xcode use "development".
  environment: "production",
};
