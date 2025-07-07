// Load swagger-sidebar
const sidebarScript = document.createElement('script');
sidebarScript.src =
  'https://cdn.jsdelivr.net/npm/swagger-sidebar/lib/bundle.js';

// Also load the sidebar styles
const sidebarStyle = document.createElement('link');
sidebarStyle.rel = 'stylesheet';
sidebarStyle.href = '/css/swagger-sidebar.css';

document.head.appendChild(sidebarStyle);

sidebarScript.onload = function () {
  const interval = setInterval(() => {
    const swaggerRoot = document.querySelector('#swagger-ui');
    const rendered = swaggerRoot && swaggerRoot.querySelector('.info');

    if (rendered) {
      clearInterval(interval);
      if (typeof initSidebar === 'function') {
        initSidebar(document.body, swaggerRoot);
        //////////////////////////////////////////////////////////////////////
        const sidebarEl = document.querySelector('#sidebar');
        const swaggerUiEl = document.querySelector('#swagger-ui');
        sidebarEl.style.display = 'none';
        setTimeout(() => {
          sidebarEl.style.display = 'block';
          const sectionTitles = sidebarEl.querySelectorAll('.sectionTitle');
          sectionTitles.forEach((title) => {
            title.style.cursor = 'pointer';
            const str = title.textContent;
            const match = str.match(/^[A-Z][a-z]+(-[A-Z][a-z]+)?/);
            const firstPhrase = match ? match[0] : '';
            title.textContent = firstPhrase;
          });
          ////////////////////////////////////////
          const html = `
                <div class="sidebar topbar">
                    <a href="https://docpatient-nexus.onrender.com"><img class="topbar__logo" src="/img/docpatient-nexus-icon.png" alt="DocPatient Nexus Logo" onerror="this.onerror=null; this.src='https://cdn-icons-png.flaticon.com/512/4154/4154438.png';"></a>
                    <h3> DocPatient Nexus</h3>
                </div>
            
                `;
          sidebarEl.insertAdjacentHTML(
            'afterbegin',
            `
            <h4>Endpoints 👇🏻</h4>      
            
            `,
          );
          sidebarEl.insertAdjacentHTML('afterbegin', html);

          ////////////////////////////////////////

          Array.from(sidebarEl.querySelectorAll('.part .link.opblock')).forEach(
            (part) => {
              const opBlock = swaggerUiEl.querySelector(
                `#${part.attributes.href.nodeValue.split('#')[1]}`,
              );

              part.querySelector('.partPath').textContent =
                opBlock.querySelector(
                  '.opblock-summary-description',
                ).textContent;
            },
          );

          ////////////////////////////////////////
          const sidebarModelsEl = document.createElement('div');
          sidebarModelsEl.classList.add('sidebar-models');
          sidebarModelsEl.insertAdjacentHTML(
            'afterbegin',
            `
            <h4>Schemas👇🏻</h4>
            `,
          );

          const modelContainerEls = Array.from(
            swaggerUiEl.querySelectorAll('.model-container'),
          );
          modelContainerEls.forEach((modelContainerEl) => {
            const modelName =
              modelContainerEl.attributes['data-name'].nodeValue;
            const href = modelContainerEl.attributes.id.nodeValue;
            sidebarModelsEl.insertAdjacentHTML(
              'beforeend',
              `
             <a href="#${href}" class="model--btn">${modelName} Model</a>
              `,
            );
          });
          sidebarEl.appendChild(sidebarModelsEl);

          const modelButtons = sidebarEl.querySelectorAll('.model--btn');
          modelButtons.forEach((button) => {
            button.addEventListener('click', (e) => {
              e.preventDefault();
              const modelContainerEl = modelContainerEls.find(
                (el) =>
                  el.attributes['data-name'].nodeValue ===
                  button.textContent.split(' ')[0],
              );
              modelContainerEls.forEach((el) => {
                el.style.backgroundColor = '';
              });
              modelContainerEl.style.backgroundColor = '#d7edff';
              modelContainerEl.scrollIntoView({ behavior: 'smooth' });
            });
          });
        }, 101);
      } else {
        console.error('❌ initSidebar not found');
      }
    }
  }, 100);
};

document.addEventListener('DOMContentLoaded', () => {
  document.body.appendChild(sidebarScript);
});
