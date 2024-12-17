import React, { useState } from "react";
import PropTypes from "prop-types";
import "./Header.css"; // CSS 스타일 분리

const Header = ({ isLoggedIn, pageType, onLoginLogout }) => {
    const [title, setTitle] = useState("악보솔솔");

    // 페이지 상태에 따라 타이틀 변경
    React.useEffect(() => {
        if (pageType === "create") {
            setTitle("악보뚝딱");
        } else {
            setTitle("악보솔솔");
        }
    }, [pageType]);

    return (
        <header className="header">
            {/* 로고 */}
            <div className="header__logo">
                <img src="/logo.png" alt="Logo" />
            </div>

            {/* 타이틀 */}
            <h1 className="header__title">{title}</h1>

            {/* 우측 버튼 */}
            <div className="header__actions">
                {isLoggedIn ? (
                    <a href="/mypage" className="header__mypage">
                        <img src="/mypage-icon.png" alt="My Page" />
                    </a>
                ) : (
                    <button onClick={onLoginLogout} className="header__login">
                        로그인/로그아웃
                    </button>
                )}
            </div>
        </header>
    );
};

Header.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired, // 로그인 상태
    pageType: PropTypes.string.isRequired, // 페이지 타입 ("create"인 경우 변경)
    onLoginLogout: PropTypes.func.isRequired, // 로그인/로그아웃 버튼 핸들러
};

export default Header;
