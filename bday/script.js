/* =========================================================
   CẤU HÌNH — chỉ cần sửa phần này
   ========================================================= */
const CONFIG = {
    ten: "Yenaiti",                 // tên hiện dưới ảnh
    ngaySinh: "26/10/2003",         // dd/mm/yyyy
    anh: "./images/avatar.jpg",     // ảnh đại diện
    chuVong: "happy-birthday-",     // chữ chạy trên vòng tròn xoay
    tieuDeThu: "Gửi cậu :)))",
    noiDungThu: [
        "Chúc mừng sinh nhật cậu nha!",
        "Tuổi mới chúc cậu khoẻ re, làm gì cũng suôn sẻ, tiền vào như nước, deadline thì ít lại. Mong cậu lúc nào cũng vui như hồi mình ngồi cười mấy chuyện nhảm nhí với nhau.",
        "Cảm ơn cậu vì đã là đứa bạn chịu nghe tớ than đủ thứ trên đời. Hôm nay là ngày của cậu, cứ quẩy hết mình đi 🎉"
    ],
    kyTen: "— Đứa bạn lầy nhất của cậu",
    soNen: 5,                       // số cây nến trên bánh (1–7)
    tuDongBatNhac: true,            // nhạc bật khi chạm "Mở quà"
    nhac: "./music/nhac.mp3",       // file nhạc của bạn (để "" nếu muốn dùng nhạc hộp nhạc có sẵn)
    nhacBatDauTuGiay: 0             // bắt đầu phát từ giây thứ mấy của bài
};

/* =========================================================
   TIỆN ÍCH
   ========================================================= */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const isMobile = () => window.innerWidth <= 768;
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function svgIcon(id, cls = "") {
    const ns = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(ns, "svg");
    svg.setAttribute("class", "ico " + cls);
    const use = document.createElementNS(ns, "use");
    use.setAttribute("href", "#" + id);
    svg.appendChild(use);
    return svg;
}

/* Bộ hẹn giờ gom nhóm để huỷ sạch khi đóng */
function timerGroup() {
    const ids = [];
    return {
        timeout(fn, ms) { const id = setTimeout(fn, ms); ids.push(id); return id; },
        interval(fn, ms) { const id = setInterval(fn, ms); ids.push(id); return id; },
        clear() { ids.forEach(id => { clearTimeout(id); clearInterval(id); }); ids.length = 0; }
    };
}

/* Gõ chữ từng ký tự */
function typeText(el, text, speed, timers, onDone) {
    let i = 0;
    const chars = [...text]; // tách đúng emoji
    const id = timers.interval(() => {
        if (i < chars.length) { el.textContent += chars[i++]; }
        else { clearInterval(id); onDone && onDone(); }
    }, speed);
    return id;
}

/* =========================================================
   KHỞI TẠO NỘI DUNG
   ========================================================= */
const [dd, mm, yyyy] = CONFIG.ngaySinh.split("/").map(n => parseInt(n, 10));
const pad = n => String(n).padStart(2, "0");
const dateText = `${pad(dd)} / ${pad(mm)} / ${yyyy}`;
const age = new Date().getFullYear() - yyyy;

$("#name").textContent = CONFIG.ten;
$("#avatar").src = CONFIG.anh;
document.title = `Happy birthday ${CONFIG.ten}`;
if (age > 0 && age < 120) {
    $("#age").innerHTML = `Tròn <b>${age}</b> tuổi rồi nha`;
}

// chữ trên vòng tròn
(function buildCircle() {
    const wrap = $("#text__cricle");
    const chars = [...CONFIG.chuVong];
    wrap.style.setProperty("--step", (360 / chars.length) + "deg");
    chars.forEach((c, i) => {
        const s = document.createElement("span");
        s.style.setProperty("--i", i);
        s.textContent = c;
        wrap.appendChild(s);
    });
})();

/* =========================================================
   INTRO: gõ ngày sinh + nút bỏ qua
   ========================================================= */
const introTimers = timerGroup();
let dateTyped = false;

function typeDate(speed = 90) {
    if (dateTyped) return;
    dateTyped = true;
    const box = $(".date__of__birth");
    const span = $(".date__of__birth span");
    span.textContent = "";
    typeText(span, dateText, speed, introTimers, () => {
        box.prepend(svgIcon("i-star"));
        box.appendChild(svgIcon("i-star"));
    });
    // mobile: ngày & tháng hai bên ảnh
    if (isMobile()) {
        const d = $(".day"), m = $(".month");
        d.textContent = ""; m.textContent = "";
        typeText(d, pad(dd), 200, introTimers);
        introTimers.timeout(() => typeText(m, pad(mm), 200, introTimers), 600);
    }
}

const skipBtn = $("#btn__skip");
function endIntro() { skipBtn.classList.add("hidden"); }

function startIntro() {
    if (reduceMotion) {
        typeDate(0);
        endIntro();
    } else {
        introTimers.timeout(() => typeDate(), isMobile() ? 4000 : 5800);
        introTimers.timeout(endIntro, isMobile() ? 6500 : 8200);
    }
}

skipBtn.addEventListener("click", () => {
    if (document.getAnimations) {
        document.getAnimations().forEach(a => {
            const t = a.effect && a.effect.getTiming();
            if (!t) return;
            if (t.iterations === Infinity) {
                if (a.currentTime < t.delay) a.currentTime = t.delay;
            } else {
                a.finish();
            }
        });
    }
    if (!dateTyped) typeDate(20);
    endIntro();
});

/* =========================================================
   CONFETTI
   ========================================================= */
const Confetti = (() => {
    const cv = $("#confetti");
    const ctx = cv.getContext("2d");
    const colors = ["#ff7882", "#F61F1F", "#ffd23f", "#ffffff", "#333333", "#fbb6c0"];
    let parts = [], running = false, W = 0, H = 0;

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        W = window.innerWidth; H = window.innerHeight;
        cv.width = W * dpr; cv.height = H * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    function heart(x, y, s) {
        ctx.beginPath();
        ctx.moveTo(x, y + s * .3);
        ctx.bezierCurveTo(x, y, x - s * .5, y, x - s * .5, y + s * .3);
        ctx.bezierCurveTo(x - s * .5, y + s * .6, x, y + s * .8, x, y + s);
        ctx.bezierCurveTo(x, y + s * .8, x + s * .5, y + s * .6, x + s * .5, y + s * .3);
        ctx.bezierCurveTo(x + s * .5, y, x, y, x, y + s * .3);
        ctx.fill();
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        parts = parts.filter(p => p.y < H + 40 && p.life > 0);
        parts.forEach(p => {
            p.vy += 0.12; p.vx *= 0.99; p.vy *= 0.99;
            p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life--;
            ctx.save();
            ctx.globalAlpha = Math.min(1, p.life / 40);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.c;
            if (p.shape === 0) ctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2);
            else if (p.shape === 1) { ctx.beginPath(); ctx.arc(0, 0, p.s / 3, 0, Math.PI * 2); ctx.fill(); }
            else heart(0, -p.s / 2, p.s);
            ctx.restore();
        });
        if (parts.length) requestAnimationFrame(loop);
        else { running = false; ctx.clearRect(0, 0, W, H); }
    }

    function burst(x = W / 2, y = H / 2, n = 120) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
            const a = Math.random() * Math.PI * 2;
            const v = 4 + Math.random() * 8;
            parts.push({
                x, y,
                vx: Math.cos(a) * v, vy: Math.sin(a) * v - 5,
                s: 8 + Math.random() * 8,
                c: colors[(Math.random() * colors.length) | 0],
                rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
                shape: Math.random() < .2 ? 2 : (Math.random() < .5 ? 0 : 1),
                life: 160 + Math.random() * 60
            });
        }
        if (!running) { running = true; requestAnimationFrame(loop); }
    }

    function rain(n = 160) {
        if (reduceMotion) return;
        for (let i = 0; i < n; i++) {
            parts.push({
                x: Math.random() * W, y: -20 - Math.random() * H * .6,
                vx: (Math.random() - .5) * 2, vy: 2 + Math.random() * 3,
                s: 8 + Math.random() * 8,
                c: colors[(Math.random() * colors.length) | 0],
                rot: Math.random() * 6, vr: (Math.random() - .5) * .3,
                shape: Math.random() < .25 ? 2 : (Math.random() < .5 ? 0 : 1),
                life: 400
            });
        }
        if (!running) { running = true; requestAnimationFrame(loop); }
    }
    return { burst, rain };
})();

/* =========================================================
   NHẠC — giai điệu Happy Birthday (hộp nhạc), tự tổng hợp
   ========================================================= */
const SynthMusic = (() => {
    const N = { A4: 440, B4: 493.88, C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G4: 392, G5: 783.99 };
    const song = [
        ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["C5", 1], ["B4", 2],
        ["G4", .75], ["G4", .25], ["A4", 1], ["G4", 1], ["D5", 1], ["C5", 2],
        ["G4", .75], ["G4", .25], ["G5", 1], ["E5", 1], ["C5", 1], ["B4", 1], ["A4", 2],
        ["F5", .75], ["F5", .25], ["E5", 1], ["C5", 1], ["D5", 1], ["C5", 3]
    ];
    const beat = 0.42;
    let ac, master, timer, idx = 0, nextTime = 0, playing = false, userMuted = false;

    function note(freq, t, dur) {
        [1, 2].forEach((mult, k) => {
            const o = ac.createOscillator();
            const g = ac.createGain();
            o.type = k ? "sine" : "triangle";
            o.frequency.value = freq * mult;
            const peak = k ? 0.05 : 0.22;
            g.gain.setValueAtTime(0.0001, t);
            g.gain.exponentialRampToValueAtTime(peak, t + 0.015);
            g.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(0.5, dur * 1.3));
            o.connect(g).connect(master);
            o.start(t);
            o.stop(t + Math.max(0.6, dur * 1.4));
        });
    }

    function schedule() {
        while (nextTime < ac.currentTime + 0.3) {
            const [n, b] = song[idx];
            note(N[n], nextTime, b * beat);
            nextTime += b * beat;
            idx++;
            if (idx >= song.length) { idx = 0; nextTime += 1.6; } // nghỉ rồi lặp
        }
    }

    function start() {
        try {
            if (!ac) {
                ac = new (window.AudioContext || window.webkitAudioContext)();
                master = ac.createGain();
                master.gain.value = 0.6;
                master.connect(ac.destination);
                nextTime = ac.currentTime + 0.15;
            }
            ac.resume();
            if (!timer) timer = setInterval(schedule, 100);
            playing = true;
        } catch (e) { playing = false; }
        sync();
    }
    function stop() { if (ac) ac.suspend(); playing = false; sync(); }
    function sync() {
        const b = $("#btn__music");
        b.classList.toggle("playing", playing);
        b.setAttribute("aria-pressed", String(playing));
    }
    function toggle() { if (playing) { userMuted = true; stop(); } else { userMuted = false; start(); } }
    function autoStart() { if (CONFIG.tuDongBatNhac && !playing && !userMuted) start(); }
    return { toggle, autoStart };
})();

/* Nhạc từ file mp3 của bạn — nếu không tải được file thì tự dùng nhạc hộp nhạc */
const Music = (() => {
    if (!CONFIG.nhac) return SynthMusic;
    const audio = new Audio(CONFIG.nhac);
    audio.loop = true;
    audio.volume = 0.7;
    audio.preload = "auto";
    let userMuted = false, failed = false, started = false;

    function sync() {
        const b = $("#btn__music");
        const playing = !audio.paused;
        b.classList.toggle("playing", playing);
        b.setAttribute("aria-pressed", String(playing));
    }
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("error", () => {
        failed = true;
        console.warn("Không tải được file nhạc:", CONFIG.nhac, "→ dùng nhạc hộp nhạc");
        if (!userMuted && started) SynthMusic.autoStart();
    });

    function start() {
        if (failed) { SynthMusic.autoStart(); return; }
        started = true;
        if (audio.currentTime === 0 && CONFIG.nhacBatDauTuGiay > 0) {
            try { audio.currentTime = CONFIG.nhacBatDauTuGiay; } catch (e) {}
        }
        audio.play().catch(() => {});
    }
    function toggle() {
        if (failed) { SynthMusic.toggle(); return; }
        if (audio.paused) { userMuted = false; start(); }
        else { userMuted = true; audio.pause(); }
    }
    function autoStart() {
        if (CONFIG.tuDongBatNhac && audio.paused && !userMuted) start();
    }
    return { toggle, autoStart };
})();
$("#btn__music").addEventListener("click", Music.toggle);

/* =========================================================
   LÁ THƯ
   ========================================================= */
const letterBox = $("#box__letter");
const letterTimers = timerGroup();
const titleEl = $(".title__letter");
const bodyEl = $(".text__body");
const signEl = $(".signature");
let letterDone = false;

function showWholeLetter() {
    letterTimers.clear();
    titleEl.textContent = CONFIG.tieuDeThu;
    titleEl.appendChild(svgIcon("i-heart", "ico-heart"));
    bodyEl.innerHTML = "";
    CONFIG.noiDungThu.forEach(t => {
        const p = document.createElement("p");
        p.textContent = t;
        bodyEl.appendChild(p);
    });
    ["#heart__letter", ".love__img", "#mewmew"].forEach(s => { $(s).classList.add("animationOp"); $(s).style.opacity = 1; });
    $$(".heart").forEach(h => h.classList.add("animation"));
    signEl.classList.add("show");
    letterDone = true;
}

function openLetter() {
    Music.autoStart();
    resetLetter();
    letterBox.classList.add("open");
    letterBox.setAttribute("aria-hidden", "false");
    if (reduceMotion) { showWholeLetter(); return; }

    letterTimers.timeout(() => {
        const r = $(".letter__border").getBoundingClientRect();
        Confetti.burst(r.left + r.width / 2, r.top + 40, 90);
    }, 900);

    // tiêu đề: gõ chữ, mỗi chữ kèm 1 tim nhỏ như bản gốc
    letterTimers.timeout(() => {
        const chars = [...CONFIG.tieuDeThu];
        let i = 0;
        const id = letterTimers.interval(() => {
            if (i >= chars.length) { clearInterval(id); return; }
            titleEl.textContent = chars.slice(0, ++i).join("");
            titleEl.appendChild(svgIcon("i-heart", "ico-heart"));
        }, 90);
    }, 1000);

    letterTimers.timeout(() => {
        ["#heart__letter", ".love__img", "#mewmew"].forEach(s => $(s).classList.add("animationOp"));
    }, 1500);
    letterTimers.timeout(() => $$(".heart").forEach(h => h.classList.add("animation")), 2300);

    // nội dung: gõ lần lượt từng đoạn
    letterTimers.timeout(() => {
        let k = 0;
        const next = () => {
            if (k >= CONFIG.noiDungThu.length) { signEl.classList.add("show"); letterDone = true; return; }
            const p = document.createElement("p");
            p.className = "typing";
            bodyEl.appendChild(p);
            typeText(p, CONFIG.noiDungThu[k], 45, letterTimers, () => {
                p.classList.remove("typing");
                k++;
                letterTimers.timeout(next, 350);
            });
            const scroller = $(".text__letter");
            const follow = letterTimers.interval(() => {
                scroller.scrollTop = scroller.scrollHeight;
                if (!p.classList.contains("typing")) clearInterval(follow);
            }, 200);
        };
        next();
    }, 3000);
}

function resetLetter() {
    letterTimers.clear();
    letterDone = false;
    titleEl.textContent = "";
    bodyEl.innerHTML = "";
    signEl.textContent = CONFIG.kyTen;
    signEl.classList.remove("show");
    ["#heart__letter", ".love__img", "#mewmew"].forEach(s => { $(s).classList.remove("animationOp"); $(s).style.opacity = ""; });
    $$(".heart").forEach(h => h.classList.remove("animation"));
}

function closeLetter() {
    letterTimers.clear();
    letterBox.classList.remove("open");
    letterBox.setAttribute("aria-hidden", "true");
    $("#btn__letter").focus();
}

$("#btn__letter").addEventListener("click", openLetter);
$(".close", letterBox).addEventListener("click", closeLetter);
$(".text__letter").addEventListener("click", () => { if (!letterDone) showWholeLetter(); });
letterBox.addEventListener("click", e => { if (e.target === letterBox) closeLetter(); });

/* =========================================================
   BÁNH KEM & THỔI NẾN
   ========================================================= */
const cakeBox = $("#box__cake");
const candlesEl = $("#candles");
const hintEl = $("#cake__hint");
const defaultHint = hintEl.textContent;
let mic = null;

function buildCandles() {
    candlesEl.innerHTML = "";
    const n = Math.max(1, Math.min(7, CONFIG.soNen | 0));
    for (let i = 0; i < n; i++) {
        const c = document.createElement("button");
        c.type = "button";
        c.className = "candle";
        c.setAttribute("aria-label", `Nến số ${i + 1}`);
        c.innerHTML = '<span class="flame"></span><span class="smoke"></span>';
        c.style.height = (46 + (i % 2) * 10) + "px";
        c.addEventListener("click", () => blow(c));
        candlesEl.appendChild(c);
    }
    hintEl.textContent = defaultHint;
    hintEl.classList.remove("done");
    $("#btn__relight").classList.remove("show");
}

function blow(c) {
    if (c.classList.contains("out")) return;
    c.classList.add("out");
    c.setAttribute("aria-label", "Nến đã tắt");
    const left = $$(".candle:not(.out)").length;
    if (left === 0) {
        stopMic();
        hintEl.textContent = "Điều ước sẽ thành sự thật!";
        hintEl.classList.add("done");
        $("#btn__relight").classList.add("show");
        Confetti.rain(180);
        const r = $("#cake").getBoundingClientRect();
        Confetti.burst(r.left + r.width / 2, r.top, 100);
    }
}

async function startMic() {
    if (mic) { stopMic(); return; }
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const ac = new (window.AudioContext || window.webkitAudioContext)();
        const src = ac.createMediaStreamSource(stream);
        const an = ac.createAnalyser();
        an.fftSize = 512;
        src.connect(an);
        const data = new Uint8Array(an.fftSize);
        let loud = 0, lastBlow = 0;
        mic = { stream, ac, raf: 0 };
        $("#btn__mic").classList.add("listening");
        $("#btn__mic").textContent = "Đang nghe… thổi đi!";
        const tick = (t) => {
            an.getByteTimeDomainData(data);
            let sum = 0;
            for (const v of data) { const x = (v - 128) / 128; sum += x * x; }
            const rms = Math.sqrt(sum / data.length);
            loud = rms > 0.18 ? loud + 1 : 0;
            if (loud > 4 && t - lastBlow > 220) {
                const lit = $$(".candle:not(.out)");
                if (lit.length) blow(lit[(Math.random() * lit.length) | 0]);
                lastBlow = t;
            }
            if (mic) mic.raf = requestAnimationFrame(tick);
        };
        mic.raf = requestAnimationFrame(tick);
    } catch (e) {
        hintEl.textContent = "Không mở được micro — chạm vào từng ngọn nến để thổi nhé";
    }
}

function stopMic() {
    if (!mic) return;
    cancelAnimationFrame(mic.raf);
    mic.stream.getTracks().forEach(t => t.stop());
    mic.ac.close();
    mic = null;
    $("#btn__mic").classList.remove("listening");
    $("#btn__mic").textContent = "Thổi bằng micro";
}

function openCake() {
    Music.autoStart();
    if (!$$(".candle").length) buildCandles();
    cakeBox.classList.add("open");
    cakeBox.setAttribute("aria-hidden", "false");
}
function closeCake() {
    stopMic();
    cakeBox.classList.remove("open");
    cakeBox.setAttribute("aria-hidden", "true");
    $("#btn__cake").focus();
}

if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) $("#btn__mic").style.display = "none";
$("#btn__cake").addEventListener("click", openCake);
$(".close", cakeBox).addEventListener("click", closeCake);
$("#btn__mic").addEventListener("click", startMic);
$("#btn__relight").addEventListener("click", buildCandles);
cakeBox.addEventListener("click", e => { if (e.target === cakeBox) closeCake(); });

/* Esc để đóng */
document.addEventListener("keydown", e => {
    if (e.key !== "Escape") return;
    if (letterBox.classList.contains("open")) closeLetter();
    if (cakeBox.classList.contains("open")) closeCake();
});

/* =========================================================
   MÀN CHỜ: chạm để mở quà → bật nhạc + chạy intro
   ========================================================= */
document.body.classList.add("waiting");
$("#btn__gate").addEventListener("click", () => {
    Music.autoStart();
    $("#gate").classList.add("hide");
    $("#gate").setAttribute("aria-hidden", "true");
    document.body.classList.remove("waiting");
    startIntro();
    setTimeout(() => Confetti.burst(window.innerWidth / 2, window.innerHeight / 2, 80), 200);
}, { once: true });