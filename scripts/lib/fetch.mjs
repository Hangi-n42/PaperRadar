// Allow-listed page fetching. A venue's adapter may only read hosts it
// declared, including after redirects, so a hijacked link cannot feed us data.
import { createHash } from 'node:crypto';

export const USER_AGENT = 'PaperRadar/1.0 (+https://github.com/jhparkland/PaperRadar; deadline tracker)';

export function hostAllowed(url, allowedHosts) {
  try {
    const host = new URL(url).hostname.toLowerCase();
    return allowedHosts.some((h) => h.toLowerCase() === host);
  } catch {
    return false;
  }
}

export function sha256(text) {
  return createHash('sha256').update(text, 'utf8').digest('hex');
}

/**
 * @returns {Promise<{ok:boolean, status?:number, text?:string, contentHash?:string, finalUrl?:string, error?:string}>}
 */
export async function fetchSource(url, { allowedHosts, timeoutMs = 20_000, fetchImpl = globalThis.fetch } = {}) {
  if (!hostAllowed(url, allowedHosts)) return { ok: false, error: `host of ${url} is not in allowedHosts` };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    // 리다이렉트 목적지도 요청 전에 검사하여 선언하지 않은 호스트에 접속하지 않습니다.
    let target = url, res;
    for (let hop = 0; hop <= 5; hop++) {
      res = await fetchImpl(target, {
        redirect: 'manual', signal: controller.signal,
        headers: { 'user-agent': USER_AGENT, accept: 'text/html,application/xhtml+xml,text/plain;q=0.9,*/*;q=0.5' },
      });
      if (![301, 302, 303, 307, 308].includes(res.status)) break;
      const location = res.headers?.get('location');
      await res.body?.cancel();
      if (!location) return { ok: false, error: 'redirect has no location' };
      target = new URL(location, target).href;
      if (!hostAllowed(target, allowedHosts)) return { ok: false, error: `redirected to ${target}, which is not in allowedHosts` };
      if (hop === 5) return { ok: false, error: 'too many redirects' };
    }
    const finalUrl = res.url || target;
    if (!hostAllowed(finalUrl, allowedHosts)) return { ok: false, status: res.status, error: `redirected to ${finalUrl}, which is not in allowedHosts` };
    if (!res.ok) return { ok: false, status: res.status, finalUrl, error: `HTTP ${res.status}` };
    const text = await res.text();
    if (!text || text.trim().length === 0) return { ok: false, status: res.status, finalUrl, error: 'empty response body' };
    return { ok: true, status: res.status, text, contentHash: sha256(text), finalUrl };
  } catch (err) {
    const reason = err?.name === 'AbortError' ? `timeout after ${timeoutMs} ms` : (err?.message ?? String(err));
    return { ok: false, error: reason };
  } finally {
    clearTimeout(timer);
  }
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
};

/** HTML → single-line plain text with single spaces, so patterns are stable. */
export function htmlToText(html) {
  let s = String(html);
  s = s.replace(/<!--[\s\S]*?-->/g, ' ');
  s = s.replace(/<(script|style|noscript|template)\b[\s\S]*?<\/\1>/gi, ' ');
  s = s.replace(/<[^>]+>/g, ' ');
  s = decodeEntities(s);
  // 공백 문자를 통일하여 선언형 패턴을 안정적으로 적용합니다.
  return s.replace(/[​‌‍﻿]/g, '').replace(/\s+/g, ' ').trim();
}

// 임베드 속성에도 같은 엔티티 디코더를 사용하며 코드는 실행하지 않습니다.
export function decodeEntities(s) {
  return String(s).replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) && n >= 0 && n <= 0x10ffff ? String.fromCodePoint(n) : m;
    }
    return ENTITIES[code.toLowerCase()] ?? m;
  });
}
