"use client";

import { useEffect, useRef, useState } from "react";

const RECAPTCHA_WIDTH = 304;
const RECAPTCHA_HEIGHT = 78;

type RecaptchaApi = {
  ready?: (callback: () => void) => void;
  render: (
    container: HTMLElement,
    parameters: {
      callback: (token: string) => void;
      "error-callback": () => void;
      "expired-callback": () => void;
      sitekey: string;
    }
  ) => number;
  reset: (widgetId?: number) => void;
};

declare global {
  interface Window {
    grecaptcha?: RecaptchaApi;
    toolmarketRecaptchaOnload?: () => void;
  }
}

let recaptchaScriptPromise: Promise<RecaptchaApi> | null = null;
let recaptchaScriptReady = false;

function resolveRecaptchaApi(attempt = 0): Promise<RecaptchaApi> {
  const recaptcha = window.grecaptcha;

  if (!recaptcha?.render) {
    if (attempt >= 20) {
      return Promise.reject(new Error("reCAPTCHA API is unavailable."));
    }

    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        resolveRecaptchaApi(attempt + 1).then(resolve, reject);
      }, 100);
    });
  }

  if (recaptcha.ready) {
    return new Promise<RecaptchaApi>((resolve) => {
      recaptcha.ready?.(() => {
        recaptchaScriptReady = true;
        resolve(recaptcha);
      });
    });
  }

  recaptchaScriptReady = true;

  return Promise.resolve(recaptcha);
}

function loadRecaptchaScript() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("reCAPTCHA is only available in the browser."));
  }

  if (recaptchaScriptReady && window.grecaptcha?.render) {
    return Promise.resolve(window.grecaptcha);
  }

  if (window.grecaptcha?.render) {
    return resolveRecaptchaApi();
  }

  if (recaptchaScriptPromise) {
    return recaptchaScriptPromise;
  }

  recaptchaScriptPromise = new Promise<RecaptchaApi>((resolve, reject) => {
    const scriptId = "toolmarket-recaptcha-script";
    const scriptUrl =
      "https://www.google.com/recaptcha/api.js?onload=toolmarketRecaptchaOnload&render=explicit";
    let settled = false;

    const resolveWhenReady = () => {
      resolveRecaptchaApi()
        .then((recaptcha) => {
          if (settled) {
            return;
          }

          settled = true;
          resolve(recaptcha);
        })
        .catch((error) => {
          if (settled) {
            return;
          }

          settled = true;
          recaptchaScriptPromise = null;
          reject(error);
        });
    };

    const rejectWithError = () => {
      if (settled) {
        return;
      }

      settled = true;
      recaptchaScriptPromise = null;
      reject(new Error("reCAPTCHA failed to load."));
    };

    const timeoutId = window.setTimeout(() => {
      rejectWithError();
    }, 15000);

    const finishResolve = () => {
      window.clearTimeout(timeoutId);
      resolveWhenReady();
    };

    const finishReject = () => {
      window.clearTimeout(timeoutId);
      rejectWithError();
    };

    window.toolmarketRecaptchaOnload = finishResolve;

    const existingScript = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (existingScript) {
      if (window.grecaptcha?.render) {
        finishResolve();
        return;
      }

      existingScript.addEventListener("load", finishResolve, { once: true });
      existingScript.addEventListener("error", finishReject, { once: true });
      return;
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", finishResolve, { once: true });
    script.addEventListener("error", finishReject, { once: true });
    document.head.appendChild(script);
  });

  return recaptchaScriptPromise;
}

export function RecaptchaCheckbox({
  onReadyChange,
  onTokenChange,
  resetNonce = 0,
  siteKey
}: {
  onReadyChange?: (ready: boolean) => void;
  onTokenChange: (token: string | null) => void;
  resetNonce?: number;
  siteKey: string;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const readyCallbackRef = useRef(onReadyChange);
  const tokenCallbackRef = useRef(onTokenChange);
  const [widgetScale, setWidgetScale] = useState(1);
  const [widgetError, setWidgetError] = useState<string | null>(null);
  const missingSiteKeyError = !siteKey ? "reCAPTCHA-ის საჯარო გასაღები ვერ მოიძებნა." : null;

  useEffect(() => {
    if (!wrapperRef.current) {
      return;
    }

    const updateScale = () => {
      const availableWidth = wrapperRef.current?.clientWidth ?? RECAPTCHA_WIDTH;

      if (availableWidth <= 0) {
        return;
      }

      setWidgetScale(Math.min(availableWidth / RECAPTCHA_WIDTH, 1));
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(wrapperRef.current);
    window.addEventListener("resize", updateScale);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, []);

  useEffect(() => {
    readyCallbackRef.current = onReadyChange;
  }, [onReadyChange]);

  useEffect(() => {
    tokenCallbackRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    let cancelled = false;

    readyCallbackRef.current?.(false);
    tokenCallbackRef.current(null);

    if (!siteKey) {
      return () => undefined;
    }

    loadRecaptchaScript()
      .then((recaptcha) => {
        if (cancelled || !containerRef.current || widgetIdRef.current !== null) {
          return;
        }

        setWidgetError(null);
        containerRef.current.innerHTML = "";
        widgetIdRef.current = recaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: (token) => {
            tokenCallbackRef.current(token);
          },
          "expired-callback": () => {
            tokenCallbackRef.current(null);
          },
          "error-callback": () => {
            tokenCallbackRef.current(null);
            setWidgetError("reCAPTCHA-ის შემოწმება ვერ შესრულდა. სცადეთ თავიდან.");
          }
        });

        readyCallbackRef.current?.(true);
      })
      .catch(() => {
        if (cancelled) {
          return;
        }

        readyCallbackRef.current?.(false);
        setWidgetError("reCAPTCHA ვერ ჩაიტვირთა. გთხოვთ სცადოთ თავიდან.");
      });

    return () => {
      cancelled = true;
    };
  }, [siteKey]);

  useEffect(() => {
    if (resetNonce === 0 || widgetIdRef.current === null || !window.grecaptcha?.reset) {
      return;
    }

    window.grecaptcha.reset(widgetIdRef.current);
    setWidgetError(null);
    tokenCallbackRef.current(null);
  }, [resetNonce]);

  return (
    <div className="grid gap-2">
      <div ref={wrapperRef} className="w-full max-w-full overflow-hidden">
        <div
          className="origin-top-left"
          style={{ height: `${Math.ceil(RECAPTCHA_HEIGHT * widgetScale)}px` }}
        >
          <div
            ref={containerRef}
            className="min-h-[78px] w-[304px] max-w-none"
            style={{
              transform: `scale(${widgetScale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
      </div>
      {missingSiteKeyError || widgetError ? (
        <p className="text-xs font-bold text-[#D92D20]">{missingSiteKeyError ?? widgetError}</p>
      ) : null}
    </div>
  );
}
