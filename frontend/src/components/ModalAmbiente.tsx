import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

// Adicionamos 'export' para que o outro arquivo possa usar
export interface IEspecificacao {
  id: number;
  descricao: string;
}

export interface IAmbiente {
  IdAmbiente: number;
  Nome: string;
  Especificacoes: IEspecificacao[]; 
}

interface ModalAmbienteProps {
  show: boolean;
  onClose: () => void;
  onSave: (dados: IAmbiente) => void;
  ambienteEdicao: IAmbiente | null;
}

const ModalAmbiente: React.FC<ModalAmbienteProps> = ({ show, onClose, onSave, ambienteEdicao }) => {
  const [idAmbiente, setIdAmbiente] = useState(0);
  const [nomeAmbiente, setNomeAmbiente] = useState('');
  const [novaEspecificacao, setNovaEspecificacao] = useState('');
  const [listaEspecificacoes, setListaEspecificacoes] = useState<IEspecificacao[]>([]);

  useEffect(() => {
    if (show) {
      if (ambienteEdicao) {
        setIdAmbiente(ambienteEdicao.IdAmbiente);
        setNomeAmbiente(ambienteEdicao.Nome);
        setListaEspecificacoes(ambienteEdicao.Especificacoes || []);
      } else {
        setIdAmbiente(0);
        setNomeAmbiente('');
        setListaEspecificacoes([]);
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [show, ambienteEdicao]);

  if (!show) return null;

  const handleAdicionar = () => {
    if (!novaEspecificacao.trim()) return;
    const novoItem = { id: Date.now(), descricao: novaEspecificacao };
    setListaEspecificacoes([...listaEspecificacoes, novoItem]);
    setNovaEspecificacao('');
  };

  const handleGravar = () => {
    onSave({
      IdAmbiente: idAmbiente,
      Nome: nomeAmbiente,
      Especificacoes: listaEspecificacoes
    });
  };

  return ReactDOM.createPortal(
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex' }}>
      <div className="modal-dialog modal-fullscreen m-0 w-100">
        <div className="modal-content border-0 h-100 d-flex flex-column">
          <div className="modal-header bg-primary text-white rounded-0">
            <h5 className="modal-title">
               <i className="fas fa-door-open me-2"></i>
               {idAmbiente > 0 ? 'Alteração de Ambiente' : 'Inclusão de Ambiente'}
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>
          
          <div className="modal-body bg-light p-4" style={{ flex: 1, overflowY: 'auto' }}>
            <div className="container">
              <div className="mb-4">
                <label className="form-label fw-bold">Nome do Ambiente *</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg shadow-sm" 
                  value={nomeAmbiente} 
                  onChange={(e) => setNomeAmbiente(e.target.value)} 
                />
              </div>

              <div className="card border-0 shadow-sm mb-4">
                <div className="card-body row g-2 align-items-end">
                  <div className="col-md-10">
                    <label className="form-label fw-bold small">Especificações</label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={novaEspecificacao} 
                      onChange={(e) => setNovaEspecificacao(e.target.value)}
                    />
                  </div>
                  <div className="col-md-2">
                    <button className="btn btn-success w-100" onClick={handleAdicionar}>
                      <i className="fas fa-plus"></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover bg-white rounded shadow-sm">
                  <thead className="tituloTabela">
                    <tr>
                      <th>Descrição</th>
                      <th style={{ width: '80px' }}>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listaEspecificacoes.map(item => (
                      <tr key={item.id}>
                        <td>{item.descricao}</td>
                        <td>
                          <button className="btn btn-sm btn-danger" onClick={() => setListaEspecificacoes(listaEspecificacoes.filter(x => x.id !== item.id))}>
                            <i className="fas fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="modal-footer bg-white border-top p-3">
            <button className="btn btn-success btn-lg px-5" onClick={handleGravar}>Gravar</button>
            <button className="btn btn-danger btn-lg px-5" onClick={onClose}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalAmbiente;