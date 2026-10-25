# Design

## Source of truth
- Status: Active — HTML Prototype 17，真实前端交互与本地模拟状态，非生产交易。
- Last refreshed: 2026-10-21
- Primary product surfaces: 微信小程序：首页、商品、购物车、我的。
- Evidence reviewed: GitHub Issue https://github.com/DeepDreamerLSC/CRMEB/issues/1 第一版 M1；本次用户对精品咖啡、简约及设计感的要求。另收到四张水墨界面参考与一张咖啡沙漏 Logo 照片，已归档到 design/coffee-v1/references/；用户明确允许按品牌调性重新提炼 Logo。已新增独立原生 HTML 原型源码，未接入 CRMEB 应用。
- Deliverable: `design/coffee-v1/index.html` 四栏 HTML 交互原型、白底黑线 Logo PNG 与 SVG；视觉稿归档为 `visual-board.html`。不修改远程 Issue。

## Brand
- Personality: 安静、专业、温暖，有咖啡杂志和独立烘焙店的质感。
- Trust signals: 清晰的规格、净重、产地、风味、价格、履约与退款状态。
- Avoid: 红色促销堆叠、发光金色丝带、重黑水墨、无效营销标签；允许自然透光的咖啡色层次。
- AhDouceur 为用户确定的正式品牌名称；图形为用户授权重新提炼的咖啡沙漏方向。图片、商品与价格均为设计示例。

## Product goals
- Goals: 找到适合的咖啡，理解普通购买与 400g 重量拼团，完成购买，追踪订单与售后。
- Non-goals: 会员积分、储值、分销、复杂优惠、ERP、骑手系统。
- Success signals: 四个主入口清楚；商品净重和价格可读；拼团进度不与购物车合计混淆。

## Personas and jobs
- Primary personas: 精品咖啡消费者及日常复购顾客。
- User jobs: 浏览风味、购买咖啡豆、邀请朋友参团、查看订单与退款。
- Key contexts: 单手手机操作、首次了解品牌、复购、到店自提。

## Information architecture
- Primary navigation: 首页 / 商品 / 购物车 / 我的；所有页面顺序一致。
- 首页: 整屏咖啡棕品牌主视觉、简化沙漏标志、标题副文案、寻味选豆 / 与友共饮双入口；不堆商品推荐或详细团进度。
- 商品: 搜索与选购/拼团双区域；左侧竖向品类导航，右侧暖白横向商品条目，展示名称、风味、规格、价格和加购或参团入口。
- 购物车: 商品选择与数量、规格、合计和结算；视觉稿为普通购买购物车，不把购物车重量冒充团进度。
- 我的: 用户入口、订单状态、我的拼团、地址管理、客服、品牌信息。
- Supporting screens later: 商品详情及规格、拼团详情、确认订单、支付结果、订单详情和售后。
- Content hierarchy: 商品与价格优先，品牌氛围辅助购买；拼团规则可达且可读。

## Design principles
- 四栏及弹窗统一透光咖啡棕、奶油色文字与轻线条；商品卡片、购物车商品条目及我的订单/我的拼团卡片保留暖白底、深棕字。
- 中文为主要信息语言，英文用于少量编辑式辅助标题。
- 交易信息优先于视觉留白；必要规则不隐藏在装饰或低对比小字中。
- 四栏共用导航、图标、色彩、按钮与间距系统。

## Visual language
- Color: 首页主体咖啡棕 #795039、透光棕 #AC825F、深棕 #3E261C、奶油白字 #FFF5E5；四栏与弹窗统一棕色；商品卡片、购物车条目及我的订单/我的拼团卡片采用暖白 #FFFAF3、深棕字 #553923，其余分区用浅色细线或半透明棕色。
- Typography: 主标题采用 Long Cang 细笔手写字形，接近用户参考图的自然笔意；正文与数字使用系统无衬线。字体文件与 OFL 许可本地随包，来源 Google Fonts 官方仓库。
- Spacing/layout rhythm: 4/8/12/16/24/32；手机左右留白约 20px。
- Shape/radius/elevation: 细线分隔、4–8px 圆角，少阴影，避免胶囊卡片堆叠。
- Motion: 后续实现采用轻量切换，尊重减少动态效果设置。
- Imagery/iconography: 首页自然透光咖啡棕与低对比细沙纹；标志用少量曲线、单颗咖啡豆与沙漏轮廓表达时间，避免照搬原始复杂图案；商品摄影保留，线图标统一。

## Components
- Existing components to reuse: 后续核对 CRMEB 原有导航、商品、SKU、订单与支付组件；当前为独立 HTML 原型。
- New/changed: 摄影主视觉、商品目录卡、重量团进度卡、购物车行、订单状态导航。
- Variants and states: 按钮主次、导航选中、商品可售与售罄、团等待/成功/失败/退款中。
- Ownership: 当前设计 token 由此文件记录，待正式前端实施时映射到现有样式体系。

## Accessibility
- Target: 后续实现按 WCAG AA 的对比度目标检查，视觉图不构成可访问性测试通过。
- Keyboard/focus: 网页预览和未来 H5 需要可见焦点；小程序使用语义化标签。
- Contrast/readability: 主要文字深咖，避免照片上低对比文字；辅助文字不能过淡。
- Screen-reader semantics: 图片替代文本、导航当前页、数量按钮和进度标签。
- Reduced motion: 动画非必要；状态不只用颜色表达。
- Touch targets: 主要点击区域至少 44×44px。

## Responsive behavior
- Supported: 以 390×844 手机布局为参考，适配 375–430px 宽度与底部安全区。
- Layout adaptations: 固定底部四栏，内容独立滚动；底部结算栏不遮挡内容。
- Touch/hover: 不依赖悬停；数量、选择和导航可直接触控。

## Interaction states
- Loading: 商品图片骨架，支付处理中防重复提交。
- Empty: 空购物车引导选购；无订单/无拼团说明。
- Error: 加载失败重试，库存变化回到结算核实。
- Success: 付款成功和成团成功分别表达。
- Disabled: 售罄不可购买，未成团不可履约。
- Offline: 保留已有展示，关键交易动作需服务端确认。
- 当前实现空购物车、搜索无结果、规格弹窗、地址表单、模拟支付/退款、订单空态与成团进度。真实加载、网络异常和支付状态仍属后端接入阶段。

## Content voice
- Tone: 简洁、自然，有适度意境。首页与商品栏目允许含蓄的编辑式标题和一句温和副文案；避免堆砌口号与排比。交易、订单与售后保持直白准确。不要为了精简将所有标题变为功能名。
- Copy / Prototype 14: 首页“AhDouceur”，副标题“留一点时间，给喜欢的风味。”；商品“风味选集”；首页入口“与友共饮 / 邀友拼团，共享好风味”，入口不突出重量，重量规则在团详情展示；购物车与我的保持简洁。
- Terminology: 净重、已付款重量、待成团、成团成功、退款处理中。
- Microcopy: 重量团示例“已拼 200g / 400g”“还差 200g”；不承诺必定成团，不把虚拟成员算作真实参与。

## Implementation constraints
- Framework: 原生 HTML/CSS/ES modules，零 npm 依赖。所有交易在本地模拟，未改动 CRMEB 交易逻辑。
- Tokens: 后续复用已有前端样式基础，避免建立第二套交易权威。正式 token 已落于 `design/tokens/`（ahdouceur.css / ahdouceur.scss + README），以 prototype.css 为提取来源，接入 CRMEB 时以它为准。
- Performance: 正式实现使用压缩图片及按需加载。
- Compatibility: 微信小程序顶部胶囊与底部安全区域应预留。
- 预览历史: Type 06 图像查看器归档为 visual-board.html；早期 HTML 排版探索保留。当前 index.html 为 Prototype 14，预览端口 8767。
- Test/screenshot: 11 项 Node 状态测试通过；浏览器检查分类、搜索、研磨、加购、选中金额、未选中禁用、自提、模拟支付退款、参团、地址保存与空购物车。390×844 和 375×667 手机视口无横向溢出。当前截图 prototype-home.jpg，旧 preview-*.png 不代表新版。
- Logo: PNG 是内置 imagegen 从现有稿提取的白底黑线版本；SVG 是 HTML 采用的对应矢量重绘。两者均保存在 design/coffee-v1/assets/。
- 数据: 当前标签 sessionStorage 保存演示状态；不发出支付、退款、地址或订单网络请求。客服未接通，真实规则、库存和支付异常待 D0 与后端阶段。
- 400g 拼团入口展示核心功能；具体人数、时限和 SKU 混拼规则继续由 D0 决定。

## Open questions
- [ ] 重设计标志的确认与矢量定稿 / 品牌方 / 品牌名称已确认为 AhDouceur。
- [ ] 商品、规格、售价和产地风味资料 / 商家 / 替换示例内容。
- [ ] D0 规则确认 / 业务负责人 / 决定拼团详情及异常状态文案。
- [ ] 自提地址与自配送边界 / 商家 / 决定结算信息。

## Prototype 10 interaction update
- 首页入口图标改为手绘咖啡袋与多只咖啡杯，使用已有 SVG 方式绘制。
- 首页选购/拼团分别进入商品页对应区域；左侧分类与搜索可在当前区域筛选。
- 拼团区域只展示实际示例团商品；空分类展示空态，详情保留 400g 规则与参团模拟。
- 已检查 375px 列表无横向溢出、底栏可见，分类、搜索、加购和团详情正常；5 项状态测试通过。

- 首页选购入口文案：寻味选豆；小字：单一产地 / 日常拼配。与“与友共饮”并列，点击进入选购区域。

## Prototype 14 — AhDouceur and dependent SKUs
- 品牌字标统一为 AhDouceur，首页主标题、页头、签名、门店与关于页面使用系统 Baskerville/Palatino/Georgia 斜体衬线，与中文手写栏目呼应。商品包装占位字也通过 imagegen 替换。
- 拼团区域不展示侧栏，并忽略普通选购的分类状态；选购保留左侧分类。
- 级联：手冲豆 → 50g/100g → 整豆/手冲研磨；意式豆 → 250g/1kg → 整豆/意式研磨。切换豆类重置重量和不兼容研磨。
- 商品、重量、豆类、研磨共同标识 SKU。购物车、结算与订单保留所选规格和单价快照。旧会话购物车迁移到新有效规格，历史订单保留原先重量与成交金额。
- 普通购买示例价格按原 200g 参考价线性换算，正式价格未确认；界面标明示例价。
- 拼团仍以 400g 为示例目标，已付款重量按本次选择的重量×数量累计，禁止超出剩余重量，不消费普通购物车。
- 验证：7 项状态测试；浏览器检查切换重置、1kg 意式加购/结算/订单、100g×2 成团、375px 无横向溢出、弹窗切换保留滚动。
- 最新截图：ahdouceur-home.jpg、ahdouceur-group.jpg、ahdouceur-spec-mobile.jpg。

- Logo 比例微调：咖啡水滴以自身中心缩放至 70%，外轮廓保持原尺寸；首页 AhDouceur 53px→47px，小屏47px→42px，后续页面字标24px→22px。当前下载入口提供同步更新的 SVG，PNG 为早期归档。

- 拼团人数示意（v16）：商品拼团卡片和团详情增加重叠头像与“2 人拼团中”；初始两人为演示参与者。当前用户首次模拟付款后变为3人，重复参与不重复计人数。成团后文案显示“3 人已成团”。本次未接真实会员数据。

## Prototype 17 — 发起拼团与截止时间
- 拼团页新增发起入口：选择现有咖啡，400g–1000g目标滑条（50g步长），选择自己的规格，模拟付款后创建新团。取消或未付款不创建。
- 新团与原有团同时保留；列表、团详情和我的当前团显示按真实目标计算的进度及倒计时。
- 有效期固定为付款发起时刻之后10天，createdAt/expiresAt 持久化，刷新不延长；到期未成团禁止继续参团，形成目标则显示已成团并停止计时。
- 多团以稳定ID保存，当前团引用在会话加载后重新关联。人数使用各团初始示例人数加当前用户一次参与，避免把多次付款重复计人。
- 验证：11项状态测试；浏览器验证1000g上限、700g新团、商品与份量选择、新旧团并存、继续参团、刷新期限保留、取消不新建，以及375px无横向溢出。
- 此原型使用浏览器时间与标签会话存储，不执行真实退款；正式后台须作为目标、参与记录及截止时间的权威。
- 截图：ahdouceur-start-group.jpg、ahdouceur-start-group-mobile.jpg、ahdouceur-group-countdowns.jpg。
