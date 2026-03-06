import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout: React.FC = () => {
  // Inicializa baseado no tamanho da tela
  const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 992);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 992) setSidebarOpen(false);
      else setSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper para fechar sidebar no mobile após clicar em link
  const closeSidebarMobile = () => {
    if (window.innerWidth < 992) setSidebarOpen(false);
  };

  return (
    <div className="app-container">
      {/* Overlay para Mobile */}
      <div 
        className={`mobile-overlay ${isSidebarOpen && window.innerWidth < 992 ? 'active' : ''}`} 
        onClick={() => setSidebarOpen(false)}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? 'active' : 'collapsed'}`}>
        <div className="p-4 text-center border-bottom border-white border-opacity-10">
          <img src="/img/logo.jpg" alt="MarceTech" className="img-fluid rounded shadow-sm" style={{ maxHeight: '80px' }} />
        </div>
        
        <nav className="mt-2 flex-grow-1">
          <ul className="list-unstyled">
            {[
              { to: "/", icon: "fas fa-home", label: "Dashboard" },
              { to: "/clientes", icon: "fas fa-users", label: "Clientes" },
              { to: "/vendedores", icon: "fas fa-user-tie", label: "Vendedores" },
              { to: "/lojas", icon: "fas fa-store", label: "Lojas" },
              { to: "/materiais", icon: "fas fa-box", label: "Materiais" },
              { to: "/usuarios", icon: "fas fa-user-cog", label: "Usuários" },
              { to: "/configuracoes", icon: "fas fa-wrench", label: "Configurações" },
            ].map((item) => (
              <li key={item.to}>
                <Link 
                  to={item.to} 
                  className={`nav-link p-3 text-white d-flex align-items-center ${location.pathname === item.to ? 'bg-primary' : ''}`} 
                  onClick={closeSidebarMobile}
                  style={{ transition: 'background 0.2s' }}
                >
                  <i className={`${item.icon} me-3`} style={{ width: '20px' }}></i> {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto border-top border-white border-opacity-10">
          <Link to="/login" className="nav-link p-3 text-white d-flex align-items-center bg-danger bg-opacity-10" onClick={closeSidebarMobile}>
            <i className="fas fa-sign-out-alt me-3"></i> Sair do Sistema
          </Link>
        </div>
      </aside>

      <div className="main-wrapper">
        <header className="main-header border-bottom">
          <button className="toggle-sidebar-btn" onClick={() => setSidebarOpen(!isSidebarOpen)}>
            <i className={`fas ${isSidebarOpen && window.innerWidth < 992 ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
          
          <div className="d-flex align-items-center">
            <div className="text-end me-3 d-none d-sm-block">
              <div className="fw-bold small lh-1">Administrador</div>
              <small className="text-muted">MarceTech Matriz</small>
            </div>
            <i className="fas fa-user-circle fa-2x text-primary"></i>
          </div>
        </header>

        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;