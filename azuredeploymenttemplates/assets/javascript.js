const repositoryOwner = "JustinVerstijnen";
const repositoryName = "AzureDeploymentTemplates";
const repositoryBranch = "main";
const rawTemplateBaseUrl = `https://raw.githubusercontent.com/${repositoryOwner}/${repositoryName}/refs/heads/${repositoryBranch}`;
const azurePortalTemplateBaseUrl = "https://portal.azure.com/#create/Microsoft.Template/uri/";
const deployToAzureButtonImageUrl = "https://aka.ms/deploytoazurebutton";

function getTemplateUrl(templatePath) {
  return `${rawTemplateBaseUrl}/${templatePath}`;
}

function getDeployToAzureUrl(templatePath) {
  return `${azurePortalTemplateBaseUrl}${encodeURIComponent(getTemplateUrl(templatePath))}`;
}

const tools = [
  {
    title: "Single Server with Active Directory",
    description: "Deploy a single server with Active Directory for simple on-premises scenarios.",
    templatePath: "singleserveractivedirectory/main.json",
    shortcut: "",
    image: ""
  },
  {
    title: "Single Server with IIS",
    description: "Deploy a single server with IIS for simple on-premises scenarios.",
    templatePath: "singleserveriis/main.json",
    shortcut: "",
    image: ""
  },
  {
    title: "Azure Virtual Desktop Kerberos",
    description: "Deploy a single session host with all Azure Virtual Desktop dependencies.",
    templatePath: "azurevirtualdesktopkerberos/main.json",
    shortcut: "",
    image: `${rawTemplateBaseUrl}/azurevirtualdesktopkerberos/azurevirtualdesktopkerberos.png`
  }
];

const grid = document.getElementById("toolsGrid");
const searchInput = document.getElementById("searchInput");
const emptyState = document.getElementById("emptyState");


function createToolImage(tool, deployToAzureUrl) {
  if (!tool.image) {
    return "";
  }

  return `
    <a class="tool-image-link" href="${deployToAzureUrl}" target="_blank" rel="noopener noreferrer" aria-label="Deploy ${tool.title} to Azure">
      <img class="tool-image" src="${tool.image}" alt="${tool.title} preview" loading="lazy" />
    </a>
  `;
}

function createShortcutLink(tool) {
  if (!tool.shortcut) {
    return "";
  }

  return `<a class="shortcut-link" href="${tool.shortcut}" target="_blank" rel="noopener noreferrer">${tool.shortcut.replace("https://", "")}</a>`;
}

function createToolCard(tool) {
  const deployToAzureUrl = getDeployToAzureUrl(tool.templatePath);
  const article = document.createElement("article");
  article.className = "tool-card";
  article.innerHTML = `
    ${createToolImage(tool, deployToAzureUrl)}
    <div class="tool-content">
      <h2 class="tool-title">${tool.title}</h2>
      <p class="tool-description">${tool.description}</p>
      <div class="tool-actions">
        <a class="deploy-to-azure" href="${deployToAzureUrl}" target="_blank" rel="noopener noreferrer" aria-label="Deploy ${tool.title} to Azure">
          <img src="${deployToAzureButtonImageUrl}" alt="Deploy to Azure" loading="lazy" />
        </a>
      </div>
      ${createShortcutLink(tool)}
    </div>
  `;
  return article;
}

function renderTools(query = "") {
  const search = query.trim().toLowerCase();
  const filtered = tools.filter((tool) => {
    return [tool.title, tool.description, tool.shortcut, tool.templatePath]
      .join(" ")
      .toLowerCase()
      .includes(search);
  });

  grid.innerHTML = "";
  filtered.forEach((tool) => grid.appendChild(createToolCard(tool)));
  emptyState.style.display = filtered.length ? "none" : "block";
}

searchInput.addEventListener("input", (event) => renderTools(event.target.value));
renderTools();
