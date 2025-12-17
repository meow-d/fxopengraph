import type { SuccessResult } from 'open-graph-scraper-lite';
import { ImageResponse } from "workers-og";


export default async function generateImage(result: SuccessResult, url: string, env: any): Promise<Response> {
  const data = result.result;

  const img = (data.ogImage && /^https?:\/\//.test(data.ogImage[0].url))
    ? `<img src="${data.ogImage[0].url}" alt="Preview image" style="object-fit: cover; flex: 0 0 25%;">`
    : "";

  const ogHtml = `
    <img width="1200" height="600" style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh; object-fit: cover; background: #fff;" src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbG5zOnN2Z2pzPSJodHRwOi8vc3ZnanMuZGV2L3N2Z2pzIiB2aWV3Qm94PSIwIDAgODAwIDQ1MCIgb3BhY2l0eT0iMC41Ij48ZGVmcz48ZmlsdGVyIGlkPSJiYmJsdXJyeS1maWx0ZXIiIHg9Ii0xMDAlIiB5PSItMTAwJSIgd2lkdGg9IjQwMCUiIGhlaWdodD0iNDAwJSIgZmlsdGVyVW5pdHM9Im9iamVjdEJvdW5kaW5nQm94IiBwcmltaXRpdmVVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+Cgk8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSI2OCIgeD0iMCUiIHk9IjAlIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBpbj0iU291cmNlR3JhcGhpYyIgZWRnZU1vZGU9Im5vbmUiIHJlc3VsdD0iYmx1ciI+PC9mZUdhdXNzaWFuQmx1cj48L2ZpbHRlcj48L2RlZnM+PGcgZmlsdGVyPSJ1cmwoI2JiYmx1cnJ5LWZpbHRlcikiPjxlbGxpcHNlIHJ4PSIxMjguNSIgcnk9IjEyOCIgY3g9IjE4NC41ODAyNzk2MjQzMDU0IiBjeT0iNDkxLjA5NjQ0MTE4NjI5NDE2IiBmaWxsPSJoc2xhKDMzOSwgODglLCA1MiUsIDEuMDApIj48L2VsbGlwc2U+PGVsbGlwc2Ugcng9IjEyOC41IiByeT0iMTI4IiBjeD0iMzYyLjE5MjA1ODYyMzcyMTciIGN5PSIxNTUuMTU5NjgyNDAxNTg1MjMiIGZpbGw9ImhzbCgxODUsIDEwMCUsIDU3JSkiPjwvZWxsaXBzZT48ZWxsaXBzZSByeD0iMTI4LjUiIHJ5PSIxMjgiIGN4PSI1NjQuOTIzNTgyMjE3NTY2MSIgY3k9IjI0OS41OTUxNTc4OTkxNzE2OCIgZmlsbD0iaHNsYSgyODIsIDcxJSwgNjElLCAxLjAwKSI+PC9lbGxpcHNlPjwvZz48L3N2Zz4=" alt="Background image">

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
    height: 600,
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
