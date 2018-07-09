<template>
  <div class="side-nav">
    <ul>
      <li class="nav-item">
				<router-link class="nav-title-item" to="/" >前言</router-link>
      </li>
			<li class="nav-item">
				<router-link class="nav-title-item" active-class="active" to="/node-go" >客观对比Node 与 Golang</router-link>
      </li>
			<li class="nav-item">
				<router-link class="nav-title-item" active-class="active" to="/golang_keywords" >Golang的25个关键字总结</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-title-item" active-class="active" to="/array_slice_map" >Array、Slice、Map原理浅析</router-link>
      </li>
			<li class="nav-item">
				<router-link class="nav-title-item" active-class="active" to="/golang_gc" >Go 与 Node 内存分配与垃圾回收</router-link>
			</li>
			<li class="nav-item">
				<router-link class="nav-title-item" active-class="active" to="/goroutine" >goroutine 调度原理</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    base: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="less">
.side-nav {
	flex: 0 0 250px;
	box-sizing: border-box;
	padding: 40px 0;
  border-right: 1px solid #e5e5e5;
  .nav-title-item {
    &:hover {
      color: #3388FF;
    }
  }
	li {
		list-style: none;
	}
	ul {
		padding: 0;
		margin: 0;
		overflow: hidden;
	}
	.nav-item {
		a {
			font-size: 14px;
			color: #333;
			line-height: 40px;
			height: 40px;
			margin: 0;
			padding: 0;
			text-decoration: none;
			display: block;
			position: relative;
			transition: all .3s;
			padding: 0 20px;
			display: block;
			&:hover {
				color: #333;
				background-color: #f5f5f5;
			}
			&.active {
				color: #333;
				background-color: #f5f5f5;
			}
		}
	}
	.nav-group__title {
		font-size: 12px;
		color: #666;
		padding-left: 28px;
		line-height: 26px;
    margin-top: 10px;
	}
}
</style>