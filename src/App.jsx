import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";

const MESSAGE_LINES = [
  "14/2 này, anh chỉ muốn nói với em rằng: ở bên em là khoảng thời gian anh thấy hạnh phúc nhất.",
  "Cảm ơn em vì đã ở bên anh, cùng anh vượt qua nhiều khó khăn trong cuộc sống cũng như tình cảm.",
  "Đã là mùa valentine thứ 4 bên nhau, anh sẽ cố gắng hơn nữa, nhiều năm sau nữa, người anh nắm tay vẫn là em.",
  "Yêu em của anh, nhiều thật nhiều.",
  "Chồng của vợ iu❤❤",
];

const PHOTOS = [
  { src: "/images/1.jpg", alt: "Anh va em - khoanh khac 1" },
  { src: "/images/2.jpg", alt: "Anh va em - khoanh khac 2" },
  { src: "/images/3.jpg", alt: "Anh va em - khoanh khac 3" },
  { src: "/images/4.jpg", alt: "Anh va em - khoanh khac 4" },
];

const AUDIO_SRC = "/media/1.mp3";

function App() {
  const [countdown, setCountdown] = useState(3);
  const [phase, setPhase] = useState("countdown");
  const audioRef = useRef(null);

  const orbs = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, index) => ({
        id: index,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        size: `${70 + Math.random() * 180}px`,
        duration: `${9 + Math.random() * 12}s`,
        delay: `${Math.random() * 4}s`,
      })),
    []
  );

  const primeAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = true;
    audio.play().catch(() => {
      // Co the bi chan autoplay.
    });
  };

  const openLetter = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.muted = false;
      audio.play().catch(() => {
        // Neu trinh duyet chan, can them mot thao tac nguoi dung nua.
      });
    }

    setPhase("hello");
  };

  useEffect(() => {
    primeAudio();
  }, []);

  useEffect(() => {
    if (phase !== "countdown") return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          setPhase("gate");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [phase]);

  useEffect(() => {
    if (phase !== "hello") return;

    const timeout = setTimeout(() => {
      setPhase("message");
    }, 3500);

    return () => clearTimeout(timeout);
  }, [phase]);

  return (
    <div className="app">
      <div className="aurora" />
      <div className="scanlines" />

      <div className="orbs" aria-hidden>
        {orbs.map((orb) => (
          <span
            key={orb.id}
            className="orb"
            style={{
              left: orb.left,
              top: orb.top,
              width: orb.size,
              height: orb.size,
              animationDuration: orb.duration,
              animationDelay: orb.delay,
            }}
          />
        ))}
      </div>

      <main className="card">
        <div className="tag">Valentine 14/02</div>
        <audio ref={audioRef} src={AUDIO_SRC} loop preload="auto" playsInline />

        {phase === "countdown" && (
          <section className="panel countdown">
            <p className="helper">Chuẩn bị nhận tin nhắn từ anh</p>
            <div className="counter-wrap">
              <span className="counter">{countdown}</span>
            </div>
            <p className="helper">đang mở khóa...</p>
          </section>
        )}

        {phase === "gate" && (
          <section className="panel hello">
            <h1>Vợ iu của chồng</h1>
            <p className="helper">Sẵn sàng mở thư chưa nè?</p>
            <button type="button" className="open-btn" onClick={openLetter}>
              Mở thư
            </button>
          </section>
        )}

        {phase === "hello" && (
          <section className="panel hello">
            <h1>Vợ iu của chồng</h1>
            <p className="helper">Có một bức thư màu xanh dành riêng cho em.</p>
          </section>
        )}

        {phase === "message" && (
          <section className="panel message">
            <h1>Gửi vợ iu của anh...</h1>

            <div className="photo-grid">
              {PHOTOS.map((photo) => (
                <figure className="photo-card" key={photo.src}>
                  <img src={photo.src} alt={photo.alt} loading="lazy" />
                </figure>
              ))}
            </div>

            <div className="letter">
              {MESSAGE_LINES.map((line, index) => (
                <p key={index} style={{ animationDelay: `${0.2 + index * 0.35}s` }}>
                  {line}
                </p>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
