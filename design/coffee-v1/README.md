# AhDouceur · 沙与时间 — HTML 交互原型

当前入口：`index.html`。通过本地 HTTP 服务打开，地址为 http://127.0.0.1:8767/ 。

```sh
cd design/coffee-v1
python3 -m http.server 8767 --bind 127.0.0.1
```

这是原生 HTML / CSS / JavaScript 原型，无构建步骤、无 npm 依赖。模块脚本需要通过 HTTP 服务加载，不建议直接双击 HTML 文件。手机宽度显示全屏应用，桌面默认单屏体验，可切换四屏总览。

已实现：四栏导航；商品分类与风味搜索；研磨选择、数量选择、加购；购物车选择、增减、删除、空状态；快递/自提/同城配送切换；地址编辑；模拟支付、订单查看和模拟退款；独立的 400g 重量拼团演示。会话状态保存在当前标签的 sessionStorage，桌面“重置体验”恢复初始数据。

支付、参团和退款均为本地模拟，无后台、无真实扣款、无配送。客服为说明入口，尚未连接微信客服。商品、价格、门店、地址、免运费和拼团规则均为示例，不构成最终业务规则。

## 视觉与素材

Prototype 17：四栏、弹窗与导航统一咖啡棕、奶油色文字；商品卡片、购物车商品条目及我的订单/我的拼团卡片保留暖白底与深棕字。首页保留柔和透光、细沙曲线。品牌字标使用系统斜体衬线 Baskerville/Palatino/Georgia；中文栏目使用细笔手写字体 Long Cang，来源 [Google Fonts 官方仓库](https://github.com/google/fonts/tree/main/ofl/longcang)，随包保留 `assets/fonts/OFL.txt` 许可证；字体仅在项目内加载，未安装到系统。

- `assets/coffee-logo-black-white.png`：从 Type 06 概念稿用内置 imagegen 提取的白底黑线 Logo。
- `assets/logo-extraction-prompt.txt`：提取提示词。
- `assets/coffee-logo-black-white.svg`：HTML 内轻线标志对应的可缩放矢量重绘，不是 PNG 的自动描摹。
- 商品图片通过 CSS 展示已有概念稿 `assets/ahdouceur-packaging-board.png` 中的包装区域，正式上线需替换为独立商品图片。
- `visual-board.html`：之前的 Type 06 图像查看器；`layout-study.html` 为更早的布局探索。
- `prototype-brown-overview.jpg`：全棕主题四栏截图；`prototype-brown-cart-mobile.jpg`：375px 购物车截图。`prototype-home.jpg` 为上一版主题。

## 文件与验证

`prototype.mjs` 负责界面和交互，`prototype.css` 负责样式，`store.mjs` 负责示例商品、购物车、订单和拼团状态。

```sh
node --test design/coffee-v1/store.test.mjs
node --check design/coffee-v1/prototype.mjs
```

11 项状态测试通过：级联规格合法性、金额与选中项、完整 SKU 合并、数量边界、结算与退款快照、拼团按重量累计与防超额、旧会话迁移。浏览器实际检查了搜索、分类、加购、金额、未选中禁用结算、自提、模拟付款/退款、成团、地址保存与空购物车。390×844 和 375×667 手机视口无横向溢出；小屏底部导航位于视口内。

设计约定见仓库根目录 `DESIGN.md`。尚未接入 CRMEB 生产功能。

本次批注更新：手绘首页图标、首页“咖啡拼团”入口，商品页“选购 / 拼团”切换、左侧竖向分类与横向白色条目。首页拼团入口直接选择拼团区域。拼团详情保留重量规则。截图：`prototype-hand-home.jpg`、`prototype-catalog-rail.jpg`、`prototype-catalog-rail-mobile.jpg`。

## 公网预览

https://coffee.chiraliumai.cn/ 通过已有 Cloudflare Tunnel 转发到本机 127.0.0.1:8767，因此当前目录的修改直接反映在线上。2026-10-24 恢复公网预览：原端口被其他项目占用，改用独立端口 8767。HTTP 服务与咖啡专用隧道由当前用户 LaunchAgent 保持运行，登录后自动启动、异常退出后重启。服务标识为 `cn.chiraliumai.coffee.http` 和 `cn.chiraliumai.coffee.tunnel`。该方式依赖本机 HTTP 服务与隧道持续运行，并非独立服务器托管。

首页拼团入口现使用“与友共饮”，小字“邀友拼团，共享好风味”；仍直接进入拼团区域。

首页选购入口现为“寻味选豆 / 单一产地 / 日常拼配”，与“与友共饮”并列；脚本资源版本 v12。

## AhDouceur 与级联规格更新

当前品牌为 AhDouceur，UI 字标与示例包装均已替换。包装使用内置 imagegen 编辑，提示词为 `assets/ahdouceur-packaging-prompt.txt`；HTML 图标仍是原生 SVG。

拼团区域移除侧栏，选购区域保留。豆类先选手冲/意式，再分别选择 50g/100g 或 250g/1kg，研磨选项同步变化；规格进入购物车、结算和订单。默认示例购物车为 50g 手冲豆 ¥22 加 250g 意式豆 ¥95，合计 ¥117。价格暂按旧参考价换算，正式 SKU 价格待商家确认。

拼团使用相同选择器，按付款的实际重量累计，超出团剩余重量时禁止确认。普通购买与参团继续独立。浏览器已验证完整规格链路与 375px 手机布局，并修复弹窗切换选项回到顶部的问题。截图：`ahdouceur-home.jpg`、`ahdouceur-group.jpg`、`ahdouceur-spec-mobile.jpg`。

比例微调（v15）：Logo 中央水滴缩小30%；首页字标收小约11%。页面“下载 Logo”提供更新后的SVG，PNG保留为早期归档。最新首页截图为 `ahdouceur-home-refined.jpg`。

- 拼团人数示意（v16）：商品拼团卡片和团详情增加重叠头像与“2 人拼团中”；初始两人为演示参与者。当前用户首次模拟付款后变为3人，重复参与不重复计人数。成团后文案显示“3 人已成团”。本次未接真实会员数据。

## 发起拼团与倒计时（v17）

拼团页“发起拼团”选择商品与400g–1000g目标（50g步长），再选择规格与数量。完成模拟付款后新增一团，原有团保留。新团从付款成功时起固定10天，列表、详情与我的当前团显示剩余天/时/分/秒；每秒刷新，重新加载保留原截止时间。到期停止接受参团，成团后显示完成状态。

会话版本为3，旧状态自动增加稳定团ID与期限，多团恢复时保持当前团与列表同一对象。实际退款、其他用户付款和服务器校时仍未接入。

新增测试覆盖滑条边界/步长、新团保存、十天精确时限、到期付款阻止以及重新加载保留目标与期限。11项测试全部通过；浏览器完成700g发起、继续参团、刷新与取消流程验证，小屏375px无横向溢出。截图见 `ahdouceur-start-group.jpg`、`ahdouceur-start-group-mobile.jpg` 与 `ahdouceur-group-countdowns.jpg`。
