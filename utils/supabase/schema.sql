/** 
* USER
* Note: This table contains user data. Users should only be able to view and update their own data.
*/
create table "user" (
  -- UUID from auth.users
  id uuid references auth.users not null primary key,
  avatar_url text,
  full_name text,
  username text,
  meta jsonb
);

alter table "user" enable row level security;

create policy "Can view own user data." on "user" for select 
using (auth.uid() = id);

create policy "Can update own user data." on "user" for update 
using (auth.uid() = id);


/********************************************************************
* This trigger automatically sets the 'id' field with a custom prefix
*/ 

CREATE OR REPLACE FUNCTION fn_set_id_with_prefix()
RETURNS TRIGGER AS $$
BEGIN
  NEW.id := TG_ARGV[0] || '-' || uuid_generate_v4()::text;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql security definer;

/********************************************************************
* This trigger automatically sets clls the function t create usr acocunt when a new users is created via Supabase Auth.
*/

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.fn_create_user_account_for_new_user();

/********************************************************************
* This function automatically creates a user entry when a new user signs up via Supabase Auth.
*/ 
create or replace function fn_create_user_account_for_new_user() 
returns trigger as $$
declare
    v_username text;
    v_name text;
    v_avatar_url text;
    v_user_id text;
    v_default_bio text := 'this is my bio';  
begin
    -- Generate the username
    v_username := split_part(new.raw_user_meta_data ->> 'name', ' ', 1) || '_' || to_char(floor(random() * 10000000), 'FM0000000');
    v_name := new.raw_user_meta_data ->> 'name';
    v_avatar_url := new.raw_user_meta_data ->> 'avatar_url';
    v_user_id := new.id;

    -- Insert into user table
    insert into public.user(id, full_name, username, avatar_url)
    values (
        new.id,
        v_name,
        v_username,
        v_avatar_url
    );

    return new;
end;
$$ language plpgsql security definer;


/********************************************************************
-- * Account
-- * Note: 
-- */
create table
  public.account (
    id text not null,
    full_name text not null,
    handle text null,
    bio text null,
    avatar_url text null,
    account_status text not null default 'new'::text,
    meta jsonb null,
    created_at timestamp with time zone null default now(),
    created_by text null,
    constraint account_pkey primary key (id),
    constraint account_username_key unique (handle)
  ) tablespace pg_default;

create unique index "account_username_key" on public."account" using btree (username) tablespace pg_default;
-- create policy "Can view own account data." on user for select using (auth.uid() = id);
-- create policy "Can update own account data." on user for update using (auth.uid() = id);

/********************************************************************
-- Create the trigger to call the function on insert of account
*/
create trigger trg_account_set_id_trigger
before insert on account
for each row 
execute function fn_set_id_with_prefix('acc');

/********************************************************************
-- Create the membership table
*/

create table
  public."membership" (
    id text not null,
    "accountId" text not null,
    "userId" text null,
    invited_name text null,
    invited_email text null,
    role text not null default 'editor',
    created_at timestamp with time zone null default now(),
    meta JSONB null,
    constraint membership_pkey primary key (id)
  ) tablespace pg_default;

create unique index "membership_accountId_invited_email_key" on public."membership" using btree ("accountId", "invited_email") tablespace pg_default;

/********************************************************************
-- Create the trigger to call the function on insert of membership
*/
create trigger trg_membership_set_id_trigger
before insert on membership
for each row 
execute function fn_set_id_with_prefix('mem');
