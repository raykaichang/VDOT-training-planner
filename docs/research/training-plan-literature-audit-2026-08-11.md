# 丹尼爾斯／Hansons 課表文獻檢核與網站測試

日期：2026-08-11

## 結論先講

這次建立 18 項課表檢查原則，並用 24 組不同 VDOT、週跑量、賽事、週期、等級、週次與目標完賽時間的組合測試現有網站。依討論結果，已修正 VDOT 配速、一般長跑 150 分鐘上限、低跑量品質課資格、Hansons 低量路線、current VDOT＋goal finish time 雙輸入，以及 Hansons 的官方來源邊界。

- 現有專案單元測試：全數通過。
- 文獻規則情境測試：16 組 PASS、8 組 REVIEW、0 組 FAIL。
- 稽核腳本抽查 2 個官方 VDOT E pace 錨點：2 組皆 PASS；單元測試另固定 30、35、39、50、71.3、85 六個完整 E/M/T/I/R 錨點。
- 所有 24 組都通過基本資料完整性：固定 7 天、距離非負、週總量守恆、正式品質課沒有排在相鄰日。
- 24 組案例已沒有硬規則 FAIL。剩餘 REVIEW 是 Phase IV 比賽週自動化、低於官方 Classic 跑量時明確標示為基礎／完賽路線，以及目標配速明顯快於目前能力時的漸進保護。

狀態定義：

- `PASS`：本次可自動檢查的硬規則全部通過，也沒有需要產品決策的差異。
- `REVIEW`：數值未必錯，但屬於網站自訂、來源不夠直接，或需要先決定產品哲學。
- `FAIL`：與採用的文獻上限、官方數值錨點或網站內部資料一致性衝突。

這是課表邏輯稽核，不是對個別跑者的醫療或受傷風險保證。

## 來源與判讀方式

來源優先順序是作者／出版社官方資料、作者官方課表 PDF、官方 VDOT 說明，再來才是目前網站自己的設計。沒有把論壇、部落格整理文或模型記憶當成硬規則。

### Daniels／VDOT

- [Daniels' Running Formula 第四版（Human Kinetics）](https://us.humankinetics.com/products/daniels-running-formula-4th-edition)
- [Sample running program from Daniels' Running Formula](https://us.humankinetics.com/blogs/excerpt/sample-running-program-from-daniels-running-formula)
- [The Basic Laws of Running According to Jack Daniels](https://us.humankinetics.com/blogs/excerpt/the-basic-laws-of-running-according-to-jack-daniels)
- [VDOT Training Definitions](https://vdoto2.com/learn-more/training-definitions)
- [Get The Most Out Of Your Threshold Training](https://news.vdoto2.com/2025/06/get-the-most-out-of-your-threshold-training/)
- [Updated VDOT Paces 39 and Below For Greater Accuracy](https://support.vdoto2.com/2019/08/updated-vdot-paces-39-for-greater-accuracy/)
- [Coach Spotlight: James McKirdy](https://news.vdoto2.com/2019/02/coach-spotlight-james-mckirdy/)
- [Understanding Effort, Not Just Pace](https://news.vdoto2.com/2017/07/understanding-effort-not-just-pace/)

### Hansons／Luke Humphrey Running

- [Hansons Running 免費 Classic 課表](https://hansons-running.com/content/training-plans)
- [Luke Humphrey Running 5K Training Philosophy](https://lukehumphreyrunning.com/5k-training-philosophy/)
- [Luke Humphrey Running 10K Training Philosophy](https://lukehumphreyrunning.com/10k-training-philosophy/)
- [Luke Humphrey Running Training Plans](https://lukehumphreyrunning.com/training-plans/)
- [Beginner Marathon PDF](hansons-official/01-beginner-marathon.pdf)
- [Advanced Marathon PDF](hansons-official/02-advanced-marathon.pdf)
- [Beginner Half Marathon PDF](hansons-official/03-beginner-half-marathon.pdf)
- [Advanced Half Marathon PDF](hansons-official/04-advanced-half-marathon.pdf)
- [Hansons Marathon Method 2e preview](hansons-official/06-hansons-marathon-method-2e-preview.pdf)
- [Hansons Half-Marathon Method sample](hansons-official/07-hansons-half-marathon-method-sample.pdf)

## 18 項課表重點檢查原則

| ID | 檢查原則 | 可執行的檢查方式 |
|---|---|---|
| P01 | VDOT 訓練配速以目前能力為基準，不用尚未具備的目標成績硬拉強度 | 配速輸入與目標成績分開；提示使用近期比賽或可靠測驗更新 VDOT |
| P02 | 配速要能對上官方 VDOT 數值，VDOT 39 以下要使用官方修正 | 以低 VDOT 與高 VDOT 官方範例做 golden test，不只測公式單調性 |
| P03 | E 是可對話、低壓力的主要跑量；天氣、坡度與疲勞時依 effort 調整 | E pace 是區間；熱天不把表定配速當硬下限 |
| P04 | Daniels 一般長跑採週量 25–30% 與 150 分鐘兩者較低 | 同時算距離占比與慢端時間，不能只通過其中一個 |
| P05 | M 是預期馬拉松比賽配速，主要放在較後期；單次上限取週量 20% 或 18 miles 較低 | 目標 MP 獨立輸入；檢查 M 工作量 cap |
| P06 | T 約為可維持一小時的強度；20 分鐘 steady 或 cruise intervals 約週量 10%，更長 tempo 要降速 | 檢查 T 主課距離、時間、恢復與週量占比 |
| P07 | I 每段約 1–5 分鐘，恢復相等或略短；總量上限取週量 8% 或 10K 較低 | 每段時間、恢復比、全課 I 距離都要檢查 |
| P08 | R 每段通常不超過 2 分鐘，強調動作與速度，段間完整恢復；總量上限取週量 5% 或 5 miles 較低 | R 不和 strides 混算；檢查單段、恢復與總量 |
| P09 | Strides 約 15–20 秒並完整恢復，是 E 日的小刺激，不等同正式 R/SOS | 排課與統計時不要把 strides 算成一堂完整品質課 |
| P10 | Daniels 由基礎到專項逐步進展；基礎期以 E＋strides 為主，再增加 R、I/T 與比賽專項 | Phase I 若出現正式 T/R 要標示為網站自訂，不宣稱是原版逐週安排 |
| P11 | 品質課之間要有 E／恢復日；缺課不補堆，生病或疼痛時不硬做 | 自動檢查相鄰日；UI 提醒不要為追週量硬塞課 |
| P12 | 一堂課的週總量要包含熱身、主課、恢復與收操，週總量也要守恆 | 每日 breakdown 與每日總量、每日總量與週總量雙向核對 |
| P13 | 品質課數量與強度要依可持續週量、訓練史與恢復能力調整 | 低週量不能只縮 E，卻保留完整高量版主課 |
| P14 | 高溫、濕度、風與地形要用 effort 校正，不應盲追平地涼爽日配速 | 配速修正與課量／恢復建議一起呈現 |
| P15 | Hansons 馬拉松／半馬的 cumulative fatigue 建立在跑量、強度、平衡、一致性與恢復，不等於天天跑到耗盡 | SOS 不連日；避免單次長跑占掉過多週量；維持易跑分布 |
| P16 | Hansons Classic 要保留原表骨架：Tue Speed→Strength、Thu goal-pace Tempo、Sun Long Run，並處理 taper／race week | 標準跑量版本逐週對照官方 PDF；公制換算容許明確誤差 |
| P17 | Hansons 官方表的 MP／HMP 是 goal pace；目前能力與目標配速是兩個不同輸入 | UI 新增目標時間或 goal MP/HMP，並對不合理落差提示而非直接覆蓋 |
| P18 | 只有能用官方逐週課表核對的距離才能標示為 Hansons 自動課表；僅有訓練哲學或付費方案目錄，不能自行補成官方週曆 | Hansons 只提供半馬／馬拉松 Classic；5K 與績效型 10K 不出現在方法選項，除非日後取得可重製、可逐週驗證的官方來源 |

## 24 組網站課表測試

### Daniels：17 組

| ID | 能力組合 | 結果 | 主要發現 |
|---|---|---|---|
| D01 | VDOT 35、20 km、5K–10K Phase I | PASS | 正式 T 資格未達，改排 E＋strides；週量與長跑上限通過 |
| D02 | VDOT 45、31.9 km、5K–10K Phase II | PASS | 正式 T 資格未達，不把縮短刺激標成 T |
| D03 | VDOT 45、32 km、5K–10K Phase II | PASS | 週量雖到舊雙品質門檻，但仍無法同時容納 20 分鐘 T、熱身收操與 10% 上限，因此維持 E＋strides |
| D04 | VDOT 50、58 km、5K–10K Phase II、30°C／80% | PASS | 結構、占比、間隔與熱天輸出通過 |
| D05 | VDOT 50、58 km、5K–10K Phase III | PASS | 結構、占比與品質課間隔通過 |
| D06 | VDOT 55、70 km、5K–10K Phase IV | REVIEW | T 課自動選到 10% 上限內；比賽週仍只有文字提醒，未自動減量 |
| D07 | VDOT 50、70 km、半馬 Phase II 單週 T+R | PASS | 結構、占比與間隔通過 |
| D08 | VDOT 50、70 km、半馬 Phase II 雙週 T+I | PASS | 結構、占比與間隔通過 |
| D09 | VDOT 45、35 km、半馬 Phase III | PASS | 正式 T 資格未達，改排 E＋strides |
| D10 | VDOT 50、64 km、半馬 Phase IV | REVIEW | 數值通過；比賽週僅提示，不會依比賽日改課表 |
| D11 | VDOT 40、40 km、馬拉松 Phase I week 1 | PASS | 實排 32 km；沒有 M/T/I/R，長跑 30% |
| D12 | VDOT 40、64 km、馬拉松 Phase II week 3 | PASS | 實排 57.6 km；長跑 29.9%，M/T cap 通過 |
| D13 | VDOT 40、65 km、馬拉松 Phase II week 1 | PASS | 實排 52 km；長跑 30%，cap 通過 |
| D14 | VDOT 50、80 km、馬拉松 Phase III week 4 | PASS | 混合長課、25% 長跑與強度 cap 通過 |
| D15 | VDOT 50、100 km、馬拉松 Phase IV week 6 | REVIEW | 75% 比賽週量是網站保守改編，不是來源明列的固定比例 |
| D16 | VDOT 30、70 km、5K–10K Phase II、35°C／80% | PASS | 長跑由 19.6 km 修正為 17.6 km，熱天 E 慢端估時 149.9 分鐘 |
| D17 | VDOT 35、27 km、馬拉松 Phase IV week 6 | REVIEW | Q2 改為 2×800m＝1.6 km T，文字與 metadata 一致且不超過 T cap；75% 比賽週量仍是網站改編 |

### Hansons：7 組

| ID | 能力組合 | 結果 | 主要發現 |
|---|---|---|---|
| H01 | VDOT 40、47 mi 換算、半馬 Beginner week 5、goal 1:50 | PASS | goal HMP 進入 Tempo；Easy／Long 仍依目前 VDOT |
| H02 | VDOT 50、50 mi 換算、半馬 Advanced week 11、goal 1:25 | REVIEW | 目標落差超過每英里 10 秒，Strength 套用 current→goal 漸進保護 |
| H03 | VDOT 38、30 km、半馬 Beginner week 5、goal 2:00 | REVIEW | 切換基礎／完賽路線；實排 17.9 km、長跑 5.3 km（29.6%），沒有縮小版 Classic SOS |
| H04 | VDOT 40、57.5 mi 換算、馬拉松 Beginner week 6、goal 3:20 | REVIEW | 官方峰值不誤報；大目標落差使用 current→goal 漸進，不直接套用 goal MP |
| H05 | VDOT 55、61.5 mi 換算、馬拉松 Advanced week 11、goal 2:55 | PASS | Speed／Easy 由 current VDOT，Tempo／Strength 由 goal MP |
| H06 | VDOT 35、35 km、馬拉松 Beginner week 13、goal 4:30 | REVIEW | 切換基礎／完賽路線；長跑 29.9%，沒有 Strength／Tempo 縮小版 |
| H07 | VDOT 45、57.5 mi 換算、馬拉松 Beginner race week、goal 3:25 | PASS | race week 比賽日使用明確 goal MP，總量對上官方表 |

### 官方 VDOT 配速錨點

| ID | 官方錨點 | 網站差異 | 結果 |
|---|---|---|---|
| V01 | VDOT 35 官方 E 6:35–7:14/km | 網站 6:35–7:14/km | PASS |
| V02 | VDOT 71.3 官方 E 3:50–4:14/km | 網站 3:50–4:14/km | PASS |

目前改為使用 6 個官方計算器錨點做分段插值，並在 VDOT 39 修正邊界兩側分別固定測試；不再把單一 VO2 百分比公式視為官方 table 的等價實作。

## 問題分級與建議討論順序

### 已完成修正

1. **VDOT pace engine**：加入 30、35、39、50、71.3、85 官方 E/M/T/I/R 錨點與分段插值，低於 39 的官方修正不再被同一公式蓋過。
2. **一般 Daniels 長跑**：同時套用 30% 與 150 分鐘上限，依熱天修正後 E 慢端估算距離。
3. **比賽週 Q2 一致性**：低量案例由 3×800m／2.0 km 的矛盾改為 2×800m／1.6 km，並維持 T cap。
4. **英里轉公里邊界**：官方峰值先統一到網站的一位小數精度再判斷，不再誤報。
5. **低跑量 T 資格**：只有在能同時容納至少 20 分鐘 T、約 2 km 熱身收操與週量 10% T cap 時才開正式品質課；否則排 E＋strides。
6. **Hansons 雙輸入**：E、Long、Speed 與網站 T／I／R 使用 current VDOT；Tempo、Strength 與比賽日使用 goal MP／HMP。目標落差超過每英里 10 秒時，自動從 current pace 漸進到 goal pace。
7. **Hansons 基礎／完賽路線**：峰值低於官方 Classic 約 75% 時，不再等比例縮小 SOS；改排 Easy、strides 與不超過 30% 的基礎長跑。
8. **Hansons 官方來源邊界**：移除 5K 與績效型 10K 自動課表。公開資料只有訓練哲學與付費方案說明，沒有可逐週核對的免費官方 Classic；免費 Couch Potato to 10K 是另一條走跑完賽課表，不能拿來支持原本的績效型生成器。

### 尚待後續產品決策

9. **一般距離 Daniels Phase I**：要採原版傾向的 E＋strides，還是保留網站自訂 T/R 基礎期；兩者都能做，但來源標示要誠實。
10. **Phase IV 的比賽週自動化**：現在只有文字提示；是否要加入比賽日期／距離並自動換課，需要產品層決定。

## 低量品質課會不會縮到無法進步

答案是「可能」，但文獻不支持一條對所有跑者都相同的最低公里數。

- VDOT 對 T 的第一方建議同時存在兩個條件：steady tempo 通常約 20 分鐘；cruise intervals 的品質段建議至少約 30 分鐘，但總量又應控制在約週量 10%。這表示在 20–30 km 週量時，完整 T 主課可能同時無法滿足最低時間與週量上限。[VDOT Threshold Training](https://news.vdoto2.com/2025/06/get-the-most-out-of-your-threshold-training/)
- 對 I 課，官方建議 1–5 分鐘一段、品質總量最多約週量 8%；目的不是做得越多越好，而是在正確強度累積足夠時間。[VDOT VO2max Training](https://news.vdoto2.com/2025/07/how-to-effectively-improve-your-vo2max/)
- 針對訓練良好長跑者的系統性回顧發現，interval training load 和 VO2max 改善有關，但整體證據異質，不能從中推出一個通用最低劑量。[Parmar et al., 2021](https://pubmed.ncbi.nlm.nih.gov/33605843/)

目前實作不是把 D01 的 3.5 km T 硬砍成 2 km 後宣稱效果相同，而是設定課型資格：週量不足時先安排 E＋strides；等週量能同時容納主課、約 2 km 熱身收操與週量 10% 上限，再開正式 T。這能同時避免「刺激太少」和「單堂課占週量太多」。

Hansons 低量版也是相同問題。方法本身強調先用 easy mileage 建立能承受強度的結構，並批評低週量、三天訓練與長跑占 40–50% 的組合。觀察性研究也顯示，半馬高於 32 km／週、馬拉松高於 65 km／週和較快成績相關，但這是關聯而非因果，不能當成硬門檻。[Hansons Marathon Method preview](hansons-official/06-hansons-marathon-method-2e-preview.pdf)、[Fokkema et al., 2020](https://pubmed.ncbi.nlm.nih.gov/32421886/)

## Hansons 應該用 current VDOT 還是目標完賽成績

不建議全部只用其中一個：

- Classic Tempo 明確寫 goal MP／HMP；Strength 則是 goal MP／HMP 每英里快約 10 秒。
- Speed 課寫 5K–10K pace，應反映目前短距離能力，不應從一個尚未具備的馬拉松目標反推。
- E／Long 的目的包含恢復與累積跑量，應以目前能力、當天 effort 與環境為準。
- Luke Humphrey 對大幅進步目標的實務建議，是早期從 current marathon pace 開始，逐步走向 goal marathon pace；每週直接撐 goal pace 並不是首選。[Marathon Tempos: 2019 Update](https://lukehumphreyrunning.com/marathon-tempos-2019-update/)

目前已保留 current VDOT 並新增 goal finish time：E、T、I、R、Speed 由 current VDOT／目前能力決定；Tempo 與 Strength 讀 goal MP／HMP。若 goal pace 比目前等效 MP／HMP 快超過每英里 10 秒，前期從 current pace 分段漸進，網站顯示目標落差警告。

## Hansons 官方表對照摘要

- Beginner Marathon 為 18 週；week 6 開始 Tuesday Speed、Thursday goal MP Tempo、Sunday Long Run，後段由 Speed 轉 Strength。
- Advanced Marathon 更早進入 Speed／Tempo；Tuesday、Thursday、Sunday 的 SOS 骨架一致。
- Beginner Half Marathon 在 week 5 先進 Tempo、week 6 加 Speed；Advanced Half Marathon 更早開始雙 SOS。
- 官方表 key 把 MP／HMP 定義成自己的 goal pace；網站現在已將 goal finish time 和 current VDOT 分開。
- 網站標準量版本保留上述骨架；低於約 75% 的版本明確標成基礎／完賽路線，不再冒充官方 Classic 的縮小版。

## 重現方式

```powershell
npm test
node scripts/audit-training-plans.mjs
node scripts/audit-training-plans.mjs --json
```

檢核程式在 [`scripts/audit-training-plans.mjs`](../../scripts/audit-training-plans.mjs)。它只讀取排課引擎並輸出結果，沒有改動網站資料或課表。
