-- Topheart admin operations
-- Usage:
-- 1. Open Supabase SQL Editor
-- 2. Copy one section at a time
-- 3. Replace placeholder values before running

-- =========================================================
-- 0. 既有資料庫升級：新增備註是否自動帶到下週
-- 已經跑過新版 setup_supabase.sql 的全新資料庫不需要再跑。
-- =========================================================
alter table public.members
add column if not exists note_carry_forward boolean not null default true;

create or replace view public.member_directory as
select
  m.id,
  m.full_name,
  m.birthday,
  m.gender,
  m.note,
  m.note_carry_forward,
  m.role,
  m.is_admin,
  m.line_user_id,
  m.is_active,
  m.last_line_login_at,
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
left join public.big_families bf on bf.id = coalesce(m.big_family_id, sg.big_family_id);

-- =========================================================
-- A. 第一次登入後，查看待綁定的 LINE 身分
-- =========================================================
select
  line_user_id,
  display_name,
  created_at,
  expires_at
from public.line_pending_logins
where consumed_at is null
order by created_at desc;


-- =========================================================
-- B. 初始化第一位管理員（第一次只需要做一次）
-- 請把名字與 LINE User ID 換成你自己的
-- =========================================================
insert into public.districts (name, description)
values ('第一區', '系統初始區')
on conflict (name) do nothing;

insert into public.members (
  full_name,
  role,
  is_admin,
  line_user_id,
  district_id,
  note
)
select
  '請改成你的名字',
  'district_leader',
  true,
  '請改成你的 LINE User ID',
  d.id,
  '系統初始管理員'
from public.districts d
where d.name = '第一區'
and not exists (
  select 1
  from public.members m
  where m.line_user_id = '請改成你的 LINE User ID'
);


-- =========================================================
-- C. 建立區
-- =========================================================
insert into public.districts (name, description)
values ('第二區', '範例區')
on conflict (name) do nothing;


-- =========================================================
-- D. 建立大家
-- =========================================================
insert into public.big_families (district_id, name, description)
values (
  (select id from public.districts where name = '第一區'),
  '恩典大家',
  ''
)
on conflict (district_id, name) do nothing;


-- =========================================================
-- E. 建立小家
-- =========================================================
insert into public.small_groups (big_family_id, name, description)
values (
  (select id from public.big_families where name = '恩典大家'),
  '喜樂小家',
  ''
)
on conflict (big_family_id, name) do nothing;


-- =========================================================
-- F. 新增大家長
-- =========================================================
insert into public.members (
  full_name,
  birthday,
  gender,
  note,
  role,
  is_admin,
  district_id,
  big_family_id
)
values (
  '王大家長',
  null,
  'brother',
  '',
  'big_family_leader',
  false,
  (select id from public.districts where name = '第一區'),
  (select id from public.big_families where name = '恩典大家')
);


-- =========================================================
-- G. 新增小家長
-- =========================================================
insert into public.members (
  full_name,
  birthday,
  gender,
  note,
  role,
  is_admin,
  district_id,
  big_family_id,
  small_group_id
)
values (
  '李小家長',
  null,
  'sister',
  '',
  'small_group_leader',
  false,
  (select id from public.districts where name = '第一區'),
  (select id from public.big_families where name = '恩典大家'),
  (select id from public.small_groups where name = '喜樂小家')
);


-- =========================================================
-- H. 新增小家人
-- =========================================================
insert into public.members (
  full_name,
  birthday,
  gender,
  note,
  role,
  district_id,
  big_family_id,
  small_group_id
)
values (
  '陳小家人',
  null,
  'brother',
  '',
  'member',
  (select id from public.districts where name = '第一區'),
  (select id from public.big_families where name = '恩典大家'),
  (select id from public.small_groups where name = '喜樂小家')
);


-- =========================================================
-- I. 新增新朋友 best
-- =========================================================
insert into public.members (
  full_name,
  birthday,
  gender,
  note,
  role,
  district_id,
  big_family_id,
  small_group_id
)
values (
  '林新朋友',
  null,
  'sister',
  '',
  'best',
  (select id from public.districts where name = '第一區'),
  (select id from public.big_families where name = '恩典大家'),
  (select id from public.small_groups where name = '喜樂小家')
);


-- =========================================================
-- J. 幫某位領袖發邀請碼
-- 只有需要登入的角色才需要邀請碼：
-- district_leader / big_family_leader / small_group_leader
-- =========================================================
insert into public.login_invites (
  member_id,
  expires_at,
  created_by_member_id
)
values (
  (
    select id
    from public.members
    where full_name = '李小家長'
      and role = 'small_group_leader'
    limit 1
  ),
  now() + interval '7 days',
  (
    select id
    from public.members
    where full_name = '請改成你的名字'
    limit 1
  )
)
returning invite_code, expires_at;


-- =========================================================
-- K. 查看目前所有邀請碼
-- =========================================================
select
  li.invite_code,
  li.expires_at,
  li.used_at,
  li.used_by_line_user_id,
  target.full_name as target_name,
  target.role as target_role,
  creator.full_name as created_by
from public.login_invites li
join public.members target on target.id = li.member_id
left join public.members creator on creator.id = li.created_by_member_id
order by li.created_at desc;


-- =========================================================
-- L. 查看目前所有人員與層級
-- =========================================================
select
  id,
  full_name,
  role,
  is_admin,
  line_user_id,
  is_active,
  district_name,
  big_family_name,
  small_group_name,
  note,
  last_line_login_at
from public.member_directory
order by
  district_name nulls last,
  big_family_name nulls last,
  small_group_name nulls last,
  role,
  full_name;


-- =========================================================
-- M. 查某一位人員是否已完成 LINE 綁定
-- =========================================================
select
  full_name,
  role,
  line_user_id,
  last_line_login_at
from public.members
where full_name = '李小家長';


-- =========================================================
-- N. 將某人升級為管理員
-- =========================================================
update public.members
set is_admin = true
where full_name = '王大家長';


-- =========================================================
-- O. 停用某人
-- =========================================================
update public.members
set is_active = false
where full_name = '林新朋友';


-- =========================================================
-- P. 重新啟用某人
-- =========================================================
update public.members
set is_active = true
where full_name = '林新朋友';


-- =========================================================
-- Q. 查詢最近點名紀錄
-- =========================================================
select
  aw.week_start_date,
  m.full_name,
  m.role,
  ar.event_type,
  ar.status,
  recorder.full_name as recorded_by,
  ar.recorded_at
from public.attendance_records ar
join public.attendance_weeks aw on aw.id = ar.attendance_week_id
join public.members m on m.id = ar.member_id
left join public.members recorder on recorder.id = ar.recorded_by_member_id
order by aw.week_start_date desc, m.full_name, ar.event_type;


-- =========================================================
-- R. 查詢某週主日 / 小家團契出席狀況
-- =========================================================
select
  aw.week_start_date,
  d.name as district_name,
  bf.name as big_family_name,
  sg.name as small_group_name,
  m.full_name,
  m.role,
  ar.event_type,
  ar.status
from public.attendance_records ar
join public.attendance_weeks aw on aw.id = ar.attendance_week_id
join public.members m on m.id = ar.member_id
join public.districts d on d.id = m.district_id
left join public.big_families bf on bf.id = m.big_family_id
left join public.small_groups sg on sg.id = m.small_group_id
where aw.week_start_date = date '2026-04-20'
order by d.name, bf.name, sg.name, m.role, m.full_name, ar.event_type;


-- =========================================================
-- S. 危險操作：解除某位人員的 LINE 綁定
-- 只有在綁錯帳號時才用
-- =========================================================
-- update public.members
-- set line_user_id = null,
--     last_line_login_at = null
-- where full_name = '李小家長';


-- =========================================================
-- T. 危險操作：刪除某人的未使用邀請碼
-- =========================================================
-- delete from public.login_invites
-- where member_id = (
--   select id
--   from public.members
--   where full_name = '李小家長'
--   limit 1
-- )
-- and used_at is null;
