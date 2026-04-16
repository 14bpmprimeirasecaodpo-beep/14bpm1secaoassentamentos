import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { POSTOS_GRAD, QUADROS, COMPORTAMENTOS } from '../constants';
import { ReformadoTransferido } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: ReformadoTransferido | null;
}

export function ReformadoForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<ReformadoTransferido>>({
    postoGrad: 'SD PM',
    quadro: 'QOPM',
    pastaFisica: 'NÃO',
    pastaDigital: 'NÃO',
    comportamento: 'BOM',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        postoGrad: 'SD PM',
        quadro: 'QOPM',
        pastaFisica: 'NÃO',
        pastaDigital: 'NÃO',
        comportamento: 'BOM',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{initialData ? 'Editar Reformado/Transf.' : 'Adicionar Reformado/Transf.'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <form id="reformado-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posto/Graduação</Label>
              <Select 
                value={formData.postoGrad} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, postoGrad: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POSTOS_GRAD.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Quadro</Label>
              <Select 
                value={formData.quadro} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, quadro: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUADROS.map(q => <SelectItem key={q} value={q}>{q}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Matrícula</Label>
              <Input 
                required
                value={formData.matricula || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, matricula: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input 
                required
                value={formData.nomeCompleto || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, nomeCompleto: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Saída</Label>
              <Input 
                type="date"
                value={formData.dataSaida || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, dataSaida: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>SEI Nº</Label>
              <Input 
                value={formData.seiNo || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, seiNo: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Suplemento / BG / FUNAPE</Label>
              <Input 
                value={formData.suplementoBgFunape || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, suplementoBgFunape: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input 
                value={formData.destino || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, destino: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>SEI de Envio dos Assentamentos</Label>
              <Input 
                value={formData.seiEnvioAssentamentos || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, seiEnvioAssentamentos: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Providências</Label>
              <Input 
                value={formData.providencias || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, providencias: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Pasta Física Recebida?</Label>
              <Select 
                value={formData.pastaFisica} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, pastaFisica: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIM">SIM</SelectItem>
                  <SelectItem value="NÃO">NÃO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Pasta Digital Recebida?</Label>
              <Select 
                value={formData.pastaDigital} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, pastaDigital: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SIM">SIM</SelectItem>
                  <SelectItem value="NÃO">NÃO</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Comportamento</Label>
              <Select 
                value={formData.comportamento} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, comportamento: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPORTAMENTOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>A contar de</Label>
              <Input 
                type="date"
                value={formData.aContarDe || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, aContarDe: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Nota BI</Label>
              <Input 
                placeholder="Ex: BI N° 103, DE 05 JUN 2014"
                value={formData.notaBI || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, notaBI: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Melhoria a partir de</Label>
              <Input 
                placeholder="Ex: EXCEPCIONAL EM 25/03/2030"
                value={formData.melhoriaApartirDe || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, melhoriaApartirDe: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Data Levantamento</Label>
              <Input 
                type="date"
                value={formData.dataLevantamento || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, dataLevantamento: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Qtd Elogios</Label>
              <Input 
                placeholder="Ex: 73 ELOGIOS ATÉ 15/08/2024"
                value={formData.qtdElogios || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, qtdElogios: e.target.value }))}
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label>Punição Disciplinar (Últimos 6 anos)</Label>
              <Input 
                placeholder="Ex: 1 PRISÃO EM 2019 E UMA ADVERTÊNCIA EM 2024"
                value={formData.punicaoUltimos6Anos || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, punicaoUltimos6Anos: e.target.value }))}
              />
            </div>
            <div className="col-span-full space-y-2">
              <Label>Observações</Label>
              <Input 
                value={formData.observacoes || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
              />
            </div>
          </form>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="reformado-form">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
