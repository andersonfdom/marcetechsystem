import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ModalUsuario, { type IUsuario } from './ModalUsuario';

const Usuarios: React.FC = () => {
  const navigate = useNavigate();

  // Estados para a Lista
  const [usuarios, setUsuarios] = useState<IUsuario[]>([]);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);

  // Estados para o Modal
  const [showModal, setShowModal] = useState(false);
  const [usuarioEdicao, setUsuarioEdicao] = useState<IUsuario | null>(null);

  // Simulação de carregamento de dados (Equivalente ao Model do CSHTML)
  const carregarUsuarios = () => {
    setLoading(true);
    // Simulação de fetch('/CarregarUsuarios')
    setTimeout(() => {
      const dadosIniciais: IUsuario[] = [
        { IdUsuario: 1, Usuario: 'admin@marcetech.com', UsuarioLogado: 'Administrador' },
        { IdUsuario: 2, Usuario: 'vendedor@marcetech.com', UsuarioLogado: 'Vendedor 01' },
      ];
      setUsuarios(dadosIniciais);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    carregarUsuarios();
  }, []);

  // Lógica de Filtro (Equivalente ao BuscarUsuarios do JS original)
  const usuariosFiltrados = usuarios.filter(u =>
    u.Usuario.toLowerCase().includes(busca.toLowerCase()) ||
    u.UsuarioLogado.toLowerCase().includes(busca.toLowerCase())
  );

  const handleNovoUsuario = () => {
    setUsuarioEdicao(null);
    setShowModal(true);
  };

  const handleEditar = (usuario: IUsuario) => {
    setUsuarioEdicao(usuario);
    setShowModal(true);
  };

  const handleExcluir = (id: number) => {
    // Mantendo o padrão de confirmação do sistema
    if (window.confirm('Tem certeza que deseja excluir este Usuário?')) {
      // Aqui viria a chamada: await fetch(`/ExcluirDadosUsuario?id=${id}`, { method: 'DELETE' })
      setUsuarios(usuarios.filter(u => u.IdUsuario !== id));
      alert("Usuário excluído com sucesso!");
    }
  };

  const handleSalvar = (dados: any) => {
    // Lógica para atualizar lista local após salvar no banco
    carregarUsuarios();
    setShowModal(false);
  };

  return (
    <div className="usuarios-container p-3 animate__animated animate__fadeIn">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Usuários do Sistema</h1>
      </div>

      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info shadow-sm border-0 border-start border-4 border-info">
            <i className="fas fa-info-circle me-2"></i>
            Este espaço é reservado para o Cadastro de Usuários do Sistema.
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm client-card">
        <div className="card-body p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <h4 className="card-title mb-0">Lista de Usuários</h4>
            <div className="d-flex gap-2">
              <button className="btn btn-primary botaoAcesso" onClick={handleNovoUsuario}>
                <i className="fas fa-plus me-2"></i>Novo Usuário
              </button>
              
              <button className="btn btn-danger shadow-sm" onClick={() => navigate('/materiais')}>
                <i className="fas fa-arrow-left me-2"></i>Voltar
              </button>
            </div>
          </div>

          {/* Campo de Busca conforme o padrão Clientes.tsx */}
          <div className="mb-4">
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white border-end-0 text-muted">
                <i className="fas fa-search"></i>
              </span>
              <input 
                type="text" 
                className="form-control border-start-0 ps-0" 
                placeholder="🔍 Procurar Usuários..." 
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="tituloTabela text-white" style={{ backgroundColor: '#212529' }}>
                <tr>
                  <th style={{ width: '40%' }}>Usuário (E-mail)</th>
                  <th style={{ width: '40%' }}>Nome Exibição</th>
                  <th className="text-center" style={{ width: '20%' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={3} className="text-center py-4">
                      <i className="fas fa-spinner fa-spin me-2"></i> Carregando...
                    </td>
                  </tr>
                ) : usuariosFiltrados.length > 0 ? (
                  usuariosFiltrados.map((user) => (
                    <tr key={user.IdUsuario}>
                      <td data-label="Usuário">{user.Usuario}</td>
                      <td data-label="Usuário Logado">{user.UsuarioLogado}</td>
                      <td className="text-center" data-label="Ações">
                        <div className="btn-group shadow-sm">
                          <button 
                            className="btn btn-sm btn-info text-white" 
                            title="Editar Usuário"
                            onClick={() => handleEditar(user)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            className="btn btn-sm btn-danger" 
                            title="Excluir Usuário"
                            onClick={() => handleExcluir(user.IdUsuario)}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="text-center py-5 text-muted">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Cadastro/Edição Individual */}
      <ModalUsuario 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSave={handleSalvar}
        usuarioEdicao={usuarioEdicao}
      />
    </div>
  );
};

export default Usuarios;