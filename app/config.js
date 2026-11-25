// MileGuard on the web. Fill these in from the CloudKit Console (see SETUP.md).
window.MG_CONFIG = {
  container: "iCloud.com.guardianapps.mileguard",
  // CloudKit Console > your container > Tokens & Keys > API Tokens. Safe to publish: it only
  // lets a signed-in person reach their own private data.
  apiToken: "89a9de3ca42f7d0650dda73e500296518f2ae41671a1223831b7eb45d535e981",
  // TestFlight and App Store builds use "production". Builds run from Xcode use "development".
  environment: "production",
  // Apple developer portal > Certificates, IDs & Profiles > Services > Maps > Configure Tokens.
  // A MapKit JS token limited to gap-apps.com. Leave empty for the simple route sketch.
  mapkitToken: "eyJraWQiOiJEWEg3S0dUMjk1IiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJLRks4V1o1NDQ3IiwiaWF0IjoxNzk1NTg2MDM5LCJvcmlnaW4iOiJnYXAtYXBwcy5jb20iLCJzY29wZSI6Im1hcGtpdF9qcyJ9.jk3GavXZ6lPwr5BFQArKzFrYKGPtTCuO8Cochiae4IX78gzB-Li3Nzg7btNzHaZNp9BK4aJvIPFALpHkLIkmjQ",
};
