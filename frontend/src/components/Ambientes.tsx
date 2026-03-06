import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalAmbiente from './ModalAmbiente';
import ModalImportarAmbientes from './ModalImportarAmbientes'; // Novo Import
import type { IAmbiente } from './ModalAmbiente';

const Ambientes: React.FC = () => {
  const navigate = useNavigate();
  
  // Estados para a Lista
  const [ambientes, setAmbientes] = useState<IAmbiente[]>([]);
  const [busca, setBusca] = useState('');
  
  // Estados para os Modais
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false); // Estado do modal de importação
  const [ambienteEdicao, setAmbienteEdicao] = useState<IAmbiente | null>(null);

  useEffect(() => {
    // Aqui você futuramente substituirá pelo fetch da sua API
    const dadosIniciais: IAmbiente[] = [
      { IdAmbiente: 1, Nome: 'Cozinha', Especificacoes: [] },
      { IdAmbiente: 2, Nome: 'Dormitório Casal', Especificacoes: [] },
      { IdAmbiente: 3, Nome: 'Banheiro Social', Especificacoes: [] },
    ];
    setAmbientes(dadosIniciais);
  }, []);

  const ambientesFiltrados = ambientes.filter(a => 
    a.Nome.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovoAmbiente = () => {
    setAmbienteEdicao(null);
    setShowModal(true);
  };

  const handleEditar = (ambiente: IAmbiente) => {
    setAmbienteEdicao(ambiente);
    setShowModal(true);
  };

  const handleExcluir = (id: number) => {
    if (window.confirm('Deseja realmente excluir este ambiente?')) {
      setAmbientes(ambientes.filter(a => a.IdAmbiente !== id));
    }
  };

  const handleSalvar = (dados: IAmbiente) => {
    if (ambienteEdicao) {
      setAmbientes(ambientes.map(a => a.IdAmbiente === dados.IdAmbiente ? dados : a));
    } else {
      const novo = { ...dados, IdAmbiente: Math.max(0, ...ambientes.map(a => a.IdAmbiente)) + 1 };
      setAmbientes([...ambientes, novo]);
    }
    setShowModal(false);
  };

  // Função chamada após sucesso na importação do Excel
  const handleDadosImportados = () => {
    // Se você estiver usando API, aqui você chamaria o GetAmbientes() novamente
    // Por enquanto, apenas um reload para simular a atualização
    window.location.reload();
  };

  return (
    <div className="ambientes-container p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Cadastro de Ambientes</h1>
      </div>

      <div className="alert alert-info shadow-sm border-0 border-start border-4 border-info mb-4">
        <i className="fas fa-info-circle me-2"></i>
        Este espaço é reservado para o Cadastro de Ambientes.
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h4 className="card-title mb-0">Lista de Ambientes</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-primary botaoAcesso" onClick={handleNovoAmbiente}>
                <i className="fas fa-plus me-2"></i>Novo Ambiente
              </button>
              {/* Botão de Importar vinculado ao novo estado */}
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
                placeholder="Procurar Ambientes..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="tituloTabela text-white" style={{ backgroundColor: '#212529' }}>
                <tr>
                  <th style={{ width: '85%' }}>Nome</th>
                  <th className="text-center">Ações</th>
                </tr>
              </thead>
              <tbody>
                {ambientesFiltrados.length > 0 ? (
                  ambientesFiltrados.map((item) => (
                    <tr key={item.IdAmbiente}>
                      <td>{item.Nome}</td>
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
                            onClick={() => handleExcluir(item.IdAmbiente)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-5 text-muted italic">
                      Nenhum ambiente encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição Individual */}
      <ModalAmbiente 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSalvar}
        ambienteEdicao={ambienteEdicao}
      />

      {/* Modal de Importação de Planilha Excel */}
      <ModalImportarAmbientes 
        show={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        onImported={handleDadosImportados}
      />
    </div>
  );
};

export default Ambientes;