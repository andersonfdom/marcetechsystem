import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../index.css';

const Materiais: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="materials-container p-3">
      {/* Título e Botão Voltar */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Cadastro de Materiais</h1>
        <button 
          className="btn btn-danger shadow-sm" 
          onClick={() => navigate('/')}
        >
          <i className="fas fa-arrow-left me-2"></i>Voltar
        </button>
      </div>

      {/* Alerta Informativo */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info shadow-sm border-0 border-start border-4 border-info">
            <i className="fas fa-info-circle me-2"></i> 
            Este espaço é reservado ao Cadastro de informações aplicadas ao orçamento.
          </div>
        </div>
      </div>

      {/* Cards de Navegação */}
      <div className="row g-4">
        {/* Card: Ambientes */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
            <div className="card-body text-center p-5">
              <div className="icon-wrapper mb-3">
                <i className="fas fa-door-open fa-4x text-primary"></i>
              </div>
              <h5 className="card-title fw-bold">Ambientes</h5>
              <p className="card-text text-muted mb-4">
                Cadastre os ambientes para uso nos orçamentos (ex: Cozinha, Quarto, Sala).
              </p>
              <button 
                type="button" 
                className="btn btn-primary btn-lg w-100 botaoAcesso" 
                onClick={() => navigate('/ambientes')}
              >
                <i className="fas fa-cogs me-2"></i> Gerenciar Ambientes
              </button>
            </div>
          </div>
        </div>

        {/* Card: Categorias e Itens */}
        <div className="col-md-6">
          <div className="card h-100 border-0 shadow-sm hover-shadow-lg transition-all">
            <div className="card-body text-center p-5">
              <div className="icon-wrapper mb-3">
                <i className="fas fa-tags fa-4x text-success"></i>
              </div>
              <h5 className="card-title fw-bold">Categorias e Itens</h5>
              <p className="card-text text-muted mb-4">
                Configure categorias e itens para cálculo de orçamentos e insumos.
              </p>
              <button 
                type="button" 
                className="btn btn-success btn-lg w-100 botaoAcesso" 
                onClick={() => navigate('/categorias')}
              >
                <i className="fas fa-list-alt me-2"></i> Gerenciar Categorias
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Materiais;