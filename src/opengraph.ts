import type { SuccessResult } from 'open-graph-scraper-lite';

export default async function generateOG(result: SuccessResult, url: string, siteUrl: string): Promise<Response> {
  const data = result.result;

  const headers: Array<string> = []
  function addTag(tag: string, content: string) {
    headers.push(`<meta property="${tag}" content="${content}">`)
  }

  // og tags
  if (data.ogTitle) addTag("og:title", data.ogTitle);
  if (data.ogDescription) addTag("og:description", data.ogDescription);
  if (data.ogSiteName) addTag("og:site_name", data.ogSiteName);

  if (data.ogUrl) addTag("og:url", data.ogUrl)
  else addTag("og:url", siteUrl);

  addTag("og:type", "website");

  if (data.ogImage && data.ogImage[0] && /^https?:\/\//.test(data.ogImage[0].url)) {
    // const encoded = encodeURIComponent(siteUrl);
    const imageUrl = new URL(`/og-image/${siteUrl}`, url).toString();
    addTag("og:image", `${imageUrl}`);
  }

  // favicon
  if (data.favicon) headers.push(`<link rel="icon" href="${data.favicon}">`);

  // redirect
  headers.push(`<meta http-equiv="refresh" content="0; url=${siteUrl}">`);

  // convert to one string
  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>${data.ogTitle || ''}</title>
        ${headers.join('\n        ')}
      </head>
      <body>
        <p>Redirecting to <a href="${siteUrl}">${siteUrl}</a></p>
      </body>
    </html>
  `;

  return new Response(html, { headers: { "Content-Type": "text/html" } });
}
