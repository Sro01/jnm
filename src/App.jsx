import React, { useState } from "react";
import OSMDDisplay from "./components/OsmdDisplay";
import Header from "./components/Header";
import "./App.css";

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태
    const [pageType, setPageType] = useState("home"); // 페이지 타입

    // 로그인/로그아웃 버튼 핸들러
    const handleLoginLogout = () => {
        setIsLoggedIn((prev) => !prev);
    };

    return (
        <div className="app-container">
            {/* Header 컴포넌트 */}
            <Header
                isLoggedIn={isLoggedIn}
                pageType={pageType}
                onLoginLogout={handleLoginLogout}
            />

            {/* OSMDDisplay 컴포넌트 */}
            <main className="main-content">
                <div className="osmd-container">
                    <OSMDDisplay
                        musicXmlUrl="./BrahWiMeSample.musicxml"
                        options={{
                            autoResize: true,
                            drawingParameters: "compact", // compact, default, or debug
                        }}
                    />
                </div>
            </main>

            {/* 페이지 상태 변경 버튼 */}
            <div style={{ textAlign: "center", margin: "20px" }}>
                <button onClick={() => setPageType("create")}>
                    악보 생성 페이지
                </button>
                <button onClick={() => setPageType("home")}>
                    홈으로 돌아가기
                </button>
            </div>
        </div>
    );
}

export default App;
