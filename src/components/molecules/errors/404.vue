<template>
  <div
    class="
      w-full h-full min-h-screen min-w-screen overflow-hidden fixed top-0 left-0 bg-black
      flex items-center justify-center backdrop-blur-4 blur-[3px]
    "
  >
    <div class="blackhole" />
    <div class="text">
      404
    </div>
  </div>
</template>
<style scoped>
.blackhole, .blackhole:before, .blackhole:after {
  animation: anim 7s linear infinite;
  color: white;
  display: flex;
  border-radius: 50%;
}

@keyframes anim {
  0% {
    transform: rotate(0deg)
  }
  100% {
    transform: rotate(-360deg)
  }
}

.blackhole {
  box-shadow: 1vh 0 3vh 2vh #f50,
  inset -2vh 0 3vh 4vh #f80,
  -1vh -1vh 35vh 0 #f60;
  position: relative;
  width: 50vh;
  height: 50vh;
  backdrop-filter: blur(var(--blur-md));
}

.blackhole:before, .blackhole:after {
  content: '';
  background: white;
  position: relative;
  top: 6vh;
}

.text {
  transform: translate(-50%, -50%);
  position: absolute;
  font-weight: bold;
  font-size: 12vh;
  color: #b9b9b9;
  top: 50%;
  left: 50%;
  letter-spacing: 5px;
}

@keyframes stationary {
  0% {
    transform: translate(-50%, -50%)
  }
  100% {
    transform: translate(-50%, -50%)
  }
}
</style>
