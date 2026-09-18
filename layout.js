document.addEventListener("DOMContentLoaded", () => {
    // 1. 自動為全站注入校徽 Favicon
    (function injectFavicon() {
        let favicon = document.querySelector("link[rel*='icon']");
        if (!favicon) {
            favicon = document.createElement('link');
            favicon.rel = 'icon';
            favicon.type = 'image/x-icon';
            document.head.appendChild(favicon);
        }
        favicon.href = 'logo.png';
    })();

    // 2. Load Header
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("site-header").innerHTML = data;
            
            // Highlight active link automatically
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            const navLinks = document.querySelectorAll("nav a");
            navLinks.forEach(link => {
                if (link.getAttribute("href") === currentPath) {
                    link.classList.add("active");
                }
            });
        });

    // 3. Load Footer & 動態控制首頁與其他頁面的對齊方式
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("site-footer").innerHTML = data;
            
            // 判斷當前頁面：若為首頁，則將聯絡資訊改為靠左對齊；其餘頁面維持預設居中
            const currentPath = window.location.pathname.split("/").pop() || "index.html";
            if (currentPath === "index.html" || currentPath === "index_2.html" || currentPath === "") {
                const containerBox = document.getElementById("footer-container-box");
                const rowBox = document.getElementById("footer-row-box");
                
                if (containerBox) {
                    containerBox.style.justifyContent = "flex-start";
                    containerBox.style.textAlign = "left";
                }
                if (rowBox) {
                    rowBox.style.justifyContent = "flex-start";
                }
            }
        });

    // 4. 全站自動注入 Back to Top 功能與樣式
    (function initBackToTop() {
        // 動態注入 CSS 樣式
        const style = document.createElement('style');
        style.innerHTML = `
            .back-to-top-btn {
                position: fixed;
                bottom: 90px; /* 已上調至 90px，避免覆蓋校歌音樂面板 */
                right: 30px;
                width: 45px;
                height: 45px;
                background-color: #ffffff; /* 白底 */
                color: #003366; /* 鳴遠藍箭嘴 */
                border: 2px solid #d4af37; /* 聖潔金邊框 */
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.2rem;
                cursor: pointer;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                z-index: 9999;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            }
            .back-to-top-btn:hover {
                background-color: #003366;
                color: #ffffff;
                transform: translateY(-5px);
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
            }
            .back-to-top-btn.show {
                opacity: 1;
                visibility: visible;
            }
            @media (max-width: 768px) {
                .back-to-top-btn {
                    bottom: 90px;
                    right: 15px;
                }
            }
        `;
        document.head.appendChild(style);

        // 動態建立 HTML 按鈕按鍵
        const backBtn = document.createElement('button');
        backBtn.className = 'back-to-top-btn';
        backBtn.setAttribute('title', '返回頂部');
        backBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
        document.body.appendChild(backBtn);

        // 監聽滾動事件（滾動超過 300px 時顯示）
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backBtn.classList.add('show');
            } else {
                backBtn.classList.remove('show');
            }
        });

        // 點擊滑動回頂部
        backBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    })();
});