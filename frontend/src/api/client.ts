import axios from 'axios'

/**
 * Se o React estiver hospedado no MESMO domínio do ASP.NET, a sessão/cookie funciona sem nada extra.
 * Se estiver em domínio/porta diferente, você precisa:
 *  - habilitar CORS no backend
 *  - e manter withCredentials = true
 */
export const api = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

/** Heurística simples: se o backend devolver HTML da tela de login, consideramos sessão expirada. */
export function isLikelyLoginHtml(payload: unknown): boolean {
  if (typeof payload !== 'string') return false
  const s = payload.toLowerCase()
  return s.includes('acesso restrito') || s.includes('marcetech - login') || s.includes('id="btnlogin"')
}