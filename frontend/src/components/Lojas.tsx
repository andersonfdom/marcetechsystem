import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalLoja from './ModalLoja';
import '../index.css';

/**
 * Interface principal para representar a estrutura de uma Loja
 */
interface ILoja {
  IdLoja: number;
  Razaosocial: string;
  Cnpj: string;
  Telefone: string;
  Email: string;
  Cep: string;
  Logradouro: string;
  NumeroLogradouro: string;
  Complemento?: string;
  Bairro: string;
  Cidade: string;
  Estado: string;
}

const Lojas: React.FC = () => {
  const navigate = useNavigate();

  // --- Estados do Grid ---
  const [lojas, setLojas] = useState<ILoja[]>([]);
  const [busca, setBusca] = useState<string>('');
  const [mensagemGrid, setMensagemGrid] = useState<{ texto: string; tipo: string } | null>(null);

  // --- Estados do Modal (Padrão Clientes.tsx) ---
  const [modalAberto, setModalAberto] = useState(false);
  const [lojaParaEditar, setLojaParaEditar] = useState<ILoja | null>(null);

  // --- Carregamento Inicial ---
  useEffect(() => {
    // Simulação de carregamento ou chamada à API
    const carregarDados = async () => {
      try {
        // const response = await fetch('/CarregarLojas');
        // const data = await response.json();
        // setLojas(data);
        
        // Dados estáticos para exemplo conforme o padrão solicitado
        const dadosIniciais: ILoja[] = [
          { 
            IdLoja: 1, Razaosocial: "Loja Matriz Centro", Cnpj: "00.000.000/0001-91", 
            Telefone: "1133334444", Email: "matriz@loja.com.br", Cep: "01001-000",
            Logradouro: "Praça da Sé", NumeroLogradouro: "100", Bairro: "Sé", Cidade: "São Paulo", Estado: "SP"
          }
        ];
        setLojas(dadosIniciais);
      } catch (error) {
        console.error("Erro ao carregar dados", error);
      }
    };
    carregarDados();
  }, []);

  // --- Handlers de Ação ---

  const handleNovaLoja = () => {
    setLojaParaEditar(null); // Limpa para inclusão
    setModalAberto(true);
  };

  const handleEditarLoja = (id: number) => {
    const loja = lojas.find(l => l.IdLoja === id);
    if (loja) {
      setLojaParaEditar(loja);
      setModalAberto(true);
    }
  };

  const handleSalvarLoja = (dados: ILoja) => {
    if (dados.IdLoja === 0) {
      // Simulação de Inclusão
      const novaLoja = { ...dados, IdLoja: Math.floor(Math.random() * 1000) };
      setLojas([...lojas, novaLoja]);
      setMensagemGrid({ texto: "Loja cadastrada com sucesso!", tipo: "success" });
    } else {
      // Simulação de Alteração
      setLojas(lojas.map(l => l.IdLoja === dados.IdLoja ? dados : l));
      setMensagemGrid({ texto: "Dados da loja atualizados com sucesso!", tipo: "success" });
    }
    setModalAberto(false);
    setTimeout(() => setMensagemGrid(null), 3000);
  };

  const handleExcluirLoja = (id: number) => {
    if (window.confirm("Deseja realmente excluir esta loja?")) {
      setLojas(lojas.filter(l => l.IdLoja !== id));
      setMensagemGrid({ texto: "Loja removida com sucesso.", tipo: "danger" });
      setTimeout(() => setMensagemGrid(null), 3000);
    }
  };

  // --- Filtro de Busca ---
  const lojasFiltradas = lojas.filter(item =>
    item.Razaosocial.toLowerCase().includes(busca.toLowerCase()) ||
    item.Cnpj.includes(busca)
  );

  return (
    <div className="clients-container p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">Cadastro de Lojas</h1>
        <div className="d-flex gap-2">
          <button className="btn btn-primary" onClick={handleNovaLoja}>
            <i className="fas fa-plus me-2"></i> Nova Loja
          </button>
          <button className="btn btn-danger" onClick={() => navigate('/Home/Index')}>
            <i className="fas fa-arrow-left me-2"></i> Voltar
          </button>
        </div>
      </div>

      <div className="alert alert-info py-2">
        <i className="fas fa-info-circle me-2"></i> 
        Gerencie as unidades e lojas da sua rede.
      </div>

      {mensagemGrid && (
        <div className={`alert alert-${mensagemGrid.tipo} alert-dismissible fade show`}>
          {mensagemGrid.texto}
          <button type="button" className="btn-close" onClick={() => setMensagemGrid(null)}></button>
        </div>
      )}

      <div className="card shadow-sm border-0">
        <div className="card-body">
          <input
            type="search"
            className="form-control mb-3"
            placeholder="🔍 Procurar Lojas (Razão Social ou CNPJ)..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />

          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="tituloTabela">
                <tr>
                  <th style={{ width: '35%' }}>Razão Social</th>
                  <th style={{ width: '25%' }}>Telefone</th>
                  <th style={{ width: '25%' }}>E-mail</th>
                  <th className="text-center" style={{ width: '120px' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {lojasFiltradas.length > 0 ? (
                  lojasFiltradas.map((loja) => (
                    <tr key={loja.IdLoja}>
                      <td>{loja.Razaosocial}</td>
                      <td>{loja.Telefone}</td>
                      <td>{loja.Email}</td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          <button 
                            className="btn btn-info" 
                            onClick={() => handleEditarLoja(loja.IdLoja)}
                            title="Editar"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-danger" 
                            onClick={() => handleExcluirLoja(loja.IdLoja)}
                            title="Excluir"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="text-center py-5 text-muted">
                      Nenhuma loja encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Vinculado - Seguindo o padrão Clientes.tsx */}
      <ModalLoja 
        show={modalAberto}
        onClose={() => setModalAberto(false)}
        onSave={handleSalvarLoja}
        lojaEdicao={lojaParaEditar}
      />
    </div>
  );
};

export default Lojas;