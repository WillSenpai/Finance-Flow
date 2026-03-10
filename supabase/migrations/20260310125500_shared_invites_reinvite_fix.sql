-- Allow re-invites after old invite lifecycle changes and enforce a single pending invite per workspace/email.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'shared_workspace_invites_workspace_id_email_status_key'
      AND conrelid = 'public.shared_workspace_invites'::regclass
  ) THEN
    ALTER TABLE public.shared_workspace_invites
      DROP CONSTRAINT shared_workspace_invites_workspace_id_email_status_key;
  END IF;
END;
$$;

CREATE UNIQUE INDEX IF NOT EXISTS shared_workspace_invites_single_pending_idx
  ON public.shared_workspace_invites (workspace_id, lower(email))
  WHERE status = 'pending';
