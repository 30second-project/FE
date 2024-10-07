
import Header from "./Header";
import "./css/Page1.css";
import "./css/Page3.css";
import circle3 from '../src/image/page3.png';
import { Link } from 'react-router-dom';
import check from "./image/check.png";
import right from "./image/right.png";
function Page3() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []); 
    return (
        <div>
            <Header />
            <div className="circlezone">
                <img src={circle3} className="circle1" alt="circle1" />
            </div>
            <ul className="circleText">
                <li>01. 정보 입력</li>
                <li className='red'>02. 동의 및 정보 확인</li>
                <li className='red'>03. 출품 완료</li>
            </ul>
            <hr />
            <div className='result'>
                <img src={check}></img>
                <p className="p3-1">출품이 정상적으로 완료되었습니다.</p>
                <p className="p3-2">
                    POBA 30초 모바일 영화제 사이트에 업로드 되기까지 최대 3일 소요됩니다.<br/>
                    기타 문의사항은 02-525-6262로 전화 문의 부탁드립니다.
                </p>
            </div>
            <div className="home">
                "POBA 30초 모바일 영화제" 사이트 바로가기&nbsp;&nbsp;<img src={right}></img>
            </div>
            <Link to="/SubmissionTable"><h2>ex) 관리자 페이지 연결</h2></Link>
        </div>
    );
}

export default Page3;
