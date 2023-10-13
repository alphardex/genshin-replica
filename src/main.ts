import "@alphardex/aqua.css/dist/aqua.min.css";
import "./style.css";

import Experience from "./Experience/Experience";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = /* html */ `
<div id="sketch"></div>
<div class="loader-screen fixed z-5 top-0 left-0 w-full h-full bg-white transition-opacity"
  style="transition-duration: 1.5s;">
  <div class="absolute hv-center">
    <div class="flex flex-col items-center space-y-6">
      <img src="./Genshin/Genshin.png" class="title block" style="width: 45vmin;" alt="" />
      <progress class="loader-progress progress-bar" value="0" max="100"></progress>
    </div>
  </div>
</div>
<div class="menu fixed z-4 top-0 left-0 w-full h-full select-none hidden">
  <div class="menu-content transition-opacity duration-1000">
    <div class="absolute" style="bottom: 16%;right: 4%;">
      <div class="flex flex-col items-center space-y-3">
        <div class="menu-btn btn-click-me" style="width: 7vmin;height: 7vmin;">
          <img src="./Genshin/ClickMe.png" class="w-full h-full block" alt="" />
        </div>
      </div>
    </div>
    <div class="disclaimer">
      <p>免责声明：</p>
      <p>
        本网站是一个纯粹的技术示例，旨在展示和分享我们的技术能力。网站的设计和内容受到《原神》的启发，并尽可能地复制了《原神》的登录界面。我们对此表示敬意，并强调这个项目不是官方的《原神》产品，也没有与《原神》或其母公司miHoYo有任何关联。
      </p>
      <p>
        我们没有，也无意从这个项目中获得任何经济利益。这个网站的所有内容仅供学习和研究目的，以便让更多的人了解和熟悉webgl开发技术。
      </p>
      <p>如果miHoYo或任何有关方面认为这个项目侵犯了他们的权益，请联系我们，我们会立即采取行动。</p>
    </div>
  </div>
</div>
<div class="enter fixed z-4 top-0 left-0 w-full h-full transition-opacity duration-500 select-none hidden">
  <div class="enter-bg absolute" style="bottom: 4vmin;left: 2%;width: 96%;">
    <div class="flex-center"
      style="height: 4.5vmin;background: linear-gradient(to right, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.482) 50%, rgba(0, 0, 0, 0) 100%);">
      <img src="./Genshin/Entry.png" class="enter-entry block" style="height: 2.5vmin;" alt="" />
    </div>
  </div>
</div>
<div class="loading-element fixed z-4 top-0 left-0 w-full h-full bg-white select-none overflow-hidden hollow">
  <div class="absolute hv-center">
    <div class="loading-element-wrapper">
      <img src="./Genshin/Elements.png" class="loading-element-img" alt="" />
    </div>
  </div>
</div>
`;

const app = document.querySelector("#app")! as HTMLElement;

// 移动端横屏适配（DOM侧）
const handleResize = (el: HTMLElement) => {
  const width = document.documentElement.clientWidth,
    height = document.documentElement.clientHeight;
  if (width > height) {
    el.style.webkitTransform = el.style.transform = `rotate(0deg)`;
    el.style.width = `${width}px`;
    el.style.height = `${height}px`;
    el.style.webkitTransformOrigin = el.style.transformOrigin = `center`;
  } else {
    el.style.webkitTransform = el.style.transform = `rotate(90deg)`;
    el.style.width = `${height}px`;
    el.style.height = `${width}px`;
    el.style.webkitTransformOrigin = el.style.transformOrigin = `${
      width / 2
    }px center`;
  }
};

handleResize(app);
window.addEventListener("resize", () => {
  handleResize(app);
});

new Experience("#sketch");
