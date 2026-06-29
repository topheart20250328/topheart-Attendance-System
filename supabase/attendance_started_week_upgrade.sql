-- Upgrade existing database: attendance start week
alter table public.members
add column if not exists attendance_started_week date not null default date '2026-04-26';

create index if not exists idx_members_attendance_started_week
on public.members (attendance_started_week);

drop view if exists public.member_directory;

create view public.member_directory
with (security_invoker = true) as
select
  m.id,
  m.full_name,
  m.birthday,
  m.phone,
  m.address,
  m.profile_note,
  m.gender,
  m.note,
  m.note_carry_forward,
  m.note_priority_high,
  m.equipment_progress,
  m.attendance_started_week,
  m.role,
  m.is_admin,
  m.line_user_id,
  m.is_active,
  m.last_line_login_at,
  coalesce(dp.district_ids, array[]::bigint[]) as district_pastor_district_ids,
  m.district_id,
  d.name as district_name,
  coalesce(m.big_family_id, sg.big_family_id) as big_family_id,
  bf.name as big_family_name,
  m.small_group_id,
  sg.name as small_group_name,
  m.created_at,
  m.updated_at
from public.members m
left join public.small_groups sg on sg.id = m.small_group_id
left join public.districts d on d.id = coalesce(m.district_id, sg.district_id)
left join public.big_families bf on bf.id = coalesce(m.big_family_id, sg.big_family_id)
left join lateral (
  select array_agg(dpd.district_id order by dpd.district_id) as district_ids
  from public.district_pastor_districts dpd
  where dpd.district_pastor_id = m.id
) dp on true;

revoke all on public.member_directory from anon, authenticated;
grant select on public.member_directory to authenticated;
