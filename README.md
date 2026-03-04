# 数字求和挑战 (Sum Quest)

一个基于 React + Vite + Tailwind CSS 构建的现代数学益智消除游戏。

## 游戏特性
- **两种模式**：经典模式（生存）和计时模式（挑战）。
- **重力系统**：消除后方块自动下落。
- **响应式设计**：完美适配手机和桌面端。
- **流畅动画**：使用 Motion 库实现的平滑交互。

## 本地开发

1. 克隆仓库：
   ```bash
   git clone <your-repo-url>
   cd number-sum-quest
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

## 部署到 Vercel

本项目已配置好 `vercel.json`，可以直接在 Vercel 上运行。

1. 将代码推送到 GitHub。
2. 在 Vercel 控制台导入该 GitHub 仓库。
3. Vercel 会自动识别 Vite 配置并完成部署。

### 环境变量
如果你使用了 Gemini AI 功能，请在 Vercel 的项目设置中添加 `GEMINI_API_KEY` 环境变量。
