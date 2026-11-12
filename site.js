/* Projects page: open a project inside a view transition.
   TODO: edit the text, add more entries, and add a matching button in projects.html. */
const projects = {
  graphrag: {
    title: "GraphRAG pipeline",
    body: "A retrieval pipeline that answers questions from a knowledge graph instead of plain text chunks, so it can follow relationships between things. I score its answers with an evaluation suite to see where it fails and why.",
    stack: "Neo4j, LlamaIndex, RAGAS, Docker",
    status: "Working, still improving",
    link: ["github.com/tentativity-77/rag-implementation", "https://github.com/tentativity-77/rag-implementation"]
  },
  dive: {
    title: "Dive site agent",
    body: "A personal agent that suggests where to dive next. It pauses for my approval before it acts, which is the part I most wanted to learn how to build.",
    stack: "LangGraph, human-in-the-loop approval",
    status: "In progress",
    link: null
  }
};

const list   = document.getElementById("project-list");
const detail = document.getElementById("project-detail");
const title  = document.getElementById("detail-title");
let openedFrom = null;

/* Run a DOM change inside a view transition when the browser supports it,
   and run it directly when it doesn't. */
function transition(change) {
  if (!document.startViewTransition) { change(); return Promise.resolve(); }
  return document.startViewTransition(change).finished;
}

list.addEventListener("click", (event) => {
  const card = event.target.closest(".project");
  if (!card) return;
  const data = projects[card.dataset.project];
  const cardTitle = card.querySelector("h3");
  openedFrom = card;

  // Name the clicked title so the browser knows what to morph FROM.
  cardTitle.style.viewTransitionName = "project-title";

  transition(() => {
    cardTitle.style.viewTransitionName = "";
    title.textContent = data.title;
    document.getElementById("detail-body").textContent = data.body;
    document.getElementById("detail-stack").textContent = data.stack;
    document.getElementById("detail-status").textContent = data.status;
    const link = document.getElementById("detail-link");
    link.textContent = "";
    if (data.link) {
      const a = document.createElement("a");
      a.href = data.link[1]; a.textContent = data.link[0];
      link.append(a);
    } else {
      link.textContent = "Not public yet";
    }
    list.hidden = true;
    detail.hidden = false;   // its heading carries the same name in CSS: the morph TO
    title.focus({ preventScroll: true });
  });
});

document.getElementById("project-back").addEventListener("click", () => {
  const cardTitle = openedFrom.querySelector("h3");
  transition(() => {
    detail.hidden = true;
    list.hidden = false;
    cardTitle.style.viewTransitionName = "project-title";
    openedFrom.focus({ preventScroll: true });
  }).then(() => { cardTitle.style.viewTransitionName = ""; });
});
