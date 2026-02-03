import React from 'react'
import { Alert } from '../../components/Alert'
import type { ApiStatus, Cliente } from '../../api/types'
import { listarClientes, gravarCliente, excluirCliente, carregarCliente } from '../../api/clientes'

export function ClientesPage() {
  const [clientes, setClientes] = React.useState<Cliente[]>([])
  const [busca, setBusca] = React.useState('')
  const [status, setStatus] = React.useState<ApiStatus>('info')
  const [message, setMessage] = React.useState('')

  const [isOpen, setIsOpen] = React.useState(false)
  const [form, setForm] = React.useState({ idCliente: 0, nome: '', telefone: '', email: '' })
  const [loading, setLoading] = React.useState(false)

  async function refresh() {
    setLoading(true)
    try {
      const data = await listarClientes()
      setClientes(data)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => { refresh() }, [])

  const filtrados = React.useMemo(() => {
    const f = busca.trim().toLowerCase()
    if (!f) return clientes
    return clientes.filter(c =>
      (c.nome ?? '').toLowerCase().includes(f) ||
      (c.telefone ?? '').toLowerCase().includes(f) ||
      (c.email ?? '').toLowerCase().includes(f)
    )
  }, [clientes, busca])

  function novoCliente() {
    setForm({ idCliente: 0, nome: '', telefone: '', email: '' })
    setIsOpen(true)
  }

  async function editar(idCliente: number) {
    const c = await carregarCliente(idCliente)
    setForm({
      idCliente: (c as any).IdCliente ?? (c as any).idCliente ?? idCliente,
      nome: (c as any).Nome ?? (c as any).nome ?? '',
      telefone: (c as any).Telefone ?? (c as any).telefone ?? '',
      email: (c as any).Email ?? (c as any).email ?? '',
    })
    setIsOpen(true)
  }

  async function salvar() {
    setMessage('')
    const resp = await gravarCliente(form)
    setStatus(resp.status)
    setMessage(resp.message)
    if (resp.status === 'sucesso') {
      setIsOpen(false)
      await refresh()
    }
  }

  async function remover(idCliente: number) {
    if (!confirm('Deseja excluir este cliente?')) return
    const resp = await excluirCliente(idCliente)
    setStatus(resp.status)
    setMessage(resp.message)
    if (resp.status === 'sucesso') await refresh()
  }

  return (
    <div className="clients-container">
      <h1>Clientes</h1>

      <Alert status={status} message={message} onClose={() => setMessage('')} />

      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <i className="fas fa-info-circle"></i> Este espaço é reservado para o Cadastro de Clientes.
          </div>
        </div>
      </div>

      <div className="card client-card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="card-title mb-0">Lista de Clientes</h4>
            <div className="d-flex gap-2">
              <button type="button" className="btn botaoAcesso" onClick={novoCliente}>
                <i className="fas fa-plus me-2"></i> Novo Cliente
              </button>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-md-6">
              <input
                id="buscaClientes"
                className="form-control"
                placeholder="Buscar clientes..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
            <div className="col-md-6 text-end">
              <button type="button" className="btn btn-outline-secondary" onClick={refresh} disabled={loading}>
                <i className="fas fa-rotate"></i> {loading ? 'Carregando...' : 'Atualizar'}
              </button>
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-hover" id="dadosCliente">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Telefone</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody id="gridDadosCliente">
                {filtrados.map((c: any) => {
                  const id = c.IdCliente ?? c.idCliente
                  return (
                    <tr key={id}>
                      <td>{c.Nome ?? c.nome}</td>
                      <td>{c.Telefone ?? c.telefone}</td>
                      <td>{c.Email ?? c.email}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <button className="btn btn-sm btn-outline-primary" onClick={() => editar(id)}>
                            <i className="fas fa-pen"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => remover(id)}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal simples (sem bootstrap modal para manter enxuto) */}
      {isOpen ? (
        <div className="modal-backdrop show" style={{ display: 'block' }}>
          <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{form.idCliente ? 'Editar Cliente' : 'Novo Cliente'}</h5>
                  <button className="btn-close" onClick={() => setIsOpen(false)} />
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label">Nome</label>
                    <input className="form-control" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Telefone</label>
                    <input className="form-control" value={form.telefone} onChange={(e) => setForm({ ...form, telefone: e.target.value })} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">E-mail</label>
                    <input className="form-control" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setIsOpen(false)}>Cancelar</button>
                  <button className="btn btn-primary" onClick={salvar}>Salvar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}