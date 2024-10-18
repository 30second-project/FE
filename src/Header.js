import DropFileInput from "./components/drop-file-input/DropFileInput";
import "../src/css/Header.css";
import logo1 from './image/로고 1.png';
import logo2 from './image/로고 2.png';
import logo3 from './image/로고 3.png';
function Header() {
    return (
        <div>
        <header>
            <ul>
                <li><img src={logo1}></img></li>
                <li><img src={logo2} className="main"></img></li>
                <li><img src={logo3}></img></li>
            </ul>
            <h1 className="header-title">출품하기</h1>
            <p className="header-font">출품 순서에 따라 상영 사이트에 업로드되며, 빠르게 출품하시면 더 많은 노출 기회를 얻으실 수 있습니다.<br/>
영화제 기간 내 모든 작품은 카테고리별, 최신별, 인기순별 등 다양한 방식으로 소개가 될 예정이니 많은 참여 부탁드립니다.

</p>
        </header>
        </div>
    );
}

export default Header;
