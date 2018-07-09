<h1 class="mb-0 align-center">Array、Slice、Map原理浅析</h1>

## Array
数组（值类型），是用来存储集合数据的，这种场景非常多，我们编码的过程中，都少不了要读取或者存储数据。当然除了数组之外，我们还有切片、Map映射等数据结构可以帮我们存储数据，但是数组是它们的基础。

#### 声明和初始化

数组初始化的几种方式
``` javascript
a := [10]int{ 1, 2, 3, 4 } // 未提供初始化值的元素为默认值 0
b := [...]int{ 1, 2 } // 由初始化列表决定数组⻓度，不能省略 "..."，否则就成 slice 了。
c := [10]int{ 2:1, 5:100 } // 按序号初始化元素
```

数组⻓度下标 n 必须是编译期正整数常量 (或常量表达式)。 ⻓度是类型的组成部分，也就是说 "[10]int" 和 "[20]int" 是完全不同的两种数组类型。
``` javascript
var a [20]int
var b [10]int
// 这里会报错，不同类型，无法比较
fmt.Println(a == b)
```

数组是值类型，也就是说会拷⻉整个数组内存进⾏值传递。可⽤ slice 或指针代替。

``` javascript
func test(x *[4]int) {
  for i := 0; i < len(x); i++ {
    println(x[i])
  }
  x[3] = 300
}

// 取地址传入
a := [10]int{ 1, 2, 3, 4 }
test(&a)

// 也可以⽤ new() 创建数组，返回数组指针。
var a = new([10]int) // 返回指针。
test(a)
```

## Slice

![d](https://odum9helk.qnssl.com/FmwMuz8-I-CQGkXjvXknBcRfEhqZ)

一个slice是一个数组某个部分的引用。在内存中，它是一个包含3个域的结构体：指向slice中第一个元素的指针，slice的长度，以及slice的容量。长度是下标操作的上界，如x[i]中i必须小于长度。容量是分割操作的上界，如x[i:j]中j不能大于容量。

src/pkg/runtime/runtime.h
``` javascript
struct Slice {
  byte* array  // actual data
  uint32 len  // number of elements
  uint32 cap  // allocated number of elements
};
```

对 slice 的修改就是对底层数组的修改。
``` javascript
func main() {
	x := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	s := x[:6]
	s = append(s, 10)
	s[0] = 100
	fmt.Println(x)
	fmt.Println(s)
}
```
输出
``` javascript
[100 1 2 3 4 5 10 7 8 9]
[100 1 2 3 4 5 10]
```
但是当slice的len超出了原底层数组的cap的时候，此时就会新开辟一块内存区域用来存储新建的底层数组。
``` javascript
func main() {
	x := [...]int{0, 1, 2, 3, 4, 5, 6, 7, 8, 9}
	s := x[:]
	s = append(s, 10)
	s[0] = 100
	fmt.Println(x)
	fmt.Println(s)
}
```
输出
``` javascript
[0 1 2 3 4 5 6 7 8 9]
[100 1 2 3 4 5 6 7 8 9 10]
```

![d](https://odum9helk.qnssl.com/FhNNKlEH4hBnVtGkTfc8KvqNqKpv)

函数 copy ⽤于在 slice 间复制数据，可以是指向同⼀底层数组的两个 slice。复制元素数量受限于src 和 dst 的 len 值 (两者的最⼩值)。在同⼀底层数组的不同 slice 间拷⻉时，元素位置可以重叠。

``` javascript
func main() {
  s1 := []int{ 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 }
  s2 := make([]int, 3, 20)
  var n int
  n = copy(s2, s1) // n = 3。不同数组上拷⻉。s2.len == 3，只能拷 3 个元素。
  fmt.Println(n, s2, len(s2), cap(s2)) // [0 1 2], len:3, cap:20
  s3 := s1[4:6] // s3 == [4 5]。s3 和 s1 指向同⼀个底层数组。
  n = copy(s3, s1[1:5]) // n = 2。同⼀数组上拷⻉，且存在重叠区域。
  fmt.Println(n, s1, s3) // [0 1 2 3 1 2 6 7 8 9] [1 2]
}
```
输出
``` javascript
3 [0 1 2] 3 20
2 [0 1 2 3 1 2 6 7 8 9] [1 2]
```

数组的slice并不会实际复制一份数据，它只是创建一个新的数据结构，包含了另外的一个指针，一个长度和一个容量数据。 如同分割一个字符串，分割数组也不涉及复制操作：它只是新建了一个结构来放置一个不同的指针，长度和容量。

由于slice是不同于指针的多字长结构，分割操作并不需要分配内存，甚至没有通常被保存在堆中的slice头部。这种表示方法使slice操作和在C中传递指针、长度对一样廉价。

#### slice的扩容规则
在对slice进行append等操作时，可能会造成slice的自动扩容。其扩容时的大小增长规则是：

* 如果新的大小是当前大小2倍以上，则大小增长为新大小
* 否则循环以下操作：如果当前大小小于1024，按每次2倍增长，否则每次按当前大小1/4增长。直到增长的大小超过或等于新大小。

#### make和new
Go有两个数据结构创建函数：new和make。基本的区别是new(T)返回一个*T，返回的这个指针可以被隐式地消除引用。而make(T, args)返回一个普通的T。通常情况下，T内部有一些隐式的指针。一句话，new返回一个指向已清零内存的指针，而make返回一个复杂的结构。

#### 总结
* 多个slice指向相同的底层数组时，修改其中一个slice，可能会影响其他slice的值；
* slice作为参数传递时，比数组更为高效，因为slice的结构比较小；
* slice在扩张时，可能会发生底层数组的变更及内存拷贝；
* 因为slice引用了数组，这可能导致数组空间不会被gc，当数组空间很大，而slice引用内容很少时尤为严重；

## Map
Go中的map在底层是用哈希表实现的。Golang采用了HashTable的实现，解决冲突采用的是链地址法。也就是说，使用数组+链表来实现map。

Map存储的是无序的键值对集合。

不是所有的key都能作为map的key类型，只有能够比较的类型才能作为key类型。所以例如切片，函数，map类型是不能作为map的key类型的。

map 查找操作⽐线性搜索快很多，但⽐起⽤序号访问 array、slice，⼤约慢 100x 左右。

通过 map[key] 返回的只是⼀个 "临时值拷⻉"，修改其⾃⾝状态没有任何意义，只能重新 value 赋值或改⽤指针修改所引⽤的内存。

每个bucket中存放最多8个key/value对, 如果多于8个，那么会申请一个新的bucket，并将它与之前的bucket链起来。

注意一个细节是Bucket中key/value的放置顺序，是将keys放在一起，values放在一起，为什么不将key和对应的value放在一起呢？如果那么做，存储结构将变成key1/value1/key2/value2… 设想如果是这样的一个map[int64]int8，考虑到字节对齐，会浪费很多存储空间。不得不说通过上述的一个小细节，可以看出Go在设计上的深思熟虑。

#### 数据结构及内存管理
hashmap的定义位于 src/runtime/hashmap.go 中，首先我们看下hashmap和bucket的定义：

``` javascript
type hmap struct {
  count     int    // 元素的个数
  flags     uint8  // 状态标志
  B         uint8  // 可以最多容纳 6.5 * 2 ^ B 个元素，6.5为装载因子
  noverflow uint16 // 溢出的个数
  hash0     uint32 // 哈希种子

  buckets    unsafe.Pointer // 桶的地址
  oldbuckets unsafe.Pointer // 旧桶的地址，用于扩容
  nevacuate  uintptr        // 搬迁进度，小于nevacuate的已经搬迁
  overflow *[2]*[]*bmap 
}
```

其中，overflow是一个指针，指向一个元素个数为2的数组，数组的类型是一个指针，指向一个slice，slice的元素是桶(bmap)的地址，这些桶都是溢出桶；为什么有两个？因为Go map在hash冲突过多时，会发生扩容操作，为了不全量搬迁数据，使用了增量搬迁，[0]表示当前使用的溢出桶集合，[1]是在发生扩容时，保存了旧的溢出桶集合；overflow存在的意义在于防止溢出桶被gc。

#### 扩容
扩容会建立一个大小是原来2倍的新的表，将旧的bucket搬到新的表中之后，并不会将旧的bucket从oldbucket中删除，而是加上一个已删除的标记。

正是由于这个工作是逐渐完成的，这样就会导致一部分数据在old table中，一部分在new table中， 所以对于hash table的insert, remove, lookup操作的处理逻辑产生影响。只有当所有的bucket都从旧表移到新表之后，才会将oldbucket释放掉。

[Golang map 的底层实现](https://www.jianshu.com/p/aa0d4808cbb8)