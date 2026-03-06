import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface IItemCategoria {
    id?: number;
    descricao: string;
    observacao: string;
    alturaPadrao: number;
    markup: number;
    valor: number;
}

export interface ICategoria {
    IdCategoria: number;
    NomeCategoria: string;
    UnidadePadrao: string;
    FormulaCalculo: string;
    ItensCategoria: IItemCategoria[];
}

interface ModalCategoriaProps {
    show: boolean;
    onClose: () => void;
    onSave: (dados: ICategoria) => void;
    categoriaEdicao: ICategoria | null;
}

const ModalCategoria: React.FC<ModalCategoriaProps> = ({ show, onClose, onSave, categoriaEdicao }) => {
    // Estados da Categoria
    const [nome, setNome] = useState('');
    const [unidade, setUnidade] = useState('');
    const [formula, setFormula] = useState('(largura * altura) * valor');
    const [itens, setItens] = useState<IItemCategoria[]>([]);

    // Estados para o formulário de "Novo Item"
    const [itemDesc, setItemDesc] = useState('');
    const [itemObs, setItemObs] = useState('');
    const [itemAltura, setItemAltura] = useState(0);
    const [itemMarkup, setItemMarkup] = useState(0);
    const [itemValor, setItemValor] = useState(0);

    useEffect(() => {
        if (show) {
            if (categoriaEdicao) {
                setNome(categoriaEdicao.NomeCategoria);
                setUnidade(categoriaEdicao.UnidadePadrao);
                setFormula(categoriaEdicao.FormulaCalculo);
                setItens(categoriaEdicao.ItensCategoria || []);
            } else {
                limparTudo();
            }
        }
    }, [show, categoriaEdicao]);

    // Lógica de desabilitar campos baseada na fórmula (igual ao JS do cshtml)
    const isAlturaDisabled = formula !== '(largura * altura) * valor';
    const isMarkupDisabled = formula !== '(quantidade * markup) + custo';

    const limparTudo = () => {
        setNome('');
        setUnidade('Metro Quadrado (m²)');
        setFormula('(largura * altura) * valor');
        setItens([]);
        limparCamposItem();
    };

    const limparCamposItem = () => {
        setItemDesc('');
        setItemObs('');
        setItemAltura(0);
        setItemMarkup(0);
        setItemValor(0);
    };

    const handleAddItem = () => {
        if (!itemDesc.trim()) return alert("Informe a descrição do item");
        
        const novoItem: IItemCategoria = {
            id: Date.now(), // Simulação de ID temporário
            descricao: itemDesc,
            observacao: itemObs,
            alturaPadrao: isAlturaDisabled ? 0 : itemAltura,
            markup: isMarkupDisabled ? 0 : itemMarkup,
            valor: itemValor
        };

        setItens([...itens, novoItem]);
        limparCamposItem();
    };

    const removerItem = (id?: number) => {
        setItens(itens.filter(i => i.id !== id));
    };

    const handleGravar = () => {
        if (!nome.trim()) return alert("O nome é obrigatório");
        if (itens.length === 0) return alert("Adicione pelo menos um item");

        onSave({
            IdCategoria: categoriaEdicao?.IdCategoria || 0,
            NomeCategoria: nome,
            UnidadePadrao: unidade,
            FormulaCalculo: formula,
            ItensCategoria: itens
        });
    };

    if (!show) return null;

    return ReactDOM.createPortal(
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="modal-dialog modal-fullscreen w-100 shadow-lg" style={{ margin: 0 }}>
                <div className="modal-content border-0">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="modal-title">
                            <i className="fas fa-layer-group me-2"></i>
                            {categoriaEdicao ? 'Alteração de Categoria' : 'Inclusão de Categoria'}
                        </h5>
                        <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
                    </div>

                    <div className="modal-body p-4 bg-light overflow-auto">
                        {/* SEÇÃO: DADOS DA CATEGORIA */}
                        <div className="card shadow-sm mb-4">
                            <div className="card-body">
                                <h6 className="text-primary mb-3"><i className="fas fa-tag me-2"></i>Dados da Categoria</h6>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label fw-bold">Nome da Categoria *</label>
                                        <input type="text" className="form-control" value={nome} onChange={(e) => setNome(e.target.value)} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label fw-bold">Fórmula de Cálculo *</label>
                                        <select className="form-select" value={formula} onChange={(e) => {
                                            setFormula(e.target.value);
                                            if(e.target.value === '(largura * altura) * valor') setUnidade("Metro Quadrado (m²)");
                                            if(e.target.value === 'quantidade * valor') setUnidade("Unidade (un)");
                                            if(e.target.value === '(quantidade * markup) + custo') setUnidade("Percentual (%)");
                                        }}>
                                            <option value="(largura * altura) * valor">(Largura × Altura) × Valor</option>
                                            <option value="quantidade * valor">Quantidade × Valor</option>
                                            <option value="(quantidade * markup) + custo">(Quantidade × Markup) + Custo</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2">
                                        <label className="form-label fw-bold">Unidade Padrão</label>
                                        <input type="text" className="form-control" value={unidade} disabled />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SEÇÃO: ITENS DA CATEGORIA */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h6 className="text-success mb-3"><i className="fas fa-circle me-2"></i>Itens da Categoria</h6>
                                <div className="row g-3 mb-3">
                                    <div className="col-12">
                                        <label className="form-label">Descrição do Item *</label>
                                        <input type="text" className="form-control" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} />
                                    </div>
                                    <div className="col-12">
                                        <label className="form-label">Observação</label>
                                        <textarea className="form-control" rows={2} value={itemObs} onChange={(e) => setItemObs(e.target.value)}></textarea>
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Altura Padrão</label>
                                        <input type="number" className="form-control" value={itemAltura} onChange={(e) => setItemAltura(Number(e.target.value))} disabled={isAlturaDisabled} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Markup</label>
                                        <input type="number" className="form-control" value={itemMarkup} onChange={(e) => setItemMarkup(Number(e.target.value))} disabled={isMarkupDisabled} />
                                    </div>
                                    <div className="col-md-3">
                                        <label className="form-label">Valor</label>
                                        <input type="number" className="form-control" value={itemValor} onChange={(e) => setItemValor(Number(e.target.value))} />
                                    </div>
                                    <div className="col-md-3 d-flex align-items-end">
                                        <button className="btn btn-success w-100" onClick={handleAddItem}>
                                            <i className="fas fa-plus me-2"></i>Adicionar Item
                                        </button>
                                    </div>
                                </div>

                                <div className="table-responsive">
                                    <table className="table table-striped table-hover border">
                                        <thead className="tituloTabela">
                                            <tr>
                                                <th>Descrição</th>
                                                <th>Obs.</th>
                                                <th className="text-end">Alt. Padrão</th>
                                                <th className="text-end">Markup</th>
                                                <th className="text-end">Valor</th>
                                                <th className="text-center">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {itens.length === 0 ? (
                                                <tr><td colSpan={6} className="text-center text-muted">Nenhum item cadastrado</td></tr>
                                            ) : (
                                                itens.map((it, index) => (
                                                    <tr key={it.id || index}>
                                                        <td>{it.descricao}</td>
                                                        <td>{it.observacao || '-'}</td>
                                                        <td className="text-end">{it.alturaPadrao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                        <td className="text-end">{it.markup.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                        <td className="text-end">{it.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                                                        <td className="text-center">
                                                            <button className="btn btn-sm btn-danger" onClick={() => removerItem(it.id)}>
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer bg-white">
                        <button className="btn btn-success px-4" onClick={handleGravar}>
                            <i className="fas fa-save me-2"></i>Gravar
                        </button>
                        <button className="btn btn-danger px-4" onClick={onClose}>
                            <i className="fas fa-times me-2"></i>Cancelar
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ModalCategoria;