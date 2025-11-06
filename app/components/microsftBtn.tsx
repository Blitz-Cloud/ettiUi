import { useMsal } from "@azure/msal-react";
import { Button } from "./ui/button";

export default function MicrosoftBtn(props: any) {
  // const { instance, accounts, inProgress } = useMsal();
  return (
    <Button
      onClick={props.onClick}
      id="loginBtn"
      className="flex items-center justify-center  dark:bg-[#2f2f2f] bg-white px-[12px] mt-4 h-[41px] cursor-pointer font-semibold border-[1px] border-[#8c8c8c] hover:bg-white"
      style={{ fontFamily: "Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
    >
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="21"
          height="21"
          viewBox="0 0 21 21"
        >
          <title>MS-SymbolLockup</title>
          <rect x="1" y="1" width="9" height="9" fill="#f25022" />
          <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
          <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
          <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
        </svg>
      </div>
      <div className="inline-block mx-[12px] dark:text-white text-[#5E5E5E]">
        Sign in with Microsoft
      </div>
    </Button>
  );
}
