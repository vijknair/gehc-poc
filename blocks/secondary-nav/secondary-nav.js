export default function decorate(block) {
  const rows = [...block.children];

  const breadcrumbRow = rows[0];
  const linkRows = rows.slice(1);

  const nav = document.createElement('div');
  nav.classList.add('secondary-nav-inner');

  // breadcrumb row
  if (breadcrumbRow) {
    const crumbs = document.createElement('div');
    crumbs.classList.add('secondary-nav-breadcrumbs');
    const links = breadcrumbRow.querySelectorAll('a');
    links.forEach((link, i) => {
      if (i === links.length - 1) {
        const span = document.createElement('span');
        span.classList.add('secondary-nav-current');
        span.textContent = link.textContent;
        crumbs.append(span);
      } else {
        const backLink = document.createElement('a');
        backLink.href = link.href;
        backLink.classList.add('secondary-nav-back');
        backLink.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10.25 1C10.32 1 10.38 1.01 10.44 1.04C10.5 1.06 10.56 1.1 10.6 1.15C10.65 1.2 10.69 1.25 10.71 1.31C10.74 1.37 10.75 1.43 10.75 1.5C10.75 1.57 10.74 1.63 10.71 1.69C10.69 1.75 10.65 1.81 10.6 1.85L4.46 8L10.6 14.15C10.65 14.2 10.69 14.25 10.71 14.31C10.74 14.37 10.75 14.43 10.75 14.5C10.75 14.57 10.74 14.63 10.71 14.69C10.69 14.75 10.65 14.81 10.6 14.85C10.56 14.9 10.5 14.94 10.44 14.96C10.38 14.99 10.32 15 10.25 15C10.18 15 10.12 14.99 10.06 14.96C10 14.94 9.95 14.9 9.9 14.85L3.4 8.35C3.35 8.31 3.31 8.25 3.29 8.19C3.26 8.13 3.25 8.07 3.25 8C3.25 7.93 3.26 7.87 3.29 7.81C3.31 7.75 3.35 7.7 3.4 7.65L9.9 1.15C9.95 1.1 10 1.06 10.06 1.04C10.12 1.01 10.18 1 10.25 1Z" fill="currentColor"/></svg> ${link.textContent}`;
        crumbs.append(backLink);
      }
    });
    nav.append(crumbs);
  }

  // page links + CTAs
  if (linkRows.length > 0) {
    const linksWrap = document.createElement('div');
    linksWrap.classList.add('secondary-nav-links');

    const pageLinks = document.createElement('div');
    pageLinks.classList.add('secondary-nav-pages');

    const ctaLinks = document.createElement('div');
    ctaLinks.classList.add('secondary-nav-ctas');

    linkRows.forEach((row) => {
      const link = row.querySelector('a');
      if (!link) return;
      const text = link.textContent.trim();
      const isCta = text === 'Book a demo' || text === 'Request a quote'
        || link.href === '#' || link.closest('.button-container');
      if (isCta) {
        const btn = document.createElement('a');
        btn.href = link.href;
        btn.textContent = text;
        btn.classList.add('secondary-nav-cta');
        if (ctaLinks.children.length === 0) btn.classList.add('primary');
        else btn.classList.add('secondary');
        ctaLinks.append(btn);
      } else {
        const navLink = document.createElement('a');
        navLink.href = link.href;
        navLink.textContent = text;
        navLink.classList.add('secondary-nav-page');
        if (window.location.pathname === link.pathname) {
          navLink.classList.add('active');
        }
        pageLinks.append(navLink);
      }
    });

    linksWrap.append(pageLinks);
    linksWrap.append(ctaLinks);
    nav.append(linksWrap);
  }

  block.replaceChildren(nav);
}
