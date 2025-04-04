import { renderers } from './renderers.mjs';
import { a as actions } from './chunks/_noop-actions_CfKMStZn.mjs';
import { c as createExports } from './chunks/entrypoint_Bii_mgQ5.mjs';
import { manifest } from './manifest_DlmYO1CZ.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/admin/api-config.astro.mjs');
const _page3 = () => import('./pages/admin/audit/companies.astro.mjs');
const _page4 = () => import('./pages/admin/audit/feature-flags.astro.mjs');
const _page5 = () => import('./pages/admin/audit.astro.mjs');
const _page6 = () => import('./pages/admin/crawler-config.astro.mjs');
const _page7 = () => import('./pages/admin/data-feeds/connection-test.astro.mjs');
const _page8 = () => import('./pages/admin/data-feeds.astro.mjs');
const _page9 = () => import('./pages/admin/data-sources/connection-test.astro.mjs');
const _page10 = () => import('./pages/admin/data-sources/dashboard.astro.mjs');
const _page11 = () => import('./pages/admin/docs/data-sources.astro.mjs');
const _page12 = () => import('./pages/admin/reports-admin.astro.mjs');
const _page13 = () => import('./pages/admin/system-logs.astro.mjs');
const _page14 = () => import('./pages/admin/test-db.astro.mjs');
const _page15 = () => import('./pages/admin/user-management.astro.mjs');
const _page16 = () => import('./pages/admin.astro.mjs');
const _page17 = () => import('./pages/api/reset-feature-flags.astro.mjs');
const _page18 = () => import('./pages/api/test-db-connection.astro.mjs');
const _page19 = () => import('./pages/api/toggle-feature-flag.astro.mjs');
const _page20 = () => import('./pages/api/toggle-supabase-env.astro.mjs');
const _page21 = () => import('./pages/companies/_slug_.astro.mjs');
const _page22 = () => import('./pages/companies.astro.mjs');
const _page23 = () => import('./pages/dashboard.astro.mjs');
const _page24 = () => import('./pages/following.astro.mjs');
const _page25 = () => import('./pages/forgot-password.astro.mjs');
const _page26 = () => import('./pages/login.astro.mjs');
const _page27 = () => import('./pages/notifications.astro.mjs');
const _page28 = () => import('./pages/preferences.astro.mjs');
const _page29 = () => import('./pages/products/_slug_.astro.mjs');
const _page30 = () => import('./pages/products.astro.mjs');
const _page31 = () => import('./pages/profile.astro.mjs');
const _page32 = () => import('./pages/register.astro.mjs');
const _page33 = () => import('./pages/reports/market-overview.astro.mjs');
const _page34 = () => import('./pages/reports.astro.mjs');
const _page35 = () => import('./pages/supabase-test.astro.mjs');
const _page36 = () => import('./pages/therapeutic-areas/_slug_.astro.mjs');
const _page37 = () => import('./pages/therapeutic-areas.astro.mjs');
const _page38 = () => import('./pages/websites/_slug_.astro.mjs');
const _page39 = () => import('./pages/websites.astro.mjs');
const _page40 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/admin/api-config.astro", _page2],
    ["src/pages/admin/audit/companies.astro", _page3],
    ["src/pages/admin/audit/feature-flags.astro", _page4],
    ["src/pages/admin/audit/index.astro", _page5],
    ["src/pages/admin/crawler-config.astro", _page6],
    ["src/pages/admin/data-feeds/connection-test.astro", _page7],
    ["src/pages/admin/data-feeds.astro", _page8],
    ["src/pages/admin/data-sources/connection-test.astro", _page9],
    ["src/pages/admin/data-sources/dashboard.astro", _page10],
    ["src/pages/admin/docs/data-sources.astro", _page11],
    ["src/pages/admin/reports-admin.astro", _page12],
    ["src/pages/admin/system-logs.astro", _page13],
    ["src/pages/admin/test-db.astro", _page14],
    ["src/pages/admin/user-management.astro", _page15],
    ["src/pages/admin/index.astro", _page16],
    ["src/pages/api/reset-feature-flags.ts", _page17],
    ["src/pages/api/test-db-connection.ts", _page18],
    ["src/pages/api/toggle-feature-flag.ts", _page19],
    ["src/pages/api/toggle-supabase-env.ts", _page20],
    ["src/pages/companies/[slug].astro", _page21],
    ["src/pages/companies/index.astro", _page22],
    ["src/pages/dashboard.astro", _page23],
    ["src/pages/following.astro", _page24],
    ["src/pages/forgot-password.astro", _page25],
    ["src/pages/login.astro", _page26],
    ["src/pages/notifications.astro", _page27],
    ["src/pages/preferences.astro", _page28],
    ["src/pages/products/[slug].astro", _page29],
    ["src/pages/products/index.astro", _page30],
    ["src/pages/profile.astro", _page31],
    ["src/pages/register.astro", _page32],
    ["src/pages/reports/market-overview.astro", _page33],
    ["src/pages/reports/index.astro", _page34],
    ["src/pages/supabase-test.astro", _page35],
    ["src/pages/therapeutic-areas/[slug].astro", _page36],
    ["src/pages/therapeutic-areas/index.astro", _page37],
    ["src/pages/websites/[slug].astro", _page38],
    ["src/pages/websites/index.astro", _page39],
    ["src/pages/index.astro", _page40]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "2ff8f223-a854-476c-8c21-0c11cdd39c0b",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
