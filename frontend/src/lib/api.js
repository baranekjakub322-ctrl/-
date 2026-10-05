import axios from "axios";

export const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const api = axios.create({ baseURL: `${BACKEND_URL}/api`, withCredentials: true });

export const photoSrc = (src) => (src?.startsWith("/api/") ? `${BACKEND_URL}${src}` : src);

export const PHONE = "+48 668 434 331";
export const TEL = "tel:+48668434331";
export const EMAIL = "jarospeedrent@gmail.com";

export const FALLBACK_PHOTOS = [
  { id: "f1", category: "bus", src: "/img/bus.webp", caption: "Ford Tourneo Custom — 8 miejsc" },
  { id: "f2", category: "bus", src: "/img/kokpit.webp", caption: "Kokpit z automatyczną skrzynią" },
  { id: "f3", category: "bus", src: "/img/bagaznik.webp", caption: "Przestrzeń bagażowa" },
  { id: "f4", category: "aerator", src: "/img/aerator.webp", caption: "Aerator spalinowy rurkowy Weibang" },
  { id: "f5", category: "wertykulator", src: "/img/wertykulator.webp", caption: "Wertykulator spalinowy Weibang" },
];

export function formatErr(detail) {
  if (detail == null) return "Coś poszło nie tak. Spróbuj ponownie.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) return detail.map((e) => e?.msg || JSON.stringify(e)).join(" ");
  if (typeof detail?.msg === "string") return detail.msg;
  return String(detail);
}

export const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const t = document.createElement("textarea");
    t.value = text;
    document.body.appendChild(t);
    t.select();
    document.execCommand("copy");
    t.remove();
  }
};

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -72, duration: 1.4 });
  else el.scrollIntoView({ behavior: "smooth" });
};
