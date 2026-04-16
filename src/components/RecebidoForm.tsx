import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { POSTOS_GRAD, QUADROS } from '../constants';
import { Recebido } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Recebido | null;
}

export function RecebidoForm({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<Partial<Recebido>>({
    postoGrad: 'SD PM',
    quadro: 'QOPM',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        postoGrad: 'SD PM',
        quadro: 'QOPM',
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
          <DialogTitle>{initialData ? 'Editar Recebido' : 'Adicionar Recebido'}</DialogTitle>
        </DialogHeader>
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <form id="recebido-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <Label>Apresentação na OME</Label>
              <Input 
                type="date"
                value={formData.apresentacaoOME || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, apresentacaoOME: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>SEI da Apresentação</Label>
              <Input 
                value={formData.seiApresentacao || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, seiApresentacao: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Suplemento de Pessoal</Label>
              <Input 
                value={formData.suplementoPessoal || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, suplementoPessoal: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label>Destino</Label>
              <Input 
                value={formData.destino || ''} 
                onChange={(e) => setFormData(prev => ({ ...prev, destino: e.target.value }))}
              />
            </div>
          </form>
        </div>
        <DialogFooter className="p-6 pt-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" form="recebido-form">Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
