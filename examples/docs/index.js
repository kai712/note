import installation from './installation.md'
import NodeOrGo from './node-go.md'
import GoBaseType from './array_slice_map.md'
import GoGC from './golang_gc.md'
import GoKeywords from './golang_keywords.md'
import Goroutine from './goroutine.md'

const routes = [
  { path: '/', component: installation },
  { path: '/node-go', component: NodeOrGo },
  { path: '/array_slice_map', component: GoBaseType },
  { path: '/golang_gc', component: GoGC },
  {
    path: '/goroutine',
    component: Goroutine
  },
  { path: '/golang_keywords', component: GoKeywords }
]

export default routes
