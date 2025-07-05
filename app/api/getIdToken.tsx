import { PublicClientApplication } from "@azure/msal-browser";
import { configuration, pca } from "~/root";

// This should be the same instance you pass to MsalProvider

export const getIdToken = async () => {
  const account = pca.getActiveAccount();
  if (!account) {
    throw Error(
      "No active account! Verify a user has been signed in and setActiveAccount has been called."
    );
  }

  const response = await pca.acquireTokenSilent({
    account: account,
    scopes: ["User.Read"],
  });
  return response.idToken;
};
