import { api } from './client'
import type { ApiMessage, Cliente } from './types'

/**
 * Endpoints vêm de wwwroot/js/clientes.js:
 *  - /ListarDadosCliente
 *  - /GravarDadosCliente
 *  - /CarregarDadosCliente?id=...
 *  - /ExcluirDadosCliente?id=...
 */
export async function listarClientes(): Promise<Cliente[]> {
  const { data } = await api.post('/ListarDadosCliente')
  return data as Cliente[]
}

export async function carregarCliente(idCliente: number): Promise<Cliente> {
  const { data } = await api.post(`/CarregarDadosCliente?id=${idCliente}`)
  return data as Cliente
}

export async function gravarCliente(payload: { idCliente: number; nome: string; telefone: string; email: string }): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>('/GravarDadosCliente', {
    IdCliente: payload.idCliente,
    Nome: payload.nome,
    Telefone: payload.telefone,
    Email: payload.email,
  })
  return data
}

export async function excluirCliente(idCliente: number): Promise<ApiMessage> {
  const { data } = await api.post<ApiMessage>(`/ExcluirDadosCliente?id=${idCliente}`)
  return data
}