# SETUP_NOTES — synapse-hugo-shared 구성 노트

생성일: 2026-06-22

---

## 파일 트리

```
synapse-hugo-shared/
├── .gitignore
├── go.mod
├── hugo.toml
├── README.md
├── SETUP_NOTES.md  ← 이 파일
├── assets/
│   └── css/
│       └── main.css          (출처: ~/dev/synapse-site/assets/css/main.css)
└── layouts/
    ├── _default/
    │   ├── baseof.html       (출처: ~/dev/synapse-site/layouts/_default/baseof.html)
    │   ├── home.html         (출처: ~/dev/synapse-site/layouts/_default/home.html)
    │   ├── list.html         (출처: ~/dev/synapse-site/layouts/_default/list.html)
    │   └── single.html       (출처: ~/dev/synapse-site/layouts/_default/single.html)
    └── _markup/
        └── render-codeblock-mermaid.html  (출처: ~/dev/synapse-site/layouts/_markup/)
```

---

## go.mod 내용

```
module github.com/thishw/synapse-hugo-shared

go 1.26
```

모듈 경로: `github.com/thishw/synapse-hugo-shared`

---

## 소비 사이트가 해야 할 것 (체크리스트)

- [ ] `hugo.toml`의 `[module]` 섹션에 `[[module.imports]] path = "github.com/thishw/synapse-hugo-shared"` 추가
- [ ] `hugo.toml`에 `[markup.goldmark.renderer] unsafe = true` 추가 (JSON-LD/inline HTML 렌더용)
- [ ] `go.mod` + `go.sum` 생성: `hugo mod tidy` 실행
- [ ] CI(GitHub Actions 등) 워크플로에 `actions/setup-go@v5` 스텝 추가 (Hugo Modules는 Go 필요)
- [ ] Hugo extended 버전 사용 (assets pipeline — CSS minify 사용 시 필수)
- [ ] 버전 핀 필요 시: `hugo mod get github.com/thishw/synapse-hugo-shared@vX.Y.Z`

---

## 참조 공식 문서

- Hugo Modules / Use Modules: https://gohugo.io/hugo-modules/use-modules/
- Hugo Modules / Theme Components: https://gohugo.io/hugo-modules/theme-components/
- Hugo Configuration / Module: https://gohugo.io/configuration/module/

---

## 구성 시 결정 사항 및 근거

| 항목 | 결정 | 근거 |
|------|------|------|
| `hugo.toml`에 baseURL/title 미포함 | 소비 사이트 몫 | theme component는 사이트 고유값 불포함 (공식 가이드) |
| `goldmark unsafe=true` 미포함 | README 안내로 대체 | 이 설정은 소비 사이트 hugo.toml에만 유효 |
| `content/` 미포함 | 의도적 제외 | 공통 레이아웃 모듈은 레이아웃/에셋만 제공 |
| `.github/workflows/` 미포함 | 의도적 제외 | 공통 레포는 자체 배포 없음 |
| `go` 버전 1.26 명시 | go.mod 직접 작성 | 로컬에 go 미설치, Hugo 0.163.3 기준 호환 버전 |

---

## 미결 사항 / 우려사항

1. **go.sum 없음**: `go.mod`만 있고 `go.sum`이 없습니다. 이 모듈 자체는 외부 Go 의존성이 없으므로 go.sum은 불필요합니다. 소비 사이트에서 `hugo mod tidy` 실행 시 소비 사이트의 go.sum이 생성됩니다.

2. **GitHub push 미완료**: remote 설정 및 GitHub 레포 생성/push는 thishw 계정 인증이 필요하므로 상위 컨트롤러에서 처리해야 합니다. 현재는 로컬 git init + 초기 커밋까지만 완료된 상태입니다.

3. **go 미설치**: 로컬에 go가 설치되지 않아 `hugo mod init`으로 go.mod를 생성하지 못하고 직접 작성했습니다. go.mod 형식은 단순하고 Hugo 공식 문서의 예시와 동일합니다. 실제 사용 시 문제없으나, 필요하면 `brew install go` 후 `hugo mod tidy`로 검증 가능합니다.

4. **home.html의 섹션 하드코딩**: `home.html`이 `posts` 섹션을 하드코딩(`where .Site.RegularPages "Section" "posts"`)합니다. 소비 사이트의 콘텐츠 구조가 다르면 이 파일만 오버라이드해야 합니다 (Hugo Module은 소비 사이트의 같은 경로 파일이 모듈 파일을 오버라이드함).

5. **Hugo extended 요구**: `baseof.html`이 `resources.Minify`를 사용하므로 Hugo extended 버전이 필요합니다. `hugo.toml`의 `[module.hugoVersion]`에 `extended = true`로 명시했습니다.
