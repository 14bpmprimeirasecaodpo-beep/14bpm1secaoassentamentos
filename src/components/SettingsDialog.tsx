import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FileUp, Download, Trash2, AlertCircle, Users, UserPlus, UserMinus, ShieldCheck } from 'lucide-react';
import { AppData, User } from '../types';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: Partial<AppData>) => void;
  data: AppData;
  currentUser: User;
  authorizedUsers: User[];
  onUpdateUsers: (users: User[]) => void;
}

const FIELD_MAPPINGS: Record<string, string[]> = {
  matricula: ['MAT', 'MATRÍCULA', 'MATRICULA', 'ID'],
  nomeCompleto: ['NOME COMPLETO', 'NOME', 'NOME_COMPLETO'],
  postoGrad: ['POSTO/ GRAD.', 'POSTO', 'GRADUAÇÃO', 'GRADUACAO', 'POSTO_GRAD'],
  quadro: ['QUADRO', 'QDR'],
  comportamento: ['COMPORTAMENTO', 'COMP'],
  aContarDe: ['A CONTAR DE:', 'A CONTAR DE', 'DATA_COMPORTAMENTO'],
  notaBI: ['NOTA DE COMPORTAMENTO PUBLICADA NO BI Nº:', 'NOTA BI', 'BI'],
  melhoriaApartirDe: ['MELHORIA DE COMPORTAMENTO A PARTIR DE:', 'MELHORIA', 'MELHORIA_COMPORTAMENTO'],
  dataSaida: ['DATA DE SAÍDA', 'DATA SAIDA', 'SAIDA'],
  destino: ['DESTINO', 'OME DESTINO'],
  apresentacaoOME: ['APRESENTAÇÃO NA OME', 'APRESENTACAO', 'DATA APRESENTACAO'],
  tipoPunicao: ['TIPO DE PUNIÇÃO', 'TIPO', 'PUNICAO'],
  qtdDias: ['QUANTIDADE DE DIAS', 'DIAS', 'QTD DIAS'],
};

export function SettingsDialog({ isOpen, onClose, onImport, data, currentUser, authorizedUsers, onUpdateUsers }: Props) {
  const [isImporting, setIsImporting] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');

  const handleAddUser = () => {
    if (!newUserEmail) return;
    if (authorizedUsers.some(u => u.email.toLowerCase() === newUserEmail.toLowerCase())) {
      toast.error('Este e-mail já está autorizado.');
      return;
    }
    const newUser: User = {
      email: newUserEmail,
      isAdmin: false,
      isFirstAccess: true
    };
    onUpdateUsers([...authorizedUsers, newUser]);
    setNewUserEmail('');
    toast.success('Usuário autorizado com sucesso!');
  };

  const handleRemoveUser = (email: string) => {
    if (email === currentUser.email) {
      toast.error('Você não pode remover seu próprio acesso.');
      return;
    }
    onUpdateUsers(authorizedUsers.filter(u => u.email !== email));
    toast.success('Acesso removido.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: keyof AppData) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawData = XLSX.utils.sheet_to_json(ws) as any[];

        const mappedData = rawData.map((row, index) => {
          const newItem: any = { id: crypto.randomUUID(), seq: index + 1 };
          
          // Intelligent mapping
          Object.entries(FIELD_MAPPINGS).forEach(([field, aliases]) => {
            const foundKey = Object.keys(row).find(key => 
              aliases.some(alias => key.toUpperCase().includes(alias.toUpperCase()))
            );
            if (foundKey) {
              newItem[field] = row[foundKey];
            }
          });

          // Fallback for fields not in mapping but present in row with exact name
          Object.keys(row).forEach(key => {
            if (!newItem[key]) newItem[key] = row[key];
          });

          return newItem;
        });

        onImport({ [type]: mappedData });
        toast.success(`Importados ${mappedData.length} registros para ${String(type)}`);
      } catch (err) {
        console.error(err);
        toast.error('Erro ao processar o arquivo. Verifique o formato.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const exportToExcel = () => {
    const wb = XLSX.utils.book_new();
    
    Object.entries(data).forEach(([key, items]) => {
      const ws = XLSX.utils.json_to_sheet(items as any[]);
      XLSX.utils.book_append_sheet(wb, ws, key);
    });

    XLSX.writeFile(wb, 'SistAssent_Backup.xlsx');
    toast.success('Dados exportados com sucesso!');
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja apagar TODOS os dados? Esta ação não pode ser desfeita.')) {
      onImport({
        efetivoAtual: [],
        reformadosTransferidos: [],
        recebidos: [],
        punicoes: [],
      });
      toast.success('Todos os dados foram apagados.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configurações do Sistema</DialogTitle>
          <DialogDescription>
            Gerencie seus dados, importações e exportações.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] pr-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 py-4">
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Importação Inteligente</h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Efetivo Atual</Label>
                  <div className="relative group">
                    <Input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      className="h-16 border-2 border-dashed border-border-subtle hover:border-primary-brand hover:bg-blue-50/30 transition-all cursor-pointer text-transparent file:hidden" 
                      onChange={(e) => handleFileUpload(e, 'efetivoAtual')}
                      disabled={isImporting}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-text-muted group-hover:text-primary-brand transition-colors">
                      <FileUp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Importar Efetivo Atual</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Reformados e Transferidos</Label>
                  <div className="relative group">
                    <Input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      className="h-16 border-2 border-dashed border-border-subtle hover:border-primary-brand hover:bg-blue-50/30 transition-all cursor-pointer text-transparent file:hidden" 
                      onChange={(e) => handleFileUpload(e, 'reformadosTransferidos')}
                      disabled={isImporting}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-text-muted group-hover:text-primary-brand transition-colors">
                      <FileUp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Importar Reformados/Transf.</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Recebidos</Label>
                  <div className="relative group">
                    <Input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      className="h-16 border-2 border-dashed border-border-subtle hover:border-primary-brand hover:bg-blue-50/30 transition-all cursor-pointer text-transparent file:hidden" 
                      onChange={(e) => handleFileUpload(e, 'recebidos')}
                      disabled={isImporting}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-text-muted group-hover:text-primary-brand transition-colors">
                      <FileUp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Importar Recebidos</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-semibold">Punições</Label>
                  <div className="relative group">
                    <Input 
                      type="file" 
                      accept=".xlsx, .xls, .csv" 
                      className="h-16 border-2 border-dashed border-border-subtle hover:border-primary-brand hover:bg-blue-50/30 transition-all cursor-pointer text-transparent file:hidden" 
                      onChange={(e) => handleFileUpload(e, 'punicoes')}
                      disabled={isImporting}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-text-muted group-hover:text-primary-brand transition-colors">
                      <FileUp className="w-5 h-5 mb-1" />
                      <span className="text-[10px] font-medium">Importar Punições</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-text-muted flex items-center gap-1 italic">
                <AlertCircle className="w-3 h-3" />
                O sistema identifica as colunas automaticamente.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border-subtle">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider">Configurações de Banco</h4>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start h-10 border-border-subtle hover:bg-bg" onClick={exportToExcel}>
                  <Download className="w-4 h-4 mr-2 text-primary-brand" />
                  Exportar Backup (Excel)
                </Button>
                <Button variant="outline" className="w-full justify-start h-10 border-border-subtle text-danger-brand hover:bg-red-50 hover:border-danger-brand/30" onClick={clearAllData}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Limpar Banco de Dados
                </Button>
              </div>
            </div>

            {currentUser.isAdmin && (
              <div className="space-y-4 pt-4 border-t border-border-subtle">
                <h4 className="text-xs font-bold text-text-muted uppercase tracking-wider flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  Gerenciar Usuários
                </h4>
                
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input 
                      placeholder="E-mail do novo usuário" 
                      className="text-xs h-9"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                    />
                    <Button size="sm" className="bg-primary-brand hover:bg-primary-hover h-9" onClick={handleAddUser}>
                      <UserPlus className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {authorizedUsers.map(user => (
                      <div key={user.email} className="flex items-center justify-between p-2 bg-bg rounded-lg border border-border-subtle">
                        <div className="flex flex-col">
                          <span className="text-[11px] font-bold">{user.email}</span>
                          <span className="text-[9px] text-text-muted uppercase font-bold flex items-center gap-1">
                            {user.isAdmin ? (
                              <><ShieldCheck className="w-2 h-2 text-primary-brand" /> Administrador</>
                            ) : (
                              'Convidado'
                            )}
                          </span>
                        </div>
                        {!user.isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-7 w-7 text-text-muted hover:text-danger-brand"
                            onClick={() => handleRemoveUser(user.email)}
                          >
                            <UserMinus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
