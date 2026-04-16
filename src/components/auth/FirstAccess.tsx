import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRound, ShieldAlert } from 'lucide-react';

interface Props {
  email: string;
  onSetPassword: (password: string) => void;
}

export function FirstAccess({ email, onSetPassword }: Props) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    onSetPassword(password);
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
          <CardTitle className="text-2xl font-bold tracking-tight">Primeiro Acesso</CardTitle>
          <CardDescription>
            Defina sua senha de acesso para o e-mail <span className="font-bold text-text-main">{email}</span>
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-100 text-danger-brand text-xs p-3 rounded-lg font-medium flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="new-password">Nova Senha</Label>
              <Input 
                id="new-password"
                type="password" 
                placeholder="Mínimo 6 caracteres" 
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input 
                id="confirm-password"
                type="password" 
                placeholder="Repita a senha" 
                className="h-11"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-11 bg-primary-brand hover:bg-primary-hover text-white font-bold rounded-lg shadow-md transition-all">
              Definir Senha e Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
