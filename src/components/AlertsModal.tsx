import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EfetivoAtual } from '../types';
import { Calendar, User } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  alerts: EfetivoAtual[];
}

export function AlertsModal({ isOpen, onClose, alerts }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Alertas de Melhoria de Comportamento
          </DialogTitle>
          <DialogDescription>
            Militares que atingiram a data prevista para melhoria de comportamento.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] mt-4 overflow-y-auto custom-scrollbar">
          <div className="space-y-3 pr-4">
            {alerts.length === 0 ? (
              <div className="text-center py-10 text-text-muted">
                Nenhum alerta pendente para hoje.
              </div>
            ) : (
              alerts.map((militar) => (
                <div 
                  key={militar.id} 
                  className="p-4 border border-border-subtle rounded-lg bg-bg hover:border-primary-brand transition-colors flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-primary-brand text-sm">
                        {militar.postoGrad} {militar.quadro}
                      </span>
                      <span className="text-xs font-mono text-text-muted">
                        MAT: {militar.matricula}
                      </span>
                    </div>
                    <h4 className="font-semibold text-sm">{militar.nomeCompleto}</h4>
                    <div className="flex items-center gap-4 pt-1">
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <User className="w-3 h-3" />
                        Atual: <span className="font-bold text-text-main">{militar.comportamento}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-text-muted">
                        <Calendar className="w-3 h-3" />
                        Melhoria em: <span className="font-bold text-danger-brand">{militar.melhoriaApartirDe}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">
                    Apto para Revisão
                  </Badge>
                </div>
              ))
            )}
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button onClick={onClose} className="bg-primary-brand hover:bg-primary-hover">
            Entendido
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
