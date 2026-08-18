const tools = [
  {
    title: "DNS MEGAtool",
    description: "A simple and efficient tool to check configured DNS records for a domain or bulk domains. It also checks security options and includes an export function.",
    toolUrl: "https://tools.justinverstijnen.nl/dnsmegatool",
    github: "https://github.com/JustinVerstijnen/DNSMegaTool",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-dnsmegatool.png"
  },
  {
    title: "Email Header Analyzer",
    description: "A simple and effective tool to check the details of email message headers.",
    toolUrl: "https://tools.justinverstijnen.nl/emailheaderanalyzer/",
    github: "https://github.com/JustinVerstijnen/EmailHeaderAnalyzer",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-emailheaderanalyzer.png"
  },
  {
    title: "365 Tenant Lookup",
    description: "Search Microsoft 365 tenants by custom domain or .onmicrosoft.com domain to find the associated tenant ID and location.",
    toolUrl: "https://tools.justinverstijnen.nl/tenantlookuptool",
    github: "https://github.com/JustinVerstijnen/TenantLookupTool",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-tenantlookuptool.png"
  },
  {
    title: "Subnet Calculator",
    description: "Calculate IPv4 networks and identify network configuration based on an IP address and subnet mask. Includes an export function.",
    toolUrl: "https://tools.justinverstijnen.nl/subnetcalculator",
    github: "https://github.com/JustinVerstijnen/SubnetCalculator",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-subnetcalculator.png"
  },
  {
    title: "IP Lookup Tool",
    description: "Look up IPv4 or IPv6 addresses and view properties such as ISP, country, location and more. Includes export functionality.",
    toolUrl: "https://tools.justinverstijnen.nl/iplookuptool",
    github: "https://github.com/JustinVerstijnen/IPLookupTool",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-iplookuptool.png"
  },
  {
    title: "Port Checker Tool",
    description: "Check whether TCP ports are open to the internet. Useful for troubleshooting firewall and DNAT rules.",
    toolUrl: "https://tools.justinverstijnen.nl/portchecker",
    github: "https://github.com/JustinVerstijnen/PortCheckerTool",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-portchecker.png"
  },
  {
    title: "Password Generator",
    description: "Quickly generate passwords with options for character sets and excluding similar characters.",
    toolUrl: "https://tools.justinverstijnen.nl/passwordgenerator",
    github: "https://github.com/JustinVerstijnen/PasswordGenerator",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-passwordgenerator.png"
  },
  {
    title: "Registry to PowerShell",
    description: "Convert Registry files and keys to PowerShell scripts for Microsoft Intune, startup scripts and Active Directory Group Policies.",
    toolUrl: "https://tools.justinverstijnen.nl/registrytopowershell",
    github: "https://github.com/JustinVerstijnen/RegistryToPowershell",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-registrytopowershell.png"
  },
  {
    title: "365 Records Generator",
    description: "Generate DNS records needed to configure a domain in Microsoft 365, including verification and SMTP DANE records, based on your domain and tenant name.",
    toolUrl: "https://tools.justinverstijnen.nl/365recordsgenerator",
    github: "https://github.com/JustinVerstijnen/365RecordsGenerator",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-365recordsgenerator.png"
  },
  {
    title: "HTML Color Picker",
    description: "Pick HTML colors and look up HEX/RGB codes for your projects.",
    toolUrl: "https://tools.justinverstijnen.nl/htmlcolorpicker",
    github: "https://github.com/JustinVerstijnen/HTMLColorPicker",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-htmlcolorpicker.png"
  },
  {
    title: "Azure Deployment Templates",
    description: "This tool is a gallery for various Azure Deployment Templates I regularly use for different researches and guides.",
    toolUrl: "https://tools.justinverstijnen.nl/azuredeploymenttemplates",
    github: "https://github.com/JustinVerstijnen/AzureDeploymentTemplates",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-azuredeploymenttemplates.jpg"
  },
  {
    title: "Markdown Editor",
    description: "The Markdown Editor tool which can be used to write articles, documentation and other information into clear readable text.",
    toolUrl: "https://tools.justinverstijnen.nl/markdowneditor",
    github: "https://github.com/JustinVerstijnen/MarkdownEditor",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-markdowneditor.png"
  },
  {
    title: "Microsoft Naming Tool",
    description: "This tool is a name generator for various Microsoft services like Intune, Entra ID and Azure.",
    toolUrl: "https://tools.justinverstijnen.nl/microsoftnamingtool",
    github: "https://github.com/JustinVerstijnen/MicrosoftNamingTool",
    image: "https://sajvwebsiteblobstorage.blob.core.windows.net/blog/tools-2375/tool-microsoftnamingtool.jpg"
  }
];

const grid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");

function githubSvg() {
  return `<span class="github-icon" aria-hidden="true"><svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 .5A12 12 0 0 0 8.2 23.9c.6.1.8-.3.8-.6v-2.1c-3.3.7-4-1.4-4-1.4-.5-1.3-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.6-.3-5.4-1.3-5.4-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.4 5.9.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A12 12 0 0 0 12 .5Z"/></svg></span>`;
}

function createToolCard(tool) {
  const article = document.createElement("article");
  article.className = "tool-card";

  const imageHtml = tool.image
    ? `
      <a class="tool-image-link" href="${tool.toolUrl}" target="_blank" rel="noopener noreferrer" aria-label="Open ${tool.title}">
        <img class="tool-image" src="${tool.image}" alt="${tool.title} preview" loading="lazy" />
      </a>
    `
    : "";

  article.innerHTML = `
    ${imageHtml}

    <div class="tool-content">
      <h2 class="tool-title">${tool.title}</h2>
      <p class="tool-description">${tool.description}</p>

      <div class="tool-actions">
        <a
          class="tool-primary"
          href="${tool.toolUrl}"
          target="_blank"
          rel="noopener noreferrer"
        >
          Use tool
        </a>

        <a
          class="tool-github"
          href="${tool.github}"
          target="_blank"
          rel="noopener noreferrer"
        >
          ${githubSvg()} GitHub
        </a>
      </div>
    </div>
  `;

  return article;
}

function renderTools(query = "") {
  const search = query.trim().toLowerCase();

  const filtered = tools.filter((tool) => {
    return [
      tool.title,
      tool.description,
      tool.github
    ]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  grid.innerHTML = "";

  filtered.forEach((tool) => {
    grid.appendChild(createToolCard(tool));
  });

  emptyState.style.display = filtered.length ? "none" : "block";
}

searchInput.addEventListener("input", (event) => {
  renderTools(event.target.value);
});

renderTools();
