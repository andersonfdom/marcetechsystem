import { api } from './client'
import type { ApiMessage } from './types'

export async function login(usuario: string, senha: string): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>('/RealizarLogin', { Usuario: usuario, Senha: senha })
  return data
}

export async function recuperarSenha(email: string): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>('/RecuperarSenha', { Email: email })
  return data
}

export async function logoff(): Promise<void> {
  await api.post('/RealizarLogoff')
}