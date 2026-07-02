
-- Fix mutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Restrict SECURITY DEFINER function execution to signed-in users only
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

-- Remove broad SELECT policy that allows listing all files.
-- Public URLs to the public bucket continue to work independently.
DROP POLICY IF EXISTS "Anyone can view images" ON storage.objects;
