import { PublicClientApplication } from "@azure/msal-browser";
import { configuration } from "~/root";

// This should be the same instance you pass to MsalProvider
const msalInstance = new PublicClientApplication(configuration);

export const getIdToken = async (msalInstance: PublicClientApplication) => {
  const activeAccount = msalInstance.getActiveAccount(); // This will only return a non-null value if you have logic somewhere else that calls the setActiveAccount API
  const accounts = msalInstance.getAllAccounts();

  if (!activeAccount && accounts.length === 0) {
    /*
     * User is not signed in. Throw error or wait for user to login.
     * Do not attempt to log a user in outside of the context of MsalProvider
     */
  }
  const request = {
    scopes: ["User.Read"],
    account: activeAccount || accounts[0],
  };

  const authResult = await msalInstance.acquireTokenSilent(request);

  return authResult.idToken;
};
