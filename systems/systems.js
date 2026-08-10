/* ==========================================================================
   Icons come from dashboard-icons (the same set Homepage uses).
   Browse names here: https://dashboardicons.com

   A system can have:
     icon      - dashboard-icons name shown next to the title
     platform  - chips for the host OS (string, or { name, icon })
     specs     - the hardware list
     notes     - anything else worth saying

   If an icon name doesn't exist, it quietly falls back to the first letter.
   ========================================================================== */

const HOMELAB = {

  nodes: [
    {
      name: "Corsair 4000D RS PC",
      role: "Home PC",
      icon: "../icons/corsair-3-logo-png-transparent.png",
      specs: ["Intel Core i9 14900k", "96GB 6400MHz CL32 DDR5", "2TB WD SN850X", "4TB Crucial P3 Plus", "1TB Samsung 980 Pro",
        "2TB Seagate Barracuda", "Gigabyte Gaming OC RTX 5090"
      ],
      platform: [
        { name: "Windows 11 Pro", icon: "windows-11" }
      ],
    },

    {
      name: "NZXT H5 Flow PC",
      role: "Apartment PC",
      icon: "../icons/Nzxt_logo.webp",
      specs: ["Intel Core i5 13400F", "32GB 6000MHz CL36 DDR5", "1TB WD Blue SN850", "2TB Samsung 990 EVO Plus", "1TB Samsung 970 EVO Plus",
        "Zotac SFF OC RTX 5070 Ti"
      ],
      platform: [
        { name: "Windows 11", icon: "windows-11" }
      ],
    },

    {
      name: "Framework 16",
      role: "Daily Laptop",
      icon: "https://cdn.jsdelivr.net/gh/selfhst/icons/webp/framework-light.webp",
      specs: ["AMD Ryzen AI 7 350", "64GB 5600MHz DDR5 SODIMM", "4TB SN850X", "1TB Patriot Viper 2230 VP4000",
        "RTX 5070 8GB"
      ],
      platform: [
        { name: "Windows 11 Pro", icon: "windows-11" },
        { name: "Fedora Workstation", icon: "fedora" }
      ],
    },

    {
      name: "Lenovo Thinkpad T480",
      role: "Used to mess around with",
      icon: "lenovo",
      specs: ["i5 8250U", "16GB 2400MHz DDR4 SODIMM", "256GB Samsung SSD"],
      platform: [
        { name: "Arch BTW", icon: "arch-linux" }
      ],
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
  img.src = name.includes("/") ? name : ICON_BASE + name + ".webp";
  img.alt = "";
  img.loading = "lazy";
  img.addEventListener("error", () => {
    wrap.classList.add("hl-icon-fallback");
    wrap.textContent = label.charAt(0);
  });
  wrap.appendChild(img);
  return wrap;
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

/* A platform entry can be "Windows 11" or { name: "Windows 11", icon: "windows" } */
function renderChip(platform) {
  const name = typeof platform === "string" ? platform : platform.name;
  const chip = el("li", "hl-chip");
  if (typeof platform !== "string" && platform.icon) {
    chip.appendChild(icon(platform.icon, name));
  }
  chip.appendChild(el("span", null, name));
  return chip;
}

function renderNode(node) {
  const card = el("article", "hl-node");

  const head = el("header", "hl-node-head");
  if (node.icon) head.appendChild(icon(node.icon, node.name));
  const headText = el("div", "hl-node-head-text");
  headText.appendChild(el("h3", "hl-node-name", node.name));
  if (node.role) headText.appendChild(el("p", "hl-node-role", node.role));
  head.appendChild(headText);
  card.appendChild(head);

  if (node.platform && node.platform.length) {
    const chips = el("ul", "hl-chips");
    node.platform.forEach(p => chips.appendChild(renderChip(p)));
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
  const grid = document.getElementById("nodes");
  HOMELAB.nodes.forEach(n => grid.appendChild(renderNode(n)));

  document.getElementById("node-count").textContent = HOMELAB.nodes.length;
}

document.addEventListener("DOMContentLoaded", build);