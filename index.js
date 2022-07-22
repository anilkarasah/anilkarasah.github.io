const fs = require('fs');
const http = require('http');
const express = require('express');

const app = express();

app.use(express.static('public'));

const pageTemplate = fs.readFileSync(
  './src/scripts/page-template.html',
  'utf8'
);
const projectTemplate = fs.readFileSync(
  './src/scripts/project-template.html',
  'utf8'
);

const socialTemplate = fs.readFileSync(
  './src/scripts/social-template.html',
  'utf8'
);

const server = http.createServer((req, res) => {
  let lang;
  if (req.url === '/' || req.url === '/tr') {
    lang = fs.readFileSync('./lang/tr.json');
  } else if (req.url === '/en') {
    lang = fs.readFileSync('./lang/en.json');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html' });
    return res.end('Page not found.');
  }

  const langObj = JSON.parse(lang);
  const page = replaceTemplate(pageTemplate, langObj);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(page);
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Server is now open!');
});

function replaceTemplate(temp, data) {
  temp = temp.replace(/{@html-lang}/g, data.htmlLang);
  temp = temp.replace(/{@title}/g, data.title);
  temp = temp.replace(/{@introduce}/g, data.introduce);
  temp = temp.replace(/{@my-img}/g, `img/${data.myImg}`);
  temp = temp.replace(/{@about-title}/g, data.aboutTitle);
  temp = temp.replace(/{@about-paragraph}/g, data.aboutParagraph);
  temp = temp.replace(/{@about-position}/g, data.aboutPosition);
  temp = temp.replace(/{@techstack-title}/g, data.techstackTitle);
  temp = temp.replace(/{@techstack-pl-title}/g, data.techstackPlTitle);
  temp = temp.replace(/{@techstack-fw-title}/g, data.techstackFwTitle);
  temp = temp.replace(/{@projects-title}/g, data.projectsTitle);
  temp = temp.replace(/{@contact-email}/g, data.contactEmail);
  temp = temp.replace(/{@footer-email}/g, data.footerEmail);

  let techstackPL = '';
  data.techstackPl.forEach((el) => (techstackPL += `<li>${el}</li>`));
  temp = temp.replace(/{@techstack-pl-items}/g, techstackPL);

  let techstackFW = '';
  data.techstackFw.forEach((el) => (techstackFW += `<li>${el}</li>`));
  temp = temp.replace(/{@techstack-fw-items}/g, techstackFW);

  let projects = '';
  data.projects.forEach((el) => {
    const temp = projectTemplate;
    projects += temp
      .replace(/{@project-title}/g, el.title)
      .replace(/{@project-description}/g, el.description)
      .replace(/{@project-url}/g, el.url);
  });

  let social = '';
  data.social.forEach((el) => {
    const temp = socialTemplate;
    social += temp
      .replace(/{@social-icon}/g, el.icon)
      .replace(/{@social-url}/g, el.url);
  });

  temp = temp.replace(/{@projects-list}/g, projects);
  temp = temp.replace(/{@social-list}/g, social);

  return temp;
}
