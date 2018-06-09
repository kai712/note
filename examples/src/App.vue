<template>
  <div class="app">
    <page-header></page-header>
    <div class="main-content">
      <div class="page-container clearfix">
        <side-nav base="/component"></side-nav>
        <div class="page-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PageHeader from './components/page-header'
import SideNav from './components/slide-nav'

export default {
  name: 'App',
  components: { PageHeader, SideNav },
  data () {
    return {
    }
  }
}
</script>

<style lang="less">
@import url('../assets/docs.less');
@import url('highlight.js/styles/monokai-sublime.css');
</style>
