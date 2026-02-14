import { ImageResponse } from "next/og";
import { createElement as h } from "react";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

function clamp(input: string, maxLen: number) {
  if (input.length <= maxLen) return input;
  return input.slice(0, Math.max(0, maxLen - 3)).trimEnd() + "...";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const rawTitle = searchParams.get("title") || "Smile Fotilo";
  const rawSubtitle =
    searchParams.get("subtitle") || "Web Design, Branding & Digital Marketing";

  const title = clamp(rawTitle, 80);
  const subtitle = clamp(rawSubtitle, 120);

  const pills = ["Web Design", "SEO", "Branding"];

  const element = h(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background:
          "linear-gradient(135deg, rgba(2,6,23,1) 0%, rgba(10,1,24,1) 55%, rgba(30,27,75,1) 100%)",
        color: "white",
        fontFamily:
          'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
        position: "relative",
        overflow: "hidden",
      },
    },
    // Ambient glows
    h("div", {
      style: {
        position: "absolute",
        width: 720,
        height: 720,
        borderRadius: 9999,
        left: -220,
        top: -260,
        background: "rgba(99,102,241,0.28)",
        filter: "blur(90px)",
      },
    }),
    h("div", {
      style: {
        position: "absolute",
        width: 600,
        height: 600,
        borderRadius: 9999,
        right: -180,
        bottom: -240,
        background: "rgba(168,85,247,0.22)",
        filter: "blur(90px)",
      },
    }),

    // Header
    h(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "relative",
          zIndex: 1,
        },
      },
      h(
        "div",
        {
          style: {
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 800,
            fontSize: 22,
            letterSpacing: "-0.02em",
          },
        },
        "SF"
      ),
      h("div", { style: { fontSize: 22, opacity: 0.9 } }, "smilefotilo.com")
    ),

    // Title block
    h(
      "div",
      { style: { position: "relative", zIndex: 1 } },
      h(
        "div",
        {
          style: {
            fontSize: 74,
            fontWeight: 900,
            lineHeight: 1.04,
            letterSpacing: "-0.04em",
            marginBottom: 18,
            maxWidth: 980,
          },
        },
        title
      ),
      h(
        "div",
        {
          style: {
            fontSize: 34,
            lineHeight: 1.2,
            opacity: 0.9,
            maxWidth: 980,
          },
        },
        subtitle
      )
    ),

    // Footer
    h(
      "div",
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          position: "relative",
          zIndex: 1,
        },
      },
      h(
        "div",
        { style: { display: "flex", gap: 10, flexWrap: "wrap" } },
        ...pills.map((pill) =>
          h(
            "div",
            {
              key: pill,
              style: {
                padding: "10px 14px",
                borderRadius: 999,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                fontSize: 20,
                fontWeight: 650,
              },
            },
            pill
          )
        )
      ),
      h(
        "div",
        { style: { fontSize: 20, opacity: 0.85, whiteSpace: "nowrap" } },
        "Gonda • Lucknow • Global"
      )
    )
  );

  const res = new ImageResponse(element, size);
  res.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  return res;
}
