import { submitToIndexNow } from './bing-indexer.mjs';

const urls = [
    'https://smilefotilo.com/',
    'https://smilefotilo.com/about',
    'https://smilefotilo.com/portfolio',
    'https://smilefotilo.com/services/web-design',
    'https://smilefotilo.com/services/seo'
];

submitToIndexNow(urls).then(() => console.log('IndexNow ping finished.'));
