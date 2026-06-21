# synapse-hugo-shared

공통 Hugo 레이아웃 모듈 — 여러 Hugo 사이트가 공유하는 layouts/assets 컴포넌트.

Hugo Module(theme component)로 배포되며, 자체 content는 없습니다.

---

## 이 모듈이 제공하는 것

| 경로 | 내용 |
|------|------|
| `layouts/_default/baseof.html` | HTML 뼈대 (CSS 로드, Mermaid CDN 조건부 로드) |
| `layouts/_default/home.html` | 홈 페이지 템플릿 (posts 섹션 목록) |
| `layouts/_default/list.html` | 섹션/taxonomy 목록 템플릿 |
| `layouts/_default/single.html` | 단일 페이지(article) 템플릿 |
| `layouts/_markup/render-codeblock-mermaid.html` | Mermaid 코드펜스 렌더 훅 |
| `assets/css/main.css` | 기본 스타일시트 (모바일 반응형, 테이블, Mermaid) |

---

## 소비 사이트에서 사용하는 법

### 1. 의존성 선언 (`hugo.toml`)

```toml
[module]
  [[module.imports]]
    path = "github.com/thishw/synapse-hugo-shared"
```

### 2. goldmark unsafe 렌더 활성화 (필수)

JSON-LD 본문 인라인 HTML 등이 raw HTML로 렌더되려면 소비 사이트의 `hugo.toml`에 반드시 추가:

```toml
[markup.goldmark.renderer]
  unsafe = true
```

> **주의**: 이 설정은 소비 사이트 hugo.toml에만 두어야 효과가 있습니다.
> 이 공통 모듈의 hugo.toml에 두면 소비 사이트에 적용되지 않습니다.

### 3. 모듈 다운로드

```bash
hugo mod get github.com/thishw/synapse-hugo-shared
```

### 4. 특정 버전 핀 (권장)

```bash
hugo mod get github.com/thishw/synapse-hugo-shared@v0.1.0
```

버전 업데이트:

```bash
hugo mod get -u github.com/thishw/synapse-hugo-shared@v0.2.0
```

### 5. GitHub Pages 워크플로에서 Go 설치 (필수)

Hugo Modules는 Go 툴체인이 필요합니다. CI 워크플로에 아래 스텝 추가:

```yaml
- name: Setup Go
  uses: actions/setup-go@v5
  with:
    go-version: "1.22"

- name: Hugo setup
  uses: peaceiris/actions-hugo@v3
  with:
    hugo-version: "0.116.0"
    extended: true

- name: Build
  run: hugo mod tidy && hugo --minify
```

---

## 소비 사이트 최소 hugo.toml 예시

```toml
baseURL = "https://your-site.example.com/"
languageCode = "ko"
title = "My Site"

[markup.goldmark.renderer]
  unsafe = true

[markup.highlight]
  noClasses = false

[module]
  [[module.imports]]
    path = "github.com/thishw/synapse-hugo-shared"
```

---

## 참조 공식 문서

- [Hugo Modules: Use Modules](https://gohugo.io/hugo-modules/use-modules/)
- [Hugo Modules: Theme Components](https://gohugo.io/hugo-modules/theme-components/)
- [Hugo Configuration: Module](https://gohugo.io/configuration/module/)
