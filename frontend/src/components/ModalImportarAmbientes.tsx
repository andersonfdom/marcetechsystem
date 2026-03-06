import React, { useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import * as XLSX from 'xlsx';

interface ModalImportarProps {
  show: boolean;
  onClose: () => void;
  onImported: () => void;
}

const ModalImportarAmbientes: React.FC<ModalImportarProps> = ({ show, onClose, onImported }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [workbook, setWorkbook] = useState<XLSX.WorkBook | null>(null);
  const [sheets, setSheets] = useState<string[]>([]);
  const [selectedSheet, setSelectedSheet] = useState("");
  const [previewData, setPreviewData] = useState<any[][]>([]);
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!show) return null;

  // Normalização para ignorar acentos, espaços e maiúsculas na comparação de colunas
  const normalize = (h: any) => (h || '').toString().trim().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  const handleFile = async (selectedFile: File) => {
    if (!selectedFile.name.toLowerCase().endsWith('.xlsx')) {
      alert("Por favor, selecione apenas arquivos .xlsx");
      return;
    }
    setFile(selectedFile);
    const data = await selectedFile.arrayBuffer();
    const wb = XLSX.read(data);
    setWorkbook(wb);
    setSheets(wb.SheetNames);
    setSelectedSheet(wb.SheetNames[0]);
    processSheet(wb, wb.SheetNames[0]);
  };

  const processSheet = (wb: XLSX.WorkBook, sheetName: string) => {
    const ws = wb.Sheets[sheetName];
    // IMPORTANTE: defval: "" garante que células vazias sejam lidas como string e apareçam no preview
    const json: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: "" });
    
    if (json.length > 0) {
      const headers = json[0].map(h => normalize(h));
      const hasAmbiente = headers.includes('ambiente');
      const hasDesc = headers.includes('especificacao') || 
                      headers.includes('especificacoes') || 
                      headers.includes('descricao');

      setIsValid(hasAmbiente); // O mínimo obrigatório é o nome do Ambiente
      setPreviewData(json);
    }
  };

  const handleUpload = async () => {
    if (!workbook || !selectedSheet) return;
    setLoading(true);

    const ws = workbook.Sheets[selectedSheet];
    // defval: "" evita que o campo desapareça do objeto se estiver vazio na planilha
    const fullData: any[] = XLSX.utils.sheet_to_json(ws, { defval: "" });
    
    const payload = fullData.map(row => {
      const keys = Object.keys(row);
      // Busca as chaves dinamicamente para evitar erro se houver espaço extra ou acento
      const keyAmbiente = keys.find(k => normalize(k) === 'ambiente');
      const keyEspec = keys.find(k => normalize(k) === 'especificacao' || 
                                   normalize(k) === 'especificacoes' || 
                                   normalize(k) === 'descricao');

      return {
        Nome: keyAmbiente ? String(row[keyAmbiente]).trim() : "",
        Especificacoes: keyEspec ? String(row[keyEspec]).trim() : ""
      };
    }).filter(x => x.Nome !== ""); // Só remove se o nome do Ambiente estiver em branco

    try {
      const response = await fetch('/ImportarDadosAmbiente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onImported();
        onClose();
      } else {
        alert("Erro no servidor ao processar os dados.");
      }
    } catch (error) {
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1055 }} tabIndex={-1}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          
          <div className="modal-header text-white" style={{ backgroundColor: '#007bff' }}>
            <h5 className="modal-title d-flex align-items-center">
              <i className="fas fa-cloud-upload-alt me-2"></i> Importar Ambientes
            </h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <div className="modal-body p-0">
            <div className="bg-light border-bottom p-2 px-3 small text-muted">
              <strong>Template:</strong> Coluna A: "Ambiente" (Obrigatório) | Coluna B: "Especificação" (Opcional)
            </div>

            <div className="p-4">
              {!file ? (
                <div 
                  className={`file-upload-area ${dragActive ? 'bg-light border-primary' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if(e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ 
                    border: '2px dashed #dee2e6', borderRadius: '10px', 
                    padding: '60px 20px', textAlign: 'center', cursor: 'pointer' 
                  }}
                >
                  <i className="fas fa-file-excel fa-4x text-muted mb-3 opacity-50"></i>
                  <h5>Selecione sua planilha .xlsx</h5>
                  <p className="text-muted small">Arraste para cá ou clique para procurar</p>
                  <input type="file" ref={fileInputRef} className="d-none" accept=".xlsx" onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])} />
                </div>
              ) : (
                <div className="animate__animated animate__fadeIn">
                  <div className="alert alert-info d-flex justify-content-between align-items-center p-2 px-3 mb-3 border-0 shadow-sm">
                    <span className="small"><i className="fas fa-file-excel me-2"></i>{file.name}</span>
                    <button className="btn btn-sm text-danger border-0" onClick={() => {setFile(null); setPreviewData([]);}}>
                      <i className="fas fa-times-circle"></i> Remover
                    </button>
                  </div>

                  {/* TABELA COM BARRA DE ROLAGEM VERTICAL */}
                  <div 
                    className="border rounded bg-white shadow-sm" 
                    style={{ maxHeight: '380px', overflowY: 'auto' }}
                  >
                    <table className="table table-sm table-hover mb-0" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                      <thead className="table-light" style={{ position: 'sticky', top: 0, zIndex: 10 }}>
                        <tr>
                          {previewData[0]?.map((h, i) => (
                            <th key={i} className="py-2 px-3 small text-uppercase text-secondary border-bottom">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.slice(1).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-3 py-2 small border-bottom text-truncate" style={{ maxWidth: '200px' }}>
                                {cell || <em className="text-muted opacity-50">vazio</em>}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <small className="fw-bold">Total: {previewData.length - 1} linhas</small>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer bg-light px-4 py-3">
            <div className="me-auto">
              {file && (
                <span className={`badge rounded-pill ${isValid ? 'bg-success' : 'bg-danger'} px-3 py-2 shadow-sm`}>
                  {isValid ? '✓ Layout Pronto' : '✗ Coluna "Ambiente" não encontrada'}
                </span>
              )}
            </div>
            <button className="btn btn-secondary px-4" onClick={onClose}>Cancelar</button>
            <button 
              className="btn btn-success px-4" 
              disabled={!isValid || loading || !file} 
              onClick={handleUpload}
              style={{ backgroundColor: '#198754' }}
            >
              {loading ? (
                <><span className="spinner-border spinner-border-sm me-2"></span>Enviando...</>
              ) : 'Confirmar Importação'}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ModalImportarAmbientes;