window.onload = setup;

let article;

async function setup() {
    article = document.querySelector('article');
    if (window.location.hash != '') {
        loadArticle(window.location.hash);
    } else {
        loadArticle('home');
    }
}

function setArticle(a) {
    article.innerHTML = a;
    hljs.highlightAll();
}

async function loadArticle(a) {
    const la = await getArticle(a);

    console.log(`Loading article '${la.name}'`);

    const pageContent = la.content;

    let processedPageContent = pageContent;

    const evalst = [];

    const regex = /{{ ?(.*?)? ?}}/gims;

    let m;

    while ((m = regex.exec(pageContent)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        // The result can be accessed through the `m`-variable.
        m.forEach((match) => {
            if (match[0] == '{' && match[1] == '{')
                evalst.push([match, match.replace('{{', '').replace('}}', '').trim()])
        });
    }


    const evals = [];

    evalst.forEach(e => { evals.push({ 'js': e[1], 'selector': e[0], 'evaluation': eval(e[1]) }); });

    evals.forEach(e => { processedPageContent = processedPageContent.replace(e.selector, e.evaluation) });

    const content = `
	<h2 class="center">${la.name}</h2>
	${processedPageContent}
	`;

    window.location.hash = la.url

    setArticle(content);
}

async function getArticle(ta) {
    ta = ta.replace('#', '');
    let name = ta.replace(/\.html/gim, '').replace(/-/g , ' ');
    name = name.split('/')[name.split('/').length - 1];
    name = toTitleCase(name);
    let url;
    if(ta.endsWith('.html'))
        url = ta;
    else
        url = ta + '.html';

    return {
        content: await (await fetch('pages/' + url)).text(),
        name: name,
        url: url
    };
}

window.addEventListener('hashchange', (e) => {
    if(e.isTrusted) {
        console.log(e.oldURL, e.newURL);
        loadArticle(window.location.hash);
    }
})

function toTitleCase(str) {
    let noCapWords = [
        "a",
        "and",
        "as",
        "at",
        "buy",
        "by",
        "down",
        "for",
        "from",
        "if",
        "in",
        "into",
        "like",
        "near",
        "nor",
        "of",
        "off",
        "on",
        "once",
        "onto",
        "or",
        "over",
        "past",
        "so",
        "than",
        "that",
        "to",
        "upon",
        "when",
        "with",
        "yet"
    ];

    let arr = [];
    let split = str.split(' ');

    for(let i=0;i<split.length;i++) {
        if(i == 0) arr.push(split[i].charAt(0).toUpperCase() + split[i].slice(1));
        else if(!noCapWords.includes(split[i])) arr.push(split[i].charAt(0).toUpperCase() + split[i].slice(1));
        else arr.push(split[i])
    }
    return arr.join(' ');
}