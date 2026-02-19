# Project HexCiv — CLAUDE.md

> 本文件是 Claude Code 的项目上下文文件，放置于项目根目录。每次对话开始时 Claude Code 会自动读取。

---

## 项目概述

**HexCiv** 是一款 2D 独立 4X 策略游戏（类《文明》系列），采用纯前端技术栈开发。

- **核心理念：** 游戏性驱动，极简 2D 视觉，弱化动画，强化底层逻辑与数值策略。
- **开发阶段：** 种子期 / 原型开发（MVP）。
- **开发者水平：** CS 科班大一，正在学习中，代码需要清晰注释和规范结构。

---

## 技术栈

| 层级 | 技术 | 职责 |
|------|------|------|
| 语言 | TypeScript（严格模式） | 全项目统一语言 |
| 构建 | Vite | 开发服务器 & 打包 |
| 逻辑层 | 纯 TS 类库 | 回合、战斗、数值、AI（零 DOM/Canvas 依赖） |
| 渲染层 | PixiJS | 六边形地图 & 单位的 2D 渲染 |
| UI 层 | React | 科技树、城市面板、主菜单等交互界面 |
| 状态管理 | Zustand | 将引擎数据同步至 React UI 层 |
| 事件系统 | 自建 EventEmitter | 引擎状态变更的核心分发机制 |

---

## 核心架构：逻辑与表现分离

```
src/
├── engine/          # 纯逻辑层（无 DOM/Canvas 操作）
│   ├── core/        # EventEmitter、Game 主循环
│   ├── hex/         # 六边形数学工具 & 网格系统
│   ├── map/         # 地图生成、地形、资源
│   ├── unit/        # 单位属性、移动、战斗
│   ├── city/        # 城市管理、生产队列
│   ├── tech/        # 科技树
│   ├── turn/        # 回合管理器
│   └── ai/          # AI 决策
├── render/          # 表现层（PixiJS），订阅引擎事件更新画面
│   ├── MapRenderer
│   └── UnitRenderer
├── ui/              # 交互层（React），通过 Zustand 读取引擎数据
│   ├── components/
│   └── stores/      # Zustand stores，订阅引擎事件
├── types/           # 全局类型定义
└── main.ts          # 入口

# 数据流向：
# Engine --（EventEmitter）--> Render（PixiJS）
# Engine --（EventEmitter）--> Zustand Store --> UI（React）
# UI / Render --（调用方法）--> Engine
```

**关键约束：`engine/` 目录下的代码不得 import 任何 DOM、Canvas、PixiJS 或 React 相关模块。**

---

## 地图系统：六边形网格

- **坐标系：** 立方体坐标 (Cube Coordinates)，满足 `q + r + s = 0`。
- **常用形式：** 轴向坐标 (Axial)，仅存储 `(q, r)`，`s` 由约束推导。
- **存储结构：** `Map<string, Tile>`，Key 格式为 `"q,r"`，实现 O(1) 查找。
- **参考资料：** [Red Blob Games - Hexagonal Grids](https://www.redblobgames.com/grids/hexagons/)

---

## 开发路线图（Roadmap）

### P0 — 六边形基础（当前）
- [ ] `HexMath` 工具类：坐标转换、距离计算、邻居获取、线性插值
- [ ] `HexGrid` 类：地图生成（先做简单矩形区域）
- [ ] `Tile` 接口：地形类型、移动力消耗、资源槽位

### P1 — 渲染管线
- [ ] PixiJS 初始化（Application, Container, Viewport）
- [ ] 将 `HexGrid` 中的 Tile 渲染为彩色多边形
- [ ] 摄像机平移 & 缩放

### P2 — 单位系统
- [ ] `Unit` 接口：HP、攻击力、移动力（Movement Points）
- [ ] 基于移动力的 BFS/A* 寻路
- [ ] 单位选中 & 移动指令

### P3 — 回合系统
- [ ] `TurnManager`：回合推进、各阶段 hook
- [ ] 移动力/行动点 的每回合重置

---

## 编码规范

1. **模块化优先：** 每个文件单一职责，通过 `index.ts` 统一导出。
2. **函数式优先：** 纯函数处理数据变换，class 仅用于有状态实体（如 `Game`, `Unit`）。
3. **类型安全：** 启用 `strict: true`，禁止 `any`，善用 `interface` / `enum` / `type`。
4. **命名规范：**
   - 文件名：`kebab-case.ts`
   - 类/接口：`PascalCase`
   - 函数/变量：`camelCase`
   - 常量：`UPPER_SNAKE_CASE`
5. **注释：** 对算法和非直觉逻辑写清晰的中文或英文注释。
6. **测试：** 核心算法（HexMath、寻路、战斗公式）需有单元测试（Vitest）。

---

## AI 协作指令

- **优先构建可扩展的底层接口**，避免将逻辑与渲染代码耦合。
- 生成代码时，先给出接口/类型定义，再给出实现。
- 如果某个设计有多种方案，简要列出 trade-off 再推荐一个。
- 对于算法实现（如 A*、Perlin 噪声），附上时间/空间复杂度说明。
- 使用中文交流，代码中的标识符和注释可以用英文。
