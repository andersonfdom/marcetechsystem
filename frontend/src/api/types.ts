export type ApiStatus = 'sucesso' | 'erro' | 'alerta' | 'info'

export interface ApiMessage {
  status: ApiStatus
  message: string
}

export interface Cliente {
  idCliente: number
  nome: string
  telefone: string
  email: string
}