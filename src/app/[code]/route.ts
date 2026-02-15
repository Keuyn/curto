import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params }: { params: { code: string } }
) {
  try {
    const { code } = params;

    // Busca o link no banco de dados
    const shortLink = await db.shortLink.findUnique({
      where: { code }
    });

    if (!shortLink) {
      // Se não encontrar, redireciona para a página principal
      return NextResponse.redirect(new URL('/', request.url));
    }

    // Incrementa o contador de cliques
    await db.shortLink.update({
      where: { id: shortLink.id },
      data: { clicks: { increment: 1 } }
    });

    // Redireciona para a URL original
    return NextResponse.redirect(shortLink.originalUrl);

  } catch (error) {
    console.error('Erro ao redirecionar:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
