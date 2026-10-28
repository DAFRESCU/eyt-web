// Espinoza T Personas — recibe el resultado de una herramienta gratis (solo si la persona lo envía
// con su consentimiento) y lo guarda en Notion: una ficha en «Clientes» y una tarea para responder hoy.
// Necesita en Vercel la variable NOTION_TOKEN (llave de la integración de Notion con acceso a la Cabina).

const NOTION_VERSION = "2022-06-28";
const CLIENTES_DB = "45f2dacfbbc2497495ef159bc4f1d3f7";
const TAREAS_DB = "00f85fc61d664e0a92738b21d9a878ff";
const DANIEL = "3c9d872b-594c-8147-beeb-0002fa88945a";
const RECIENTES = new Map();
const TEMAS = ["Talento", "Cultura y bienestar", "Liderazgo y dirección", "Orden laboral"];

const clip = (s, n) => String(s == null ? "" : s).replace(/\s+/g, " ").trim().slice(0, n);
const txt = (s) => [{ type: "text", text: { content: clip(s, 1900) } }];

function limaDate() {
  const d = new Date(Date.now() - 5 * 3600 * 1000);
  return d.toISOString().slice(0, 10);
}

async function notion(path, body, token) {
  const r = await fetch("https://api.notion.com/v1/" + path, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Notion-Version": NOTION_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j && j.message) || "Notion " + r.status);
  return j;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") return res.status(405).json({ ok: false });

  let b = req.body;
  if (typeof b === "string") { try { b = JSON.parse(b); } catch (e) { b = null; } }
  if (!b || typeof b !== "object") return res.status(400).json({ ok: false, error: "datos" });

  // trampa para bots: el campo oculto debe venir vacío
  if (b.web) return res.status(200).json({ ok: true });

  // límite de envíos: máximo 5 cada 10 minutos por conexión (mejor esfuerzo, en memoria)
  const ip = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "anon";
  const ahora = Date.now();
  const previos = (RECIENTES.get(ip) || []).filter((t) => ahora - t < 10 * 60 * 1000);
  if (previos.length >= 5) return res.status(429).json({ ok: false, error: "espera" });
  previos.push(ahora);
  RECIENTES.set(ip, previos);
  if (RECIENTES.size > 500) RECIENTES.clear();

  const nombre = clip(b.nombre, 80), empresa = clip(b.empresa, 120), telefono = clip(b.telefono, 30);
  const correo = clip(b.correo, 120), cargo = clip(b.cargo, 80);
  if (!nombre || !empresa || !telefono || b.consentimiento !== true) {
    return res.status(400).json({ ok: false, error: "faltan" });
  }
  if (correo && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) return res.status(400).json({ ok: false, error: "correo" });

  const token = process.env.NOTION_TOKEN;
  if (!token) return res.status(503).json({ ok: false, error: "config" });

  const herramienta = clip(b.herramienta, 80) || "Herramienta de la web";
  const esTermometro = clip(b.id, 40) === "termometro";
  const total = Number.isFinite(+b.total) ? +b.total : null;
  const N = Number.isFinite(+b.n) ? +b.n : null;
  const veredicto = clip(b.veredicto, 80);
  const tema = clip(b.tema, 60);
  const grupos = Array.isArray(b.grupos) ? b.grupos.slice(0, 8) : [];
  const brechas = Array.isArray(b.brechas) ? b.brechas.slice(0, 25) : [];
  const modalidad = b.modalidad === "Virtual" ? "Virtual" : b.modalidad === "Presencial" ? "Presencial" : null;
  const hoy = limaDate();

  const props = {
    Empresa: { title: txt(empresa) },
    Estado: { status: { name: "Prediagnóstico" } },
    Contacto: { rich_text: txt(nombre) },
    Origen: { select: { name: "Termómetro web" } },
    "Lo que dijo": { rich_text: txt(herramienta + (veredicto ? " · " + veredicto : "") + (total != null && N ? " · " + total + " de " + N : "")) },
    "Siguiente paso": { rich_text: txt("Responder hoy por WhatsApp y proponer 45 minutos para validar el resultado.") },
    "Fecha siguiente paso": { date: { start: hoy } },
    "Teléfono": { phone_number: telefono },
  };
  if (cargo) props.Cargo = { rich_text: txt(cargo) };
  if (correo) props.Correo = { email: correo };
  if (modalidad) props.Modalidad = { select: { name: modalidad } };
  if (esTermometro && total != null) props["Termómetro (de 20)"] = { number: total };
  if (TEMAS.indexOf(tema) >= 0) props["Tema principal"] = { select: { name: tema } };
  const tam = clip(b.tamano, 20);

  const children = [
    { object: "block", type: "callout", callout: { icon: { emoji: "🌡️" }, color: "yellow_background", rich_text: [
      { type: "text", text: { content: "Llegó desde la web (" + herramienta + ") con consentimiento. Es un prediagnóstico: se valida en la reunión. Aviso para " } },
      { type: "mention", mention: { type: "user", user: { id: DANIEL } } },
    ] } },
    { object: "block", type: "heading_3", heading_3: { rich_text: txt("Resultado") } },
    { object: "block", type: "paragraph", paragraph: { rich_text: txt(
      (total != null && N ? total + " de " + N + " · " : "") + (veredicto || "") + (tema ? " · Empezar por: " + tema : "") + (tam ? " · Tamaño: " + tam + " trabajadores" : "")
    ) } },
  ];
  grupos.forEach((g) => {
    children.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: txt(clip(g.nombre, 60) + ": " + (+g.puntos || 0) + " de " + (+g.de || 0)) } });
  });
  if (brechas.length) {
    children.push({ object: "block", type: "heading_3", heading_3: { rich_text: txt("Lo que marcó «No» o «No sé»") } });
    brechas.forEach((x) => {
      children.push({ object: "block", type: "bulleted_list_item", bulleted_list_item: { rich_text: txt(clip(x.grupo, 40) + " · " + clip(x.punto, 160) + (x.nose ? " (no sé)" : "")) } });
    });
  }

  try {
    const page = await notion("pages", { parent: { database_id: CLIENTES_DB }, properties: props, children }, token);
    await notion("pages", {
      parent: { database_id: TAREAS_DB },
      properties: {
        Tarea: { title: txt("Responder a " + empresa + " (" + herramienta + ")") },
        Estado: { status: { name: "Por hacer" } },
        Fecha: { date: { start: hoy } },
        Prioridad: { select: { name: "Alta" } },
        Tipo: { select: { name: "Cliente" } },
        Cliente: { relation: [{ id: page.id }] },
      },
    }, token).catch(() => null);
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(502).json({ ok: false, error: "notion" });
  }
}
