import { setupHeadline } from "./components/headline.js";
import { setupPrivateCompanies } from "./components/boards/privateCompanies.js";
import { setupPubliDepartments } from "./components/boards/publicSector.js";
import { setupPrivateSector } from "./components/boards/privateSector.js";
import { setupNavigation } from "./components/navigation/navbar.js";
import { setupInstallPrormpt } from "./components/pwa/prompt.js";
document.querySelector("#app").innerHTML = `
  <header>
  
  </header>
  <br/>
  <div id="headline">

    <div id="headline-message" class="card">
    <h2> Boitekong Community Job Board</h2>
    <br/>
        <p>We're all about connecting you with job opportunities from various sectors. Our board features vacancies from:</p>
        <ul>
            <li><strong>Public sector departments and entities</strong> 🏛️</li>
            <li><strong>Private sector companies</strong> 🏢</li>
            <li><strong>Job posts from other job agencies</strong> 📑</li>
        </ul>
  
        <p>Whether you're a fresh graduate 🎓 or an experienced professional 👩‍💼👨‍💼, we're here to help you navigate your career path. 
          Dive in and explore the multitude of opportunities waiting for you! 🚀💼</p>
       <br/>
       <h3>Looking for a job in the South African Market</h3>
       <br/>
       <h4>Start Here</h4>
       <h2>Currently There Are :</h2>
       <br/>
        <ul id="headline-job-info"></ul>
        <br/> 
       <p class="call-to-action">
          share site with friends
       
        
          <button id="share-site" class="apply share">
            <img class="share-button img-icon"  loading="lazy" src="./public/assets/share.png" atl="share image"/>
          </button>
       
       </span>
    </div>
  </div>
  <div id="job-board"></div>
  <div id="pvt-job-board"></div>

  <dialog id="dialog">
      <article id="info"> 
      </article>
      <button id="close-dialog">Close</button>
  </dialog>

  <footer id="contact">
    © 2023 K.T Motshoana
    <section>
        <a
        href="https://t.me/Kebalepile_1"
        target="_blank"
        rel="noopener noreferrer"
        title="https://t.me/Kebalepile_1"
        ><i class="fa fa-telegram" style="font-size: 36px"></i
      ></a>
      <a href="mailto:boitkongcommunity@gmail.com" title="boitkongcommunity@gmail.com"
        ><i class="fa fa-envelope" style="font-size: 36px"></i
      ></a>
    </section>
  </footer>
`;
const shareSiteButon = document.getElementById("share-site");

shareSiteButon.addEventListener("click", async () => {
  const shareData = {
    title: "Boitekong Job Board",
    text: "available job vacancy, might be suitable for you!",
    url: location.origin
  };
  try {
    await navigator.share(shareData);
  } catch (err) {
    console.error(err);
  }
});
const closeButton = document.getElementById("close-dialog");

closeButton.addEventListener("click", () => {
  dialog.close();
});

setupHeadline(document.querySelector("#headline-job-info"));
setupPubliDepartments(document.querySelector("#job-board"));
setupPrivateCompanies(document.querySelector("#job-board"));
setupPrivateSector(document.querySelector("#pvt-job-board"));
setupNavigation(document.querySelector("header"));
setupInstallPrormpt(document.querySelector("#install-app"));
