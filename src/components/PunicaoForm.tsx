import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { POSTOS_GRAD, QUADROS, COMPORTAMENTOS, TIPOS_PUNICAO } from '../constants';
import { Punicao } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Punicao | null;
}

export function PunicaoForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<Punicao>>({
    postoGrad: 'SD PM',
    quadro: 'QOPM',
    tipoPunicao: 'ADVERTÊNCIA',
    comportamentoResultado: 'BOM',
    qtdDias: 0,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        postoGrad: 'SD PM',
        quadro: 'QOPM',
        tipoPunicao: 'ADVERTÊNCIA',
        comportamentoResultado: 'BOM',
        qtdDias: 0,
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
          <DialogTitle>{initialData ? 'Editar Punição' : 'Adicionar Punição'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <form id="punicao-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label>Quantidade de Dias</Label>
              <Input 
                type="number"
                value={formData.qtdDias || 0} 
                onChange={(e) => setFormData(prev => ({ ...prev, qtdDias: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Tipo de Punição</Label>
              <Select 
                value={formData.tipoPunicao} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, tipoPunicao: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIPOS_PUNICAO.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Início</Label>
              <Input 
                type="date"
                value={formData.inicio || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, inicio: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Fim</Label>
              <Input 
                type="date"
                value={formData.fim || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, fim: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Publicado no BI</Label>
              <Input 
                placeholder="Ex: BI 14ºBPM Nº 088, 10MAI2022"
                value={formData.publicadoBI || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, publicadoBI: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Comportamento Resultado</Label>
              <Select 
                value={formData.comportamentoResultado} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, comportamentoResultado: v as any }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMPORTAMENTOS.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
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
          <Button type="submit" form="punicao-form">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
