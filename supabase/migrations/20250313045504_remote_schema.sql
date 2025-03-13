create sequence "public"."company_financials_id_seq";

create sequence "public"."company_metrics_id_seq";

create sequence "public"."company_stock_data_id_seq";

create sequence "public"."data_ingestion_logs_id_seq";

create sequence "public"."data_source_endpoints_id_seq";

create sequence "public"."data_sources_id_seq";

drop trigger if exists "update_companies_updated_at" on "public"."companies";

create table "public"."company_financials" (
    "id" integer not null default nextval('company_financials_id_seq'::regclass),
    "company_id" integer not null,
    "period" text not null,
    "fiscal_date" date not null,
    "revenue" bigint,
    "cost_of_revenue" bigint,
    "gross_profit" bigint,
    "r_and_d_expenses" bigint,
    "sga_expense" bigint,
    "operating_expenses" bigint,
    "operating_income" bigint,
    "ebitda" bigint,
    "net_income" bigint,
    "eps" numeric,
    "cash_and_equivalents" bigint,
    "total_assets" bigint,
    "total_debt" bigint,
    "total_liabilities" bigint,
    "total_equity" bigint,
    "operating_cash_flow" bigint,
    "capital_expenditure" bigint,
    "free_cash_flow" bigint,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."company_financials" enable row level security;

create table "public"."company_metrics" (
    "id" integer not null default nextval('company_metrics_id_seq'::regclass),
    "company_id" integer not null,
    "date" date not null,
    "market_cap" bigint,
    "pe_ratio" numeric,
    "price_to_sales" numeric,
    "price_to_book" numeric,
    "enterprise_value" bigint,
    "ev_to_revenue" numeric,
    "ev_to_ebitda" numeric,
    "dividend_yield" numeric,
    "debt_to_equity" numeric,
    "profit_margin" numeric,
    "roe" numeric,
    "roa" numeric,
    "current_ratio" numeric,
    "quick_ratio" numeric,
    "cash_ratio" numeric,
    "debt_ratio" numeric,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."company_metrics" enable row level security;

create table "public"."company_stock_data" (
    "id" integer not null default nextval('company_stock_data_id_seq'::regclass),
    "company_id" integer not null,
    "date" date not null,
    "open" numeric,
    "high" numeric,
    "low" numeric,
    "close" numeric,
    "adjusted_close" numeric,
    "volume" bigint,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."company_stock_data" enable row level security;

create table "public"."data_ingestion_logs" (
    "id" integer not null default nextval('data_ingestion_logs_id_seq'::regclass),
    "data_source_id" integer not null,
    "endpoint_id" integer not null,
    "started_at" timestamp with time zone not null default now(),
    "completed_at" timestamp with time zone,
    "status" text not null,
    "records_processed" integer default 0,
    "records_added" integer default 0,
    "records_updated" integer default 0,
    "error_message" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."data_ingestion_logs" enable row level security;

create table "public"."data_source_endpoints" (
    "id" integer not null default nextval('data_source_endpoints_id_seq'::regclass),
    "data_source_id" integer not null,
    "name" text not null,
    "endpoint_path" text not null,
    "description" text,
    "target_table" text,
    "field_mapping" jsonb,
    "configuration" jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."data_source_endpoints" enable row level security;

create table "public"."data_sources" (
    "id" integer not null default nextval('data_sources_id_seq'::regclass),
    "name" text not null,
    "description" text,
    "base_url" text not null,
    "auth_type" text not null,
    "auth_key" text,
    "is_active" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."data_sources" enable row level security;

alter sequence "public"."company_financials_id_seq" owned by "public"."company_financials"."id";

alter sequence "public"."company_metrics_id_seq" owned by "public"."company_metrics"."id";

alter sequence "public"."company_stock_data_id_seq" owned by "public"."company_stock_data"."id";

alter sequence "public"."data_ingestion_logs_id_seq" owned by "public"."data_ingestion_logs"."id";

alter sequence "public"."data_source_endpoints_id_seq" owned by "public"."data_source_endpoints"."id";

alter sequence "public"."data_sources_id_seq" owned by "public"."data_sources"."id";

CREATE UNIQUE INDEX company_financials_company_id_period_fiscal_date_key ON public.company_financials USING btree (company_id, period, fiscal_date);

CREATE UNIQUE INDEX company_financials_pkey ON public.company_financials USING btree (id);

CREATE UNIQUE INDEX company_metrics_company_id_date_key ON public.company_metrics USING btree (company_id, date);

CREATE UNIQUE INDEX company_metrics_pkey ON public.company_metrics USING btree (id);

CREATE UNIQUE INDEX company_stock_data_company_id_date_key ON public.company_stock_data USING btree (company_id, date);

CREATE UNIQUE INDEX company_stock_data_pkey ON public.company_stock_data USING btree (id);

CREATE UNIQUE INDEX data_ingestion_logs_endpoint_id_started_at_key ON public.data_ingestion_logs USING btree (endpoint_id, started_at);

CREATE UNIQUE INDEX data_ingestion_logs_pkey ON public.data_ingestion_logs USING btree (id);

CREATE UNIQUE INDEX data_source_endpoints_data_source_id_name_key ON public.data_source_endpoints USING btree (data_source_id, name);

CREATE UNIQUE INDEX data_source_endpoints_pkey ON public.data_source_endpoints USING btree (id);

CREATE UNIQUE INDEX data_sources_name_key ON public.data_sources USING btree (name);

CREATE UNIQUE INDEX data_sources_pkey ON public.data_sources USING btree (id);

CREATE INDEX idx_companies_ticker ON public.companies USING btree (stock_symbol);

CREATE INDEX idx_company_financials_company_id ON public.company_financials USING btree (company_id);

CREATE INDEX idx_company_metrics_company_id ON public.company_metrics USING btree (company_id);

CREATE INDEX idx_company_stock_data_company_id ON public.company_stock_data USING btree (company_id);

CREATE INDEX idx_data_source_endpoints_data_source_id ON public.data_source_endpoints USING btree (data_source_id);

alter table "public"."company_financials" add constraint "company_financials_pkey" PRIMARY KEY using index "company_financials_pkey";

alter table "public"."company_metrics" add constraint "company_metrics_pkey" PRIMARY KEY using index "company_metrics_pkey";

alter table "public"."company_stock_data" add constraint "company_stock_data_pkey" PRIMARY KEY using index "company_stock_data_pkey";

alter table "public"."data_ingestion_logs" add constraint "data_ingestion_logs_pkey" PRIMARY KEY using index "data_ingestion_logs_pkey";

alter table "public"."data_source_endpoints" add constraint "data_source_endpoints_pkey" PRIMARY KEY using index "data_source_endpoints_pkey";

alter table "public"."data_sources" add constraint "data_sources_pkey" PRIMARY KEY using index "data_sources_pkey";

alter table "public"."company_financials" add constraint "company_financials_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_financials" validate constraint "company_financials_company_id_fkey";

alter table "public"."company_financials" add constraint "company_financials_company_id_period_fiscal_date_key" UNIQUE using index "company_financials_company_id_period_fiscal_date_key";

alter table "public"."company_metrics" add constraint "company_metrics_company_id_date_key" UNIQUE using index "company_metrics_company_id_date_key";

alter table "public"."company_metrics" add constraint "company_metrics_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_metrics" validate constraint "company_metrics_company_id_fkey";

alter table "public"."company_stock_data" add constraint "company_stock_data_company_id_date_key" UNIQUE using index "company_stock_data_company_id_date_key";

alter table "public"."company_stock_data" add constraint "company_stock_data_company_id_fkey" FOREIGN KEY (company_id) REFERENCES companies(id) not valid;

alter table "public"."company_stock_data" validate constraint "company_stock_data_company_id_fkey";

alter table "public"."data_ingestion_logs" add constraint "data_ingestion_logs_data_source_id_fkey" FOREIGN KEY (data_source_id) REFERENCES data_sources(id) not valid;

alter table "public"."data_ingestion_logs" validate constraint "data_ingestion_logs_data_source_id_fkey";

alter table "public"."data_ingestion_logs" add constraint "data_ingestion_logs_endpoint_id_fkey" FOREIGN KEY (endpoint_id) REFERENCES data_source_endpoints(id) not valid;

alter table "public"."data_ingestion_logs" validate constraint "data_ingestion_logs_endpoint_id_fkey";

alter table "public"."data_ingestion_logs" add constraint "data_ingestion_logs_endpoint_id_started_at_key" UNIQUE using index "data_ingestion_logs_endpoint_id_started_at_key";

alter table "public"."data_source_endpoints" add constraint "data_source_endpoints_data_source_id_fkey" FOREIGN KEY (data_source_id) REFERENCES data_sources(id) not valid;

alter table "public"."data_source_endpoints" validate constraint "data_source_endpoints_data_source_id_fkey";

alter table "public"."data_source_endpoints" add constraint "data_source_endpoints_data_source_id_name_key" UNIQUE using index "data_source_endpoints_data_source_id_name_key";

alter table "public"."data_sources" add constraint "data_sources_name_key" UNIQUE using index "data_sources_name_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.trigger_set_timestamp()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$
;

grant delete on table "public"."company_financials" to "anon";

grant insert on table "public"."company_financials" to "anon";

grant references on table "public"."company_financials" to "anon";

grant select on table "public"."company_financials" to "anon";

grant trigger on table "public"."company_financials" to "anon";

grant truncate on table "public"."company_financials" to "anon";

grant update on table "public"."company_financials" to "anon";

grant delete on table "public"."company_financials" to "authenticated";

grant insert on table "public"."company_financials" to "authenticated";

grant references on table "public"."company_financials" to "authenticated";

grant select on table "public"."company_financials" to "authenticated";

grant trigger on table "public"."company_financials" to "authenticated";

grant truncate on table "public"."company_financials" to "authenticated";

grant update on table "public"."company_financials" to "authenticated";

grant delete on table "public"."company_financials" to "service_role";

grant insert on table "public"."company_financials" to "service_role";

grant references on table "public"."company_financials" to "service_role";

grant select on table "public"."company_financials" to "service_role";

grant trigger on table "public"."company_financials" to "service_role";

grant truncate on table "public"."company_financials" to "service_role";

grant update on table "public"."company_financials" to "service_role";

grant delete on table "public"."company_metrics" to "anon";

grant insert on table "public"."company_metrics" to "anon";

grant references on table "public"."company_metrics" to "anon";

grant select on table "public"."company_metrics" to "anon";

grant trigger on table "public"."company_metrics" to "anon";

grant truncate on table "public"."company_metrics" to "anon";

grant update on table "public"."company_metrics" to "anon";

grant delete on table "public"."company_metrics" to "authenticated";

grant insert on table "public"."company_metrics" to "authenticated";

grant references on table "public"."company_metrics" to "authenticated";

grant select on table "public"."company_metrics" to "authenticated";

grant trigger on table "public"."company_metrics" to "authenticated";

grant truncate on table "public"."company_metrics" to "authenticated";

grant update on table "public"."company_metrics" to "authenticated";

grant delete on table "public"."company_metrics" to "service_role";

grant insert on table "public"."company_metrics" to "service_role";

grant references on table "public"."company_metrics" to "service_role";

grant select on table "public"."company_metrics" to "service_role";

grant trigger on table "public"."company_metrics" to "service_role";

grant truncate on table "public"."company_metrics" to "service_role";

grant update on table "public"."company_metrics" to "service_role";

grant delete on table "public"."company_stock_data" to "anon";

grant insert on table "public"."company_stock_data" to "anon";

grant references on table "public"."company_stock_data" to "anon";

grant select on table "public"."company_stock_data" to "anon";

grant trigger on table "public"."company_stock_data" to "anon";

grant truncate on table "public"."company_stock_data" to "anon";

grant update on table "public"."company_stock_data" to "anon";

grant delete on table "public"."company_stock_data" to "authenticated";

grant insert on table "public"."company_stock_data" to "authenticated";

grant references on table "public"."company_stock_data" to "authenticated";

grant select on table "public"."company_stock_data" to "authenticated";

grant trigger on table "public"."company_stock_data" to "authenticated";

grant truncate on table "public"."company_stock_data" to "authenticated";

grant update on table "public"."company_stock_data" to "authenticated";

grant delete on table "public"."company_stock_data" to "service_role";

grant insert on table "public"."company_stock_data" to "service_role";

grant references on table "public"."company_stock_data" to "service_role";

grant select on table "public"."company_stock_data" to "service_role";

grant trigger on table "public"."company_stock_data" to "service_role";

grant truncate on table "public"."company_stock_data" to "service_role";

grant update on table "public"."company_stock_data" to "service_role";

grant delete on table "public"."data_ingestion_logs" to "anon";

grant insert on table "public"."data_ingestion_logs" to "anon";

grant references on table "public"."data_ingestion_logs" to "anon";

grant select on table "public"."data_ingestion_logs" to "anon";

grant trigger on table "public"."data_ingestion_logs" to "anon";

grant truncate on table "public"."data_ingestion_logs" to "anon";

grant update on table "public"."data_ingestion_logs" to "anon";

grant delete on table "public"."data_ingestion_logs" to "authenticated";

grant insert on table "public"."data_ingestion_logs" to "authenticated";

grant references on table "public"."data_ingestion_logs" to "authenticated";

grant select on table "public"."data_ingestion_logs" to "authenticated";

grant trigger on table "public"."data_ingestion_logs" to "authenticated";

grant truncate on table "public"."data_ingestion_logs" to "authenticated";

grant update on table "public"."data_ingestion_logs" to "authenticated";

grant delete on table "public"."data_ingestion_logs" to "service_role";

grant insert on table "public"."data_ingestion_logs" to "service_role";

grant references on table "public"."data_ingestion_logs" to "service_role";

grant select on table "public"."data_ingestion_logs" to "service_role";

grant trigger on table "public"."data_ingestion_logs" to "service_role";

grant truncate on table "public"."data_ingestion_logs" to "service_role";

grant update on table "public"."data_ingestion_logs" to "service_role";

grant delete on table "public"."data_source_endpoints" to "anon";

grant insert on table "public"."data_source_endpoints" to "anon";

grant references on table "public"."data_source_endpoints" to "anon";

grant select on table "public"."data_source_endpoints" to "anon";

grant trigger on table "public"."data_source_endpoints" to "anon";

grant truncate on table "public"."data_source_endpoints" to "anon";

grant update on table "public"."data_source_endpoints" to "anon";

grant delete on table "public"."data_source_endpoints" to "authenticated";

grant insert on table "public"."data_source_endpoints" to "authenticated";

grant references on table "public"."data_source_endpoints" to "authenticated";

grant select on table "public"."data_source_endpoints" to "authenticated";

grant trigger on table "public"."data_source_endpoints" to "authenticated";

grant truncate on table "public"."data_source_endpoints" to "authenticated";

grant update on table "public"."data_source_endpoints" to "authenticated";

grant delete on table "public"."data_source_endpoints" to "service_role";

grant insert on table "public"."data_source_endpoints" to "service_role";

grant references on table "public"."data_source_endpoints" to "service_role";

grant select on table "public"."data_source_endpoints" to "service_role";

grant trigger on table "public"."data_source_endpoints" to "service_role";

grant truncate on table "public"."data_source_endpoints" to "service_role";

grant update on table "public"."data_source_endpoints" to "service_role";

grant delete on table "public"."data_sources" to "anon";

grant insert on table "public"."data_sources" to "anon";

grant references on table "public"."data_sources" to "anon";

grant select on table "public"."data_sources" to "anon";

grant trigger on table "public"."data_sources" to "anon";

grant truncate on table "public"."data_sources" to "anon";

grant update on table "public"."data_sources" to "anon";

grant delete on table "public"."data_sources" to "authenticated";

grant insert on table "public"."data_sources" to "authenticated";

grant references on table "public"."data_sources" to "authenticated";

grant select on table "public"."data_sources" to "authenticated";

grant trigger on table "public"."data_sources" to "authenticated";

grant truncate on table "public"."data_sources" to "authenticated";

grant update on table "public"."data_sources" to "authenticated";

grant delete on table "public"."data_sources" to "service_role";

grant insert on table "public"."data_sources" to "service_role";

grant references on table "public"."data_sources" to "service_role";

grant select on table "public"."data_sources" to "service_role";

grant trigger on table "public"."data_sources" to "service_role";

grant truncate on table "public"."data_sources" to "service_role";

grant update on table "public"."data_sources" to "service_role";

create policy "Allow public read access to company_financials"
on "public"."company_financials"
as permissive
for select
to public
using (true);


create policy "Allow public read access to company_metrics"
on "public"."company_metrics"
as permissive
for select
to public
using (true);


create policy "Allow public read access to company_stock_data"
on "public"."company_stock_data"
as permissive
for select
to public
using (true);


create policy "Allow public read access to data_ingestion_logs"
on "public"."data_ingestion_logs"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to insert data_source_endpoints"
on "public"."data_source_endpoints"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated users to update data_source_endpoints"
on "public"."data_source_endpoints"
as permissive
for update
to authenticated
using (true);


create policy "Allow public read access to data_source_endpoints"
on "public"."data_source_endpoints"
as permissive
for select
to public
using (true);


create policy "Allow authenticated users to insert data_sources"
on "public"."data_sources"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow authenticated users to update data_sources"
on "public"."data_sources"
as permissive
for update
to authenticated
using (true);


create policy "Allow public read access to data_sources"
on "public"."data_sources"
as permissive
for select
to public
using (true);


CREATE TRIGGER update_company_financials_updated_at BEFORE UPDATE ON public.company_financials FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_company_metrics_updated_at BEFORE UPDATE ON public.company_metrics FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_company_stock_data_updated_at BEFORE UPDATE ON public.company_stock_data FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_data_ingestion_logs_updated_at BEFORE UPDATE ON public.data_ingestion_logs FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_data_source_endpoints_updated_at BEFORE UPDATE ON public.data_source_endpoints FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_data_sources_updated_at BEFORE UPDATE ON public.data_sources FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();


