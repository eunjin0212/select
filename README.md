# Select Component 구현하기

![React](https://img.shields.io/badge/react-18.3.1-1E99FF.svg)
![typescript](https://img.shields.io/badge/typescript-4.9.5-1E99FF.svg)

## ⚙️ 실행 방법

```cmd
npm install
npm run start // for development
npm run build // for production build
npm run test // for test
```

## 📂 파일 경로

<details>
  <summary>src</summary>
  <pre>
 ┣ assets [...] // icon
 ┣ mock [...] // mock data
 ┣ components
 ┃ ┣ Select.tsx
 ┃ ┣ Dropdown.tsx
 ┃ ┗ DropdownItem.tsx
 ┣ css
 ┃ ┣ Select.module.css
 ┃ ┣ Dropdown.module.css
 ┃ ┣ DropdownItem.module.css
 ┃ ┣ index.css
 ┃ ┗ App.css
 ┣ pages
 ┃ ┗ Demo.tsx
 ┣ __tests__ [...] // test
 ┣ App.tsx
 ┗ index.tsx
  </pre>
</details>

## 📝 개발 과정

### 프로젝트

- 컴포넌트 구조
  - **Select**
    - 키보드 핸들링
    - 옵션의 타입, 검색된 값에 따른 옵션 핸들링
    - 옵션의 가징 긴 값에 따른 너비 핸들링
    - 검색 값, 선택 값 핸들링
  - **Dropdown**
    - 옵션의 방향, 위치 핸들링
    - 최고 높이는 브라우저 크기 맞춰 노출
  - **DropdownItem**
    - 아이템 호버, 선택 여부 UI 핸들링
    - 선택된 값에 따른 자기 자신 스크롤 핸들링

### 기능

- [X] option은 배열과 함수 두가지 타입
- [X] Select 폭은 option의 가장 긴 option에 맞춤
- [X] 검색 가능
- [X] 값이 선택되지 않았을 때, 포커스가 아웃 되면 검색어 삭제
- [X] 마우스, 키보드 둘 다 option 탐색 가능
- [X] 클릭, 엔터키 둘 다 선택 가능
- [X] list가 열렸을 때 선택된 값이 시작점
- [X] 스크린 크기에 따른 옵션 위치 조정 (아래, 위 공간 중,공간이 더 넓은 쪽)
