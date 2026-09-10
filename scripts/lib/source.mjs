// 공식 HTML이 참조하는 정적 모듈 및 임베드 데이터를 실행 없이 읽습니다.
import { parse } from 'acorn';
import { fetchSource, htmlToText, decodeEntities, sha256 } from './fetch.mjs';

function nodes(code) {
  const root = parse(code, { ecmaVersion: 'latest', sourceType: 'module' });
  const found = [], stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || typeof node !== 'object') continue;
    if (node.type) found.push(node);
    for (const value of Object.values(node)) {
      if (Array.isArray(value)) stack.push(...value);
      else if (value && typeof value === 'object') stack.push(value);
    }
  }
  return found.sort((a, b) => a.start - b.start);
}

function staticValue(node) {
  if (node?.type === 'Literal' && !node.regex && !node.bigint) return node.value;
  if (node?.type === 'UnaryExpression' && node.operator === '-' && node.argument.type === 'Literal'
      && typeof node.argument.value === 'number') return -node.argument.value;
  if (node?.type === 'ObjectExpression') {
    const out = Object.create(null);
    for (const p of node.properties) {
      if (p.type !== 'Property' || p.computed || p.method || p.kind !== 'init') throw new Error('non-static embedded property');
      const key = p.key.name ?? p.key.value;
      if (Object.hasOwn(out, key)) throw new Error('duplicate embedded property');
      out[key] = staticValue(p.value);
    }
    return out;
  }
  throw new Error('embedded data must contain static literals only');
}

export function sourceText(body, source = {}) {
  if (!source.format || source.format === 'html') return htmlToText(body);
  if (source.format === 'javascript-strings') {
    return nodes(body).filter(n => n.type === 'Literal' && typeof n.value === 'string')
      .map(n => n.value).join(' ').replace(/\s+/g, ' ').trim();
  }
  if (source.format === 'embedded-json') {
    // data-code에는 iframe에서 사용하는 원본 HTML이 엔티티 인코딩되어 있습니다.
    const attr = new RegExp('\\b' + source.attribute + '\\s*=\\s*(?:"([^"]*)"|\'([^\']*)\')', 'gi');
    const values = [];
    for (const match of body.matchAll(attr)) {
      const html = decodeEntities(match[1] ?? match[2]);
      for (const script of html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)) {
        for (const node of nodes(script[1])) {
          if (node.type === 'VariableDeclarator' && node.id.name === source.variable) values.push(staticValue(node.init));
        }
      }
    }
    if (values.length !== 1) throw new Error('expected exactly one embedded data variable');
    return JSON.stringify(values[0]).replace(/\s+/g, ' ');
  }
  throw new Error('unknown source format');
}

export async function fetchCfp(cfp, { fetchImpl } = {}) {
  try {
    let url = cfp.url;
    const hashes = [];
    let fetched = await fetchSource(url, { allowedHosts: cfp.allowedHosts, fetchImpl });
    for (const pattern of cfp.source?.follow ?? []) {
      if (!fetched.ok) return fetched;
      hashes.push(fetched.contentHash);
      const matches = [...fetched.text.matchAll(new RegExp(pattern, 'g'))];
      const refs = [...new Set(matches.map(m => decodeEntities(m[1] ?? '')))];
      if (refs.length !== 1 || !refs[0]) throw new Error('expected exactly one source reference');
      url = new URL(refs[0], fetched.finalUrl ?? url).href;
      // 매 단계의 URL은 기존 allow-list 수집기를 통과해야 합니다.
      fetched = await fetchSource(url, { allowedHosts: cfp.allowedHosts, fetchImpl });
    }
    if (!fetched.ok) return fetched;
    hashes.push(fetched.contentHash);
    return { ...fetched, text: sourceText(fetched.text, cfp.source), contentHash: sha256(hashes.join('\n')) };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}
