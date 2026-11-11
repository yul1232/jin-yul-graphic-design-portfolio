// thumbnail: 메인 이미지 / cover: 상세 대표 이미지 / images: 작업물 이미지.
// 이미지가 없으면 빈 문자열을 유지하세요.
const projectCovers = [
  'assets/snowman-book-cover.png',
  'assets/catcher-in-the-rye-cover.png',
  'assets/great-gatsby-cover-preview.png',
  'assets/kaguya-poster-preview.png',
  'assets/seorin-logo.png',
];
const projectToolKeys = [
  ['photoshop', 'illustrator'], // 프로젝트 1
  ['photoshop', 'illustrator'], // 프로젝트 2
  ['photoshop', 'illustrator'], // 프로젝트 3
  ['photoshop', 'illustrator'], // 프로젝트 4
  ['photoshop', 'illustrator'], // 프로젝트 5
];
const galleryImages = {
  'assets/kaguya-poster-preview.png': 'assets/kaguya-poster-gallery.jpg',
  'assets/seorin-logo.png': 'assets/seorin-logo-gallery.png',
};

window.projects=projectCovers.map((cover,index)=>({
  id:`project-${index+1}`,category:'',year:'',images:['','','','',''],
  title: [
    '눈사람 자살 사건 북커버 리디자인',
    '호밀밭의 파수꾼 북커버 리디자인',
    '위대한 개츠비 북커버 리디자인',
    '가구야 공주 이야기 영화 포스터 리디자인',
    '서린(SEORIN) 스킨케어 브랜드 로고 디자인',
  ][index] || '',
  description: [
    '최승호의 우화집 『눈사람 자살 사건』을 새롭게 해석한 북커버 리디자인 프로젝트입니다. 우화집의 대표 작품인 「눈사람 자살 사건」을 중심으로 작품의 내용을 시각화하고, 책의 분위기와 특징을 전달하는 데 중점을 두었다.',
    'J. D. 샐린저의 소설 『호밀밭의 파수꾼』을 새로운 시각으로 재구성한 북커버 리디자인 프로젝트다. 작품의 주요 특징을 분석하고 이를 시각적으로 재해석해 기존과는 다른 분위기의 표지를 제작하였다.',
    '소설 『위대한 개츠비』의 핵심 소재인 부와 인물 데이지의 관계에 주목한 북커버 리디자인 프로젝트이다. 부를 상징하는 노란색과 데이지꽃을 중심으로, 작품 속 사랑과 물질적 가치관의 대비를 시각적으로 표현했다.',
    '스튜디오 지브리의 애니메이션 영화 『가구야 공주 이야기』를 재해석한 영화 포스터 디자인 프로젝트이다. 작품 특유의 서정적인 분위기를 바탕으로 색채와 이미지, 타이포그래피를 조화롭게 구성해 영화의 시각적 특징을 전달하고자 했다.',
    '스킨케어 브랜드 ‘서린(SEORIN)’의 브랜드 아이덴티티를 구축하기 위한 로고 디자인 프로젝트이다. 수분과 피부의 균형, 편안함을 핵심 가치로 설정하고, 브랜드의 특징을 간결하면서도 세련된 시각적 언어로 표현하고자 했다.',
  ][index] || '',
  thumbnail: galleryImages[cover] || cover,
  cover: cover || '',
  showTools: index < 5,
  tools: projectToolKeys[index] || [],
}));
