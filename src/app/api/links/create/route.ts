import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Função para gerar um código curto único
function generateShortCode(length: number = 5): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Função para gerar um código único (garante que não exista no banco)
async function generateUniqueCode(): Promise<string> {
  let code: string;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (exists && attempts < maxAttempts) {
    code = generateShortCode(5);
    const existing = await db.shortLink.findUnique({
      where: { code }
    });
    exists = !!existing;
    attempts++;
  }

  if (exists) {
    // Se ainda existir, tenta com código mais longo
    return generateUniqueCodeWithFallback(6);
  }

  return code!;
}

function generateUniqueCodeWithFallback(length: number): string {
  return generateShortCode(length);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    // Validação básica
    if (!url) {
      return NextResponse.json(
        { error: 'URL é obrigatória' },
        { status: 400 }
      );
    }

    // Normaliza a URL (adiciona http:// se necessário)
    let normalizedUrl = url.trim();
    if (!/^https?:\/\//i.test(normalizedUrl)) {
      normalizedUrl = 'http://' + normalizedUrl;
    }

    // Validação adicional
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json(
        { error: 'URL inválida' },
        { status: 400 }
      );
    }

    // Gera um código curto único
    const code = await generateUniqueCode();

    // Cria o link no banco de dados
    const shortLink = await db.shortLink.create({
      data: {
        code,
        originalUrl: normalizedUrl,
      }
    });

    // Constrói a URL curta
    const baseUrl = new URL(request.url).origin;
    const shortUrl = `${baseUrl}/${code}`;

    return NextResponse.json({
      shortUrl,
      code: shortLink.code,
      originalUrl: shortLink.originalUrl
    });

  } catch (error) {
    console.error('Erro ao criar link:', error);
    return NextResponse.json(
      { error: 'Erro ao criar link' },
      { status: 500 }
    );
  }
}
