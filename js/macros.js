const DIFFUSIONRIG_PROJECT = "https://diffusionrig.github.io/";

const DISSERTATION_PDF = "https://drive.google.com/file/d/1-cUlfdSXbekzRZB4FO3OEmdSi3i-MoaT/view";

const NLT_PROJECT = "http://nlt.csail.mit.edu/";

const MOSCULP_PROJECT = "http://mosculp.csail.mit.edu/";
const MOSCULP_PHOTOS = "https://photos.app.goo.gl/HkTbsYtXQXxBo8up6";
const MOSCULP_FORBES = "https://www.forbes.com/sites/jenniferhicks/2018/09/25/these-researchers-turned-2d-videos-into-3d-motion-sculptures";
const MOSCULP_BBC = "https://www.bbc.com/news/av/technology-45552015/creating-3d-sculptures-from-2d-video-and-other-news";
const MOSCULP_MIT = "https://news.mit.edu/2018/creating-3-d-printed-motion-sculptures-from-2-d-videos-mit-csail-0919";
const MOSCULP_MIT_HOMEPAGE = "docs/news/mosculp_mit_homepage.png";

const GENRE_PROJECT = "http://genre.csail.mit.edu/";

const AD_PAPER = "http://dx.doi.org/10.1073/pnas.1611073113";
const AD_NUS = "http://news.nus.edu.sg/highlights/model-illuminates-alzheimers-disease";
const AD_PT = "https://www.psychologytoday.com/intl/blog/the-athletes-way/201610/alzheimers-study-links-triad-brain-areas-cognition";
const AD_MGH = "docs/news/ad_mgh.pdf";

const MIT_RED = "#135d99";
const MIT_DARK_GRAY = "#8A8B8C";
const MIT_LIGHT_GRAY = "#C2C0BF";


function clickme(text, link) {
  document.write("<a target='_blank' href=" + link + ">" + text + "</a>");
}

function clickable(text, link) {
  document.write("<a class='lowkey' target='_blank' href=" + link + ">" + text + "</a>");
}

function clickableperson(text, link) {
  document.write("<a style='color: #135d99;' class='lowkey' target='_blank' href=" + link + ">" + text + "</a>");
}

function text_button(text, link) {
  clickable("[" + text + "]", link);
}

function code_link(link) {
  document.write(`
  <a href=` + link + ` target='_blank' class="button alt icon fa-github small">Code</a>
  `)
}

function paper_link(link) {
  document.write(`
  <a href=` + link + ` target='_blank' class="button alt icon fa-file-pdf-o small">Paper</a>
  `)
}

function project_link(link) {
  document.write(`
  <a href=` + link + ` target='_blank' class="button alt icon fa-file small">Project Page</a>
  `)
}

function bib_link(link) {
  document.write(`
  <a href=` + link + ` target='_blank' class="button alt icon fa-google small">Bibtex</a>
  `)
}

function undef() {
  document.write("<font color='#FF0000'>UNDEFINED</font>");
}

function getPerson(id) {
  switch (id) {
    case "me":
      document.write("<u>Ashish Ramayee Asokan</u>");
      break;
    case "xiuming":
      clickable("Xiuming Zhang", "https://xiuming.info/");
      break;
    case "harsh":
      clickable("Harsh Rangwani", "https://rangwani-harsh.github.io/about/");
      break;
    case "srava":
      clickable("Sravanti Addepalli", "https://scholar.google.com/citations?user=MOO12i0AAAAJ&hl=en");
      break;
    case "venky":
      clickable("Prof. Venkatesh Babu", "https://cds.iisc.ac.in/faculty/venky/");
      break;
    case "sss":
      clickable("Prof. Shylaja Sharath", "https://staff.pes.edu/nm1297/");
      break;
    case "anc":
      clickable("Prof. Anirban Chakraborty", "https://anirbanchakraborty.github.io/");
      break;
    case "ym":
      clickable("Yashwanth M", "https://www.linkedin.com/in/yashwanth-mandula-aba700a5/");
      break;
    case "raghu":
      clickable("Raghavendra Bhat", "https://in.linkedin.com/in/raghavendrabhat");
      break;
    default:
      undef();
  }
}

function getVenue(id, year) {
  switch (id) {
    case "iccv":
      clickable("ICCV".concat(" ", year), "https://en.wikipedia.org/wiki/International_Conference_on_Computer_Vision");
      break;
    case "ijcnn":
      clickable("WCCI IJCNN".concat(" ", year), "https://ieeexplore.ieee.org/xpl/conhome/1000500/all-proceedings");
      break;
    case "aiml":
      clickable("AI-ML Systems".concat(" ", year), "https://www.aimlsystems.org/2023");
      break;
    case "aistats":
      clickable("AISTATS".concat(" ", year), "https://aistats.org/index.html");
      break;
    case "wacv":
      clickable("WACV".concat(" ", year), "https://www.openresearch.org/wiki/WACV");
      break;
    case "nips":
      clickable("NeurIPS".concat(" ", year), "https://en.wikipedia.org/wiki/Conference_on_Neural_Information_Processing_Systems");
      break;
    case "uist":
      clickable("UIST".concat(" ", year), "https://en.wikipedia.org/wiki/ACM_Symposium_on_User_Interface_Software_and_Technology");
      break;
    case "eccv":
      clickable("ECCV".concat(" ", year), "https://en.wikipedia.org/wiki/European_Conference_on_Computer_Vision");
      break;
    case "cvpr":
      clickable("CVPR".concat(" ", year), "https://en.wikipedia.org/wiki/Conference_on_Computer_Vision_and_Pattern_Recognition");
      break;
    case "tog":
      clickable("TOG".concat(" ", year), "https://en.wikipedia.org/wiki/ACM_Transactions_on_Graphics");
      break;
    case "siggraph":
      clickable("SIGGRAPH".concat(" ", year), "https://en.wikipedia.org/wiki/SIGGRAPH");
      break;
    case "siggraph_asia":
      clickable("SIGGRAPH Asia".concat(" ", year), "https://en.wikipedia.org/wiki/SIGGRAPH");
      break;
    case "pnas":
      clickable("PNAS".concat(" ", year), "https://en.wikipedia.org/wiki/Proceedings_of_the_National_Academy_of_Sciences_of_the_United_States_of_America");
      break;
    case "ismrm":
      clickable("ISMRM".concat(" ", year), "https://en.wikipedia.org/wiki/International_Society_of_Magnetic_Resonance_in_Medicine");
      break;
    default:
      undef();
  }
}

function getAffli(id) {
  switch (id) {
    case "pes":
      clickable("PES University", "https://pes.edu/");
      break;
    case "val":
      clickable("Vision and AI Lab", "https://val.cds.iisc.ac.in/");
      break;
    case "intel":
      clickable("Intel", "https://www.intel.in/content/www/in/en/homepage.html");
      break;
    case "na":
      clickable("Niramai Health Analytix", "https://www.niramai.com/");
      break;
    case "gmac":
      clickable("GMAC Intelligence", "https://gi4all.com/");
      break;
    case "vcl":
      clickable("Visual Computing Lab", "https://visual-computing.in/");
      break;
    default:
      undef();
  }
}

function paper(link) {
  text_button("paper", link);
}

function poster(link) {
  text_button("poster", link);
}

function video(link) {
  text_button("video", link);
}

function talk(link) {
  text_button("talk", link);
}

function thesis(link) {
  text_button("thesis", link);
}

function code(link) {
  text_button("code", link);
}

function demo(link) {
  text_button("demo", link);
}

function doc(link) {
  text_button("doc", link);
}

function supp(link) {
  text_button("supp", link);
}

function project(link) {
  text_button("project", link);
}

function bibtex(link) {
  text_button("bibtex", link);
}

function patent(link) {
  text_button("patent", link);
}

function hl(text) {
  document.write(`<font color=${MIT_RED}>${text}</font>`);
}
