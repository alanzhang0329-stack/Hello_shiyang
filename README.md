# 个人明信片网站

一个无需构建工具的四页静态个人网站，可直接托管到 GitHub Pages。

## 本地预览

直接打开 `index.html`，或在仓库目录运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 修改内容

- 第 2–4 页全部文案：`content.js`
- 页面结构：`index.html`
- 颜色、尺寸和布局：`styles.css`
- 翻页交互：`script.js`

将 `.photo-placeholder` 元素替换为 `<img src="你的图片路径" alt="图片说明">` 即可使用真实照片。建议将照片放在 `images/` 目录。

`content.js` 已按页码分为 `2`、`3`、`4` 三组。修改标题、简介、档案条目或照片说明后，刷新页面即可看到结果。

### 添加照片

1. 将照片放进 `images/` 目录，例如 `images/football-1.jpg`。
2. 在 `content.js` 对应页面的 `photos` 数组填写路径，例如 `src: "images/football-1.jpg"`。
3. `position` 控制照片在框内的位置；`scale: 1` 会将完整照片拉伸到相框大小。

每页的 `photos` 有六项：第一项是顶部个人照，后面五项对应照片 1–5。照片会完整铺满相框，不裁剪、不留白，也不会改变页面整体布局。照片比例与相框不同时，画面会有轻微拉伸；将 `scale` 设置为大于 `1` 仍可能造成边缘超出。

## GitHub Pages

在仓库的 **Settings → Pages** 中，将发布来源设为当前分支的根目录。保存后，GitHub 会生成可公开访问的网址。
