# Cloudflare Pages 部署文档

本文档详细描述了如何使用 `wrangler` 工具将您的项目部署到 Cloudflare Pages。我们以 `nots-tools` 项目为例，包含了从安装 `wrangler` 到部署的整个流程。

## 1. 安装 Wrangler 工具

`wrangler` 是 Cloudflare 提供的命令行工具，用于与 Cloudflare Workers 和 Cloudflare Pages 交互。首先，您需要安装 `wrangler` 工具。

### 使用 npm 安装

如果您的系统已经安装了 Node.js 和 npm，可以使用以下命令安装 `wrangler`：

```bash
npm install -g wrangler
```

### 使用 Homebrew 安装 (macOS/Linux)

如果您在 macOS 或 Linux 上，可以使用 Homebrew 安装 `wrangler`：

```bash
brew install wrangler
```

### 验证安装

安装完成后，您可以使用以下命令验证 `wrangler` 是否安装成功：

```bash
wrangler --version
```

如果您看到版本号，说明安装成功。

## 2. 登录到 Cloudflare

为了使 `wrangler` 工具能够访问您的 Cloudflare 帐户，您需要登录到 Cloudflare。

运行以下命令来启动登录流程：

```bash
wrangler login
```

此命令将打开一个浏览器窗口，要求您使用 Cloudflare 账户登录。登录成功后，`wrangler` 工具将为您保存身份验证信息。

## 3. 初始化项目

在命令行中，使用以下命令进入您的项目目录。假设您的项目目录是 `nots-tools`，请执行：

```bash
cd knots-tools
```

如果您尚未创建 Cloudflare Pages 项目，请在 Cloudflare 控制台创建一个新的 Pages 项目，名称为 `nots-tools`。

## 4. 部署项目到 Cloudflare Pages

使用 `wrangler` 将 `nots-tools` 项目部署到 Cloudflare Pages。确保您的项目目录中包含 `public` 文件夹，并且该文件夹包含您要部署的静态文件。

执行以下命令进行部署：

```bash
wrangler pages deploy public --project-name=knots-tools
```

这条命令的作用是：

- `public`：指定了您要部署的文件夹。请确保此文件夹包含您的静态文件。
- `--project-name=knots-tools`：指定 Cloudflare Pages 上的项目名称。

执行该命令后，`wrangler` 将会把 `public` 文件夹中的内容部署到 Cloudflare Pages，部署过程将在终端中显示日志信息。

## 5. 检查部署状态

部署成功后，您将看到一个指向新项目的网址（例如：`https://knots-tools.pages.dev`）。您可以在浏览器中访问此网址，以查看您的网站是否已成功上线。

## 6. 配置自定义域名（可选）

如果您想使用自定义域名，您可以在 Cloudflare 控制台中为您的 Pages 项目配置一个域名。配置完成后，您的项目将通过该域名进行访问。

---

### 总结

通过上述步骤，您已经成功使用 `wrangler` 工具将 `nots-tools` 项目部署到 Cloudflare Pages。您可以随时使用 `wrangler` 进行项目的更新和维护。