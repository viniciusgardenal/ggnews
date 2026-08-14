/**
 * Defensive HTML Sanitizer for Core Loop News Rich Text content.
 * Protects against Stored XSS by stripping scripts, dangerous tags,
 * inline event handlers, and unsafe URI schemes.
 */
export function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml || typeof dirtyHtml !== 'string') {
    return '';
  }

  let clean = dirtyHtml;

  // 1. Remove dangerous executable/injection tags and their contents
  const dangerousTags = [
    'script',
    'style',
    'object',
    'embed',
    'applet',
    'base',
    'form',
    'input',
    'button',
    'textarea',
    'select',
    'meta',
    'link',
  ];

  for (const tag of dangerousTags) {
    const regex = new RegExp(`<${tag}\\b[^>]*>[\\s\\S]*?<\\/${tag}>|<${tag}\\b[^>]*\\/?>`, 'gi');
    clean = clean.replace(regex, '');
  }

  // 2. Remove all inline event handlers (e.g. onload, onerror, onclick, onmouseover)
  clean = clean.replace(/\s+on[a-zA-Z]+\s*=\s*(?:["'][^"']*["']|[^\s>]+)/gi, '');

  // 3. Remove javascript:, vbscript:, and data:text/html URI schemes in attributes
  clean = clean.replace(
    /\b(href|src|action|poster)\s*=\s*["']?\s*(?:javascript|vbscript|data\s*:\s*text\/html)[\s\S]*?["'\s>]/gi,
    ' '
  );

  // 4. Secure iframe tags: Allow only approved video embed providers (YouTube, Vimeo)
  clean = clean.replace(/<iframe\b([^>]*)>/gi, (match, attrs) => {
    const srcMatch = attrs.match(/src\s*=\s*["']([^"']+)["']/i);
    if (!srcMatch) {
      return ''; // No src, strip iframe
    }
    const srcUrl = srcMatch[1];
    const isAllowedDomain =
      srcUrl.startsWith('https://www.youtube.com/embed/') ||
      srcUrl.startsWith('https://www.youtube-nocookie.com/embed/') ||
      srcUrl.startsWith('https://player.vimeo.com/video/');

    if (!isAllowedDomain) {
      return ''; // Untrusted source, strip iframe
    }

    // Return safe sandboxed iframe
    return `<iframe src="${srcUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>`;
  });

  // 5. Ensure external links have safe rel attributes
  clean = clean.replace(/<a\b([^>]*)>/gi, (match, attrs) => {
    if (!/rel\s*=/i.test(attrs)) {
      return `<a ${attrs} rel="noopener noreferrer">`;
    }
    return match;
  });

  return clean;
}
