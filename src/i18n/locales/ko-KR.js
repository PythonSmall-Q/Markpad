export default {
    app: {
        name: 'Markpad',
        description: '강력한 Markdown 노트 애플리케이션'
    },

    menu: {
        file: '파일',
        edit: '편집',
        view: '보기',
        help: '도움말'
    },

    header: {
        new: '새로 만들기',
        open: '열기',
        save: '저장',
        saveAs: '다른 이름으로 저장',
        export: '내보내기',
        settings: '설정'
    },

    sidebar: {
        files: '파일',
        recentFiles: '최근 파일',
        openDocuments: '열린 문서',
        noRecentFiles: '최근 파일이 없습니다',
        noDocuments: '문서가 없습니다',
        settings: '설정'
    },

    editor: {
        toolbar: {
            bold: '굵게',
            italic: '기울임꼴',
            strikethrough: '취소선',
            heading: '제목',
            unorderedList: '글머리 기호 목록',
            orderedList: '번호 매기기 목록',
            quote: '인용',
            inlineCode: '인라인 코드',
            codeBlock: '코드 블록',
            link: '링크 삽입',
            image: '이미지 삽입',
            video: '비디오 삽입',
            audio: '오디오 삽입',
            table: '표 삽입',
            inlineMath: '인라인 수식',
            blockMath: '블록 수식',
            hr: '수평선',
            preview: '미리보기',
            hidePreview: '미리보기 숨기기',
            showPreview: '미리보기 표시'
        },
        placeholder: 'Markdown 문서 작성 시작...',
        dialog: {
            insertLink: '링크 삽입',
            linkUrl: '링크 URL',
            linkText: '링크 텍스트',
            invalidUrl: '유효한 URL을 입력하세요',
            enterFormula: '수식 입력',
            inlineMath: '인라인 수식',
            blockMath: '블록 수식',
            confirm: '확인',
            cancel: '취소'
        },
        placeholder: 'Markdown 문서를 작성하세요...',
        preview: '미리보기',
        split: '분할',
        fullscreen: '전체 화면',
        exitFullscreen: '전체 화면 종료'
    },

    settings: {
        title: '설정',
        appearance: {
            title: '외관',
            theme: '테마',
            light: '밝게',
            dark: '어둡게',
            auto: '자동'
        },
        language: {
            title: '언어',
            selectLanguage: '언어 선택',
            zhCN: '중국어 간체',
            enUS: 'English'
        },
        editor: {
            title: '편집기',
            fontSize: '글꼴 크기',
            lineHeight: '줄 높이',
            tabSize: '탭 크기',
            wordWrap: '자동 줄 바꿈',
            lineNumbers: '줄 번호 표시',
            autoSave: '자동 저장',
            autoSaveInterval: '자동 저장 간격(초)'
        },
        file: {
            title: '파일',
            defaultFileName: '기본 파일 이름',
            fileExtension: '파일 확장자',
            recentFilesLimit: '최근 파일 수'
        },
        shortcuts: {
            title: '단축키',
            action: '작업',
            key: '키'
        },
        about: {
            title: '정보',
            version: '버전',
            description: '강력한 Markdown 노트 애플리케이션',
            author: '작성자',
            license: '라이선스',
            homepage: '홈페이지',
            repository: '저장소'
        },
        saveSuccess: '설정이 저장되었습니다',
        resetConfirm: '모든 설정을 재설정하시겠습니까?',
        reset: '설정 재설정'
    },

    file: {
        new: '새 파일',
        open: '파일 열기',
        save: '저장',
        saveAs: '다른 이름으로 저장',
        close: '닫기',
        closeAll: '모두 닫기',
        recentFiles: '최근 파일',
        clearRecent: '기록 지우기'
    },

    export: {
        title: '내보내기',
        html: 'HTML로 내보내기',
        pdf: 'PDF로 내보내기',
        markdown: 'Markdown으로 내보내기',
        success: '내보내기 성공',
        failed: '내보내기 실패'
    },

    shortcuts: {
        newFile: '새 파일',
        openFile: '파일 열기',
        save: '저장',
        saveAs: '다른 이름으로 저장',
        close: '닫기',
        bold: '굵게',
        italic: '기울임꼴',
        find: '찾기',
        replace: '바꾸기',
        settings: '설정'
    },

    messages: {
        saveSuccess: '저장 성공',
        saveFailed: '저장 실패',
        openFailed: '열기 실패',
        unsavedChanges: '저장하지 않은 변경 사항이 있습니다. 저장하시겠습니까?',
        confirmClose: '이 파일을 닫으시겠습니까?',
        confirmCloseAll: '모든 파일을 닫으시겠습니까?',
        fileNotFound: '파일을 찾을 수 없습니다',
        invalidFile: '잘못된 파일입니다',
        exportSuccess: '내보내기 성공',
        exportFailed: '내보내기 실패'
    },

    mathTutorial: {
        title: '수학 수식 튜토리얼',
        basics: { title: '기본 구문', desc: 'LaTeX는 인라인 및 블록 수식을 지원합니다', inline: { title: '인라인 수식' }, block: { title: '블록 수식' } },
        symbols: { title: '기호', name: '이름', code: '코드', result: '결과', greek: { title: '그리스 문자' }, operators: { title: '연산자' } },
        fractions: { title: '분수와 근호', fraction: { title: '분수' }, root: { title: '근호' } },
        scripts: { title: '위 첨자와 아래 첨자', superscript: { title: '위 첨자' }, subscript: { title: '아래 첨자' } },
        functions: { title: '함수', trig: { title: '삼각 함수' }, log: { title: '로그' }, limits: { title: '극한' } },
        matrices: { title: '행렬', bracket: { title: '소괄호' }, square: { title: '대괄호' }, determinant: { title: '행렬식' } },
        equations: { title: '방정식', system: { title: '연립방정식' }, align: { title: '정렬' } },
        examples: { title: '예제', quadratic: '이차방정식', integral: '적분', summation: '합', limit: '극한', matrix: '행렬', system: '연립', derivative: '도함수', partial: '편미분', vector: '벡터', set: '집합', logic: '논리', copy: '복사', copied: '복사됨' }
    }
}
