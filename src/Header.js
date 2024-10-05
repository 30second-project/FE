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
        </header>
        </div>
    );
}

export default Header;
