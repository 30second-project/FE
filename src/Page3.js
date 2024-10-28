import React, { useEffect } from 'react';
import Header from "./Header";
import "./css/Page1.css";
import "./css/Page3.css";
import circle3 from '../src/image/page3.png';
import check from "./image/check.png";
import right from "./image/right.png";
import { useLocation, useNavigate } from 'react-router-dom';

function Page3() {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);

        const handlePopState = (event) => {
            // 이전 페이지로 돌아가는 경우에만 경고 메시지 표시
            if (event.state) {
                alert('세션이 만료되었습니다. 새로고침해주세요.');
                navigate(location.pathname); // 같은 경로로 되돌리기
            }
        };

        // popstate 이벤트 리스너 추가
        window.addEventListener('popstate', handlePopState);

        // 컴포넌트 언마운트 시 이벤트 제거
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [navigate, location.pathname]);

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
                <img src={check} alt="Check" />
                <p className="p3-1">출품이 정상적으로 완료되었습니다.</p>
                <p className="p3-2">
                    <div className="Rfont">
                        <div className="result-box1">
                            <span className='re_br'>출품 적합 여부 확인 후 업로드가 진행됩니다.&nbsp;&nbsp;</span>
                            상영사이트에 업로드 되기까지 최대 3일 소요됩니다.<br />
                        </div>
                        <span className='re_br'>기타 문의사항이 있다면,&nbsp;&nbsp;</span>
                        다누림 문화복지서비스 운영사무국(02-525-6262)으로
                        전화 부탁드립니다.
                    </div>


                </p>
            </div>
            <a href="https://poba30.com">
                <div className="home">
                    상영사이트 바로가기 &nbsp;&nbsp;<img src={right} alt="Right Arrow" />
                </div>
            </a>
        </div>
    );
}

export default Page3;
