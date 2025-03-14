alter table "public"."pharm_class_mappings" drop constraint "unique_pharm_class_mapping";

alter table "public"."pharm_class_mappings" drop constraint "pharm_class_mappings_therapeutic_area_id_fkey";

drop index if exists "public"."pharm_class_mapping_idx";

drop index if exists "public"."unique_pharm_class_mapping";

alter table "public"."pharm_class_mappings" alter column "therapeutic_area_id" drop not null;

CREATE INDEX idx_pharm_class_mappings ON public.pharm_class_mappings USING btree (pharm_class, class_type);

alter table "public"."pharm_class_mappings" add constraint "pharm_class_mappings_therapeutic_area_id_fkey" FOREIGN KEY (therapeutic_area_id) REFERENCES therapeutic_areas(id) ON DELETE CASCADE not valid;

alter table "public"."pharm_class_mappings" validate constraint "pharm_class_mappings_therapeutic_area_id_fkey";


