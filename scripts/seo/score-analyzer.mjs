import http from 'http';

function checkSEO() {
    http.get('http://localhost:3000', (res) => {
        let html = '';
        res.on('data', chunk => html += chunk);
        res.on('end', () => {
            let score = 100;
            const checks = [];

            // 1. Title Tag
            const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/);
            if (!titleMatch) {
                checks.push('❌ Missing <title> tag (-10)');
                score -= 10;
            } else {
                const title = titleMatch[1];
                if (title.length > 60) {
                    checks.push(`⚠️ Title too long (${title.length} chars) (-5)`);
                    score -= 5;
                } else {
                    checks.push(`✅ Title present and optimal length: "${title}"`);
                }
            }

            // 2. Meta Description
            const metaDescMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]+)"[^>]*>/i) || html.match(/<meta[^>]*content="([^"]+)"[^>]*name="description"[^>]*>/i);
            if (!metaDescMatch) {
                checks.push('❌ Missing meta description (-10)');
                score -= 10;
            } else {
                const desc = metaDescMatch[1];
                if (desc.length > 160) {
                    checks.push(`⚠️ Meta description too long (${desc.length} chars) (-5)`);
                    score -= 5;
                } else {
                    checks.push(`✅ Meta description present: "${desc}"`);
                }
            }

            // 3. H1 Tag
            const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi);
            if (!h1Match) {
                checks.push('❌ Missing <h1> tag (-10)');
                score -= 10;
            } else if (h1Match.length > 1) {
                checks.push(`⚠️ Multiple <h1> tags found (${h1Match.length}) (-5)`);
                score -= 5;
            } else {
                checks.push('✅ Single <h1> tag found');
            }

            // 4. Canonical
            if (!html.includes('rel="canonical"')) {
                checks.push('⚠️ Missing canonical URL (-5)');
                score -= 5;
            } else {
                checks.push('✅ Canonical URL present');
            }

            // 5. Schema Markup
            if (!html.includes('application/ld+json')) {
                checks.push('⚠️ Missing JSON-LD Schema (-10)');
                score -= 10;
            } else {
                checks.push('✅ JSON-LD Schema present');
            }

            // 6. Cloaking / Hidden Text
            if (html.includes('sr-only') && html.length > 50000) {
                // Approximate check: if sr-only exists along with massive HTML, could be cloaking
                const srMatches = html.match(/sr-only/g);
                if (srMatches && srMatches.length > 10) {
                    checks.push('❌ High risk of cloaking (excessive sr-only tags) (-20)');
                    score -= 20;
                } else {
                    checks.push('✅ No excessive sr-only text bloat (Cloaking avoided)');
                }
            } else {
                checks.push('✅ No hidden SEO text blocks detected');
            }

            // 7. OpenGraph
            if (!html.includes('og:title')) {
                checks.push('⚠️ Missing OpenGraph tags (-5)');
                score -= 5;
            } else {
                checks.push('✅ OpenGraph tags present (Social SEO)');
            }

            console.log('--- ON-PAGE SEO SCAN RESULT ---');
            checks.forEach(c => console.log(c));
            console.log(`\n🏆 FINAL SEO SCORE: ${score}/100\n`);

            if (score >= 90) {
                console.log('STATUS: Excellent! Ready for Google Indexing.');
            } else {
                console.log('STATUS: Needs improvement before deployment.');
            }
        });
    }).on('error', (err) => {
        console.error('Failed to fetch localhost. Ensure the server is running.', err);
    });
}

checkSEO();
