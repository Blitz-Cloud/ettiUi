// import React from "react";
// import {
//   AuthenticatedTemplate,
//   UnauthenticatedTemplate,
//   useMsal,
//   useMsalAuthentication,
// } from "@azure/msal-react";
// import { InteractionType } from "@azure/msal-browser";

// export default function Auth2() {
//   const { instance, accounts, inProgress } = useMsal();
//   console.log(instance);
//   console.log(accounts);

//   if (accounts.length > 0) {
//     return <span>There are currently {accounts.length} users signed in!</span>;
//   } else if (inProgress === "login") {
//     return <span>Login is currently in progress!</span>;
//   } else {
//     return (
//       <>
//         <span>There are currently no users signed in!</span>
//         <button onClick={() => instance.loginPopup()}>Login</button>
//       </>
//     );
//   }
// }
import React, { useState, useEffect } from "react";
import { useMsal, useAccount, useMsalAuthentication } from "@azure/msal-react";
import { InteractionType } from "@azure/msal-browser";

export default function Auth2() {
  const { instance, accounts, inProgress } = useMsal();
  const account = useAccount(accounts[0] || {});
  const [apiData, setApiData] = useState(null);

  useEffect(() => {
    if (account) {
      instance
        .acquireTokenSilent({
          scopes: ["User.Read"],
          account: account,
        })
        .then((response) => {
          const accessToken = response.idToken;
          console.log(accessToken);
          // console.log(accessToken);
          fetch("http://localhost:3000/api/auth", {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [account, instance]);

  if (accounts.length > 0) {
    return (
      <>
        <span>There are currently {accounts.length} users signed in!</span>
        {apiData && (
          <span>Data retreived from API: {JSON.stringify(apiData)}</span>
        )}
      </>
    );
  } else if (inProgress === "login") {
    return <span>Login is currently in progress!</span>;
  } else {
    return <span>There are currently no users signed in!</span>;
  }
}
