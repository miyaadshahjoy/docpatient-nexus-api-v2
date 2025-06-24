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

    console.log(swaggerRoot, rendered);
    if (rendered) {
      clearInterval(interval);
      if (typeof initSidebar === 'function') {
        initSidebar(document.body, swaggerRoot);
        console.log('✅ Sidebar initialized');
        //////////////////////////////////////////////////////////////////////
        const sidebarEl = document.querySelector('#sidebar');
        const swaggerUiEl = document.querySelector('#swagger-ui');
        sidebarEl.style.display = 'none';
        setTimeout(() => {
          sidebarEl.style.display = 'block';
          console.log(sidebarEl, sidebarEl.querySelectorAll('.sectionTitle'));
          const sectionTitles = sidebarEl.querySelectorAll('.sectionTitle');
          sectionTitles.forEach((title) => {
            title.style.cursor = 'pointer';
            const str = title.textContent;
            const match = str.match(/^[A-Z][a-z]+(-[A-Z][a-z]+)?/);
            const firstPhrase = match ? match[0] : '';
            title.textContent = firstPhrase;
          });
          console.log(
            Array.from(
              sidebarEl.querySelectorAll('.part .link.opblock'),
            ).forEach((part) => {
              console.log(part);
              const opBlock = swaggerUiEl.querySelector(
                `#${part.attributes.href.nodeValue.split('#')[1]}`,
              );
              console.log(
                opBlock.querySelector('.opblock-summary-description')
                  .textContent,
              );
              part.querySelector('.partPath').textContent =
                opBlock.querySelector(
                  '.opblock-summary-description',
                ).textContent;
            }),
          );
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
