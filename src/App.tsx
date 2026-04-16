/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Settings, Users, UserMinus, UserPlus, ShieldAlert, Plus, Search, FileUp, Download, Trash2, Edit2, Bell, LogOut, UserCog, Gavel } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { AppData, EfetivoAtual, ReformadoTransferido, Recebido, Punicao, User, AuthState } from './types';
import { EfetivoForm } from './components/EfetivoForm';
import { ReformadoForm } from './components/ReformadoForm';
import { RecebidoForm } from './components/RecebidoForm';
import { PunicaoForm } from './components/PunicaoForm';
import { SettingsDialog } from './components/SettingsDialog';
import { AlertsModal } from './components/AlertsModal';
import { Login } from './components/auth/Login';
import { FirstAccess } from './components/auth/FirstAccess';
import { motion, AnimatePresence } from 'motion/react';

type View = 'efetivo' | 'reformados' | 'recebidos' | 'punicoes';

const INITIAL_DATA: AppData = {
  efetivoAtual: [],
  reformadosTransferidos: [],
  recebidos: [],
  punicoes: [],
};

const ADMIN_EMAIL = '14bpmprimeirasecao.dpo@gmail.com';

const INITIAL_AUTH: AuthState = {
  currentUser: null,
  authorizedUsers: [
    { email: ADMIN_EMAIL, password: 'admin123', isAdmin: true, isFirstAccess: false }
  ],
};

export default function App() {
  const [view, setView] = useState<View>('efetivo');
  const [data, setData] = useState<AppData>(() => {
    const saved = localStorage.getItem('sistassent_data');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('sistassent_auth');
    return saved ? JSON.parse(saved) : INITIAL_AUTH;
  });
  const [loginError, setLoginError] = useState('');
  const [showFirstAccess, setShowFirstAccess] = useState(false);
  const [pendingEmail, setPendingEmail] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [alerts, setAlerts] = useState<EfetivoAtual[]>([]);

  const checkAlerts = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activeAlerts = data.efetivoAtual.filter(militar => {
      if (!militar.melhoriaApartirDe) return false;
      
      // Try to extract date DD/MM/YYYY from string
      const dateMatch = militar.melhoriaApartirDe.match(/(\d{2})\/(\d{2})\/(\d{4})/);
      if (dateMatch) {
        const [_, day, month, year] = dateMatch;
        const alertDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        return alertDate <= today;
      }
      
      // Try to parse as ISO date if it's just a date string
      const isoDate = new Date(militar.melhoriaApartirDe);
      if (!isNaN(isoDate.getTime())) {
        return isoDate <= today;
      }

      return false;
    });

    setAlerts(activeAlerts);
  };

  useEffect(() => {
    localStorage.setItem('sistassent_data', JSON.stringify(data));
    checkAlerts();
  }, [data]);

  useEffect(() => {
    localStorage.setItem('sistassent_auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (email: string, pass: string) => {
    const user = auth.authorizedUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      setLoginError('Acesso Negado. E-mail não autorizado pelo Administrador.');
      return;
    }

    if (!user.password) {
      setPendingEmail(email);
      setShowFirstAccess(true);
      return;
    }

    if (user.password !== pass) {
      setLoginError('Senha incorreta. Tente novamente.');
      return;
    }

    setAuth(prev => ({ ...prev, currentUser: user }));
    setLoginError('');
    toast.success(`Bem-vindo, ${email}!`);
  };

  const handleSetFirstPassword = (password: string) => {
    const updatedUsers = auth.authorizedUsers.map(u => 
      u.email.toLowerCase() === pendingEmail.toLowerCase() ? { ...u, password, isFirstAccess: false } : u
    );
    const user = updatedUsers.find(u => u.email.toLowerCase() === pendingEmail.toLowerCase())!;
    
    setAuth({
      currentUser: user,
      authorizedUsers: updatedUsers
    });
    setShowFirstAccess(false);
    setPendingEmail('');
    toast.success('Senha definida com sucesso!');
  };

  const handleLogout = () => {
    setAuth(prev => ({ ...prev, currentUser: null }));
    toast.info('Sessão encerrada.');
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setAuth(prev => ({ ...prev, authorizedUsers: newUsers }));
  };

  if (!auth.currentUser) {
    if (showFirstAccess) {
      return <FirstAccess email={pendingEmail} onSetPassword={handleSetFirstPassword} />;
    }
    return <Login onLogin={handleLogin} error={loginError} />;
  }

  const handleAdd = (newItem: any) => {
    const key = view === 'efetivo' ? 'efetivoAtual' : 
                view === 'reformados' ? 'reformadosTransferidos' : 
                view === 'recebidos' ? 'recebidos' : 'punicoes';
    
    if (editingItem) {
      setData(prev => ({
        ...prev,
        [key]: prev[key as keyof AppData].map((item: any) => item.id === editingItem.id ? newItem : item)
      }));
      toast.success('Registro atualizado com sucesso!');
    } else {
      setData(prev => ({
        ...prev,
        [key]: [...prev[key as keyof AppData], { ...newItem, id: crypto.randomUUID(), seq: prev[key as keyof AppData].length + 1 }]
      }));
      toast.success('Registro adicionado com sucesso!');
    }
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    const key = view === 'efetivo' ? 'efetivoAtual' : 
                view === 'reformados' ? 'reformadosTransferidos' : 
                view === 'recebidos' ? 'recebidos' : 'punicoes';
    
    setData(prev => ({
      ...prev,
      [key]: prev[key as keyof AppData].filter((item: any) => item.id !== id)
    }));
    toast.success('Registro excluído com sucesso!');
  };

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setIsFormOpen(true);
  };

  const filteredData = () => {
    const key = view === 'efetivo' ? 'efetivoAtual' : 
                view === 'reformados' ? 'reformadosTransferidos' : 
                view === 'recebidos' ? 'recebidos' : 'punicoes';
    
    return (data[key as keyof AppData] as any[]).filter(item => 
      item.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.matricula.includes(searchTerm)
    );
  };
  const getComportamentoBadgeClass = (comp: string) => {
    switch (comp) {
      case 'EXCEPCIONAL': return 'badge-success';
      case 'ÓTIMO': return 'badge-warning';
      case 'BOM': return 'badge-warning opacity-80';
      case 'INSUFICIENTE': return 'badge-danger opacity-80';
      case 'MAU': return 'badge-danger';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="h-screen bg-bg font-sans text-text-main flex flex-col overflow-hidden">
      {/* Compact Header */}
      <header className="h-14 bg-header-bg border-b border-border-subtle flex items-center justify-between px-4 flex-shrink-0 z-50">
        <div className="flex items-center gap-2">
          <img 
            src="http://www.pm.pe.gov.br/wp-content/uploads/2021/03/logo_14_bpm-150x150.png" 
            alt="Logo 14º BPM" 
            className="w-8 h-8 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-base font-bold tracking-tight text-primary-brand">SGA MILITAR</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`w-9 h-9 rounded-full relative ${alerts.length > 0 ? 'text-danger-brand animate-pulse' : 'text-text-muted'}`}
            onClick={() => setIsAlertsOpen(true)}
          >
            <Bell className="w-5 h-5" />
            {alerts.length > 0 && (
              <span className="absolute top-1 right-1 bg-danger-brand text-white text-[9px] font-bold px-1 rounded-full border border-white">
                {alerts.length}
              </span>
            )}
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-text-muted" onClick={() => setIsSettingsOpen(true)}>
            <Settings className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-full text-text-muted hover:text-danger-brand" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col pb-16">
        {/* Search Area */}
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <Input 
              placeholder="Pesquisar militar..." 
              className="pl-9 h-10 bg-white border-border-subtle rounded-xl text-sm shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List Content */}
        <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
          <div className="flex flex-col gap-2 pb-24">
            <AnimatePresence mode="popLayout">
              {filteredData().map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => handleEdit(item)}
                  className="bg-white border border-border-subtle rounded-xl p-3 shadow-sm active:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-primary-brand uppercase tracking-wider">
                          {item.postoGrad}
                        </span>
                        <span className="text-[10px] font-mono text-text-muted">
                          {item.matricula}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-text-main mt-0.5">
                        {item.nomeCompleto}
                      </h3>
                    </div>
                    
                    {view === 'efetivo' && (
                      <div className={`w-2 h-2 rounded-full ${
                        item.comportamento === 'EXCEPCIONAL' ? 'bg-success-brand' :
                        item.comportamento === 'ÓTIMO' ? 'bg-warning-brand' :
                        item.comportamento === 'BOM' ? 'bg-warning-brand opacity-60' :
                        'bg-danger-brand'
                      }`} />
                    )}
                    {view === 'punicoes' && (
                      <Badge variant="outline" className="text-[9px] font-bold border-danger-brand/30 text-danger-brand bg-red-50">
                        {item.tipoPunicao}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredData().length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-text-muted opacity-50">
                <Search className="w-10 h-10 mb-2" />
                <p className="text-xs font-medium">Nenhum registro encontrado.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* FAB */}
      <button 
        className="fab"
        onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Bottom Tab Bar */}
      <div className="tab-bar">
        <button 
          className={`tab-item ${view === 'efetivo' ? 'tab-item-active' : ''}`}
          onClick={() => setView('efetivo')}
        >
          <Users className="w-5 h-5" />
          <span className="tab-label">Efet. Atual</span>
        </button>
        <button 
          className={`tab-item ${view === 'reformados' ? 'tab-item-active' : ''}`}
          onClick={() => setView('reformados')}
        >
          <UserMinus className="w-5 h-5" />
          <span className="tab-label">Ref./Transf.</span>
        </button>
        <button 
          className={`tab-item ${view === 'recebidos' ? 'tab-item-active' : ''}`}
          onClick={() => setView('recebidos')}
        >
          <UserPlus className="w-5 h-5" />
          <span className="tab-label">Recebidos</span>
        </button>
        <button 
          className={`tab-item ${view === 'punicoes' ? 'tab-item-active' : ''}`}
          onClick={() => setView('punicoes')}
        >
          <Gavel className="w-5 h-5" />
          <span className="tab-label">Punições</span>
        </button>
      </div>

      {/* Modals */}
      <EfetivoForm 
        isOpen={isFormOpen && view === 'efetivo'} 
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }} 
        onSubmit={handleAdd}
        initialData={editingItem}
      />
      <ReformadoForm 
        isOpen={isFormOpen && view === 'reformados'} 
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }} 
        onSubmit={handleAdd}
        initialData={editingItem}
      />
      <RecebidoForm 
        isOpen={isFormOpen && view === 'recebidos'} 
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }} 
        onSubmit={handleAdd}
        initialData={editingItem}
      />
      <PunicaoForm 
        isOpen={isFormOpen && view === 'punicoes'} 
        onClose={() => { setIsFormOpen(false); setEditingItem(null); }} 
        onSubmit={handleAdd}
        initialData={editingItem}
      />
      
      <SettingsDialog 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        onImport={(newData) => setData(prev => ({
          ...prev,
          ...newData
        }))}
        data={data}
        currentUser={auth.currentUser}
        authorizedUsers={auth.authorizedUsers}
        onUpdateUsers={handleUpdateUsers}
      />

      <AlertsModal 
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
        alerts={alerts}
      />

      <Toaster position="bottom-right" />
    </div>
  );
}
