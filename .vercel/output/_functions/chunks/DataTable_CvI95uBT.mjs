import { c as createComponent, a as createAstro, m as maybeRenderHead, e as addAttribute, f as renderScript, b as renderTemplate, g as defineScriptVars, r as renderComponent, F as Fragment, u as unescapeHTML } from './astro/server_CCC6TWgs.mjs';
import 'kleur/colors';
import 'clsx';
/* empty css                          */

const $$Astro$3 = createAstro();
const $$Chart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$3, $$props, $$slots);
  Astro2.self = $$Chart;
  const {
    id,
    width = 400,
    height = 300,
    className = ""
  } = Astro2.props;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(`chart-container ${className}`, "class")} data-astro-cid-jowm3pwr> <canvas${addAttribute(id, "id")}${addAttribute(width, "width")}${addAttribute(height, "height")} data-astro-cid-jowm3pwr></canvas> </div>  ${renderScript($$result, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/atoms/Chart.astro?astro&type=script&index=0&lang.ts")}`;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/atoms/Chart.astro", void 0);

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(raw || cooked.slice()) }));
var _a$1;
const $$Astro$2 = createAstro();
const $$FinancialChart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$2, $$props, $$slots);
  Astro2.self = $$FinancialChart;
  const {
    id,
    title,
    data,
    width = 600,
    height = 400,
    className = ""
  } = Astro2.props;
  const years = [.../* @__PURE__ */ new Set([
    ...data.revenue?.map((d) => d.year) || [],
    ...data.rAndDSpending?.map((d) => d.year) || [],
    ...data.netIncome?.map((d) => d.year) || []
  ])].sort();
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", " <script>(function(){", "\n  // Chart.js will be imported from the CDN via the base Chart component\n  document.addEventListener('DOMContentLoaded', () => {\n    const ctx = document.getElementById(id)?.getContext('2d');\n    if (!ctx) return;\n\n    const datasets = [];\n    \n    // Use colors from Chart.js defaults\n    if (data.revenue) {\n      datasets.push({\n        label: 'Revenue',\n        data: years.map(year => {\n          const point = data.revenue.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(255, 99, 132)',\n        backgroundColor: 'rgba(255, 99, 132, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n    \n    if (data.rAndDSpending) {\n      datasets.push({\n        label: 'R&D Spending',\n        data: years.map(year => {\n          const point = data.rAndDSpending.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(54, 162, 235)',\n        backgroundColor: 'rgba(54, 162, 235, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n    \n    if (data.netIncome) {\n      datasets.push({\n        label: 'Net Income',\n        data: years.map(year => {\n          const point = data.netIncome.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(255, 205, 86)',\n        backgroundColor: 'rgba(255, 205, 86, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n\n    new Chart(ctx, {\n      type: 'line',\n      data: {\n        labels: years,\n        datasets\n      },\n      options: {\n        responsive: true,\n        maintainAspectRatio: false,\n        animation: false,\n        plugins: {\n          title: {\n            display: true,\n            text: title,\n            font: {\n              size: 16,\n              weight: 'bold'\n            }\n          },\n          legend: {\n            position: 'bottom'\n          },\n          tooltip: {\n            mode: 'index',\n            intersect: false,\n            callbacks: {\n              label: (context) => {\n                const value = context.parsed.y;\n                return `${context.dataset.label}: $${value.toFixed(1)}B`;\n              }\n            }\n          }\n        },\n        scales: {\n          x: {\n            title: {\n              display: true,\n              text: 'Year'\n            },\n            grid: {\n              display: true\n            }\n          },\n          y: {\n            title: {\n              display: true,\n              text: 'Billions USD'\n            },\n            ticks: {\n              callback: (value) => `$${value}B`\n            },\n            grid: {\n              display: true\n            }\n          }\n        }\n      }\n    });\n  });\n})();<\/script>"], ["", " <script>(function(){", "\n  // Chart.js will be imported from the CDN via the base Chart component\n  document.addEventListener('DOMContentLoaded', () => {\n    const ctx = document.getElementById(id)?.getContext('2d');\n    if (!ctx) return;\n\n    const datasets = [];\n    \n    // Use colors from Chart.js defaults\n    if (data.revenue) {\n      datasets.push({\n        label: 'Revenue',\n        data: years.map(year => {\n          const point = data.revenue.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(255, 99, 132)',\n        backgroundColor: 'rgba(255, 99, 132, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n    \n    if (data.rAndDSpending) {\n      datasets.push({\n        label: 'R&D Spending',\n        data: years.map(year => {\n          const point = data.rAndDSpending.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(54, 162, 235)',\n        backgroundColor: 'rgba(54, 162, 235, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n    \n    if (data.netIncome) {\n      datasets.push({\n        label: 'Net Income',\n        data: years.map(year => {\n          const point = data.netIncome.find(d => d.year === year);\n          return point ? point.value : null;\n        }),\n        borderColor: 'rgb(255, 205, 86)',\n        backgroundColor: 'rgba(255, 205, 86, 0.2)',\n        borderWidth: 2,\n        fill: true\n      });\n    }\n\n    new Chart(ctx, {\n      type: 'line',\n      data: {\n        labels: years,\n        datasets\n      },\n      options: {\n        responsive: true,\n        maintainAspectRatio: false,\n        animation: false,\n        plugins: {\n          title: {\n            display: true,\n            text: title,\n            font: {\n              size: 16,\n              weight: 'bold'\n            }\n          },\n          legend: {\n            position: 'bottom'\n          },\n          tooltip: {\n            mode: 'index',\n            intersect: false,\n            callbacks: {\n              label: (context) => {\n                const value = context.parsed.y;\n                return \\`\\${context.dataset.label}: $\\${value.toFixed(1)}B\\`;\n              }\n            }\n          }\n        },\n        scales: {\n          x: {\n            title: {\n              display: true,\n              text: 'Year'\n            },\n            grid: {\n              display: true\n            }\n          },\n          y: {\n            title: {\n              display: true,\n              text: 'Billions USD'\n            },\n            ticks: {\n              callback: (value) => \\`$\\${value}B\\`\n            },\n            grid: {\n              display: true\n            }\n          }\n        }\n      }\n    });\n  });\n})();<\/script>"])), renderComponent($$result, "Chart", $$Chart, { "id": id, "width": width, "height": height, "className": className }), defineScriptVars({ id, title, data, years }));
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/FinancialChart.astro", void 0);

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const $$Astro$1 = createAstro();
const $$PipelineChart = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$PipelineChart;
  const {
    id,
    title,
    data,
    width = 600,
    height = 400,
    className = ""
  } = Astro2.props;
  const stageOrder = [
    "discovery",
    "preclinical",
    "phase1",
    "phase2",
    "phase3",
    "submitted",
    "approved",
    "marketed"
  ];
  const stageNames = {
    discovery: "Discovery",
    preclinical: "Preclinical",
    phase1: "Phase 1",
    phase2: "Phase 2",
    phase3: "Phase 3",
    submitted: "Submitted",
    approved: "Approved",
    marketed: "Marketed"
  };
  const sortedData = [...data].sort(
    (a, b) => stageOrder.indexOf(a.stage) - stageOrder.indexOf(b.stage)
  );
  return renderTemplate(_a || (_a = __template(["", " <script>(function(){", "\n  // Chart.js will be imported from the CDN via the base Chart component\n  document.addEventListener('DOMContentLoaded', () => {\n    const ctx = document.getElementById(id)?.getContext('2d');\n    if (!ctx) return;\n\n    new Chart(ctx, {\n      type: 'bar',\n      data: {\n        labels: sortedData.map(d => stageNames[d.stage] || d.stage),\n        datasets: [{\n          label: 'Number of Products',\n          data: sortedData.map(d => d.count),\n          // Use default Chart.js colors from global config\n          borderWidth: 1\n        }]\n      },\n      options: {\n        responsive: true,\n        maintainAspectRatio: false,\n        animation: false,\n        plugins: {\n          title: {\n            display: true,\n            text: title,\n            font: {\n              size: 16,\n              weight: 'bold'\n            }\n          },\n          legend: {\n            display: false\n          },\n          tooltip: {\n            callbacks: {\n              label: (context) => {\n                const value = context.parsed.y;\n                return `${value} product${value === 1 ? '' : 's'}`;\n              }\n            }\n          }\n        },\n        scales: {\n          x: {\n            title: {\n              display: true,\n              text: 'Development Stage'\n            }\n          },\n          y: {\n            title: {\n              display: true,\n              text: 'Number of Products'\n            },\n            beginAtZero: true,\n            ticks: {\n              stepSize: 1\n            }\n          }\n        }\n      }\n    });\n  });\n})();<\/script>"], ["", " <script>(function(){", "\n  // Chart.js will be imported from the CDN via the base Chart component\n  document.addEventListener('DOMContentLoaded', () => {\n    const ctx = document.getElementById(id)?.getContext('2d');\n    if (!ctx) return;\n\n    new Chart(ctx, {\n      type: 'bar',\n      data: {\n        labels: sortedData.map(d => stageNames[d.stage] || d.stage),\n        datasets: [{\n          label: 'Number of Products',\n          data: sortedData.map(d => d.count),\n          // Use default Chart.js colors from global config\n          borderWidth: 1\n        }]\n      },\n      options: {\n        responsive: true,\n        maintainAspectRatio: false,\n        animation: false,\n        plugins: {\n          title: {\n            display: true,\n            text: title,\n            font: {\n              size: 16,\n              weight: 'bold'\n            }\n          },\n          legend: {\n            display: false\n          },\n          tooltip: {\n            callbacks: {\n              label: (context) => {\n                const value = context.parsed.y;\n                return \\`\\${value} product\\${value === 1 ? '' : 's'}\\`;\n              }\n            }\n          }\n        },\n        scales: {\n          x: {\n            title: {\n              display: true,\n              text: 'Development Stage'\n            }\n          },\n          y: {\n            title: {\n              display: true,\n              text: 'Number of Products'\n            },\n            beginAtZero: true,\n            ticks: {\n              stepSize: 1\n            }\n          }\n        }\n      }\n    });\n  });\n})();<\/script>"])), renderComponent($$result, "Chart", $$Chart, { "id": id, "width": width, "height": height, "className": className }), defineScriptVars({ id, title, sortedData, stageNames }));
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/PipelineChart.astro", void 0);

const $$Astro = createAstro();
const $$DataTable = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$DataTable;
  const {
    id,
    columns,
    data,
    defaultSort,
    defaultSortDirection = "asc",
    pageSize = 10,
    pagination = false,
    searchable = false,
    class: className = "",
    enableRowHover = true,
    showEmptyState = true,
    emptyStateMessage = "No data available"
  } = Astro2.props;
  new URL(Astro2.request.url);
  let sortedData = [...data];
  if (defaultSort) {
    const sortCol = columns.find((col) => col.key === defaultSort);
    if (sortCol && sortCol.sortable) {
      sortedData.sort((a, b) => {
        let aVal = a[defaultSort];
        let bVal = b[defaultSort];
        if (aVal === null || aVal === void 0) return defaultSortDirection === "asc" ? 1 : -1;
        if (bVal === null || bVal === void 0) return defaultSortDirection === "asc" ? -1 : 1;
        if (typeof aVal === "string" && typeof bVal === "string") {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }
        if (aVal === bVal) return 0;
        const result = aVal > bVal ? 1 : -1;
        return defaultSortDirection === "asc" ? result : -result;
      });
    }
  }
  const tableId = id || `table-${Math.random().toString(36).substring(2, 9)}`;
  return renderTemplate`${maybeRenderHead()}<div${addAttribute(["data-table-container", className], "class:list")}${addAttribute(tableId, "id")} data-astro-cid-6jdogjc4> <div class="overflow-x-auto" data-astro-cid-6jdogjc4> <table class="min-w-full divide-y divide-gray-200" data-table data-astro-cid-6jdogjc4> <thead class="bg-gray-50" data-astro-cid-6jdogjc4> <tr data-astro-cid-6jdogjc4> ${columns.map((column) => renderTemplate`<th scope="col"${addAttribute([
    "px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap",
    column.align === "center" ? "text-center" : "",
    column.align === "right" ? "text-right" : "",
    column.width ? "" : "flex-1",
    column.hideMobile ? "hidden sm:table-cell" : ""
  ], "class:list")}${addAttribute(column.width ? `width: ${column.width}` : "", "style")} data-astro-cid-6jdogjc4> <div${addAttribute([
    "flex items-center gap-1",
    column.align === "center" ? "justify-center" : "",
    column.align === "right" ? "justify-end" : ""
  ], "class:list")} data-astro-cid-6jdogjc4> ${column.label} </div> </th>`)} </tr> </thead> <tbody class="bg-white divide-y divide-gray-200" data-tbody data-astro-cid-6jdogjc4> ${sortedData.length > 0 ? sortedData.map((row) => renderTemplate`<tr${addAttribute([enableRowHover && "hover:bg-gray-50"], "class:list")} data-row data-astro-cid-6jdogjc4> ${columns.map((column) => {
    const cellValue = row[column.key];
    const renderedValue = column.render ? column.render(cellValue, row) : cellValue;
    return renderTemplate`<td${addAttribute([
      "px-6 py-4 whitespace-nowrap text-sm",
      column.align === "center" ? "text-center" : "",
      column.align === "right" ? "text-right" : "",
      column.hideMobile ? "hidden sm:table-cell" : ""
    ], "class:list")}${addAttribute(column.key, "data-cell-key")} data-astro-cid-6jdogjc4> ${typeof renderedValue === "string" && renderedValue.startsWith("<") ? renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": ($$result2) => renderTemplate`${unescapeHTML(renderedValue)}` })}` : renderedValue} </td>`;
  })} </tr>`) : showEmptyState && renderTemplate`<tr data-astro-cid-6jdogjc4> <td${addAttribute(columns.length, "colspan")} class="px-6 py-10 text-center text-gray-500 text-sm" data-astro-cid-6jdogjc4> ${emptyStateMessage} </td> </tr>`} </tbody> </table> </div> </div> `;
}, "C:/Users/joey/projects/jaw-labs/mytoppharma/app/src/components/molecules/DataTable.astro", void 0);

export { $$FinancialChart as $, $$PipelineChart as a, $$DataTable as b };
