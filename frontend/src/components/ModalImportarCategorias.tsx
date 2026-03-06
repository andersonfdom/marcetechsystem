import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as XLSX from 'xlsx';

interface ModalImportarProps {
  show: boolean;
  onClose: () => void;
  onImported: () => void;
}

const ModalImportarCategorias: React.FC<ModalImportarProps> = ({ show, onClose, onImported }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  const normalize = (h: any) => (h || '').toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '');

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.xlsx')) {
      alert("Por favor, selecione apenas arquivos .xlsx");
      return;
    }
    setFile(selectedFile);
    const data = await selectedFile.arrayBuffer();
    const wb = XLSX.read(data);
    setWorkbook(wb);
    setSelectedSheet(wb.SheetNames[0]);
    processSheet(wb, wb.SheetNames[0]);
  };

  const processSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    
    if (json.length > 0) {
      const headers = json[0].map(h => normalize(h));
      // Validação das colunas obrigatórias conforme seu .cshtml
      const required = ['categoria', 'formulacalculo', 'unidadepadrao', 'descricao', 'valor'];
      const hasRequired = required.every(req => headers.includes(req));

      setIsValid(hasRequired);
      setPreviewData(json);
    }
  };

  const handleUpload = async () => {
    if (!workbook || !selectedSheet) return;
    setLoading(true);

    const ws = workbook.Sheets[selectedSheet];
    const fullData: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
    
    const payload = fullData.map(row => {
      const keys = Object.keys(row);
      const findK = (name: string) => keys.find(k => normalize(k) === name);

      return {
        Categoria: row[findK('categoria')!] || "",
        FormulaCalculo: row[findK('formulacalculo')!] || "",
        UnidadePadrao: row[findK('unidadepadrao')!] || "",
        Descricao: row[findK('descricao')!] || "",
        AlturaPadrao: row[findK('alturapadrao') || ""] || "",
        Observacao: row[findK('observacao') || ""] || "",
        Markup: row[findK('markup') || ""] || "",
        Valor: row[findK('valor')!] || ""
      };
    }).filter(x => x.Categoria !== "");

    try {
      const response = await fetch('/ImportarDadosCategoria', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onImported();
        onClose();
      } else {
        alert("Erro ao importar categorias.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header text-white bg-primary">
            <h5 className="modal-title"><i className="fas fa-file-import me-2"></i> Importar Categorias</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-0">
            <div className="bg-light border-bottom p-3 small text-muted">
              <strong>Colunas obrigatórias:</strong> Categoria, FormulaCalculo, UnidadePadrao, Descricao, Valor.
            </div>

            <div className="p-4">
              {!file ? (
                <div 
                  className={`file-upload-area ${dragActive ? 'bg-light border-primary' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ border: '2px dashed #dee2e6', borderRadius: '10px', padding: '50px 20px', textAlign: 'center', cursor: 'pointer' }}
                >
                  <i className="fas fa-file-excel fa-4x text-primary mb-3 opacity-50"></i>
                  <h5>Arraste sua planilha de Categorias aqui</h5>
                  <p className="text-muted small">Clique para selecionar arquivo .xlsx</p>
                  <input type="file" ref={fileInputRef} className="d-none" accept=".xlsx" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="animate__animated animate__fadeIn">
                  <div className="alert alert-info d-flex justify-content-between align-items-center p-2 px-3 mb-3">
                    <span className="small font-monospace">{file.name}</span>
                    <button className="btn btn-sm text-danger" onClick={() => {setFile(null); setPreviewData([]);}}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>

                  {/* CONTAINER COM SCROLL VERTICAL */}
                  <div className="border rounded bg-white" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <table className="table table-sm table-hover mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                      <thead className="table-dark" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                          {previewData[0]?.map((h, i) => (
                            <th key={i} className="py-2 px-3 small border-bottom fw-normal">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(1).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell: any, j: number) => (
                              <td key={j} className="px-3 py-2 small border-bottom text-truncate" style={{ maxWidth: '150px' }}>
                                {cell || <span className="text-muted">--</span>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="text-end mt-2">
                    <small className="text-muted">Total detectado: {previewData.length - 1} registros</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-light">
            <button className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
            <button 
              className="btn btn-success px-4" 
              disabled={!isValid || loading || !file} 
              onClick={handleUpload}
            >
              {loading ? 'Processando...' : 'Importar Categorias'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalImportarCategorias;