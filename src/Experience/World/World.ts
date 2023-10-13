import * as kokomi from "kokomi.js";
import * as THREE from "three";
import { Howl } from "howler";

import type Experience from "../Experience";

import TestObject from "./TestObject";
import AmbientLightComponent from "./AmbientLightComponent";
import DirectionalLightComponent from "./DirectionalLightComponent";
import PolarLight from "./PolarLight";
import StarParticle from "./StarParticle";
import Column from "./Column";
import GradientBackground from "./GradientBackground";
import BigCloud from "./BigCloud";
import Cloud from "./Cloud";
import HashFog from "./HashFog";
import Road from "./Road";
import ForwardCamera from "./ForwardCamera";

export default class World extends kokomi.Component {
  declare base: Experience;
  testObject: TestObject | null;
  alc!: AmbientLightComponent | null;
  dlc!: DirectionalLightComponent | null;
  pl!: PolarLight | null;
  sp!: StarParticle | null;
  co!: Column | null;
  gb!: GradientBackground | null;
  bc!: BigCloud | null;
  cl!: Cloud | null;
  hf!: HashFog | null;
  ro!: Road | null;
  fc!: ForwardCamera | null;
  bgm!: Howl;
  constructor(base: Experience) {
    super(base);

    this.testObject = null;

    this.base.am.on("ready", async () => {
      // const skybox = this.base.am.items["skybox"];
      // skybox.mapping = THREE.EquirectangularReflectionMapping;
      // // this.base.scene.background = skybox;

      // this.testObject = new TestObject(this.base);
      // this.testObject.addExisting();

      this.base.scene.fog = new THREE.Fog(0x389af2, 5000, 10000);

      this.gb = new GradientBackground(this.base);
      this.gb.addExisting();
      this.alc = new AmbientLightComponent(this.base);
      this.alc.addExisting();
      this.dlc = new DirectionalLightComponent(this.base);
      this.dlc.addExisting();
      this.co = new Column(this.base);
      this.co.addExisting();
      this.bc = new BigCloud(this.base);
      this.bc.addExisting();
      this.cl = new Cloud(this.base);
      this.cl.addExisting();
      this.pl = new PolarLight(this.base);
      this.pl.addExisting();
      this.sp = new StarParticle(this.base);
      this.sp.addExisting();
      this.hf = new HashFog(this.base);
      this.hf.addExisting();
      this.ro = new Road(this.base);
      this.ro.addExisting();
      this.fc = new ForwardCamera(this.base);
      this.fc.addExisting();

      await kokomi.sleep(1000);

      document.querySelector(".loader-screen")?.classList.add("hollow");

      const bgm = new Howl({
        src: "Genshin/BGM.mp3",
        loop: true,
      });
      this.bgm = bgm;
      bgm.play();

      await kokomi.sleep(1000);

      document.querySelector(".menu")?.classList.remove("hidden");

      document.querySelector(".btn-click-me")?.addEventListener("click", () => {
        const clickSound = new Howl({
          src: "Genshin/Genshin Impact [Duang].mp3",
        });
        clickSound.play();
        this.createDoor();
      });
    });
  }
  update(time: number): void {
    const progressbar = document.querySelector(
      ".loader-progress"
    )! as HTMLProgressElement;
    progressbar.value = this.base.am.loadProgress * 100;
  }
  // 创建门
  createDoor() {
    document.querySelector(".menu")?.classList.add("pointer-events-none");
    document.querySelector(".menu-content")?.classList.add("hollow");
    this.ro?.activateCreateDoor();
    this.ro?.on("stop-camera", () => {
      this.fc?.stop();
    });
    this.ro?.on("door-comeout", () => {
      const doorComeoutSound = new Howl({
        src: "Genshin/Genshin Impact [DoorComeout].mp3",
      });
      doorComeoutSound.play();
    });
    this.ro?.on("door-created", () => {
      const enterEl = document.querySelector(".enter");
      enterEl?.classList.remove("hidden");
      enterEl?.addEventListener("click", () => {
        const enterSound = new Howl({
          src: "Genshin/Genshin Impact [DoorThrough].mp3",
        });
        enterSound.play();
        this.enter();
      });
    });
  }
  // 进入游戏
  async enter() {
    const enterEl = document.querySelector(".enter");
    enterEl?.classList.add("hollow");
    this.ro?.openDoor();
    this.fc?.diveIn();
    this.emit("bloom-in");

    this.bgm.fade(1, 0, 2000);

    await kokomi.sleep(2000);

    this.startGame();
  }
  // 进游戏后随便做做啥
  startGame() {
    console.log("原神，启动！");
  }
}
