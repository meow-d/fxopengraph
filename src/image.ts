import type { SuccessResult } from 'open-graph-scraper-lite';
import { ImageResponse } from "workers-og";


export default async function generateImage(result: SuccessResult, url: string, env: any): Promise<Response> {
  const data = result.result;

  const img = (data.ogImage && /^https?:\/\//.test(data.ogImage[0].url))
    ? `<img src="${data.ogImage[0].url}" alt="Preview image" style="object-fit: cover; flex: 0 0 25%;">`
    : "";

  const bgUrl = new URL("/background.svg", url).toString();

  const ogHtml = `
    <!-- grr background-image doesn't work!!! -->
    <img style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; background: #fff;" src="${bgUrl}" alt="Background image">

    <div style="
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100vh;
      width: 100vw;
      font-family: Inter, sans-serif;
      padding: 2em;
      color: #000;
      gap: 2em;
      box-sizing: border-box;
    ">
      ${img}

      <div style="flex: 1; display: flex; flex-direction: column; gap: 1em; overflow: hidden;">
        <span style="font-size: 20px; font-weight: 600; opacity: 0.8; text-transform: uppercase; letter-spacing: 3px;">
          ${data.ogSiteName || ''}
        </span>

        <h1 style="font-size: 52px;  font-weight: 800; margin: 0;">
          ${data.ogTitle || ''}
        </h1>

        <p style="font-size: 26px; font-weight: 400; margin: 0; opacity: 0.9; line-height: 1.4;">
          ${data.ogDescription || ''}
        </p>

        <div style="display: flex; font-size: 22px; color: #6e22f7; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
          ${data.ogUrl || ''}
        </div>
      </div>
    </div>
    `;

  // :3 for testing
  // return new Response(ogHtml, { headers: { "Content-Type": "text/html" } });

  const interRegular = await env.ASSETS.fetch(new URL("/Inter_18pt-Regular.ttf", url));
  const interBold = await env.ASSETS.fetch(new URL("/Inter_18pt-Bold.ttf", url));
  const interRegularData = await interRegular.arrayBuffer();
  const interBoldData = await interBold.arrayBuffer();

  return new ImageResponse(ogHtml, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: interRegularData,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'Inter',
        data: interBoldData,
        weight: 700,
        style: 'normal',
      },
    ],
  });
}
