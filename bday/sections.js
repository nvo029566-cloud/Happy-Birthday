/* =========================================================
   NỘI DUNG CÁC PHẦN CUỘN XUỐNG — chỉ cần sửa phần này
   (dùng chung CONFIG.ten, Confetti từ script.js)
   ========================================================= */
const NOI_DUNG = {
    // 1. Album: bỏ ảnh vào thư mục images/album/ rồi sửa tên file + chú thích
    album: [
        { anh: "./images/album/1.jpg", chuThich: "Hồi mới quen, còn ngại ngùng" },
        { anh: "./images/album/2.jpg", chuThich: "Chuyến đi chơi cả nhóm" },
        { anh: "./images/album/3.jpg", chuThich: "Ảnh dìm huyền thoại" },
        { anh: "./images/album/4.jpg", chuThich: "Chầu lẩu no căng" },
        { anh: "./images/album/5.jpg", chuThich: "Chạy deadline cùng nhau" },
        { anh: "./images/album/6.jpg", chuThich: "Sinh nhật năm ngoái" }
    ],

    // 2. Dòng thời gian
    dongThoiGian: [
        { ngay: "05/09/2021", tieuDe: "Ngày đầu làm quen", moTa: "Ngồi cạnh nhau, mượn cái bút, thế là thành bạn." },
        { ngay: "20/11/2021", tieuDe: "Lần đầu đi chơi", moTa: "Hẹn 7h, 8h rưỡi mới đi. Từ đó biết cậu hay trễ." },
        { ngay: "15/04/2022", tieuDe: "Lần đầu giận nhau", moTa: "Giận được đúng hai ngày rồi lại rủ nhau đi ăn." },
        { ngay: "26/10/2025", tieuDe: "Sinh nhật năm ngoái", moTa: "Cả nhóm hát lệch tông nhưng vẫn vui." },
        { ngay: "Hôm nay", tieuDe: "Tuổi mới của cậu", moTa: "Còn nhiều kèo nữa đang chờ mình đi tiếp." }
    ],

    // 3. Bộ đếm: ngày bắt đầu quen (dd/mm/yyyy)
    ngayQuen: "05/09/2021",

    // 4. Thẻ lật
    tieuDeTheLat: "Những điều tớ quý ở cậu",
    theLat: [
        "Lúc nào cũng rủ là đi",
        "Nghe tớ than mà không phán xét",
        "Cười to nhất nhóm",
        "Nhớ cả mấy chuyện nhỏ xíu của tớ",
        "Lầy nhưng rất tình cảm",
        "Có chuyện là có mặt"
    ],

    // 5. Thẻ cào
    theCao: [
        "1 ly trà sữa, tớ bao full topping",
        "1 buổi nghe cậu than không ngắt lời",
        "1 kèo đi chơi, cậu chọn chỗ"
    ],

    // 6. Hộp quà
    soLanBamHop: 5,
    loiTrongHop: "Quà thật tớ giữ rồi, gặp nhau mới đưa nha 🎁",

    // 7. Câu đố: dung = số thứ tự đáp án đúng (bắt đầu từ 0)
    cauDo: [
        { hoi: "Mình quen nhau ở đâu?", chon: ["Lớp học", "Chỗ làm", "Trên mạng", "Đi du lịch"], dung: 0 },
        { hoi: "Món tủ của nhóm mình?", chon: ["Trà sữa", "Lẩu", "Bánh tráng trộn", "Ốc"], dung: 1 },
        { hoi: "Ai hay đến trễ nhất?", chon: ["Tớ", "Cậu", "Cả hai", "Không ai"], dung: 1 }
    ],
    loiBiMat: "Đúng hết luôn, đúng là bạn thân!\nPhần thưởng: tớ bao cậu một chầu tuỳ chọn 🍜",

    // 8. Màn kết
    loiKet: "Cảm ơn cậu vì đã làm bạn với tớ suốt thời gian qua. Chúc cậu tuổi mới rực rỡ, và mình còn đi với nhau thêm nhiều năm nữa.",
    kyTenKet: "Bạn thân của cậu ✌"
};

/* ========================================================= */
(() => {
const q = (s, r = document) => r.querySelector(s);
const qa = (s, r = document) => [...r.querySelectorAll(s)];
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const boom = (el, n = 90) => {
    if (typeof Confetti === "undefined") return;
    const r = el.getBoundingClientRect();
    Confetti.burst(r.left + r.width / 2, r.top + r.height / 2, n);
};

/* hiện dần khi cuộn tới */
const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
}, { threshold: 0.2 });
function reveal(el) { el.classList.add("reveal"); io.observe(el); }
qa(".sec__title").forEach(reveal);

/* ---------- 1. ALBUM ---------- */
const album = q("#album__list");
const lb = q("#lightbox");
NOI_DUNG.album.forEach((a, i) => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.tabIndex = 0;
    fig.style.setProperty("--r", (i % 2 ? 3 : -3) + "deg");
    fig.style.setProperty("--d", (i * -0.4) + "s");
    const img = document.createElement("img");
    img.src = a.anh;
    img.alt = a.chuThich;
    img.loading = "lazy";
    img.onerror = () => {
        const e = document.createElement("div");
        e.className = "empty";
        e.textContent = "Ảnh " + (i + 1);
        img.replaceWith(e);
        fig.dataset.empty = "1";
    };
    const cap = document.createElement("figcaption");
    cap.textContent = a.chuThich;
    fig.append(img, cap);
    const open = () => {
        if (fig.dataset.empty) return;
        q("#lightbox__img").src = a.anh;
        q("#lightbox__cap").textContent = a.chuThich;
        lb.classList.add("open");
        lb.setAttribute("aria-hidden", "false");
    };
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", e => { if (e.key === "Enter") open(); });
    album.appendChild(fig);
});
const setLine = () => album.style.setProperty("--line-w", album.scrollWidth + "px");
window.addEventListener("load", setLine);
window.addEventListener("resize", setLine);
setLine();
const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
q(".close", lb).addEventListener("click", closeLb);
lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

/* ---------- 2. DÒNG THỜI GIAN ---------- */
const tl = q("#timeline__list");
NOI_DUNG.dongThoiGian.forEach(t => {
    const li = document.createElement("li");
    li.className = "tl__item";
    li.innerHTML = `<div class="tl__card"><span class="tl__date"></span><h3></h3><p></p></div>`;
    q(".tl__date", li).textContent = t.ngay;
    q("h3", li).textContent = t.tieuDe;
    q("p", li).textContent = t.moTa;
    tl.appendChild(li);
    reveal(li);
});

/* ---------- 3. BỘ ĐẾM ---------- */
(function counter() {
    const [d, m, y] = NOI_DUNG.ngayQuen.split("/").map(Number);
    const since = new Date(y, m - 1, d);
    q("#counter__since").textContent = `Kể từ ${NOI_DUNG.ngayQuen} — và vẫn đang đếm tiếp`;
    const el = u => q(`#counter__box [data-u="${u}"]`);
    const tick = () => {
        let s = Math.max(0, Math.floor((Date.now() - since) / 1000));
        const days = Math.floor(s / 86400); s %= 86400;
        el("d").textContent = days.toLocaleString("vi-VN");
        el("h").textContent = String(Math.floor(s / 3600)).padStart(2, "0");
        el("m").textContent = String(Math.floor(s % 3600 / 60)).padStart(2, "0");
        el("s").textContent = String(s % 60).padStart(2, "0");
    };
    tick();
    setInterval(tick, 1000);
})();

/* ---------- 4. THẺ LẬT ---------- */
q("#flip__title").textContent = NOI_DUNG.tieuDeTheLat;
const grid = q("#flip__grid");
let flippedCount = 0;
NOI_DUNG.theLat.forEach((t, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "flipcard";
    b.setAttribute("aria-label", "Lá bài số " + (i + 1));
    b.innerHTML = `<span class="flipcard__face flipcard__front"><b>${i + 1}</b></span><span class="flipcard__face flipcard__back"></span>`;
    q(".flipcard__back", b).textContent = t;
    b.addEventListener("click", () => {
        const was = b.classList.contains("flipped");
        b.classList.toggle("flipped");
        if (!was && !b.dataset.seen) {
            b.dataset.seen = "1";
            if (++flippedCount === NOI_DUNG.theLat.length) setTimeout(() => boom(grid, 120), 500);
        }
    });
    grid.appendChild(b);
});

/* ---------- 5. THẺ CÀO ---------- */
const sg = q("#scratch__grid");
NOI_DUNG.theCao.forEach((t, i) => {
    const card = document.createElement("div");
    card.className = "scratchcard";
    card.innerHTML = `<div class="scratchcard__prize"><div><small>Phiếu số ${i + 1}</small></div></div><canvas></canvas>`;
    q(".scratchcard__prize > div", card).append(document.createTextNode(t));
    sg.appendChild(card);
    const cv = q("canvas", card);
    const ctx = cv.getContext("2d");
    let drawing = false, done = false, moves = 0;

    let lastW = 0;
    function paint() {
        if (done || card.clientWidth === lastW) return; // tránh xoá lớp bạc khi thanh địa chỉ mobile co giãn
        lastW = card.clientWidth;
        const w = card.clientWidth, h = card.clientHeight, dpr = window.devicePixelRatio || 1;
        cv.width = w * dpr; cv.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.globalCompositeOperation = "source-over";
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, "#c9c9d1"); g.addColorStop(.5, "#eeeef3"); g.addColorStop(1, "#b5b5bf");
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(255,255,255,.5)";
        for (let k = 0; k < 40; k++) ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
        ctx.fillStyle = "#555";
        ctx.font = "18px Sriracha, cursive";
        ctx.textAlign = "center";
        ctx.fillText("Cào ở đây ✦", w / 2, h / 2 + 6);
    }
    function scratch(e) {
        if (!drawing || done) return;
        const r = cv.getBoundingClientRect();
        const x = e.clientX - r.left, y = e.clientY - r.top;
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(x, y, 20, 0, Math.PI * 2);
        ctx.fill();
        if (++moves % 12 === 0) check();
    }
    function check() {
        const data = ctx.getImageData(0, 0, cv.width, cv.height).data;
        let clear = 0, total = 0;
        for (let k = 3; k < data.length; k += 4 * 40) { total++; if (data[k] === 0) clear++; }
        if (clear / total > 0.5) {
            done = true;
            card.classList.add("done");
            boom(card, 70);
        }
    }
    cv.addEventListener("pointerdown", e => { drawing = true; cv.setPointerCapture(e.pointerId); scratch(e); });
    cv.addEventListener("pointermove", scratch);
    cv.addEventListener("pointerup", () => { drawing = false; });
    cv.addEventListener("pointercancel", () => { drawing = false; });
    paint();
    window.addEventListener("resize", paint);
    if (document.fonts) document.fonts.ready.then(() => { if (!moves) { lastW = 0; paint(); } });
});

/* ---------- 6. HỘP QUÀ ---------- */
const box = q("#giftbox");
const hint = q("#gift__hint");
const need = Math.max(1, NOI_DUNG.soLanBamHop | 0);
let taps = 0;
const setHint = () => {
    hint.textContent = taps === 0 ? `Bấm vào hộp ${need} lần để mở` : `Còn ${need - taps} lần nữa…`;
};
setHint();
box.addEventListener("click", () => {
    if (box.classList.contains("open")) return;
    taps++;
    box.style.setProperty("--amp", (4 + taps * 3) + "deg");
    box.classList.remove("shake");
    void box.offsetWidth;
    box.classList.add("shake");
    if (taps >= need) {
        setTimeout(() => {
            box.classList.remove("shake");
            box.classList.add("open");
            hint.textContent = "Mở rồi nè!";
            const res = q("#gift__result");
            res.textContent = NOI_DUNG.loiTrongHop;
            requestAnimationFrame(() => res.classList.add("show"));
            boom(box, 140);
        }, 450);
    } else setHint();
});

/* ---------- 7. CÂU ĐỐ ---------- */
const quiz = q("#quiz__box");
let qi = 0;
function renderQ() {
    const c = NOI_DUNG.cauDo[qi];
    quiz.innerHTML = `<p class="quiz__progress">Câu ${qi + 1}/${NOI_DUNG.cauDo.length}</p><p class="quiz__q"></p><div class="quiz__opts"></div><p class="quiz__feedback" aria-live="polite"></p>`;
    q(".quiz__q", quiz).textContent = c.hoi;
    const opts = q(".quiz__opts", quiz);
    const fb = q(".quiz__feedback", quiz);
    c.chon.forEach((t, k) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = t;
        b.addEventListener("click", () => {
            if (k === c.dung) {
                b.classList.add("right");
                fb.textContent = "Chính xác!";
                qa("button", opts).forEach(x => x.disabled = true);
                setTimeout(() => { qi++; qi < NOI_DUNG.cauDo.length ? renderQ() : finishQuiz(); }, 800);
            } else {
                b.classList.remove("wrong"); void b.offsetWidth; b.classList.add("wrong");
                fb.textContent = "Sai rồi, thử lại nha :)";
            }
        });
        opts.appendChild(b);
    });
}
function finishQuiz() {
    quiz.innerHTML = `<div class="quiz__secret"><h3>Mở khoá lời nhắn!</h3><p></p></div>`;
    q(".quiz__secret p", quiz).textContent = NOI_DUNG.loiBiMat;
    boom(quiz, 120);
}
if (NOI_DUNG.cauDo.length) renderQ();

/* ---------- 8. MÀN KẾT ---------- */
const finale = q("#finale");
q("#finale__name").textContent = typeof CONFIG !== "undefined" ? CONFIG.ten : "";
q("#finale__msg").textContent = NOI_DUNG.loiKet;
q("#finale__sign").textContent = NOI_DUNG.kyTenKet;

// đèn trời
const layer = q("#lanterns");
function lantern(text, x) {
    const el = document.createElement("div");
    el.className = "lantern";
    el.style.left = (x ?? (8 + Math.random() * 84)) + "%";
    el.style.setProperty("--dur", (text ? 14 : 10 + Math.random() * 6) + "s");
    el.style.setProperty("--rise", (finale.offsetHeight + 150) + "px");
    el.innerHTML = `<span class="lantern__sway"><span class="lantern__body"></span></span>`;
    if (text) {
        const w = document.createElement("span");
        w.className = "lantern__wish";
        w.textContent = text;
        q(".lantern__sway", el).appendChild(w);
    }
    if (!text) q(".lantern__body", el).style.zoom = (0.55 + Math.random() * 0.4).toFixed(2);
    el.addEventListener("animationend", ev => { if (ev.animationName === "rise") el.remove(); });
    layer.appendChild(el);
}
q("#wish__form").addEventListener("submit", e => {
    e.preventDefault();
    const inp = q("#wish__input");
    const t = inp.value.trim() || "Điều ước bí mật ✨";
    lantern(t, 35 + Math.random() * 30);
    inp.value = "";
});

// pháo hoa
const fw = (() => {
    const cv = q("#fireworks");
    const ctx = cv.getContext("2d");
    const hues = ["#ff7882", "#ffd23f", "#ffffff", "#9be3ff", "#ff9d4d", "#f7a8ff"];
    let rockets = [], sparks = [], running = false, W = 0, H = 0;
    const size = () => {
        const dpr = window.devicePixelRatio || 1;
        W = finale.clientWidth; H = finale.clientHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();
    window.addEventListener("resize", size);

    function launch() {
        rockets.push({
            x: W * (0.15 + Math.random() * 0.7), y: H,
            ty: H * (0.12 + Math.random() * 0.3),
            c: hues[(Math.random() * hues.length) | 0]
        });
        if (!running) { running = true; requestAnimationFrame(loop); }
    }
    function explode(r) {
        const n = 60 + (Math.random() * 30 | 0);
        for (let i = 0; i < n; i++) {
            const a = (Math.PI * 2 * i) / n, v = 2 + Math.random() * 3.5;
            sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, c: r.c, life: 70 + Math.random() * 30 });
        }
    }
    function loop() {
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "rgba(0,0,0,.22)";
        ctx.fillRect(0, 0, W, H);
        ctx.globalCompositeOperation = "lighter";
        rockets = rockets.filter(r => {
            r.y -= 7;
            ctx.fillStyle = r.c;
            ctx.fillRect(r.x - 1.5, r.y, 3, 10);
            if (r.y <= r.ty) { explode(r); return false; }
            return true;
        });
        sparks = sparks.filter(p => {
            p.vy += 0.045; p.vx *= 0.985; p.vy *= 0.985;
            p.x += p.vx; p.y += p.vy; p.life--;
            ctx.globalAlpha = Math.max(0, p.life / 90);
            ctx.fillStyle = p.c;
            ctx.beginPath(); ctx.arc(p.x, p.y, 2, 0, Math.PI * 2); ctx.fill();
            ctx.globalAlpha = 1;
            return p.life > 0;
        });
        if (rockets.length || sparks.length) requestAnimationFrame(loop);
        else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    return { launch, size };
})();

q("#fw__btn").addEventListener("click", () => {
    for (let i = 0; i < 5; i++) setTimeout(fw.launch, i * 220);
});

// tự bắn pháo hoa & thả đèn khi cuộn tới màn kết
let autoTimer = null;
new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !reduce) {
        fw.size();
        if (!autoTimer) {
            for (let i = 0; i < 4; i++) setTimeout(() => lantern(), i * 900);
            autoTimer = setInterval(() => {
                fw.launch();
                if (Math.random() < .35 && layer.children.length < 12) lantern();
            }, 1100);
        }
    } else if (autoTimer) {
        clearInterval(autoTimer);
        autoTimer = null;
    }
}, { threshold: 0.35 }).observe(finale);
})();