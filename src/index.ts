import ogs from 'open-graph-scraper-lite';
import generateImage from './image';
import generateOG from './opengraph';


// constants
// ripped from FxEmbed's code lol
const BOT_UA_REGEX = /bot|facebook|embed|got|firefox\/92|firefox\/38|curl|wget|go-http|yahoo|generator|whatsapp|revoltchat|preview|link|proxy|vkshare|images|analyzer|index|crawl|spider|python|node|mastodon|http\.rb|ruby|bun\/|fiddler|iframely|steamchaturllookup|bluesky|matrix-media-repo|cardyb|resolver|util/gi


// helpers
function validUrl(siteUrl: string): boolean {
  try {
    console.log(siteUrl)
    if (!URL.canParse(siteUrl)) return false;

    const url = new URL(siteUrl);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    if (!url.hostname) return false;
    if (url.hostname.split('.').length < 2) return false;

    return true;
  } catch (e) {
    return false;
  }
}


function isBotUA(request: Request): boolean {
  const userAgent = request.headers.get('User-Agent') || '';
  return BOT_UA_REGEX.test(userAgent);
}


async function parse(siteUrl: string) {
  const response = await fetch(siteUrl);
  const responseHtml = await response.text();
  return await ogs({ html: responseHtml });
}


export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const url = new URL(request.url);

    // no url
    if (url.pathname === '/') {
      return new Response(`example usage: ${request.url}https://example.com\ni think i'm going to hell for this`);
    }

    // generate og image
    if (url.pathname.startsWith("/og-image/")) {
      const siteUrl = decodeURIComponent(url.pathname.substring(10));
      if (!validUrl(siteUrl)) return new Response('Invalid URL', { status: 400 });
      // if (!isBotUA(request)) return Response.redirect(siteUrl, 302);

      const parsed = await parse(siteUrl);
      if (parsed.error) return new Response('Failed to parse', { status: 500 });
      return generateImage(parsed, request.url, env);
    }

    // generate og html
    const siteUrl = decodeURIComponent(url.pathname.substring(1));
    if (!validUrl(siteUrl)) return new Response('Invalid URL', { status: 400 });
    if (!isBotUA(request)) return Response.redirect(siteUrl, 302);

    const parsed = await parse(siteUrl);
    if (parsed.error) return new Response('Failed to parse', { status: 500 });
    return generateOG(parsed, request.url, siteUrl);
  },
} satisfies ExportedHandler<Env>;
