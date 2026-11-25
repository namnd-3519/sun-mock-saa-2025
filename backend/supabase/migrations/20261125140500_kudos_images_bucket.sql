-- Storage bucket for images attached to kudos (max 5 per kudos, enforced by create_kudos).
-- Private: only signed-in users read (the web app serves signed URLs); they upload only into
-- their own "<uid>/" folder.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'kudos-images',
  'kudos-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy kudos_images_insert_own_folder on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'kudos-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy kudos_images_delete_own_folder on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'kudos-images'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy kudos_images_select_authenticated on storage.objects
  for select to authenticated
  using (bucket_id = 'kudos-images');
