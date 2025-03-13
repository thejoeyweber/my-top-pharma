drop trigger if exists "update_company_financials_updated_at" on "public"."company_financials";

drop trigger if exists "update_company_metrics_updated_at" on "public"."company_metrics";

drop trigger if exists "update_company_stock_data_updated_at" on "public"."company_stock_data";

drop trigger if exists "update_data_ingestion_logs_updated_at" on "public"."data_ingestion_logs";

drop trigger if exists "update_data_source_endpoints_updated_at" on "public"."data_source_endpoints";

drop trigger if exists "update_data_sources_updated_at" on "public"."data_sources";

drop trigger if exists "update_companies_updated_at" on "public"."companies";

drop policy "Allow public read access to company_financials" on "public"."company_financials";

drop policy "Allow public read access to company_metrics" on "public"."company_metrics";

drop policy "Allow public read access to company_stock_data" on "public"."company_stock_data";

drop policy "Allow public read access to data_ingestion_logs" on "public"."data_ingestion_logs";

drop policy "Allow authenticated users to insert data_source_endpoints" on "public"."data_source_endpoints";

drop policy "Allow authenticated users to update data_source_endpoints" on "public"."data_source_endpoints";

drop policy "Allow public read access to data_source_endpoints" on "public"."data_source_endpoints";

drop policy "Allow authenticated users to insert data_sources" on "public"."data_sources";

drop policy "Allow authenticated users to update data_sources" on "public"."data_sources";

drop policy "Allow public read access to data_sources" on "public"."data_sources";

drop policy "Allow authenticated users to update companies" on "public"."companies";

revoke delete on table "public"."company_financials" from "anon";

revoke insert on table "public"."company_financials" from "anon";

revoke references on table "public"."company_financials" from "anon";

revoke select on table "public"."company_financials" from "anon";

revoke trigger on table "public"."company_financials" from "anon";

revoke truncate on table "public"."company_financials" from "anon";

revoke update on table "public"."company_financials" from "anon";

revoke delete on table "public"."company_financials" from "authenticated";

revoke insert on table "public"."company_financials" from "authenticated";

revoke references on table "public"."company_financials" from "authenticated";

revoke select on table "public"."company_financials" from "authenticated";

revoke trigger on table "public"."company_financials" from "authenticated";

revoke truncate on table "public"."company_financials" from "authenticated";

revoke update on table "public"."company_financials" from "authenticated";

revoke delete on table "public"."company_financials" from "service_role";

revoke insert on table "public"."company_financials" from "service_role";

revoke references on table "public"."company_financials" from "service_role";

revoke select on table "public"."company_financials" from "service_role";

revoke trigger on table "public"."company_financials" from "service_role";

revoke truncate on table "public"."company_financials" from "service_role";

revoke update on table "public"."company_financials" from "service_role";

revoke delete on table "public"."company_metrics" from "anon";

revoke insert on table "public"."company_metrics" from "anon";

revoke references on table "public"."company_metrics" from "anon";

revoke select on table "public"."company_metrics" from "anon";

revoke trigger on table "public"."company_metrics" from "anon";

revoke truncate on table "public"."company_metrics" from "anon";

revoke update on table "public"."company_metrics" from "anon";

revoke delete on table "public"."company_metrics" from "authenticated";

revoke insert on table "public"."company_metrics" from "authenticated";

revoke references on table "public"."company_metrics" from "authenticated";

revoke select on table "public"."company_metrics" from "authenticated";

revoke trigger on table "public"."company_metrics" from "authenticated";

revoke truncate on table "public"."company_metrics" from "authenticated";

revoke update on table "public"."company_metrics" from "authenticated";

revoke delete on table "public"."company_metrics" from "service_role";

revoke insert on table "public"."company_metrics" from "service_role";

revoke references on table "public"."company_metrics" from "service_role";

revoke select on table "public"."company_metrics" from "service_role";

revoke trigger on table "public"."company_metrics" from "service_role";

revoke truncate on table "public"."company_metrics" from "service_role";

revoke update on table "public"."company_metrics" from "service_role";

revoke delete on table "public"."company_stock_data" from "anon";

revoke insert on table "public"."company_stock_data" from "anon";

revoke references on table "public"."company_stock_data" from "anon";

revoke select on table "public"."company_stock_data" from "anon";

revoke trigger on table "public"."company_stock_data" from "anon";

revoke truncate on table "public"."company_stock_data" from "anon";

revoke update on table "public"."company_stock_data" from "anon";

revoke delete on table "public"."company_stock_data" from "authenticated";

revoke insert on table "public"."company_stock_data" from "authenticated";

revoke references on table "public"."company_stock_data" from "authenticated";

revoke select on table "public"."company_stock_data" from "authenticated";

revoke trigger on table "public"."company_stock_data" from "authenticated";

revoke truncate on table "public"."company_stock_data" from "authenticated";

revoke update on table "public"."company_stock_data" from "authenticated";

revoke delete on table "public"."company_stock_data" from "service_role";

revoke insert on table "public"."company_stock_data" from "service_role";

revoke references on table "public"."company_stock_data" from "service_role";

revoke select on table "public"."company_stock_data" from "service_role";

revoke trigger on table "public"."company_stock_data" from "service_role";

revoke truncate on table "public"."company_stock_data" from "service_role";

revoke update on table "public"."company_stock_data" from "service_role";

revoke delete on table "public"."data_ingestion_logs" from "anon";

revoke insert on table "public"."data_ingestion_logs" from "anon";

revoke references on table "public"."data_ingestion_logs" from "anon";

revoke select on table "public"."data_ingestion_logs" from "anon";

revoke trigger on table "public"."data_ingestion_logs" from "anon";

revoke truncate on table "public"."data_ingestion_logs" from "anon";

revoke update on table "public"."data_ingestion_logs" from "anon";

revoke delete on table "public"."data_ingestion_logs" from "authenticated";

revoke insert on table "public"."data_ingestion_logs" from "authenticated";

revoke references on table "public"."data_ingestion_logs" from "authenticated";

revoke select on table "public"."data_ingestion_logs" from "authenticated";

revoke trigger on table "public"."data_ingestion_logs" from "authenticated";

revoke truncate on table "public"."data_ingestion_logs" from "authenticated";

revoke update on table "public"."data_ingestion_logs" from "authenticated";

revoke delete on table "public"."data_ingestion_logs" from "service_role";

revoke insert on table "public"."data_ingestion_logs" from "service_role";

revoke references on table "public"."data_ingestion_logs" from "service_role";

revoke select on table "public"."data_ingestion_logs" from "service_role";

revoke trigger on table "public"."data_ingestion_logs" from "service_role";

revoke truncate on table "public"."data_ingestion_logs" from "service_role";

revoke update on table "public"."data_ingestion_logs" from "service_role";

revoke delete on table "public"."data_source_endpoints" from "anon";

revoke insert on table "public"."data_source_endpoints" from "anon";

revoke references on table "public"."data_source_endpoints" from "anon";

revoke select on table "public"."data_source_endpoints" from "anon";

revoke trigger on table "public"."data_source_endpoints" from "anon";

revoke truncate on table "public"."data_source_endpoints" from "anon";

revoke update on table "public"."data_source_endpoints" from "anon";

revoke delete on table "public"."data_source_endpoints" from "authenticated";

revoke insert on table "public"."data_source_endpoints" from "authenticated";

revoke references on table "public"."data_source_endpoints" from "authenticated";

revoke select on table "public"."data_source_endpoints" from "authenticated";

revoke trigger on table "public"."data_source_endpoints" from "authenticated";

revoke truncate on table "public"."data_source_endpoints" from "authenticated";

revoke update on table "public"."data_source_endpoints" from "authenticated";

revoke delete on table "public"."data_source_endpoints" from "service_role";

revoke insert on table "public"."data_source_endpoints" from "service_role";

revoke references on table "public"."data_source_endpoints" from "service_role";

revoke select on table "public"."data_source_endpoints" from "service_role";

revoke trigger on table "public"."data_source_endpoints" from "service_role";

revoke truncate on table "public"."data_source_endpoints" from "service_role";

revoke update on table "public"."data_source_endpoints" from "service_role";

revoke delete on table "public"."data_sources" from "anon";

revoke insert on table "public"."data_sources" from "anon";

revoke references on table "public"."data_sources" from "anon";

revoke select on table "public"."data_sources" from "anon";

revoke trigger on table "public"."data_sources" from "anon";

revoke truncate on table "public"."data_sources" from "anon";

revoke update on table "public"."data_sources" from "anon";

revoke delete on table "public"."data_sources" from "authenticated";

revoke insert on table "public"."data_sources" from "authenticated";

revoke references on table "public"."data_sources" from "authenticated";

revoke select on table "public"."data_sources" from "authenticated";

revoke trigger on table "public"."data_sources" from "authenticated";

revoke truncate on table "public"."data_sources" from "authenticated";

revoke update on table "public"."data_sources" from "authenticated";

revoke delete on table "public"."data_sources" from "service_role";

revoke insert on table "public"."data_sources" from "service_role";

revoke references on table "public"."data_sources" from "service_role";

revoke select on table "public"."data_sources" from "service_role";

revoke trigger on table "public"."data_sources" from "service_role";

revoke truncate on table "public"."data_sources" from "service_role";

revoke update on table "public"."data_sources" from "service_role";

alter table "public"."company_financials" drop constraint "company_financials_company_id_fkey";

alter table "public"."company_financials" drop constraint "company_financials_company_id_period_fiscal_date_key";

alter table "public"."company_metrics" drop constraint "company_metrics_company_id_date_key";

alter table "public"."company_metrics" drop constraint "company_metrics_company_id_fkey";

alter table "public"."company_stock_data" drop constraint "company_stock_data_company_id_date_key";

alter table "public"."company_stock_data" drop constraint "company_stock_data_company_id_fkey";

alter table "public"."data_ingestion_logs" drop constraint "data_ingestion_logs_data_source_id_fkey";

alter table "public"."data_ingestion_logs" drop constraint "data_ingestion_logs_endpoint_id_fkey";

alter table "public"."data_ingestion_logs" drop constraint "data_ingestion_logs_endpoint_id_started_at_key";

alter table "public"."data_source_endpoints" drop constraint "data_source_endpoints_data_source_id_fkey";

alter table "public"."data_source_endpoints" drop constraint "data_source_endpoints_data_source_id_name_key";

alter table "public"."data_sources" drop constraint "data_sources_name_key";

drop function if exists "public"."trigger_set_timestamp"();

alter table "public"."company_financials" drop constraint "company_financials_pkey";

alter table "public"."company_metrics" drop constraint "company_metrics_pkey";

alter table "public"."company_stock_data" drop constraint "company_stock_data_pkey";

alter table "public"."data_ingestion_logs" drop constraint "data_ingestion_logs_pkey";

alter table "public"."data_source_endpoints" drop constraint "data_source_endpoints_pkey";

alter table "public"."data_sources" drop constraint "data_sources_pkey";

drop index if exists "public"."company_financials_company_id_period_fiscal_date_key";

drop index if exists "public"."company_financials_pkey";

drop index if exists "public"."company_metrics_company_id_date_key";

drop index if exists "public"."company_metrics_pkey";

drop index if exists "public"."company_stock_data_company_id_date_key";

drop index if exists "public"."company_stock_data_pkey";

drop index if exists "public"."data_ingestion_logs_endpoint_id_started_at_key";

drop index if exists "public"."data_ingestion_logs_pkey";

drop index if exists "public"."data_source_endpoints_data_source_id_name_key";

drop index if exists "public"."data_source_endpoints_pkey";

drop index if exists "public"."data_sources_name_key";

drop index if exists "public"."data_sources_pkey";

drop index if exists "public"."idx_companies_ticker";

drop index if exists "public"."idx_company_financials_company_id";

drop index if exists "public"."idx_company_metrics_company_id";

drop index if exists "public"."idx_company_stock_data_company_id";

drop index if exists "public"."idx_data_source_endpoints_data_source_id";

drop table "public"."company_financials";

drop table "public"."company_metrics";

drop table "public"."company_stock_data";

drop table "public"."data_ingestion_logs";

drop table "public"."data_source_endpoints";

drop table "public"."data_sources";

alter table "public"."companies" drop column "active";

alter table "public"."companies" drop column "ticker";

alter table "public"."companies" alter column "headquarters" set data type character varying(255) using "headquarters"::character varying(255);

alter table "public"."companies" alter column "logo_url" set data type character varying(255) using "logo_url"::character varying(255);

alter table "public"."companies" alter column "name" set data type character varying(255) using "name"::character varying(255);

alter table "public"."companies" alter column "slug" set not null;

alter table "public"."companies" alter column "slug" set data type character varying(100) using "slug"::character varying(100);

alter table "public"."companies" alter column "stock_exchange" set data type character varying(50) using "stock_exchange"::character varying(50);

alter table "public"."companies" alter column "stock_symbol" set data type character varying(10) using "stock_symbol"::character varying(10);

alter table "public"."companies" alter column "website" set data type character varying(255) using "website"::character varying(255);

drop sequence if exists "public"."company_financials_id_seq";

drop sequence if exists "public"."company_metrics_id_seq";

drop sequence if exists "public"."company_stock_data_id_seq";

drop sequence if exists "public"."data_ingestion_logs_id_seq";

drop sequence if exists "public"."data_source_endpoints_id_seq";

drop sequence if exists "public"."data_sources_id_seq";

CREATE UNIQUE INDEX companies_slug_key ON public.companies USING btree (slug);

CREATE INDEX idx_companies_slug ON public.companies USING btree (slug);

alter table "public"."companies" add constraint "companies_slug_key" UNIQUE using index "companies_slug_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_modified_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$function$
;

create policy "Allow authenticated users to update companies"
on "public"."companies"
as permissive
for update
to authenticated
using (true)
with check (true);


CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON public.companies FOR EACH ROW EXECUTE FUNCTION update_modified_column();


