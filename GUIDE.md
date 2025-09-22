# 가이드: Black Duck 스니펫 스캔 워크플로우 활용하기

이 문서는 `.github/workflows/blackduck-snippet-scan.yml` GitHub Action 워크플로우의 설정 및 결과 활용법을 안내합니다.

## 1. 워크플로우 실행 방법

이 워크플로우는 별도의 수동 실행 없이, **새로운 Pull Request (PR)를 생성하거나 기존 PR에 새로운 코드를 푸시(push)할 때마다 자동으로 실행**됩니다.

워크플로우는 PR에 추가된 코드 라인만을 대상으로 스캔을 진행합니다.

## 2. 스캔 결과 확인

워크플로우 실행이 완료되면, 스캔 결과는 두 가지 형태로 나타납니다.

1.  **PR 코멘트**: 스니펫이 하나 이상 발견되면, GitHub Action 봇이 PR에 아래와 같은 코멘트를 자동으로 작성합니다. 이 코멘트에는 발견된 모든 스니펫의 정보가 테이블 형태로 요약되어 있습니다.

    > ### :shield: Black Duck Snippet Scan Results
    > 
    > The following open source snippets were detected in the added code:
    > 
    > | Risk | Component | Version | License | License Family |
    > |:----:|:----------|:--------|:--------|:---------------|
    > | 🔴 | `example-component` | `1.2.3` | AGPL-3.0-only | AGPL |
    > | 🟡 | `another-component` | `2.0.0` | MPL-2.0 | WEAK_RECIPROCAL |
    > | 🟢 | `safe-component` | `3.1.4` | MIT | PERMISSIVE |

2.  **워크플로우 상태**: PR의 하단에 표시되는 CI/CD 체크 항목에서 `Black Duck Snippet Scan` 워크플로우의 성공/실패 여부를 확인할 수 있습니다.

## 3. 결과 해석 및 조치 사항

스캔 결과 테이블의 각 항목은 다음과 같은 의미를 가집니다.

-   **Risk**: 라이선스 위험도를 색상으로 나타냅니다. (🔴 높음, 🟡 중간, 🟢 낮음)
-   **Component**: 스니펫이 유래한 원본 오픈소스 컴포넌트의 이름입니다.
-   **Version**: 해당 컴포넌트의 버전입니다.
-   **License**: 라이선스의 SPDX ID 입니다.
-   **License Family**: 라이선스 그룹(군)입니다. (예: `RECIPROCAL`, `PERMISSIVE`)

### 위험도(Risk)에 따른 조치 방법

#### 🔴 높은 위험 (High Risk)

-   **의미**: `AGPL`, `GPL` 등과 같은 **상호주의(Reciprocal)** 라이선스가 발견된 경우입니다. 이 라이선스는 소스 코드 공개 의무를 발생시킬 수 있어 비즈니스에 큰 영향을 줄 수 있습니다.
-   **워크플로우 상태**: **실패 (Failed)**. PR에 빨간색 ❌ 체크가 표시되며, 설정에 따라 병합(merge)이 차단될 수 있습니다.
-   **조치 사항**:
    1.  해당 코드가 반드시 필요한지 검토합니다.
    2.  **법무/컴플라이언스팀에 검토를 요청**하여 라이선스 의무 사항을 준수할 수 있는지 확인해야 합니다.
    3.  검토 결과에 따라, 해당 코드를 **다른 라이선스를 가진 코드로 대체하거나 직접 구현**하는 것을 고려해야 합니다.

#### 🟡 중간 위험 (Medium Risk)

-   **의미**: `MPL`, `EPL` 등과 같은 **약한 상호주의(Weak Reciprocal)** 라이선스가 발견된 경우입니다. 일반적으로 파일 단위의 소스 코드 공개 의무를 가집니다.
-   **워크플로우 상태**: **성공 (Success)**. 하지만 경고의 의미를 가집니다.
-   **조치 사항**:
    1.  회사의 오픈소스 정책을 확인하여 해당 라이선스가 허용되는지 확인합니다.
    2.  수정한 파일에 대한 라이선스 고지 등, 해당 라이선스가 요구하는 의무 사항을 이행해야 할 수 있습니다.

#### 🟢 낮음 (Low Risk)

-   **의미**: `MIT`, `Apache`, `BSD` 등과 같은 **허용적인(Permissive)** 라이선스입니다. 최소한의 제약 조건만 가지므로 일반적으로 사용하기에 안전합니다.
-   **워크플로우 상태**: **성공 (Success)**.
-   **조치 사항**: 별도의 조치가 필요하지 않은 경우가 대부분입니다.

## 4. 워크플로우 사용자 정의 (Customization)

회사의 정책에 따라 라이선스 위험도 기준을 변경하고 싶다면, `.github/workflows/blackduck-snippet-scan.yml` 파일의 `Process scan results and comment on PR` 스텝에 있는 `github-script` 내용을 수정할 수 있습니다.

```javascript
// ...
// 위험도 기준을 정의하는 부분
const highRiskFamilies = [\'RECIPROCAL\', \'AGPL\'];
const mediumRiskFamilies = [\'WEAK_RECIPROCAL\'];
// ...
```

위 배열에 라이선스 패밀리 이름을 추가하거나 제거하여 위험도 기준을 조정할 수 있습니다.
