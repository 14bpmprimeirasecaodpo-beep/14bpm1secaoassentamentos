import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Lock, Mail } from 'lucide-react';
import { User } from '../../types';

interface Props {
  onLogin: (email: string, pass: string) => void;
  error?: string;
}

export function Login({ onLogin, error }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-border-subtle">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="http://www.pm.pe.gov.br/wp-content/uploads/2021/03/logo_14_bpm-150x150.png" 
              alt="Logo 14º BPM" 
              className="w-20 h-20 object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">SGA MILITAR</CardTitle>
          <CardDescription>
            Sistema de Gestão de Assentamentos
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-danger-brand text-xs p-3 rounded-lg font-medium text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  id="email"
                  type="email" 
                  placeholder="nome@exemplo.com" 
                  className="pl-10 h-11"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button 
                  type="button"
                  className="text-xs text-primary-brand hover:underline font-medium"
                  onClick={() => alert('Por favor, entre em contato com o Administrador do sistema para recuperar sua senha.')}
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <Input 
                  id="password"
                  type="password" 
                  placeholder="••••••••" 
                  className="pl-10 h-11"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11 bg-primary-brand hover:bg-primary-hover text-white font-bold rounded-lg shadow-md transition-all">
              Entrar no Sistema
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
