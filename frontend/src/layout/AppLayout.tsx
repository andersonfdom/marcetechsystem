import React from 'react'
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { logoff } from '../api/auth'

export function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false)
  const [cadastroOpen, setCadastroOpen] = React.useState(false)

  // No mobile, iniciar fechado
  React.useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 991px)').matches
    if (isMobile) setSidebarCollapsed(true)
  }, [])

  // Ao navegar no mobile, fechar o menu e remover o overlay
  React.useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 991px)').matches
    if (isMobile) {
      setSidebarCollapsed(true)
      setCadastroOpen(false)
    }
  }, [location.pathname])

  function toggleSidebar() {
    setSidebarCollapsed((v) => !v)
  }

  function closeSidebarOnMobile() {
    const isMobile = window.matchMedia('(max-width: 991px)').matches
    if (isMobile) setSidebarCollapsed(true)
  }

  function toggleCadastro(e: React.MouseEvent) {
    e.preventDefault()
    setCadastroOpen((v) => !v)
  }

  async function handleLogoff() {
    await logoff()
    closeSidebarOnMobile()
    navigate('/login')
  }

  return (
    <div className="app-container">
      <div
        className={`mobile-overlay ${!sidebarCollapsed ? 'active' : ''}`}
        onClick={closeSidebarOnMobile}
      ></div>

      <button className="toggle-sidebar" type="button" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="logo">
          <img src="/img/logo.jpg" alt="MarceTech" />
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-menu">
            <li className="nav-item">
              <NavLink className="nav-link" to="/dashboard" onClick={closeSidebarOnMobile}>
                <div className="nav-content">
                  <i className="fas fa-home"></i>
                  <span className="nav-text">Dashboard</span>
                </div>
              </NavLink>
            </li>

            <li className={`nav-item has-submenu ${cadastroOpen ? 'active' : ''}`}>
              <a href="#" className="nav-link" onClick={toggleCadastro}>
                <div className="nav-content">
                  <i className="fas fa-folder-plus"></i>
                  <span className="nav-text">Cadastro</span>
                </div>
              </a>

              <ul className="submenu">
                <li className="nav-item">
                  <NavLink className="nav-link" to="/clientes" onClick={closeSidebarOnMobile}>
                    <div className="nav-content">
                      <i className="fas fa-users"></i>
                      <span className="nav-text">Clientes</span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/lojas" onClick={closeSidebarOnMobile}>
                    <div className="nav-content">
                      <i className="fas fa-store"></i>
                      <span className="nav-text">Lojas</span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/vendedores" onClick={closeSidebarOnMobile}>
                    <div className="nav-content">
                      <i className="fas fa-user-tie"></i>
                      <span className="nav-text">Vendedores</span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/materiais" onClick={closeSidebarOnMobile}>
                    <div className="nav-content">
                      <i className="fas fa-box"></i>
                      <span className="nav-text">Materiais</span>
                    </div>
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink className="nav-link" to="/usuarios" onClick={closeSidebarOnMobile}>
                    <div className="nav-content">
                      <i className="fas fa-user-cog"></i>
                      <span className="nav-text">Usuários do Sistema</span>
                    </div>
                  </NavLink>
                </li>
              </ul>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/orcamentos" onClick={closeSidebarOnMobile}>
                <div className="nav-content">
                  <i className="fas fa-money-bill"></i>
                  <span className="nav-text">Orçamentos</span>
                </div>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/configuracoes" onClick={closeSidebarOnMobile}>
                <div className="nav-content">
                  <i className="fas fa-wrench"></i>
                  <span className="nav-text">Configurações do Sistema</span>
                </div>
              </NavLink>
            </li>

            <li className="nav-item">
              <button type="button" className="nav-link nav-button" onClick={handleLogoff}>
                <div className="nav-content">
                  <i className="fas fa-sign-out-alt"></i>
                  <span className="nav-text">Sair</span>
                </div>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="main-content">
        <header className="main-header">
          <div className="user-info">
            <div className="welcome">
              <div className="row">
                <div className="col">
                  <i className="fas fa-user"></i> <b>Bem-vindo:</b> {/* TODO: puxar do backend */}
                </div>
                <div className="col">
                  <i className="fas fa-user-check"></i> <b>Cliente:</b> {/* TODO: puxar do backend */}
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div
              id="mensagemRetornoCadOrcamento"
              className="alert alert-warning"
              style={{ display: 'none' }}
            ></div>
          </div>
          <div className="row">
            <div id="mensagemCritica" className="alert alert-danger" style={{ display: 'none' }}></div>
          </div>
        </header>

        <main id="templatePrincipal" className="content-wrapper">
          <Outlet />
        </main>

        <footer className="main-footer">
          <div className="container-fluid">
            <div className="row align-items-center">
              <div className="col-md-6 text-md-start text-center">
                &copy; {new Date().getFullYear()} - MarceTech - Todos os direitos reservados
              </div>
              <div className="col-md-6 text-md-end text-center">
                <span className="text-muted">Versão 2.0.0</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
