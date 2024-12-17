import React, { useEffect, useRef } from "react";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

const OSMDDisplay = ({ musicXmlUrl, options = {} }) => {
    const containerRef = useRef(null); // DOM 요소 참조
    const osmdRef = useRef(null); // OSMD 인스턴스 참조

    useEffect(() => {
        // OSMD 초기화 및 렌더링
        const initializeOSMD = async () => {
            if (containerRef.current) {
                // OSMD 인스턴스 생성 (기본 옵션 설정)
                osmdRef.current = new OpenSheetMusicDisplay(
                    containerRef.current,
                    options
                );

                try {
                    // MusicXML 파일 로드 및 렌더링
                    await osmdRef.current.load(musicXmlUrl);
                    osmdRef.current.render();
                } catch (error) {
                    console.error("Error loading MusicXML:", error);
                }
            }
        };

        initializeOSMD();

        // 컴포넌트 언마운트 시 정리
        return () => {
            osmdRef.current = null;
        };
    }, [musicXmlUrl, options]); // musicXmlUrl이나 옵션이 변경될 때 다시 렌더링

    return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
};

export default OSMDDisplay;
