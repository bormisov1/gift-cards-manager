<template>
  <div class="cube-container">
    <div data-w-id="9deb6b9f-af3b-274d-f6de-7c4c94acle16" class="_3d-cube">
      <div class="side _3d-cube-left-back"></div>
      <div class="side _3d-cube-top"></div>
      <div class="side _3d-cube-left-front"></div>
      <div class="side _3d-cube-right-back"></div>
      <div class="side _3d-cube-bottom"></div>
      <div class="side _3d-cube-right-front"></div>
    </div>
  </div>
</template>
<script>


       /*  // rotate the cube along the x axis
        angle = timeDelta * 0.001 * SPEED_X * Math.PI * 2;
        for (let v of vertices) {
            let dy = v.y - cy;
            let dz = v.z - cz;
            let y = dy * Math.cos(angle) - dz * Math.sin(angle);
            let z = dy * Math.sin(angle) + dz * Math.cos(angle);
            v.y = y + cy;
            v.z = z + cz;
        }

        // rotate the cube along the y axis
        angle = timeDelta * 0.001 * SPEED_Y * Math.PI * 2;
        for (let v of vertices) {
            let dx = v.x - cx;
            let dz = v.z - cz;
            let x = dz * Math.sin(angle) + dx * Math.cos(angle);
            let z = dz * Math.cos(angle) - dx * Math.sin(angle);
            v.x = x + cx;
            v.z = z + cz;
        } */
export default {
  name: 'cube',
  props: ['qrURL'],
  created() {
    this.applyCSS()
    console.log(1234)
  },
  /* beforeUpdate() {
    this.applyCSS()
  }, */
  methods: {
    applyCSS() {
      console.log(this.qrURL)
      let style = document.createElement("style")
      style.type = "text/css"
      document.body.appendChild(style) 
      style.innerHTML = `._3d-cube-left-front {
        background-image: url(${this.qrURL}) !important;
      }`
    }
  }, 
}
</script>
<style>
._3d-cube {
  position: relative;
  display: block;
  width: 40px;
  height: 300px;
  margin-right: auto;
  margin-left: auto;
  /* -webkit-transform: rotateX(135deg) rotateY(140deg) rotatez(25deg); */
  /* transform: rotateX(135deg) rotateY (140deg) rotatez (25deg); */
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;

	-webkit-transform: rotateX(-4deg) rotateY(282deg);
	transform: rotateX( -4deg ) rotateY(282deg );
	margin: 150px auto;

	-webkit-animation: giro 2s linear;
	animation: giro 2s linear;
  margin-top: 2px;
}

@-webkit-keyframes giro {
  0% { transform: scale(0)  rotateY(282deg); }
  50% { transform: scale(0.25) rotateY(657deg); }
  100% { transform: scale(0.5)  rotateY(1002deg); }
}

@keyframes giro {
  0% { transform: scale(0)  rotateY(282deg); }
  50% { transform: scale(0.5) rotateY(657deg); }
  100% { transform: scale(1)  rotateY(1002deg); }
}

/* @-webkit-keyframes giro360 {
  0% { -webkit-transform: rotateX(  0deg) rotateY(  0deg); }
  100% { -webkit-transform: rotateX(360deg) rotateY(360deg); }
}

@keyframes giro360 {
  0% { transform: rotateX(  0deg) rotateY(  0deg); }
  100% { transform: rotateX(360deg) rotateY(360deg); }
} */
.side {
  background: rgba(255, 255, 255, 0);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(1.5px);
  -webkit-backdrop-filter: blur(1.5px);
  border: 1px solid rgba(255, 255, 255, 0.57);
}

._3d-cube-right-back {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 300px;
  height: 300px;
  /* background-color: #991d1d; */
  -webkit-transform: translate(-150px, 0px) rotateX(0deg) rotateY(90deg) rotateZ(0deg);
  transform: translate(-150px, 0px) rotateX(0deg) rotateY(90deg) rotateZ(0deg);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}
._3d-cube-right-front {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 40px;
  height: 300px;
  /* background-color: #e6e625; */
  -webkit-transform: translate3d(0px, 0px, 150px);
  transform: translate3d(0px, 0px, 150px);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

._3d-cube-left-front {
  position: absolute; left: 0px;
  top: 0px; right: 0px; bottom: 0px;
  width: 300px;
  height: 300px;
  /* background-color: #ec2444; */
  -webkit-transform: translate(-110px, 0px) rotateX(0deg) rotateY(90deg) rotateZ(0deg);
  transform: translate(-110px, 0px) rotateX(0deg) rotateY(90deg) rotateZ(0deg);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

._3d-cube-bottom {
  position: absolute;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 40px;
  height: 300px;
  /* background-color: #414141; */
  -webkit-transform: translate(0px, -150px) rotateX(90deg) rotateY(180deg) rotateZ(0deg);
  transform: translate(0px, -150px) rotateX(90deg) rotateY(180deg) rotateZ(0deg);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}


._3d-cube-left-back {
  position: absolute;
  left: 0px; top: 0px; right: 0px; bottom: 0px;
  width: 40px;
  height: 300px;
  /* background-color: #819e8e; */
  -webkit-transform: translate3d(0px, 0px, -150px);
  transform: translate3d(0px, 0px, -150px);
  -webkit-transform-style: preserve-3d; transform-style: preserve-3d;
}
._3d-cube-top {
  position: absolute; left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  width: 40px;
  height: 300px;
  /* background-color: #5426b6; */
  -webkit-transform: translate(0px, 150px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
  transform: translate(0px, 150px) rotateX(90deg) rotateY(0deg) rotateZ(0deg);
  -webkit-transform-style: preserve-3d;
  transform-style: preserve-3d;
}

/* .cara-fondo{
	background: #000;
	position: absolute;
	border: 5px solid #000;
	border-radius: 19px;

} */

</style>