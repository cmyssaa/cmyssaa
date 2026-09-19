document.addEventListener("DOMContentLoaded", () => {
    const siteRoot = getSiteRoot();

    injectMetaThemeColor();
    injectCanonicalLink();
    injectStylesheet("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css");
    injectFavicon(siteRoot);

    const headerHost = document.getElementById("site-header");
    if (headerHost) {
        fetch(siteRoot + "header.html")
            .then((res) => res.text())
            .then((data) => {
                headerHost.innerHTML = data;
                rewriteRootLinks(headerHost, siteRoot);
                highlightActiveNav();
                initMobileNav();
            })
            .catch(() => {
                headerHost.innerHTML = '<nav class="noscript-fallback"><a href="' + siteRoot + 'index.html">首頁</a></nav>';
            });
    }

    const footerHost = document.getElementById("site-footer");
    if (footerHost) {
        fetch(siteRoot + "footer.html")
            .then((res) => res.text())
            .then((data) => {
                footerHost.innerHTML = data;
                rewriteRootLinks(footerHost, siteRoot);
            });
    }

    initBackToTop();
});

function getSiteRoot() {
    const script = document.querySelector("script[src*='layout.js']");
    if (script && script.src) {
        return script.src.replace(/layout\.js(?:\?.*)?$/, "");
    }
    return new URL("./", window.location.href).href;
}

function injectStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
}

function injectCanonicalLink() {
    if (document.querySelector("link[rel='canonical']")) return;
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = new URL(window.location.pathname + window.location.search, window.location.origin).href;
    document.head.appendChild(canonical);
}

function injectMetaThemeColor() {
    if (!document.querySelector("meta[name='theme-color']")) {
        const meta = document.createElement("meta");
        meta.name = "theme-color";
        meta.content = "#003366";
        document.head.appendChild(meta);
    }
}

function injectFavicon(siteRoot) {
    let favicon = document.querySelector("link[rel*='icon']");
    if (!favicon) {
        favicon = document.createElement("link");
        favicon.rel = "icon";
        favicon.type = "image/png";
        document.head.appendChild(favicon);
    }
    if (!favicon.getAttribute("href")) {
        favicon.href = siteRoot + "logo.png";
    }
}

function rewriteRootLinks(root, siteRoot) {
    root.querySelectorAll("a[href]").forEach((link) => {
        const href = link.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#") || href.startsWith("?")) {
            return;
        }
        link.setAttribute("href", new URL(href, siteRoot).href);
    });
    root.querySelectorAll("img[src]").forEach((img) => {
        const src = img.getAttribute("src");
        if (!src || src.startsWith("http") || src.startsWith("data:")) return;
        img.setAttribute("src", new URL(src, siteRoot).href);
    });
}

function highlightActiveNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll("#site-nav a").forEach((link) => {
        const hrefPath = (link.getAttribute("href") || "").split("/").pop().split("?")[0];
        if (hrefPath === currentPath) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        }
    });
}

function initMobileNav() {
    const nav = document.getElementById("site-nav");
    if (!nav) return;

    nav.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            nav.classList.remove("is-open");
        });
    });
}

function initBackToTop() {
    const backBtn = document.createElement("button");
    backBtn.type = "button";
    backBtn.className = "back-to-top-btn";
    backBtn.setAttribute("title", "返回頂部");
    backBtn.setAttribute("aria-label", "返回頂部");
    backBtn.innerHTML = '<i class="fa-solid fa-arrow-up" aria-hidden="true"></i>';
    document.body.appendChild(backBtn);

    window.addEventListener("scroll", () => {
        backBtn.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });

    backBtn.addEventListener("click", () => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
}
