// thumbnail: 메인 이미지 / cover: 상세 대표 이미지 / images: 작업물 이미지.
// 이미지가 없으면 빈 문자열을 유지하세요.
window.projects=Array.from({length:6},(_,index)=>({
  id:`project-${index+1}`,title:'',category:'',year:'',thumbnail:'',cover:'',description:'',images:['','','','',''],
  tools: index === 0 ? ['photoshop', 'illustrator'] : [],
}));
