import { NextRequest, NextResponse } from 'next/server';
import { WEB_MCP_ROUTES, WEB_MCP_VERSION, getMcpRoute, normalizeMcpPath } from '@/app/lib/web-mcp/manifest';

export async function GET(request: NextRequest) {
  const pathParam = request.nextUrl.searchParams.get('path');
  const includeLinks = request.nextUrl.searchParams.get('includeLinks') !== 'false';
  const includeSections = request.nextUrl.searchParams.get('includeSections') !== 'false';
  const includeAll = request.nextUrl.searchParams.get('all') === '1';

  const basePayload = {
    version: WEB_MCP_VERSION,
    generatedAt: new Date().toISOString(),
    totalRoutes: WEB_MCP_ROUTES.length,
    discovery: {
      endpoint: '/api/web-mcp',
      usage: [
        'GET /api/web-mcp -> index',
        'GET /api/web-mcp?path=/tools -> route blueprint',
        'GET /api/web-mcp?all=1 -> full manifest',
      ],
    },
  };

  if (includeAll) {
    return NextResponse.json({
      ...basePayload,
      routes: WEB_MCP_ROUTES,
    });
  }

  if (!pathParam) {
    return NextResponse.json({
      ...basePayload,
      routes: WEB_MCP_ROUTES.map((route) => ({
        path: route.path,
        title: route.title,
        purpose: route.purpose,
        layoutFlow: route.layoutFlow,
        seoIntents: route.seoIntents,
      })),
    });
  }

  const normalizedPath = normalizeMcpPath(pathParam);
  const route = getMcpRoute(normalizedPath);

  if (!route) {
    return NextResponse.json(
      {
        ...basePayload,
        path: normalizedPath,
        error: `No Web MCP blueprint configured for ${normalizedPath}`,
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    ...basePayload,
    path: normalizedPath,
    route: {
      ...route,
      sections: includeSections ? route.sections : undefined,
      links: includeLinks ? route.links : undefined,
    },
  });
}

