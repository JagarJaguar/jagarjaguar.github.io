/* ==========================================================================
   Icons come from dashboard-icons (the same set Homepage uses).
   Browse names here: https://dashboardicons.com

   A node can have:
     platform  - chips for the host OS / runtime
     specs     - the hardware list
     groups    - services running on the host itself
     guests    - VMs, each with their own groups of services
     flow      - an arrow chain, e.g. how media moves between apps
     notes     - anything else worth saying
   ========================================================================== */

const HOMELAB = {

  // The path from the internet down to the switch.
  edge: [
    { name: "Internet",            icon: "internet",   note: "homelab domain" },
    { name: "Cloudflare DNS",      icon: "cloudflare", note: "proxied" },
    { name: "Asus RT-AC5300",      icon: "asus",       note: "router" },
    { name: "NETGEAR GS724TPv2",   icon: "netgear",    note: "switch" }
  ],

  // Things that are true of every node.
  globalNotes: [
    "Glances runs on every node for the Homepage widget.",
    "Dockpeek proxy and Scrutiny run on every node."
  ],

  nodes: [
    {
      name: "Lenovo Thinkstation P620",
      role: "Storage + photos + local AI",
      specs: [
        "Threadripper PRO 3945WX",
        "128GB DDR4 ECC",
        "RTX 2060 Super",
        "1TB SN770 + 4TB WD Red SSD",
        "3x 18TB Seagate EXOS",
        "Supermicro 9300-8i HBA"
      ],
      platform: ["Proxmox VE"],
      guests: [
        {
          name: "Windows 11",
          icon: "windows-11",
          sub: "VM",
          groups: [
            {
              label: "Game servers",
              services: [
                { name: "MC Server #1", icon: "minecraft" }
              ]
            },
            {
              label: "Docker",
              services: [
                { name: "Immich",     icon: "immich" },
                { name: "Open WebUI", icon: "open-webui" },
                { name: "Ollama",     icon: "ollama" }
              ]
            }
          ]
        },
        {
          name: "Unraid",
          icon: "unraid",
          sub: "VM",
          groups: [
            {
              label: "Storage",
              services: [
                { name: "3x 18TB XFS array", icon: "ugreen-nas" }
              ]
            }
          ]
        }
      ]
    },

    {
      name: "Dell Optiplex Micro 3050",
      role: "Apps + utilities",
      specs: ["i5 7500T", "8GB DDR4 SODIMM", "256GB SATA SSD"],
      platform: ["Linux Mint", "Docker"],
      groups: [
        {
          label: "Docker",
          services: [
            { name: "Homepage",  icon: "homepage" },
            { name: "ConvertX",  icon: "convertx" },
            { name: "Scrutiny",  icon: "scrutiny" },
            { name: "Dockpeek",  icon: "dockpeek" },
            { name: "Mealie",    icon: "mealie" },
            { name: "Vikunja",   icon: "vikunja" },
            { name: "Memos",     icon: "memos" }
          ]
        }
      ]
    },

        {
      name: "Dell Optiplex Micro 7020",
      role: "Game servers + media",
      specs: ["i5 14500T", "64GB DDR5 SODIMM", "256GB M.2"],
      platform: ["Linux Mint", "Docker"],
      groups: [
        {
          label: "Bare metal",
          services: [
            { name: "MC Server #2", icon: "minecraft" },
            { name: "MC Server #3", icon: "minecraft" },
            { name: "Terraria",     icon: "terraria" }
          ]
        },
        {
          label: "Docker",
          services: [
            { name: "Jellyfin", icon: "jellyfin" },
            { name: "Radarr",   icon: "radarr" },
            { name: "Sonarr",   icon: "sonarr" },
            { name: "Prowlarr", icon: "prowlarr" },
            { name: "qBittorrent", icon: "qbittorrent" },
            { name: "Autobrr",  icon: "autobrr" },
            { name: "Gluetun",  icon: "gluetun" }
          ]
        }
      ],
      flow: ["Prowlarr", "Sonarr / Radarr", "qBittorrent", "Jellyfin"],
      notes: [
        "MC servers pinned to P-cores, Jellyfin to E-cores.",
        "Gluetun is the killswitch, VPN is AirVPN.",
        "Prowlarr uses Flaresolverr for some indexers.",
        "Media lives on the P620."
      ]
    },

    {
      name: "Dell Optiplex Micro 7050",
      role: "Networking + monitoring",
      specs: ["i5 6500T", "8GB DDR4 SODIMM", "128GB SATA SSD"],
      platform: ["Linux Mint", "Docker", "CrowdSec bouncer"],
      groups: [
        {
          label: "Docker",
          services: [
            { name: "Nginx Proxy Manager", icon: "nginx-proxy-manager" },
            { name: "Pi-hole",             icon: "pi-hole" },
            { name: "Uptime Kuma",         icon: "uptime-kuma" },
            { name: "CrowdSec",            icon: "crowdsec" }
          ]
        }
      ]
    }
  ]
};


/* ==========================================================================
   Rendering shid.
   ========================================================================== */

const ICON_BASE = "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/webp/";

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function icon(name, label) {
  const wrap = el("span", "hl-icon");
  if (!name) {
    wrap.classList.add("hl-icon-fallback");
    wrap.textContent = label.charAt(0);
    return wrap;
  }
  const img = el("img");
  img.src = ICON_BASE + name + ".webp";
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => {
    wrap.classList.add("hl-icon-fallback");
    wrap.textContent = label.charAt(0);
  });
  wrap.appendChild(img);
  return wrap;
}

function renderEdge(list) {
  const row = el("div", "hl-edge");
  list.forEach((hop, i) => {
    const item = el("div", "hl-hop");
    item.appendChild(icon(hop.icon, hop.name));
    const text = el("div", "hl-hop-text");
    text.appendChild(el("span", "hl-hop-name", hop.name));
    if (hop.note) text.appendChild(el("span", "hl-hop-note", hop.note));
    item.appendChild(text);
    row.appendChild(item);
    if (i < list.length - 1) {
      const arrow = el("span", "hl-arrow", "\u203A");
      arrow.setAttribute("aria-hidden", "true");
      row.appendChild(arrow);
    }
  });
  return row;
}

function renderService(service) {
  const tag = service.url ? "a" : "div";
  const item = el(tag, "hl-service");
  if (service.url) {
    item.href = service.url;
    item.target = "_blank";
    item.rel = "noopener noreferrer";
  }
  item.appendChild(icon(service.icon, service.name));
  const text = el("div", "hl-service-text");
  text.appendChild(el("span", "hl-service-name", service.name));
  if (service.sub) text.appendChild(el("span", "hl-service-sub", service.sub));
  item.appendChild(text);
  return item;
}

function renderGroups(container, groups, headingTag) {
  (groups || []).forEach(group => {
    container.appendChild(el(headingTag, "hl-group-label", group.label));
    const grid = el("div", "hl-services");
    group.services.forEach(s => grid.appendChild(renderService(s)));
    container.appendChild(grid);
  });
}

function renderGuest(guest) {
  const box = el("section", "hl-guest");

  const head = el("div", "hl-guest-head");
  head.appendChild(icon(guest.icon, guest.name));
  const text = el("div", "hl-guest-text");
  text.appendChild(el("span", "hl-guest-name", guest.name));
  if (guest.sub) text.appendChild(el("span", "hl-guest-sub", guest.sub));
  head.appendChild(text);
  box.appendChild(head);

  renderGroups(box, guest.groups, "h5");
  return box;
}

function renderNode(node) {
  const card = el("article", "hl-node");

  const head = el("header", "hl-node-head");
  head.appendChild(el("h3", "hl-node-name", node.name));
  if (node.role) head.appendChild(el("p", "hl-node-role", node.role));
  card.appendChild(head);

  if (node.platform && node.platform.length) {
    const chips = el("ul", "hl-chips");
    node.platform.forEach(p => chips.appendChild(el("li", "hl-chip", p)));
    card.appendChild(chips);
  }

  if (node.specs && node.specs.length) {
    const specs = el("ul", "hl-specs");
    node.specs.forEach(s => specs.appendChild(el("li", null, s)));
    card.appendChild(specs);
  }

  renderGroups(card, node.groups, "h4");

  if (node.guests && node.guests.length) {
    card.appendChild(el("h4", "hl-group-label", "Virtual machines"));
    node.guests.forEach(g => card.appendChild(renderGuest(g)));
  }

  if (node.flow && node.flow.length) {
    const flow = el("p", "hl-flow");
    flow.textContent = node.flow.join("  \u2192  ");
    card.appendChild(flow);
  }

  if (node.notes && node.notes.length) {
    const notes = el("ul", "hl-notes");
    node.notes.forEach(n => notes.appendChild(el("li", null, n)));
    card.appendChild(notes);
  }

  return card;
}

function countServices(node) {
  const inGroups = groups =>
    (groups || []).reduce((sum, g) => sum + g.services.length, 0);
  return inGroups(node.groups) +
    (node.guests || []).reduce((sum, g) => sum + inGroups(g.groups), 0);
}

function build() {
  document.getElementById("edge").appendChild(renderEdge(HOMELAB.edge));

  const globals = document.getElementById("global-notes");
  HOMELAB.globalNotes.forEach(n => globals.appendChild(el("li", null, n)));

  const grid = document.getElementById("nodes");
  HOMELAB.nodes.forEach(n => grid.appendChild(renderNode(n)));

  document.getElementById("node-count").textContent = HOMELAB.nodes.length;
  document.getElementById("service-count").textContent =
    HOMELAB.nodes.reduce((sum, n) => sum + countServices(n), 0);
}

document.addEventListener("DOMContentLoaded", build);