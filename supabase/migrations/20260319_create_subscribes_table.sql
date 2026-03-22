-- Migration: Create subscribes table for newsletter
-- Created: 2026-03-19

create table if not exists public.subscribes (
  id serial not null,
  user_id text null,
  email character varying(150) not null unique,
  is_subscribed boolean null default true,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint subscribes_pkey primary key (id)
  -- constraint subscribes_user_id_fkey foreign KEY (user_id) references public.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Note: The foreign key constraint depends on the existence of a 'users' table.
-- If you have a users table, you can uncomment the line above.
-- Otherwise, it's safer to keep it commented for initial setup.
