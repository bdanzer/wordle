import { useEffect, useState } from "react";
import { ReactElement } from "react";

declare global {
  interface Window {
    google: any;
    [key: string]: any;
  }
}

export interface IGoogleOneTapLogin extends IUseGoogleOneTapLogin {
  children?: ReactElement | null;
}

export interface IUseGoogleOneTapLogin {
  enableOneTap: boolean;
  disabled?: boolean;
  onError?: (error?: Error | string) => void;
  googleAccountConfigs: IGoogleOneTapLoginProps;
  onSuccess?: (response: any) => void;
  ref?: any;
}

export interface IGoogleOneTapLoginProps {
  nonce?: string;
  context?: string;
  client_id: string;
  auto_select?: boolean;
  prompt_parent_id?: string;
  state_cookie_domain?: string;
  cancel_on_tap_outside?: boolean;
  callback?: (...args: any) => any;
  native_callback?: (...args: any) => any;
}

export interface IGoogleCallbackResponse {
  credential?: string;
}

export interface IGoogleEndPointResponse {
  iss: string;
  sub: string;
  azp: string;
  aud: string;
  iat: string;
  exp: string;
  name: string;
  email: string;
  local: string;
  picture: string;
  given_name: string;
  family_name: string;
  email_verified: string;
}

export default function useScript(src: string, scriptOnload: any): string {
  // Keep track of script status ("idle", "loading", "ready", "error")
  const [status, setStatus] = useState<string>(src ? "loading" : "idle");

  useEffect(
    () => {
      // Allow falsy src value if waiting on other data needed for
      // constructing the script URL passed to this hook.
      if (!src) {
        setStatus("idle");
        return;
      }

      // Fetch existing script element by src
      // It may have been added by another intance of this hook
      let script: HTMLScriptElement | null = document.querySelector(
        `script[src="${src}"]`
      );

      if (!script) {
        // Create script
        script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.setAttribute("data-status", "loading");
        script.onload = scriptOnload;
        // Add script to document body
        document.body.appendChild(script);

        // Store status in attribute on script
        // This can be read by other instances of this hook
        const setAttributeFromEvent = (event: Event) => {
          !!script &&
            script.setAttribute(
              "data-status",
              event.type === "load" ? "ready" : "error"
            );
        };

        script.addEventListener("load", setAttributeFromEvent);
        script.addEventListener("error", setAttributeFromEvent);
      } else {
        // Grab existing script status from attribute and set to state.
        setStatus(script.getAttribute("data-status") || "idle");
      }

      // Script event handler to update status in state
      // Note: Even if the script already exists we still need to add
      // event handlers to update the state for *this* hook instance.
      const setStateFromEvent = (event: Event) => {
        setStatus(event.type === "load" ? "ready" : "error");
      };

      // Add event listeners
      script.addEventListener("load", setStateFromEvent);
      script.addEventListener("error", setStateFromEvent);

      // Remove event listeners on cleanup
      return () => {
        if (script) {
          script.removeEventListener("load", setStateFromEvent);
          script.removeEventListener("error", setStateFromEvent);
        }
      };
    },
    [src] // Only re-run effect if script src changes
  );

  return status;
}

const scriptFlag: string = "__googleOneTapScript__";
const googleClientScriptURL: string = "https://accounts.google.com/gsi/client";
const oauthEndpointURL: string =
  "https://oauth2.googleapis.com/tokeninfo?id_token=";

function callback({
  data,
  onError,
  onSuccess,
}: {
  data: IGoogleCallbackResponse;
  onError?: IUseGoogleOneTapLogin["onError"];
  onSuccess?: IUseGoogleOneTapLogin["onSuccess"];
}) {
  console.log("callback data", data);
  if (data?.credential) {
    onSuccess?.(data);
    // fetch(`${oauthEndpointURL}${data.credential}`)
    //   .then((resp) => {
    //     if (resp?.status === 200 && resp?.json) {
    //       return resp.json();
    //     } else {
    //       if (onError) {
    //         onError();
    //       }
    //       throw new Error('Something went wrong');
    //     }
    //   })
    //   .then((resp: IGoogleEndPointResponse) => {
    //     if (onSuccess) {
    //       onSuccess(resp);
    //     }
    //   })
    //   .catch((error) => {
    //     if (onError) {
    //       onError(error);
    //     }
    //     throw error;
    //   });
  }
}

export function useOneTap({
  enableOneTap,
  onError,
  disabled,
  onSuccess,
  googleAccountConfigs,
  ref,
}: IUseGoogleOneTapLogin) {
  const script = useScript(googleClientScriptURL, () => {
    console.log("this was called after script loaded");
  });
  console.log("googleAccountConfigs", googleAccountConfigs);

  useEffect(() => {
    if (!enableOneTap) {
      return;
    }

    if (!window?.[scriptFlag] && window.google && script === "ready") {
      console.log("hello this is working");
      window.google.accounts.id.initialize({
        ...googleAccountConfigs,
        callback: (data: IGoogleCallbackResponse) =>
          callback({ data, onError, onSuccess }),
      });
      window[scriptFlag] = true;
      window.google.accounts.id.prompt();
      if (ref) {
        window.google.accounts.id.renderButton(ref.current, {
          theme: "outline",
          size: "large",
        });
      }
    }
    // if (window?.[scriptFlag] && script === 'ready' && !disabled) {
    //   console.log('hello this is working 2')
    //   window.google.accounts.id.prompt();
    //   window.google.accounts.id.renderButton(ref.current, {
    //     theme: 'outline',
    //     size: 'large',
    //   })
    // }
  }, [script, window?.[scriptFlag], disabled, enableOneTap]);

  return null;
}
