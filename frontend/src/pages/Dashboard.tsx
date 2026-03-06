import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dados mockados (substituir por chamadas de API ou Context futuramente)
  const stats = {
    clientes: 125,
    orcamentos: 14,
    contratos: 8
  };

  return (
    <div className="dashboard-container animate__animated animate__fadeIn">
      {/* Header do Dashboard */}
      <div className="dashboard-header mb-4 py-4 bg-light border-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-12">
              <h1 className="display-5 fw-bold text-dark">
                <i className="fas fa-tachometer-alt me-3 text-primary"></i>Dashboard MarceTech
              </h1>
              <p className="lead mb-0 text-muted">Excelência e gestão de sua marcenaria em suas mãos</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Cards de Estatísticas */}
        <div className="row mb-5">
          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card stat-card border-0 shadow-sm p-3">
              <div className="stat-number h2 fw-bold text-primary">{stats.clientes}</div>
              <div className="stat-label text-muted fw-medium">Clientes Cadastrados</div>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card stat-card border-0 shadow-sm p-3">
              <div className="stat-number h2 fw-bold text-warning">{stats.orcamentos}</div>
              <div className="stat-label text-muted fw-medium">Orçamentos em Aberto</div>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-warning" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-md-6 mb-4">
            <div className="card stat-card border-0 shadow-sm p-3">
              <div className="stat-number h2 fw-bold text-success">{stats.contratos}</div>
              <div className="stat-label text-muted fw-medium">Contratos Fechados</div>
              <div className="progress mt-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-success" style={{ width: '45%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Módulos Principais */}
          <div className="col-lg-12">
            <div className="row mb-4">
              <div className="col-12">
                <h3 className="mb-4 fw-bold">
                  <i className="fas fa-th-large me-2 text-primary"></i>Módulos do Sistema
                </h3>
              </div>

              {/* Cadastro de Clientes */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card module-card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="module-icon mb-3">
                      <i className="fas fa-users fa-3x text-primary opacity-75"></i>
                    </div>
                    <h5 className="card-title fw-bold">Cadastro de Clientes</h5>
                    <p className="card-text text-muted">Gerencie sua base de clientes</p>
                    <button 
                      type="button" 
                      className="btn btn-primary botaoAcesso px-4" 
                      onClick={() => navigate('/Clientes')}
                    >
                      <i className="fas fa-address-book me-2"></i> Gerenciar
                    </button>
                  </div>
                </div>
              </div>

              {/* Cadastro de Materiais */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card module-card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="module-icon mb-3">
                      <i className="fas fa-boxes fa-3x text-primary opacity-75"></i>
                    </div>
                    <h5 className="card-title fw-bold">Cadastro de Materiais</h5>
                    <p className="card-text text-muted">Configure categorias e itens para orçamentos</p>
                    <button 
                      type="button" 
                      className="btn btn-primary botaoAcesso px-4" 
                      onClick={() => navigate('/Materiais')}
                    >
                      <i className="fas fa-cogs me-2"></i> Configurar
                    </button>
                  </div>
                </div>
              </div>

              {/* Gerar Orçamento */}
              <div className="col-xl-4 col-md-6 mb-4">
                <div className="card module-card border-0 shadow-sm h-100">
                  <div className="card-body text-center p-4">
                    <div className="module-icon mb-3">
                      <i className="fas fa-file-invoice-dollar fa-3x text-primary opacity-75"></i>
                    </div>
                    <h5 className="card-title fw-bold">Gerar Orçamento</h5>
                    <p className="card-text text-muted">Crie orçamentos detalhados para seus clientes</p>
                    <button 
                      type="button" 
                      className="btn btn-primary botaoAcesso px-4" 
                      onClick={() => navigate('/Orcamentos')}
                    >
                      <i className="fas fa-plus me-2"></i> Novo Orçamento
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mensagem de Alerta (Oculta por padrão como no original) */}
            <div className="row">
              <div id="mensagemCritica" className="alert alert-danger d-none">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;