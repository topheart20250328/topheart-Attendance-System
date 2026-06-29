# 維運與資料安全建議

## 備份

- 優先確認 Supabase 專案方案是否支援 Point-in-Time Recovery。若有，正式上線前先做一次還原演練。
- 若目前方案沒有 PITR，建議至少每日匯出資料庫備份，並保存到 Supabase 以外的位置。
- 每次大批匯入、調整組織層級或部署 schema 前，先手動匯出一份備份。

## 防誤刪

- 一般前端操作會先將人員移入「封存區」，保留歷史點名資料。
- 封存區內才會顯示「完全刪除」，且必須二段確認後才會刪除人員與相關資料。
- 真正硬刪前仍建議先確認備份，避免不可復原的資料遺失。
- `audit_logs` 會記錄敏感操作，方便日後追查誰在何時調整資料。

## 多人同時點名

- 目前同一筆點名若多人同時儲存，會以最後儲存者為準。
- 建議同一小家仍指定主要點名者，其他人以查看或補充備註為主。
- 若未來多人協作頻率變高，下一階段可加入版本檢查，提示「資料已被其他人更新」後再讓使用者決定是否覆蓋。

## 備註規範

- 備註最多 1000 字，避免誤貼大量內容或造成畫面難以閱讀。
- 「持續提醒」代表備註會顯示在之後週次，直到使用者取消或清空。
- 備註請避免放過度敏感個資、醫療細節或不適合廣泛管理者檢視的牧養內容。
- 若未來需要更私密的牧養紀錄，建議新增獨立的 `pastoral_notes` 類資料表，並給更嚴格的可見權限與操作紀錄。

## 流量與容量

- 數百名使用者與同時數十人上線，現在的資料量通常不是容量問題；較需要注意的是總覽頁的歷史統計查詢。
- 本次總覽統計限制在目前可見人員與近一年資料，避免不必要地掃描所有歷史紀錄。
- 文字備註本身容量很小；真正要注意的是未來若加入圖片、附件或長期大量牧養紀錄，需要另外規劃儲存策略。

## 效能維護

- 每次大量匯入、年度整理或調整索引前，先備份資料庫，再記錄主要資料表筆數：`members`、`attendance_weeks`、`attendance_records`、`districts`、`big_families`、`small_groups`。
- 建議定期查看 Supabase Advisors，優先處理缺少索引、RLS 與安全性警告；效能警告若牽涉大量資料掃描，再搭配查詢實際用途判斷是否加索引。
- 第一階段已補強常用查詢索引：啟用人員角色/姓名、啟用組織排序，以及 `attendance_records (attendance_week_id, status)`。若後續新增查詢條件，應先用實際慢查詢或 advisors 確認再加索引，避免過多索引拖慢寫入。
- `出席導覽` 目前只在前端請求當週資料，後端歷史統計限制在可見人員與近 52 週。若資料量成長後仍明顯變慢，再進入第二階段建立月彙總或 `attendance_summary`。
- `app-api` 的登入清理任務已改為定時或登入相關 action 觸發；若未來部署多個 Edge Function instance，仍可接受，因為清理邏輯是冪等的，只影響觸發頻率。

常用盤點 SQL：

```sql
select 'members' as table_name, count(*) from public.members
union all select 'attendance_weeks', count(*) from public.attendance_weeks
union all select 'attendance_records', count(*) from public.attendance_records
union all select 'districts', count(*) from public.districts
union all select 'big_families', count(*) from public.big_families
union all select 'small_groups', count(*) from public.small_groups;
```
