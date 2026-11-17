import type { Chapter, Lesson } from '../types/python';

export const CURRICULUM: Chapter[] = [
  {
    id: 'ch1',
    number: '01',
    title: 'Python 起步與變數',
    subtitle: '認識第一行輸出指令、資料型態與 f-string 排版',
    lessons: [
      {
        id: 'l01',
        chapterId: 'ch1',
        number: '01',
        title: '第一支程式與 print()',
        durationMinutes: 4,
        difficulty: '入門',
        summary: '學會使用 print() 將文字與運算結果顯示在終端機上，並了解註解的寫法。',
        concepts: [
          {
            title: '用 print() 輸出訊息',
            summary: 'print() 是 Python 最基礎的輸出函式。文字必須用單引號或雙引號包起來，括號內也可以放入數字或算式。',
            codeExample: 'print("Hello, Python!")\nprint(2026)\nprint(15 + 27)',
            tip: '引號必須成對出現，中文與英文的引號不可混用（只能用半形 " " 或 \' \'）。',
          },
          {
            title: '單行註解 #',
            summary: '以 # 開頭的內容會被 Python 忽略，常用來替程式碼加上說明或暫時停用某一行。',
            codeExample: '# 這是一行說明，不會被執行\nprint("開始學習")',
          },
        ],
        taskTitle: '印出自我介紹與年度目標',
        taskDescription: '請撰寫兩行 print() 指令，依序印出你的學習宣言與今年的目標數字。',
        requirements: [
          '第一行輸出包含 "Python" 的問候文字',
          '第二行輸出數字 100（代表 100 分目標）',
        ],
        starterCode: '# 請在下方完成兩行 print() 輸出\nprint("Hello, Python!")\n',
        solutionCode: 'print("Hello, Python!")\nprint(100)',
        hint: '在第二行加上 print(100)，數字不需要加引號。',
        verificationCode: `
check("至少輸出兩行內容", len(output_lines) >= 2, f"目前只有 {len(output_lines)} 行輸出")
check("第一行包含 Python", len(output_lines) >= 1 and "Python" in output_lines[0], "請確認第一行文字包含 Python")
check("第二行輸出數字 100", len(output_lines) >= 2 and output_lines[1] == "100", "請確認第二行印出 100")
`,
      },
      {
        id: 'l02',
        chapterId: 'ch1',
        number: '02',
        title: '變數與基本資料型態',
        durationMinutes: 5,
        difficulty: '入門',
        summary: '使用變數名稱儲存資料，並分辨整數 int、浮點數 float、字串 str 與布林值 bool。',
        concepts: [
          {
            title: '賦值運算子 =',
            summary: '在 Python 中，= 代表「把右邊的值放進左邊的變數」，不需要事先宣告型態。',
            codeExample: 'name = "小美"\nage = 20\nheight = 162.5\nis_student = True',
            tip: '變數名稱建議使用小寫英文與底線（snake_case），且不可用數字開頭。',
          },
          {
            title: '四大基本型態與 type()',
            summary: '使用 type(變數) 可以檢查目前資料屬於哪一種型態。',
            codeExample: 'print(type(20))       # int\nprint(type(162.5))    # float\nprint(type("小美"))   # str\nprint(type(True))     # bool',
          },
        ],
        taskTitle: '建立課程檔案資料',
        taskDescription: '建立四個指定變數來描述一門課程，並印出課程名稱。',
        requirements: [
          '定義字串變數 course_name = "Python 基礎"',
          '定義整數變數 hours = 12',
          '定義浮點數變數 rating = 4.9',
          '定義布林變數 is_open = True，並印出 course_name',
        ],
        starterCode: '# 建立四個變數並印出 course_name\ncourse_name = "Python 基礎"\nhours = \nrating = \nis_open = \nprint(course_name)',
        solutionCode: 'course_name = "Python 基礎"\nhours = 12\nrating = 4.9\nis_open = True\nprint(course_name)',
        hint: '布林值 True 與 False 的首字母必須大寫。',
        verificationCode: `
check("course_name 為字串 'Python 基礎'", ns.get("course_name") == "Python 基礎", "請將 course_name 設為 'Python 基礎'")
check("hours 為整數 12", isinstance(ns.get("hours"), int) and ns.get("hours") == 12, "hours 應為整數 12")
check("rating 為浮點數 4.9", isinstance(ns.get("rating"), float) and abs(ns.get("rating") - 4.9) < 1e-6, "rating 應為 4.9")
check("is_open 為布林 True", ns.get("is_open") is True, "is_open 應為 True")
check("有印出課程名稱", "Python 基礎" in output, "請使用 print(course_name) 輸出")
`,
      },
      {
        id: 'l03',
        chapterId: 'ch1',
        number: '03',
        title: 'f-string 格式化字串',
        durationMinutes: 5,
        difficulty: '入門',
        summary: '使用 f"..." 語法把變數和算式直接嵌入字串中，還可以控制小數點位數。',
        concepts: [
          {
            title: '在字串前面加上 f',
            summary: '只要在引號前寫上 f，就可以在字串裡用大括號 {變數} 放入任何變數或算式，完全不用手動轉型。',
            codeExample: 'item = "咖啡"\nprice = 65\nprint(f"{item}每杯 {price} 元")',
          },
          {
            title: '控制小數位數 :.2f',
            summary: '在大括號內的變數後面加上 :.2f，就能將浮點數四捨五入顯示為兩位小數。',
            codeExample: 'pi = 3.14159\nprint(f"圓周率約為 {pi:.2f}")  # 3.14',
          },
        ],
        taskTitle: '輸出咖啡廳收據明細',
        taskDescription: '利用 f-string 組合商品名稱、數量與總價，印出格式清晰的結帳文字。',
        requirements: [
          '保留變數 drink = "拿鐵"、price = 85、qty = 3',
          '計算 total = price * qty',
          '印出格式完全相符的文字：購買 3 杯拿鐵，總金額 255 元',
        ],
        starterCode: 'drink = "拿鐵"\nprice = 85\nqty = 3\ntotal = price * qty\n\n# 使用 f-string 印出：購買 3 杯拿鐵，總金額 255 元\nprint()',
        solutionCode: 'drink = "拿鐵"\nprice = 85\nqty = 3\ntotal = price * qty\nprint(f"購買 {qty} 杯{drink}，總金額 {total} 元")',
        hint: '在 print() 內寫 f"購買 {qty} 杯{drink}，總金額 {total} 元"',
        verificationCode: `
check("total 計算正確為 255", ns.get("total") == 255, "total 應為 price * qty")
check("輸出正確的結帳字串", "購買 3 杯拿鐵，總金額 255 元" in output, "請確認空格與全形逗號：購買 3 杯拿鐵，總金額 255 元")
`,
      },
    ],
  },
  {
    id: 'ch2',
    number: '02',
    title: '運算與使用者輸入',
    subtitle: '掌握算術、餘數、次方運算，並接收使用者輸入',
    lessons: [
      {
        id: 'l04',
        chapterId: 'ch2',
        number: '04',
        title: '數值與比較運算子',
        durationMinutes: 5,
        difficulty: '入門',
        summary: '分辨一般除法 /、整數除法 //、取餘數 % 與次方 **，以及比較結果的布林值。',
        concepts: [
          {
            title: '七種常見算術運算',
            summary: '除了加減乘除，Python 提供 // 取商數、% 取餘數，以及 ** 計算次方。',
            codeExample: 'print(10 / 3)   # 3.3333...\nprint(10 // 3)  # 3 (整數商)\nprint(10 % 3)   # 1 (餘數)\nprint(2 ** 5)   # 32 (2的5次方)',
          },
          {
            title: '比較運算子',
            summary: '== 代表判斷是否相等（注意是兩個等號），!= 代表不相等，結果必為 True 或 False。',
            codeExample: 'x = 12\nprint(x % 2 == 0)  # True (是否為偶數)',
          },
        ],
        taskTitle: '時間秒數換算器',
        taskDescription: '將總共 385 秒換算成「幾分幾秒」，並儲存到指定變數中印出。',
        requirements: [
          '已知 total_seconds = 385',
          '使用 // 算出 minutes（應為 6）',
          '使用 % 算出 seconds（應為 25）',
          '印出「6 分 25 秒」',
        ],
        starterCode: 'total_seconds = 385\n\nminutes = \nseconds = \nprint(f"{minutes} 分 {seconds} 秒")',
        solutionCode: 'total_seconds = 385\nminutes = total_seconds // 60\nseconds = total_seconds % 60\nprint(f"{minutes} 分 {seconds} 秒")',
        hint: '1 分鐘等於 60 秒，所以 minutes = total_seconds // 60，seconds = total_seconds % 60。',
        verificationCode: `
check("minutes 為 6", ns.get("minutes") == 6, "請使用 total_seconds // 60")
check("seconds 為 25", ns.get("seconds") == 25, "請使用 total_seconds % 60")
check("輸出 6 分 25 秒", "6 分 25 秒" in output, "請確認輸出為 6 分 25 秒")
`,
      },
      {
        id: 'l05',
        chapterId: 'ch2',
        number: '05',
        title: '接收輸入 input() 與轉型',
        durationMinutes: 6,
        difficulty: '入門',
        summary: '透過 input() 讀取文字輸入，並用 int() 或 float() 轉換成可計算的數字。',
        concepts: [
          {
            title: 'input() 回傳的永遠是字串',
            summary: '即使使用者輸入的是 25，input() 回傳的仍是字串 "25"。要進行數學計算前，必須先轉型。',
            codeExample: 'age_text = input()\nage = int(age_text)\nprint(f"明年你就 {age + 1} 歲了")',
            tip: '在本平台練習含 input() 的程式時，請在右側「輸入區 (stdin)」預先填入每行測試輸入。',
          },
        ],
        taskTitle: '矩形面積計算機',
        taskDescription: '從輸入區依序讀取矩形的「寬」與「高」（已預設為 8 與 5），轉為整數後計算並印出面積。',
        requirements: [
          '使用兩次 input() 讀取寬與高並轉成 int',
          '計算 area = width * height',
          '印出計算結果：面積為 40',
        ],
        defaultStdin: '8\n5',
        starterCode: '# 右側「輸入區 (stdin)」已預設兩行輸入：8 與 5\nwidth = int(input())\nheight = \narea = \nprint(f"面積為 {area}")',
        solutionCode: 'width = int(input())\nheight = int(input())\narea = width * height\nprint(f"面積為 {area}")',
        hint: '第二行使用 height = int(input())，接著計算 area = width * height。',
        verificationCode: `
check("width 為整數 8", ns.get("width") == 8, "請確保第一筆輸入轉為整數")
check("height 為整數 5", ns.get("height") == 5, "請使用 int(input()) 讀取第二筆輸入")
check("area 為 40", ns.get("area") == 40, "area 應為 width * height")
check("輸出包含 面積為 40", "面積為 40" in output, "請確認輸出文字為：面積為 40")
`,
      },
    ],
  },
  {
    id: 'ch3',
    number: '03',
    title: '流程控制與條件判斷',
    subtitle: '讓程式依據不同條件做出決策與分支執行',
    lessons: [
      {
        id: 'l06',
        chapterId: 'ch3',
        number: '06',
        title: 'if / elif / else 條件分支',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '學習 if、elif、else 的縮排結構，以及邏輯運算子 and、or、not 的組合。',
        concepts: [
          {
            title: '冒號與 4 格縮排',
            summary: '條件結尾一定要加冒號 :，條件成立後要執行的程式必須向右縮排 4 個空白。',
            codeExample: 'temp = 28\nif temp >= 30:\n    print("炎熱")\nelif temp >= 20:\n    print("舒適")\nelse:\n    print("偏涼")',
          },
          {
            title: '組合條件 and / or',
            summary: 'and 需要左右兩側條件同時成立；or 只要其中一側成立即可。',
            codeExample: 'age = 22\nhas_ticket = True\nif age >= 18 and has_ticket:\n    print("准許入場")',
          },
        ],
        taskTitle: '遊樂園門票分級判斷',
        taskDescription: '根據 age 變數決定票價變數 ticket_price：未滿 6 歲免費 (0)、6 到 17 歲半票 (150)、其餘全票 (300)。',
        requirements: [
          '保留 age = 14',
          '使用 if / elif / else 設定 ticket_price',
          '印出 ticket_price 的數值（150）',
        ],
        starterCode: 'age = 14\nticket_price = 0\n\n# 完成條件判斷\nif age < 6:\n    ticket_price = 0\n\n\nprint(ticket_price)',
        solutionCode: 'age = 14\nif age < 6:\n    ticket_price = 0\nelif age < 18:\n    ticket_price = 150\nelse:\n    ticket_price = 300\nprint(ticket_price)',
        hint: '在 if age < 6: 之後加上 elif age <= 17:（或 elif age < 18:），最後用 else: 設定 300。',
        verificationCode: `
check("ticket_price 在 age=14 時為 150", ns.get("ticket_price") == 150, "age=14 時應為半票 150")
check("輸出 150", "150" in output, "請使用 print(ticket_price) 輸出結果")
`,
      },
      {
        id: 'l07',
        chapterId: 'ch3',
        number: '07',
        title: '實戰練習：成績等第判斷函式',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '透過設計可重複測試的條件結構，體會條件順序對程式邏輯的影響。',
        concepts: [
          {
            title: '條件判斷由嚴格到寬鬆',
            summary: '撰寫級距判斷時，應從最高門檻開始檢查，因為 Python 只要命中第一個成立的 if/elif 就會跳出整個區塊。',
            codeExample: 'score = 85\nif score >= 90:\n    grade = "A"\nelif score >= 80:\n    grade = "B"\nelse:\n    grade = "C"',
            tip: '試著點擊編輯器上方的「單步追蹤」，觀察程式如何跳過不成立的分支！',
          },
        ],
        taskTitle: '判斷奇偶與正負數狀態',
        taskDescription: '給定整數 num = -7，判斷它是「正偶數」、「正奇數」、「負數」或「零」，並存入變數 label 後印出。',
        requirements: [
          '保留 num = -7',
          '若 num == 0，label 為 "零"',
          '若 num < 0，label 為 "負數"',
          '若 num > 0 且為偶數，label 為 "正偶數"；否則為 "正奇數"',
        ],
        starterCode: 'num = -7\nlabel = ""\n\nif num == 0:\n    label = "零"\n# 請補齊其餘條件\n\nprint(label)',
        solutionCode: 'num = -7\nif num == 0:\n    label = "零"\nelif num < 0:\n    label = "負數"\nelif num % 2 == 0:\n    label = "正偶數"\nelse:\n    label = "正奇數"\nprint(label)',
        hint: '先判斷 num == 0 和 num < 0，剩下的就一定是正數，再用 num % 2 == 0 分辨奇偶。',
        verificationCode: `
check("label 結果為 負數", ns.get("label") == "負數", "當 num = -7 時，label 應為 '負數'")
check("有印出結果", "負數" in output, "請印出 label")
`,
      },
    ],
  },
  {
    id: 'ch4',
    number: '04',
    title: '迴圈與重複結構',
    subtitle: '自動化重複運算，並用單步追蹤觀察迴圈變數變化',
    lessons: [
      {
        id: 'l08',
        chapterId: 'ch4',
        number: '08',
        title: 'for 迴圈與 range()',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '使用 for 搭配 range() 執行指定次數的迴圈，完成數值加總與序列生成。',
        concepts: [
          {
            title: '認識 range(起始, 結束, 步長)',
            summary: 'range(1, 6) 會依序產生 1, 2, 3, 4, 5（包含起點、不包含終點）。若只寫 range(5)，則從 0 到 4。',
            codeExample: 'for i in range(1, 4):\n    print(f"第 {i} 次執行")',
          },
          {
            title: '累加器模式',
            summary: '在迴圈外部先設 total = 0，每次迴圈執行 total += i，就能把數列全部加起來。',
            codeExample: 'total = 0\nfor n in range(1, 6):\n    total += n\nprint(total)  # 15',
          },
        ],
        taskTitle: '計算 1 到 10 的偶數總和',
        taskDescription: '利用 for 迴圈與 range()，計算 1 到 10（含 10）之間所有偶數（2, 4, 6, 8, 10）的總和。',
        requirements: [
          '定義變數 even_sum 並累積偶數總和',
          '使用 for 迴圈完成計算（不可直接寫死 30）',
          '印出 even_sum（應為 30）',
        ],
        starterCode: 'even_sum = 0\nfor n in range(2, 11, 2):\n    # 請累加到 even_sum\n    pass\n\nprint(even_sum)',
        solutionCode: 'even_sum = 0\nfor n in range(2, 11, 2):\n    even_sum += n\nprint(even_sum)',
        hint: '把 pass 換成 even_sum += n，即可觀察單步追蹤中 even_sum 每次增加的過程。',
        verificationCode: `
check("even_sum 總和為 30", ns.get("even_sum") == 30, "2+4+6+8+10 應等於 30")
check("輸出包含 30", "30" in output, "請使用 print(even_sum) 輸出")
`,
      },
      {
        id: 'l09',
        chapterId: 'ch4',
        number: '09',
        title: 'while 迴圈與 break / continue',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '當不知道確切執行次數時，使用 while 條件迴圈，並用 break 提前結束。',
        concepts: [
          {
            title: 'while 條件成立就繼續',
            summary: 'while 會在條件為 True 時不斷重複，務必在迴圈內更新條件變數，避免形成無窮迴圈。',
            codeExample: 'count = 3\nwhile count > 0:\n    print(count)\n    count -= 1\nprint("發射！")',
          },
          {
            title: 'break 與 continue',
            summary: 'break 會立刻終止整個迴圈；continue 則是跳過這一次剩下的程式碼，直接進入下一輪。',
            codeExample: 'for i in range(1, 10):\n    if i == 5:\n        break\n    print(i)',
          },
        ],
        taskTitle: '尋找第一個大於 50 的平方數',
        taskDescription: '使用 while 迴圈從 n = 1 開始檢查，找到第一個滿足 n * n > 50 的整數 n 並停止。',
        requirements: [
          '從 n = 1 開始遞增',
          '當 n * n > 50 時停止迴圈（此時 n 應為 8）',
          '印出找到的 n',
        ],
        starterCode: 'n = 1\nwhile n * n <= 50:\n    # 更新 n\n    pass\n\nprint(n)',
        solutionCode: 'n = 1\nwhile n * n <= 50:\n    n += 1\nprint(n)',
        hint: '在 while 迴圈內寫 n += 1，當 n 到 8 時 8*8=64 > 50 就會跳出迴圈。',
        verificationCode: `
check("找到的 n 為 8", ns.get("n") == 8, "7*7=49 仍 <= 50，第一個大於 50 的平方數對應 n=8")
check("輸出 8", "8" in output, "請印出 n")
`,
      },
      {
        id: 'l10',
        chapterId: 'ch4',
        number: '10',
        title: '巢狀迴圈視覺化：乘法表',
        durationMinutes: 7,
        difficulty: '基礎',
        summary: '理解外層迴圈走一步、內層迴圈走完一整輪的運作順序，最適合用單步追蹤觀察。',
        concepts: [
          {
            title: '外層與內層迴圈',
            summary: '巢狀迴圈常常用來處理二維表格或座標。建議執行後點選「單步追蹤」，觀看 i 與 j 的變化節奏。',
            codeExample: 'for i in range(1, 3):\n    for j in range(1, 4):\n        print(f"{i}x{j}={i*j}")',
          },
        ],
        taskTitle: '產生 3x3 乘法配對串列',
        taskDescription: '使用雙層 for 迴圈，把 1~3 與 1~3 相乘的結果依序加入 results 串列（共 9 個數字）。',
        requirements: [
          '建立空串列 results = []',
          '外層 i 跑 range(1, 4)，內層 j 跑 range(1, 4)',
          '使用 results.append(i * j) 加入元素',
          '印出 results',
        ],
        starterCode: 'results = []\nfor i in range(1, 4):\n    for j in range(1, 4):\n        # 將 i * j 加入 results\n        pass\n\nprint(results)',
        solutionCode: 'results = []\nfor i in range(1, 4):\n    for j in range(1, 4):\n        results.append(i * j)\nprint(results)',
        hint: '將 pass 替換成 results.append(i * j)。',
        verificationCode: `
check("results 長度為 9", isinstance(ns.get("results"), list) and len(ns.get("results")) == 9, "results 應包含 9 個乘積")
check("results 內容正確", ns.get("results") == [1, 2, 3, 2, 4, 6, 3, 6, 9], "預期結果為 [1, 2, 3, 2, 4, 6, 3, 6, 9]")
`,
      },
    ],
  },
  {
    id: 'ch5',
    number: '05',
    title: '資料結構：串列、字典與集合',
    subtitle: '掌握 Python 最強大的容器型態，組織與過濾大量資料',
    lessons: [
      {
        id: 'l11',
        chapterId: 'ch5',
        number: '11',
        title: 'List 串列與索引切片',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '建立有序的資料集合，使用正負索引、切片 [start:end] 與 append() 修改內容。',
        concepts: [
          {
            title: '索引從 0 開始，負索引從尾端數起',
            summary: 'fruits[0] 是第一個元素，fruits[-1] 是最後一個元素。fruits[1:3] 則會取出索引 1 和 2 的子串列。',
            codeExample: 'fruits = ["蘋果", "香蕉", "芒果", "葡萄"]\nprint(fruits[0])    # 蘋果\nprint(fruits[-1])   # 葡萄\nprint(fruits[1:3])  # ["香蕉", "芒果"]',
          },
          {
            title: '新增與長度計算',
            summary: 'append() 可在尾端加入新元素，len() 可取得元素總數。',
            codeExample: 'fruits.append("奇異果")\nprint(len(fruits))  # 5',
          },
        ],
        taskTitle: '整理週一到週五的待辦清單',
        taskDescription: '建立一個任務串列，追加一項新任務，並切出前三項高優先任務。',
        requirements: [
          '已知 tasks = ["寫程式", "買牛奶", "運動"]',
          '使用 append() 新增 "閱讀"',
          '使用切片取得前兩項任務，存入 top_two',
          '印出 tasks 與 top_two',
        ],
        starterCode: 'tasks = ["寫程式", "買牛奶", "運動"]\n\n# 1. 使用 append 加入 "閱讀"\n\n# 2. 用切片取得前兩項存入 top_two\ntop_two = \n\nprint(tasks)\nprint(top_two)',
        solutionCode: 'tasks = ["寫程式", "買牛奶", "運動"]\ntasks.append("閱讀")\ntop_two = tasks[:2]\nprint(tasks)\nprint(top_two)',
        hint: '切片 tasks[0:2] 或簡寫 tasks[:2] 可取出前兩項。',
        verificationCode: `
check("tasks 包含 4 項且最後一項為 閱讀", ns.get("tasks") == ["寫程式", "買牛奶", "運動", "閱讀"], "請使用 tasks.append('閱讀')")
check("top_two 為前兩項", ns.get("top_two") == ["寫程式", "買牛奶"], "top_two 應為 ['寫程式', '買牛奶']")
`,
      },
      {
        id: 'l12',
        chapterId: 'ch5',
        number: '12',
        title: 'List 推導式 (Comprehension)',
        durationMinutes: 6,
        difficulty: '進階',
        summary: '用一行簡潔可讀的 Pythonic 語法，從現有串列轉換並篩選出新串列。',
        concepts: [
          {
            title: '[運算式 for 變數 in 序列 if 條件]',
            summary: 'List Comprehension 可以把原本需要 4 行的空串列 + for + if + append 濃縮成清晰的一行。',
            codeExample: 'nums = [1, 2, 3, 4, 5]\nsquares = [x * x for x in nums]\nevens = [x for x in nums if x % 2 == 0]',
          },
        ],
        taskTitle: '篩選及格分數並加分',
        taskDescription: '從原始分數 scores 中，用 List 推導式挑出 >= 60 分的成績，並幫每個及格分數加 5 分存入 bonus_scores。',
        requirements: [
          '保留 scores = [45, 72, 88, 55, 90]',
          '使用推導式建立 bonus_scores',
          '結果應為 [77, 93, 95]',
        ],
        starterCode: 'scores = [45, 72, 88, 55, 90]\n\n# 篩選 >= 60 分並加 5 分\nbonus_scores = []\n\nprint(bonus_scores)',
        solutionCode: 'scores = [45, 72, 88, 55, 90]\nbonus_scores = [s + 5 for s in scores if s >= 60]\nprint(bonus_scores)',
        hint: '寫法結構：[s + 5 for s in scores if s >= 60]。',
        verificationCode: `
check("bonus_scores 結果為 [77, 93, 95]", ns.get("bonus_scores") == [77, 93, 95], "應挑出 72, 88, 90 並各加 5 分")
check("輸出結果", "[77, 93, 95]" in output, "請印出 bonus_scores")
`,
      },
      {
        id: 'l13',
        chapterId: 'ch5',
        number: '13',
        title: 'Dict 字典鍵值對',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '使用大括號 {key: value} 建立字典，實現快速查找與更新結構化資料。',
        concepts: [
          {
            title: '建立、讀取與更新字典',
            summary: '字典透過唯一的鍵 (key) 來對應值 (value)。使用 .get(key, 預設值) 可以避免找不到鍵時發生 KeyError。',
            codeExample: 'user = {"name": "阿哲", "level": 3}\nuser["level"] = 4\nuser["city"] = "台北"\nprint(user.get("role", "一般會員"))',
          },
          {
            title: '用 items() 走訪字典',
            summary: '搭配 for k, v in dict.items(): 可以同時取出每個鍵與值。',
            codeExample: 'for k, v in user.items():\n    print(f"{k}: {v}")',
          },
        ],
        taskTitle: '統計倉庫商品庫存',
        taskDescription: '更新商品字典 stock：將 "apple" 數量增加 5、新增 "orange": 12，並計算所有水果總數 total_stock。',
        requirements: [
          '保留初始 stock = {"apple": 10, "banana": 6}',
          '更新后 stock["apple"] 應為 15，且包含 "orange": 12',
          '計算總庫存 total_stock = sum(stock.values()) 並印出',
        ],
        starterCode: 'stock = {"apple": 10, "banana": 6}\n\n# 1. 將 apple 增加 5\n\n# 2. 新增 orange 為 12\n\ntotal_stock = 0\nprint(total_stock)',
        solutionCode: 'stock = {"apple": 10, "banana": 6}\nstock["apple"] += 5\nstock["orange"] = 12\ntotal_stock = sum(stock.values())\nprint(total_stock)',
        hint: '可用 stock["apple"] += 5 與 stock["orange"] = 12，再用 sum(stock.values()) 加總。',
        verificationCode: `
check("apple 更新為 15", isinstance(ns.get("stock"), dict) and ns["stock"].get("apple") == 15, "apple 應為 15")
check("新增 orange 為 12", isinstance(ns.get("stock"), dict) and ns["stock"].get("orange") == 12, "應新增 orange: 12")
check("total_stock 為 33", ns.get("total_stock") == 33, "15 + 6 + 12 應等於 33")
`,
      },
      {
        id: 'l14',
        chapterId: 'ch5',
        number: '14',
        title: 'Tuple 元組與 Set 集合',
        durationMinutes: 5,
        difficulty: '基礎',
        summary: '認識不可變的 Tuple（常用於座標與回傳多值）以及自動去除重複元素的 Set 集合。',
        concepts: [
          {
            title: 'Tuple（不可修改的序列）',
            summary: '使用小括號 () 建立。適合存放不希望被意外改動的固定資料，且支援快速解構賦值。',
            codeExample: 'point = (25.03, 121.56)\nlat, lng = point\nprint(lat, lng)',
          },
          {
            title: 'Set（不重複元素集合）',
            summary: '使用 set(串列) 可一秒去除重複項目，還支援交集 & 與聯集 | 運算。',
            codeExample: 'tags = ["py", "web", "py", "data"]\nunique = set(tags)\nprint(len(unique))  # 3',
          },
        ],
        taskTitle: '去除重複名單並找出共同興趣',
        taskDescription: '找出兩位同學各自興趣的交集（共同興趣），並計算共有幾項。',
        requirements: [
          '已知 a_likes = {"Python", "音樂", "登山"}、b_likes = {"攝影", "Python", "登山"}',
          '使用集合交集 & 計算 common',
          '印出 common 的元素數量（應為 2）',
        ],
        starterCode: 'a_likes = {"Python", "音樂", "登山"}\nb_likes = {"攝影", "Python", "登山"}\n\ncommon = \nprint(len(common))',
        solutionCode: 'a_likes = {"Python", "音樂", "登山"}\nb_likes = {"攝影", "Python", "登山"}\ncommon = a_likes & b_likes\nprint(len(common))',
        hint: '集合的交集運算符號為 &，即 common = a_likes & b_likes。',
        verificationCode: `
check("common 為集合 {'Python', '登山'}", ns.get("common") == {"Python", "登山"}, "交集應為 {'Python', '登山'}")
check("印出交集數量 2", "2" in output, "請印出 len(common)")
`,
      },
    ],
  },
  {
    id: 'ch6',
    number: '06',
    title: '函式與模組思維',
    subtitle: '把重複邏輯封裝成函式，並善用 Python 標準函式庫',
    lessons: [
      {
        id: 'l15',
        chapterId: 'ch6',
        number: '15',
        title: 'def 定義函式與 return',
        durationMinutes: 7,
        difficulty: '基礎',
        summary: '學習用 def 建立函式、設定參數預設值，並了解 return 回傳值與 print 的差異。',
        concepts: [
          {
            title: '定義與呼叫函式',
            summary: 'return 會把運算結果交回給呼叫端，讓後續程式繼續使用；沒有寫 return 的函式預設回傳 None。',
            codeExample: 'def calc_discount(price, rate=0.9):\n    return round(price * rate)\n\nfinal = calc_discount(500)\nprint(final)  # 450',
          },
        ],
        taskTitle: '打造攝氏轉華氏溫度函式',
        taskDescription: '定義一個名為 c_to_f(celsius) 的函式，回傳對應的華氏溫度（公式：celsius * 9 / 5 + 32）。',
        requirements: [
          '定義函式 c_to_f(celsius)',
          '使用 return 回傳轉換後的數值',
          '呼叫 c_to_f(25) 並印出結果（77.0）',
        ],
        starterCode: 'def c_to_f(celsius):\n    # 請計算並 return 華氏溫度\n    pass\n\nprint(c_to_f(25))',
        solutionCode: 'def c_to_f(celsius):\n    return celsius * 9 / 5 + 32\n\nprint(c_to_f(25))',
        hint: '函式內部寫 return celsius * 9 / 5 + 32。',
        verificationCode: `
fn = ns.get("c_to_f")
check("已定義函式 c_to_f", callable(fn), "請確認函式名稱為 c_to_f")
if callable(fn):
    check("c_to_f(0) == 32", abs(fn(0) - 32) < 1e-6, "0 度應回傳 32")
    check("c_to_f(25) == 77", abs(fn(25) - 77) < 1e-6, "25 度應回傳 77")
    check("c_to_f(100) == 212", abs(fn(100) - 212) < 1e-6, "100 度應回傳 212")
`,
      },
      {
        id: 'l16',
        chapterId: 'ch6',
        number: '16',
        title: '區域變數與預設參數',
        durationMinutes: 6,
        difficulty: '進階',
        summary: '釐清函式內部的區域作用域 (Local Scope)，並練習靈活使用預設參數與關鍵字參數。',
        concepts: [
          {
            title: '函式內外的變數各自獨立',
            summary: '在函式內部建立的變數屬於「區域變數」，只在該函式執行期間存在，不會覆蓋外部同名的全域變數。',
            codeExample: 'tax = 0.05\ndef add_tax(amount, rate=0.05):\n    total = amount * (1 + rate)\n    return total',
            tip: '用「單步追蹤」執行函式呼叫時，可以看到右側視野區清楚區分「主程式」與「函式內部」的變數！',
          },
        ],
        taskTitle: '彈性問候語產生器',
        taskDescription: '設計 greet(name, title="同學") 函式，回傳 "你好，{name}{title}！" 字串。',
        requirements: [
          '定義 greet(name, title="同學")',
          'greet("小明") 應回傳 "你好，小明同學！"',
          'greet("陳", "老師") 應回傳 "你好，陳老師！"',
        ],
        starterCode: 'def greet(name, title="同學"):\n    # 回傳組合後的問候字串\n    pass\n\nprint(greet("小明"))\nprint(greet("陳", "老師"))',
        solutionCode: 'def greet(name, title="同學"):\n    return f"你好，{name}{title}！"\n\nprint(greet("小明"))\nprint(greet("陳", "老師"))',
        hint: '在函式內回傳 f"你好，{name}{title}！"。',
        verificationCode: `
fn = ns.get("greet")
check("已定義 greet 函式", callable(fn), "請確認函式名稱為 greet")
if callable(fn):
    check("預設參數測試通過", fn("小明") == "你好，小明同學！", "greet('小明') 應回傳 '你好，小明同學！'")
    check("自訂 title 測試通過", fn("陳", "老師") == "你好，陳老師！", "greet('陳', '老師') 應回傳 '你好，陳老師！'")
`,
      },
      {
        id: 'l17',
        chapterId: 'ch6',
        number: '17',
        title: '標準函式庫 math 與 random',
        durationMinutes: 5,
        difficulty: '基礎',
        summary: '使用 import 匯入 Python 內建模組，快速取得數學常數、開根號與隨機抽樣功能。',
        concepts: [
          {
            title: 'import 模組名稱',
            summary: 'Python 內建豐富的標準庫，使用前只需在檔案頂端 import 即可。',
            codeExample: 'import math\nimport random\n\nprint(math.sqrt(81))        # 9.0\nprint(math.ceil(4.2))       # 5\nprint(random.choice(["A", "B", "C"]))',
          },
        ],
        taskTitle: '計算兩點間的直線距離',
        taskDescription: '匯入 math 模組，計算座標 (0, 0) 到 (3, 4) 的歐幾里得距離，並存入變數 distance。',
        requirements: [
          '匯入 math 模組',
          '使用 math.sqrt() 或 math.hypot() 計算 (3, 4) 到原點的距離',
          'distance 應為 5.0 並印出',
        ],
        starterCode: 'import math\n\nx, y = 3, 4\ndistance = \nprint(distance)',
        solutionCode: 'import math\n\nx, y = 3, 4\ndistance = math.sqrt(x ** 2 + y ** 2)\nprint(distance)',
        hint: '利用畢氏定理：math.sqrt(x ** 2 + y ** 2)。',
        verificationCode: `
check("distance 為 5.0", isinstance(ns.get("distance"), (int, float)) and abs(ns.get("distance") - 5.0) < 1e-6, "distance 應為 5.0")
check("印出結果", "5" in output, "請印出 distance")
`,
      },
    ],
  },
  {
    id: 'ch7',
    number: '07',
    title: '字串處理與錯誤防呆',
    subtitle: '清洗文字資料，並用 try/except 保護程式穩定運行',
    lessons: [
      {
        id: 'l18',
        chapterId: 'ch7',
        number: '18',
        title: '字串常用方法',
        durationMinutes: 6,
        difficulty: '基礎',
        summary: '熟練 strip() 去空白、split() 拆解字串與 join() 重新組裝文字資料。',
        concepts: [
          {
            title: '資料清洗三寶：strip、split、join',
            summary: '處理外部輸入或 CSV 文字時，常需要先去掉前後空白，再依分隔符號切成串列。',
            codeExample: 'raw = "  apple, banana, cherry  "\nclean = raw.strip()\nitems = [x.strip() for x in clean.split(",")]\nprint(" / ".join(items))',
          },
        ],
        taskTitle: '整理標籤文字清單',
        taskDescription: '將雜亂字串 raw = "  python, AI , data  " 去除空白並拆分成乾淨的小寫串列 tags。',
        requirements: [
          '保留 raw = "  python, AI , data  "',
          '分割並清除每個項目的前後空白與轉為小寫',
          'tags 應為 ["python", "ai", "data"]',
        ],
        starterCode: 'raw = "  python, AI , data  "\n\n# 提示：先 split(",") 再對每個元素 .strip().lower()\ntags = []\nprint(tags)',
        solutionCode: 'raw = "  python, AI , data  "\ntags = [t.strip().lower() for t in raw.split(",")]\nprint(tags)',
        hint: '可以寫成 [t.strip().lower() for t in raw.split(",")]。',
        verificationCode: `
check("tags 為 ['python', 'ai', 'data']", ns.get("tags") == ["python", "ai", "data"], "請確認每個元素都已 strip() 並轉成小寫 lower()")
`,
      },
      {
        id: 'l19',
        chapterId: 'ch7',
        number: '19',
        title: 'try / except 例外處理',
        durationMinutes: 6,
        difficulty: '進階',
        summary: '預期可能發生的執行錯誤（如型態轉換失敗或除以零），優雅地回傳替代結果而不讓程式中斷。',
        concepts: [
          {
            title: '捕捉特定例外類型',
            summary: '把容易出錯的程式放進 try:，當發生指定錯誤時，執行 except 區塊作為補救措施。',
            codeExample: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return None',
          },
        ],
        taskTitle: '實作安全整數轉換函式',
        taskDescription: '撰寫 parse_int(text, default=0) 函式：嘗試將 text 轉為整數回傳，若發生 ValueError 則回傳 default。',
        requirements: [
          '定義 parse_int(text, default=0)',
          'parse_int("42") 回傳 42',
          'parse_int("abc", -1) 回傳 -1',
        ],
        starterCode: 'def parse_int(text, default=0):\n    try:\n        return int(text)\n    except ValueError:\n        # 請回傳預設值\n        pass\n\nprint(parse_int("42"))\nprint(parse_int("abc", -1))',
        solutionCode: 'def parse_int(text, default=0):\n    try:\n        return int(text)\n    except ValueError:\n        return default\n\nprint(parse_int("42"))\nprint(parse_int("abc", -1))',
        hint: '在 except ValueError: 底下寫 return default。',
        verificationCode: `
fn = ns.get("parse_int")
check("已定義 parse_int", callable(fn), "請確認函式名稱為 parse_int")
if callable(fn):
    check("有效數字字串轉換成功", fn("42") == 42, "parse_int('42') 應回傳 42")
    check("無效字串回傳預設值", fn("abc", -1) == -1, "parse_int('abc', -1) 應回傳 -1")
    check("預設參數生效", fn("xyz") == 0, "parse_int('xyz') 預設應回傳 0")
`,
      },
    ],
  },
  {
    id: 'ch8',
    number: '08',
    title: '綜合專題實作',
    subtitle: '整合資料結構、迴圈、條件與函式，打造完整小系統',
    lessons: [
      {
        id: 'l20',
        chapterId: 'ch8',
        number: '20',
        title: '專題：智慧購物車結帳系統',
        durationMinutes: 8,
        difficulty: '進階',
        summary: '結合字典、串列、迴圈與條件折扣邏輯，實作可重複呼叫的購物車結帳計算函式。',
        concepts: [
          {
            title: '把複雜問題拆解成小步驟',
            summary: '先走訪購物車內的每件商品計算「單價 × 數量」並累加，最後再套用滿額折扣規則。',
            codeExample: 'cart = [{"name": "書", "price": 320, "qty": 2}]\nsubtotal = sum(item["price"] * item["qty"] for item in cart)',
          },
        ],
        taskTitle: '完成 checkout(cart) 結帳函式',
        taskDescription: '計算購物車小計，若總金額滿 500 元（>= 500）享有 9 折優惠（乘以 0.9），最後回傳整數金額（使用 int() 或 round()）。',
        requirements: [
          '定義函式 checkout(cart)，cart 為包含 price 與 qty 鍵的字典串列',
          '當小計 >= 500 時套用 0.9 折扣',
          '回傳最終金額並印出測試結果',
        ],
        starterCode: 'def checkout(cart):\n    subtotal = 0\n    for item in cart:\n        # 累加 item["price"] * item["qty"]\n        pass\n    \n    # 若 subtotal >= 500，打九折\n    \n    return round(subtotal)\n\nsample_cart = [\n    {"name": "機械鍵盤", "price": 450, "qty": 1},\n    {"name": "滑鼠墊", "price": 150, "qty": 1},\n]\nprint(checkout(sample_cart))',
        solutionCode: 'def checkout(cart):\n    subtotal = 0\n    for item in cart:\n        subtotal += item["price"] * item["qty"]\n    if subtotal >= 500:\n        subtotal = subtotal * 0.9\n    return round(subtotal)\n\nsample_cart = [\n    {"name": "機械鍵盤", "price": 450, "qty": 1},\n    {"name": "滑鼠墊", "price": 150, "qty": 1},\n]\nprint(checkout(sample_cart))',
        hint: '小計 450+150 = 600，滿 500 打 9 折後應回傳 540。',
        verificationCode: `
fn = ns.get("checkout")
check("已定義 checkout 函式", callable(fn), "請確認函式名稱為 checkout")
if callable(fn):
    c1 = [{"name": "A", "price": 450, "qty": 1}, {"name": "B", "price": 150, "qty": 1}]
    c2 = [{"name": "C", "price": 120, "qty": 2}]
    check("滿 500 套用 9 折 (600 -> 540)", fn(c1) == 540, "600 元滿額打 9 折應為 540")
    check("未滿 500 原價計算 (240 -> 240)", fn(c2) == 240, "240 元未滿 500 應維持 240")
`,
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = CURRICULUM.flatMap((chapter) => chapter.lessons);
