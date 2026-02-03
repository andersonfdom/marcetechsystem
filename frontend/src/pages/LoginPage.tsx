import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login, recuperarSenha } from '../api/auth'
import { Alert } from '../components/Alert'
import type { ApiStatus } from '../api/types'

export function LoginPage() {
  const navigate = useNavigate()
  const [usuario, setUsuario] = React.useState('')
  const [senha, setSenha] = React.useState('')
  const [status, setStatus] = React.useState<ApiStatus>('info')
  const [message, setMessage] = React.useState('')

  async function handleLogin() {
    setMessage('')
    if (!usuario.trim()) { setStatus('erro'); setMessage('Entre com seu usuário(email).'); return }
    if (!senha.trim()) { setStatus('erro'); setMessage('Digite sua senha.'); return }

    const resp = await login(usuario.trim(), senha.trim())
    setStatus(resp.status)
    setMessage(resp.message)

    if (resp.status === 'sucesso') navigate('/dashboard')
  }

  async function handleRecuperar() {
    setMessage('')
    if (!usuario.trim()) { setStatus('erro'); setMessage('Informe seu e-mail para recuperação.'); return }
    const resp = await recuperarSenha(usuario.trim())
    setStatus(resp.status)
    setMessage(resp.message)
  }

  return (
    <div className="login-container">
      <div className="row">
        <div className="col">
          <img src="/img/logo.jpg" className="logo" alt="MarceTech Logo" />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <h2>Acesso Restrito</h2>
          <Alert status={status} message={message} onClose={() => setMessage('')} />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <input
            type="email"
            className="form-control"
            placeholder="Entre com seu e-mail"
            autoComplete="username"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <input
            type="password"
            className="form-control"
            placeholder="Digite sua senha"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        <div className="col">
          <Link to="/pre-cadastro" className="recuperar">
            <i className="fas fa-user-plus me-2"></i>Pré-Cadastro
          </Link>
        </div>
        <div className="col">
          <a href="#" className="recuperar" onClick={(e) => { e.preventDefault(); handleRecuperar() }}>
            <i className="fas fa-key me-2"></i>Esqueci minha senha
          </a>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <button type="button" className="btn btn-primary btn-lg" onClick={handleLogin}>
            Acessar Sistema
          </button>
        </div>
      </div>
    </div>
  )
}