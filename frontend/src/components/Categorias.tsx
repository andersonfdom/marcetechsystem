import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalCategoria from './ModalCategoria';
import ModalImportarCategorias from './ModalImportarCategorias';
import type { ICategoria } from './ModalCategoria';

const Categorias: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para a Lista
  const [categorias, setCategorias] = useState<ICategoria[]>([]);
  const [busca, setBusca] = useState('');
  
  // Estados para os Modais
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [categoriaEdicao, setCategoriaEdicao] = useState<ICategoria | null>(null);

  useEffect(() => {
    // Simulação de dados vindo da API seguindo a estrutura do ModalCategoria
    const dadosIniciais: ICategoria[] = [
      { 
        IdCategoria: 1, 
        NomeCategoria: 'Marcenaria', 
        UnidadePadrao: 'Metro Quadrado (m²)', 
        FormulaCalculo: '(largura * altura) * valor',
        ItensCategoria: [] 
      },
      { 
        IdCategoria: 2, 
        NomeCategoria: 'Ferragens', 
        UnidadePadrao: 'Unidade (un)', 
        FormulaCalculo: 'quantidade * valor',
        ItensCategoria: [] 
      },
    ];
    setCategorias(dadosIniciais);
  }, []);

  const categoriasFiltradas = categorias.filter(c => 
    c.NomeCategoria.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovaCategoria = () => {
    setCategoriaEdicao(null);
    setShowModal(true);
  };

  const handleEditar = (categoria: ICategoria) => {
    setCategoriaEdicao(categoria);
    setShowModal(true);
  };

  const handleExcluir = (id: number) => {
    if (window.confirm('Deseja realmente excluir esta categoria?')) {
      setCategorias(categorias.filter(c => c.IdCategoria !== id));
    }
  };

  const handleSalvar = (dados: ICategoria) => {
    if (categoriaEdicao) {
      setCategorias(categorias.map(c => c.IdCategoria === dados.IdCategoria ? dados : c));
    } else {
      const novo = { ...dados, IdCategoria: Math.max(0, ...categorias.map(c => c.IdCategoria)) + 1 };
      setCategorias([...categorias, novo]);
    }
    setShowModal(false);
  };

  const handleDadosImportados = () => {
    // Simulação de atualização após importação
    window.location.reload();
  };

  return (
    <div className="categorias-container p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Cadastro de Categorias</h1>
      </div>

      <div className="alert alert-info shadow-sm border-0 border-start border-4 border-info mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Este espaço é reservado para o Cadastro de Categorias.
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h4 className="card-title mb-0">Lista de Categorias</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-primary botaoAcesso" onClick={handleNovaCategoria}>
                <i className="fas fa-plus me-2"></i>Nova Categoria
              </button>
              
              <button className="btn btn-success text-white" onClick={() => setShowImportModal(true)}>
                <i className="fas fa-file-import me-2"></i>Importar
              </button>
              
              <button className="btn btn-danger shadow-sm" onClick={() => navigate('/materiais')}>
                <i className="fas fa-arrow-left me-2"></i>Voltar
              </button>
            </div>
          </div>

          <div className="mb-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0" 
                placeholder="Procurar Categorias..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="tituloTabela text-white" style={{ backgroundColor: '#212529' }}>
                <tr>
                  <th style={{ width: '40%' }}>Nome</th>
                  <th style={{ width: '20%' }}>Unidade</th>
                  <th style={{ width: '25%' }}>Fórmula</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {categoriasFiltradas.length > 0 ? (
                  categoriasFiltradas.map((item) => (
                    <tr key={item.IdCategoria}>
                      <td>{item.NomeCategoria}</td>
                      <td>{item.UnidadePadrao}</td>
                      <td><code className="text-dark">{item.FormulaCalculo}</code></td>
                      <td className="text-center">
                        <div className="btn-group shadow-sm">
                          <button 
                            className="btn btn-sm btn-info text-white" 
                            title="Editar"
                            onClick={() => handleEditar(item)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            title="Excluir"
                            onClick={() => handleExcluir(item.IdCategoria)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted italic">
                      Nenhuma categoria encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição Individual */}
      <ModalCategoria 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSalvar}
        categoriaEdicao={categoriaEdicao}
      />

      {/* Modal de Importação */}
      <ModalImportarCategorias 
        show={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onImported={handleDadosImportados}
      />
    </div>
  );
};

export default Categorias;