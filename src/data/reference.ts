import type { CheatSheetItem, PlaygroundTemplate } from '../types/python';

export const PLAYGROUND_TEMPLATES: PlaygroundTemplate[] = [
  {
    id: 'fibonacci',
    title: '費氏數列生成器',
    category: '迴圈與函式',
    description: '觀察迴圈變數交換的動態過程，適合用「單步追蹤」逐步檢查記憶體變化。',
    code: `def fibonacci(n):
    seq = []
    a, b = 0, 1
    for _ in range(n):
        seq.append(a)
        a, b = b, a + b
    return seq

result = fibonacci(8)
print("前 8 項費氏數列：", result)
`,
  },
  {
    id: 'word-freq',
    title: '文字詞頻統計器',
    category: '字典與字串',
    description: '將一段文字清洗拆分，並利用字典累計每個詞彙出現的次數。',
    code: `text = "Python is fun and Python is powerful because Python is readable"
words = text.lower().split()

counts = {}
for word in words:
    counts[word] = counts.get(word, 0) + 1

for word, freq in sorted(counts.items(), key=lambda x: -x[1]):
    print(f"{word:<10} : {'*' * freq} ({freq})")
`,
  },
  {
    id: 'prime-finder',
    title: '質數篩選演算法',
    category: '條件與邏輯',
    description: '找出 2 到 40 之間的所有質數，練習巢狀條件判斷。',
    code: `primes = []
for num in range(2, 41):
    is_prime = True
    for d in range(2, int(num ** 0.5) + 1):
        if num % d == 0:
            is_prime = False
            break
    if is_prime:
        primes.append(num)

print(f"共找到 {len(primes)} 個質數：")
print(primes)
`,
  },
  {
    id: 'bmi-input',
    title: '互動式 BMI 評估',
    category: '標準輸入',
    description: '示範如何從輸入區 (stdin) 讀取身高與體重，進行數值計算與健康分級。',
    stdin: '172\n65',
    code: `height_cm = float(input("請輸入身高(cm)："))
weight_kg = float(input("請輸入體重(kg)："))

bmi = weight_kg / ((height_cm / 100) ** 2)
print(f"您的 BMI 為：{bmi:.2f}")

if bmi < 18.5:
    print("評估：體重過輕")
elif bmi < 24:
    print("評估：健康體位")
else:
    print("評估：體重過重")
`,
  },
  {
    id: 'oop-bank',
    title: '物件導向：銀行帳戶類別',
    category: '進階類別',
    description: '定義 BankAccount 類別，封裝存款與提款方法及餘額檢查。',
    code: `class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount
        print(f"{self.owner} 存入 {amount} 元，餘額 {self.balance} 元")

    def withdraw(self, amount):
        if amount > self.balance:
            print("餘額不足，無法提款")
            return
        self.balance -= amount
        print(f"{self.owner} 提領 {amount} 元，餘額 {self.balance} 元")

acc = BankAccount("林小美", 1000)
acc.deposit(500)
acc.withdraw(300)
acc.withdraw(2000)
`,
  },
];

export const CHEAT_SHEET_ITEMS: CheatSheetItem[] = [
  {
    id: 'cs-print',
    category: '基礎輸出與字串',
    title: 'f-string 格式化輸出',
    description: '將變數與小數格式直接嵌入字串輸出。',
    syntax: 'f"{變數:.2f}"',
    exampleCode: 'name = "Python"\nscore = 95.678\nprint(f"{name} 成績：{score:.1f}")',
  },
  {
    id: 'cs-types',
    category: '基礎輸出與字串',
    title: '資料型態轉換',
    description: '在字串、整數與浮點數之間安全轉換。',
    syntax: 'int(x) / float(x) / str(x)',
    exampleCode: 'age = int("21")\nmsg = "年齡：" + str(age)\nprint(msg)',
  },
  {
    id: 'cs-str-methods',
    category: '基礎輸出與字串',
    title: '字串分割與合併',
    description: '用 split() 拆成串列，再用 join() 重新連接。',
    syntax: 's.split(",") / "-".join(lst)',
    exampleCode: 'items = "A,B,C".split(",")\nprint(" | ".join(items))',
  },
  {
    id: 'cs-if',
    category: '流程與迴圈',
    title: '條件分支 if / elif / else',
    description: '依條件順序檢查並執行對應縮排區塊。',
    syntax: 'if 條件:\n    ...\nelif 條件:\n    ...\nelse:\n    ...',
    exampleCode: 'temp = 26\nif temp >= 30:\n    print("炎熱")\nelif temp >= 20:\n    print("舒適")\nelse:\n    print("偏涼")',
  },
  {
    id: 'cs-for',
    category: '流程與迴圈',
    title: 'for 迴圈與 enumerate',
    description: '同時取得串列元素的索引位置與數值。',
    syntax: 'for idx, val in enumerate(items):',
    exampleCode: 'langs = ["Python", "SQL", "JS"]\nfor i, name in enumerate(langs, start=1):\n    print(f"{i}. {name}")',
  },
  {
    id: 'cs-while',
    category: '流程與迴圈',
    title: 'while 迴圈控制',
    description: '條件成立時重複執行，搭配 break 提前跳出。',
    syntax: 'while 條件:\n    if 中止條件:\n        break',
    exampleCode: 'n = 1\nwhile n <= 5:\n    print(n)\n    n += 1',
  },
  {
    id: 'cs-list',
    category: '資料結構',
    title: 'List 串列操作與切片',
    description: '支援索引取值、尾端新增與範圍切片。',
    syntax: 'lst.append(x) / lst[start:end]',
    exampleCode: 'nums = [10, 20, 30, 40]\nnums.append(50)\nprint(nums[1:4])\nprint(nums[::-1])',
  },
  {
    id: 'cs-comp',
    category: '資料結構',
    title: 'List 推導式',
    description: '單行建立轉換與過濾後的新串列。',
    syntax: '[expr for x in seq if cond]',
    exampleCode: 'evens_sq = [x**2 for x in range(1, 10) if x % 2 == 0]\nprint(evens_sq)',
  },
  {
    id: 'cs-dict',
    category: '資料結構',
    title: 'Dict 字典安全讀取與走訪',
    description: '透過鍵值對存取資料，避免 KeyError。',
    syntax: 'd.get(key, default) / d.items()',
    exampleCode: 'menu = {"紅茶": 30, "奶茶": 45}\nprint(menu.get("綠茶", 35))\nfor k, v in menu.items():\n    print(k, v)',
  },
  {
    id: 'cs-def',
    category: '函式與除錯',
    title: '定義函式與預設參數',
    description: '封裝邏輯並透過 return 回傳結果。',
    syntax: 'def fn(a, b=10):\n    return a + b',
    exampleCode: 'def power(base, exp=2):\n    return base ** exp\n\nprint(power(5))\nprint(power(2, 5))',
  },
  {
    id: 'cs-try',
    category: '函式與除錯',
    title: 'try / except 例外捕捉',
    description: '攔截預期錯誤並提供安全降級方案。',
    syntax: 'try:\n    ...\nexcept ErrorType:\n    ...',
    exampleCode: 'try:\n    val = int("abc")\nexcept ValueError:\n    val = 0\nprint("安全結果：", val)',
  },
];
