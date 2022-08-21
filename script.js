window.onload = setup;

let article;

function setup() {
    article = document.querySelector('article');
    if (window.location.hash != '') {
        loadArticle(window.location.hash);
    } else {
        loadArticle('home');
    }
    // loadArticle('Secure Logins with NodeJS and SQL');
}

function setArticle(a) {
    article.innerHTML = a;
    hljs.highlightAll();
}

async function loadArticle(a) {
    const la = getArticle(a);

    console.log(`Loading article '${la.name}'`);

    const pageContent = await (await fetch(la.url)).text();

    let processedPageContent = pageContent;

    const evalst = [];

    const matches = pageContent.matchAll(/\{\{ ?(.*?)? ?\}\}/mg);
    let done = false;

    while (!done) {
        const match = matches.next()
        if (match.done) { done = true; break; }
        evalst.push(match.value);
    }

    const evals = [];

    evalst.forEach(e => { evals.push({ 'js': e[1], 'selector': e[0], 'evaluation': eval(e[1]) }); });

    evals.forEach(e => { processedPageContent = processedPageContent.replace(e.selector, e.evaluation) });

    const content = `
	<h2 class="center">${la.name}</h2>
	${processedPageContent}
	`;

    window.location.hash = `#${la.url.replace('/pages/', '').replace('.html', '')}`;

    setArticle(content);
}

function getArticle(ta) {
    if (ta.endsWith('.html'))
        return getArticles().filter(
            a => a.url == ta.replace('#', ''))[0];
    return getArticles().filter(
        a => a.url == '/pages/' + ta.replace('#', '') + '.html')[0];
}

function getArticles() {
    return [
        {
            'name': 'Secure Logins with NodeJS and SQL',
            'url': '/pages/secure-logins-with-nodejs-and-sql.html'
        },
        {
            'name': 'Articles',
            'url': '/pages/articles.html'
        },
        {
            'name': 'About',
            'url': '/pages/about.html'
        },
        {
            'name': 'Home',
            'url': '/pages/home.html'
        },
        {
            'name': 'Projects',
            'url': '/pages/projects/projects.html'
        },
        {
            'name': 'PyOS',
            'url': '/pages/projects/pyos/about.html'
        },
        {
            'name': 'PyOS - Getting Started',
            'url': '/pages/projects/pyos/getting-started.html'
        }
    ];
}