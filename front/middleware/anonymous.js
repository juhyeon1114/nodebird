/*
middleware는 컴퓨터 프로그램 사이에서 중간 처리를 하는 프로그램(중간 계층 프로그램)을 말한다.
nuxt는 middleware 디렉토리 내에 존재하는 js파일을 컴포넌트, 레이아웃, 라우터에서 미들웨어로 활용할 수 있도록 지원한다.
*/
export default function({ store, redirect }){
    if(store.state.users.me){
        redirect('/');
    }
}
