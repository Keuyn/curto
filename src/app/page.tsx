'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Bolt, Copy, Check, ExternalLink, Info } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function Home() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      toast({
        title: 'URL obrigatória',
        description: 'Por favor, insira uma URL para encurtar.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setShortUrl('');
    setCopied(false);

    try {
      const response = await fetch('/api/links/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao criar link');
      }

      setShortUrl(data.shortUrl);
      toast({
        title: 'Link criado com sucesso!',
        description: 'Seu link está pronto para uso.',
      });
    } catch (error) {
      toast({
        title: 'Erro ao criar link',
        description: error instanceof Error ? error.message : 'Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!shortUrl) return;

    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast({
        title: 'Link copiado!',
        description: 'O link foi copiado para sua área de transferência.',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Erro ao copiar',
        description: 'Não foi possível copiar o link.',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-lg p-8 shadow-2xl border-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm">
          {/* Logo and Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 mb-4 shadow-lg">
              <Bolt className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              LinkFlow
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Gere links curtos que funcionam em qualquer lugar
            </p>
          </div>

          {/* Input Section */}
          <div className="space-y-4">
            <div className="relative">
              <Input
                type="url"
                placeholder="Cole seu link longo aqui (https://...)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="h-14 text-base pr-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                disabled={isGenerating}
              />
              {url && (
                <ExternalLink className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              )}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || !url.trim()}
              className="w-full h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isGenerating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Gerando...
                </>
              ) : (
                'Gerar Link Curto'
              )}
            </Button>
          </div>

          {/* Result Section */}
          {shortUrl && (
            <div className="mt-8 animate-in fade-in slide-in-from-top-4 duration-500">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-blue-300 dark:border-blue-700">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  Seu link foi gerado:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg text-sm break-all font-mono">
                    {shortUrl}
                  </code>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                    className="shrink-0 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Info Note */}
          <div className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
              <p className="font-medium">Como funciona?</p>
              <p>
                Seus links são armazenados de forma segura e redirecionam instantaneamente 
                para o destino original. Compartilhe links curtos e profissionais!
              </p>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>LinkFlow - Encurtador de Links Universal</p>
      </footer>
    </div>
  );
}
