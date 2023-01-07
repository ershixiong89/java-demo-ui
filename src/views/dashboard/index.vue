<template>
  <div class="dashboard-container">
    <div class="welcome-container">
      <span class="welcome-container-first">WELCOME</span>
      <span class="welcome-container-first">TO</span>
      <h1>Chaser-h.com</h1>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss">
@import "@/styles/mixin.scss";
@import "@/styles/animation.scss";
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.dashboard-container {
  height: 100%;
  .welcome-container {
    height: 100%;
    width: 100%;
    margin-top: 80px;
    @include flexStyle(center, center, column);
    .welcome-container-first {
      color: $secondaryText;
      font-size: 40px;
      font-weight: lighter;
      padding: 20px 0;
      letter-spacing: 3px;
      @include setAnimation(slide_down__big 0.8s 1);
    }
    h1 {
      // letter-spacing: 2px;
      letter-spacing: 1.5px;
      -webkit-box-reflect: below 0 -webkit-gradient(linear, left top, left
            bottom, from(rgba(0, 0, 0, 0)), to(rgba(212, 94, 94, 0.10)));
      @include setAnimation(slide_down__big 1s 1);
    }
  }  
}
</style>
