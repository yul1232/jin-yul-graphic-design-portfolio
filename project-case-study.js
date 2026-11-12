(() => {
  const caseStudies = {
    'project-1': {
      designNotes: [
        ['형태', '눈사람의 형태를 단순한 타원으로 추상화하고, 세 개의 형태를 분리해 녹아내린 모습을 표현했다. 각 형태의 크기와 간격을 조정해 시각적 균형을 유지했다.'],
        ['색채', '작품 속 눈사람이 따뜻한 물에 녹고 싶어 하는 내용에서 착안해, 물을 연상시키는 푸른색(#1E63B0)을 주조색으로 사용했다. 이를 통해 눈사람이 물속에 있는 듯한 장면을 표현했다.'],
        ['장식 요소', '눈사람과 연관된 눈꽃 패턴을 반복적으로 배치해 장식성을 더하고, 표지 전체의 시각적 완성도를 높였다.'],
        ['타이포그래피', "유기적인 곡선이 특징인 'OG 르네상스 비밀'을 사용해 부드러운 인상을 표현했다. 글자색은 눈사람과 동일한 흰색으로 설정해 시각적 통일감을 주었다."],
      ],
      colors: ['#1E63B0', '#D9DDE3', '#F4F5F6'],
      typeface: 'OG 르네상스 비밀',
      // 준비된 이미지의 상대 경로를 해당 칸에 입력합니다.
      sketches: [
        'assets/snowman-sketch-1.png',
        'assets/snowman-sketch-2.png',
        'assets/snowman-sketch-3.png',
      ],
    },
    'project-2': {
      designNotes: [
        ['형태', '제목 자체를 주요 시각 요소로 활용해 간결하면서도 현대적인 표지를 구성하고자 했다. 영문 제목을 중심으로 글자의 크기와 비율을 조정하고, 한글 제목과 작가명을 함께 배치해 심미성과 정보 전달의 균형을 고려했다.'],
        ['색채', "붉은 계열의 색상과 회색 그라데이션을 사용해 작품의 핵심 키워드인 '반항'을 표현했다. 붉은색은 주인공 홀든이 사회에 대해 느끼는 반항적인 심리를 드러내고, 회색 그라데이션은 그런 태도를 지닌 홀든 역시 완전히 자유롭지 않은 내면의 모순을 나타낸다."],
        ['타이포그래피', '영문 제목을 크게 배치해 타이포그래피가 돋보이도록 구성했다. 글자의 세로 비율을 강조해 독특한 시각적 인상을 주고, 한글 제목과 작가명은 간결하게 배치해 전체적인 균형을 맞췄다.'],
      ],
      colors: ['#FDFDFE', '#47261D', '#999999'],
      // 완성 표지 뒷면 왼쪽의 그라데이션을 사용합니다. 아래 값은 해당 영역의 위·아래 픽셀에서 읽은 sRGB 값입니다.
      coverGradient: ['#DF2012', '#9D9999'],
      coverRatio: '3308 / 2658',
      typeface: '강원교육튼튼체',
      // 준비된 스케치 이미지의 상대 경로를 왼쪽부터 입력합니다.
      sketches: [
        'assets/catcher-sketch-1.png',
        'assets/catcher-sketch-2.png',
        'assets/catcher-sketch-3.png',
      ],
    },
    'project-3': {
      designNotes: [
        ['형태', '개츠비가 품었던 순수한 사랑과 현실의 괴리를 표현하기 위해 데이지꽃의 꽃잎을 깨지고 흩어진 형태로 구성했다. 이를 통해 사랑보다 부와 안정을 선택한 데이지의 모습과 무너진 개츠비의 이상을 시각화했다.'],
        ['색채', '데이지꽃 본래의 흰색을 유지하고, 배경에는 부와 물질적 욕망을 상징하는 노란색을 사용했다.'],
        ['타이포그래피', '스텔라체 OTF Bold Condensed를 사용해 제목의 세로 비율을 강조하고, 배경색과 대비되는 색상의 그라데이션을 적용해 주목성과 시각적 밀도를 높였다.'],
      ],
      colors: ['#F3EB02', '#F8F8F8', '#B7CAD3', '#EBA421'],
      titleGradient: [
        [76.79, 87.12, 65.54, 47.55],
        [81.88, 50.16, 65.22, 6.42],
        [71.17, 10.98, 31.01, 0],
      ],
      coverRatio: '3661 / 2480',
      typeface: '스텔라체 OTF Bold Condensed',
      sketches: [
        'assets/gatsby-sketch-1.png',
        'assets/gatsby-sketch-2.png',
        'assets/gatsby-sketch-3.png',
      ],
    },
    'project-4': {
      designNotes: [
        ['형태', '영화 속 가구야 공주가 처음 등장하는 장면을 원형의 달 안에 배치했다. 이를 통해 가구야 공주의 탄생과 달로 돌아가는 결말을 하나의 이미지로 연결해 표현했다.'],
        ['색채', '연두색과 붉은색의 그라데이션을 활용해 부드럽고 따뜻한 분위기를 형성했다. 원작의 자연스러운 색감과 어우러지도록 채도를 조절했다.'],
        ['타이포그래피', '스스로넷 NotCliche OTF를 사용해 제목의 개성 있는 글자 형태를 강조했다. 글자의 크기와 자간을 조정해 시각적 리듬감을 형성하고, 중심 이미지와 조화를 이루도록 배치했다.'],
      ],
      // 포스터 원본에서 추출한 상단, 하단, 달 내부, 제목 색상.
      colors: ['#E1E7AA', '#D05E57', '#FFEBB8', '#FFFBCB'],
      backgroundGradient: ['#E1E7AA', '#D4A17B', '#D05E57'],
      coverRatio: '4961 / 7016',
      typeface: '스스로넷 NotCliche OTF',
      sketches: ['assets/kaguya-sketch-1.png'],
    },
    'project-5': {
      designNotes: [
        ['형태', '피부에 자연스럽게 스며드는 수분과 편안한 사용감을 표현하기 위해 부드럽게 이어지는 유기적인 곡선을 중심으로 디자인했다. 브랜드명 SEORIN의 이니셜 S와 R의 구조를 활용해 하나의 모노그램으로 재구성하고, 획의 흐름과 내부 여백을 조정해 간결하면서도 안정적인 형태를 완성했다.'],
        ['색채', '차분한 청록색을 사용해 스킨케어 브랜드가 추구하는 수분감과 편안함을 표현했다. 푸른색 계열의 청량함과 낮은 명도의 안정적인 인상을 결합해 깨끗하면서도 신뢰감 있는 브랜드 이미지를 형성했다.'],
        ['타이포그래피', '심볼의 유기적인 곡선과 대비되는 간결한 영문 서체를 사용해 시각적 균형을 형성했다. 글자 사이의 간격을 넓게 조정해 여유롭고 정돈된 인상을 주었으며, 심볼과 워드마크가 각각의 형태를 유지하면서도 하나의 브랜드로 인식되도록 구성했다.'],
      ],
      colors: ['#215367'],
      coverRatio: '1 / 1',
      typeface: 'Fraunces',
      sketches: [
        'assets/seorin-sketch-1.png',
        'assets/seorin-sketch-2.png',
        'assets/seorin-sketch-3.png',
      ],
    },
  };

  function gradientSwatch(colors, tooltip) {
    return `<li class="case-gradient" title="${tooltip}"><span aria-hidden="true" style="background:linear-gradient(${colors.join(', ')})"></span>${colors.join(' → ')}</li>`;
  }

  function titleGradient(stops) {
    // 화면에는 RGB 근사값을 HEX로 표시하고, 원본 CMYK 값은 툴팁에 유지합니다.
    const colors = stops.map(([c, m, y, k]) => {
      const hex = [c, m, y].map(channel =>
        Math.round(255 * (1 - channel / 100) * (1 - k / 100)).toString(16).padStart(2, '0')
      );
      return `#${hex.join('').toUpperCase()}`;
    });
    const cmyk = stops.map(([c, m, y, k]) => `C ${c} / M ${m} / Y ${y} / K ${k}`).join(' → ');
    return gradientSwatch(colors, cmyk);
  }

  function section(number, label, title, content) {
    return `<section class="case-section" aria-labelledby="case-title-${number}">
      <p class="case-kicker"><strong>${number}</strong><span>${label}</span></p>
      <h2 id="case-title-${number}">${title}</h2>
      ${content}
    </section>`;
  }

  function media(label, source = '', ratio = '') {
    return `<div class="case-media" role="img" aria-label="${label}" data-source="${source}"${ratio ? ` style="aspect-ratio:${ratio}"` : ''}></div>`;
  }

  function mediaGroup(sources, label) {
    return sources.map((source, index) => media(`${label} ${index + 1}`, source)).join('');
  }

  window.renderProjectCaseStudy = project => {
    const study = caseStudies[project.id];
    if (!study) return false;

    const visuals = document.querySelector('#visuals');
    visuals.closest('#detail').classList.add('case-detail');
    visuals.classList.add('case-study');
    visuals.dataset.projectId = project.id;
    visuals.innerHTML = `
      ${section('01', 'PROCESS', '아이디어 스케치', `
        <div class="case-columns case-process">
          <div class="case-sketches">${mediaGroup(study.sketches, '아이디어 스케치')}</div>
        </div>`)}
      ${section('02', 'DESIGN MEANING', '디자인 의도와 표현', `
        <div class="case-columns case-design">
          <div class="case-cover">${media(project.title.replace(/ 리디자인$/, ''), project.cover, study.coverRatio)}</div>
          <div class="case-split">
            <dl class="case-notes">
              ${study.designNotes.map(([label, text]) => `<dt>${label}</dt><dd>${text}</dd>`).join('')}
            </dl>
            <div class="case-specs">
              <ul class="case-colors">
                ${study.colors.map(color => `<li><span style="background-color:${color}"></span>${color}</li>`).join('')}
                ${study.coverGradient ? `<li title="표지에서 읽은 위·아래 색상"><span class="case-gradient-swatch" style="background-image:url('${project.cover}')"></span>${study.coverGradient.join(' → ')}</li>` : ''}
                ${study.titleGradient ? titleGradient(study.titleGradient) : ''}
                ${study.backgroundGradient ? gradientSwatch(study.backgroundGradient, '포스터 배경의 위에서 아래로 추출한 색상') : ''}
              </ul>
              <p class="case-font"><strong>FONT</strong> ${study.typeface}</p>
            </div>
          </div>
        </div>`)}
    `;

    visuals.querySelectorAll('.case-media[data-source]:not([data-source=""])').forEach(slot => {
      const image = new Image();
      image.alt = slot.getAttribute('aria-label');
      image.decoding = 'async';
      if (slot.closest('.case-sketches')) {
        // assets 폴더 대신 저장소 최상위에 업로드한 스케치도 표시합니다.
        image.addEventListener('error', () => {
          image.src = slot.dataset.source.replace(/^assets\//, '');
        }, { once: true });
      }
      image.addEventListener('load', () => {
        slot.replaceChildren(image);
        slot.removeAttribute('role');
        slot.removeAttribute('aria-label');
        slot.classList.add('has-artwork');
      }, { once: true });
      image.src = slot.dataset.source;
    });
    return true;
  };
})();
