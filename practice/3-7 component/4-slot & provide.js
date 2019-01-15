import Vue from 'vue'

const ChildComponent = {
  template: '<div>child component: {{data.value}}</div>',
  /* 上级 provide */
  inject: ['yeye', 'data'],
  mounted() {
    // $parent 只能拿到上一级里面的 value
    console.log(this.$parent.$options.name) // comp
    // 拿到所有父级
    console.log(this.yeye, this.value) // 父组件
  }
}

const component = {
  name: 'comp',
  components: {
    ChildComponent
  },
  template: `
    <div :style="style">
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="footer">
        <slot name="footer"></slot>
      </div>
      <slot name="content" :value="value"></slot>
      <child-component />
    </div>
  `,
  data() {
    return {
      style: {
        width: '200px',
        height: '200px',
        border: '1px solid #aaa'
      },
      value: 'component value'
    }
  }
}

new Vue({
  components: {
    CompOne: component
  },
  el: '#root',
  data() {
    return {
      value: '父组件'
    }
  },
  /* 下级组件注入, 不提供 react 属性, 像 data() */
  provide() {
    // const data = {}
    /* 不推荐用 defineProperty() */
    /* 提供 react 属性, 使 value 改变下级对应改变 */
    // Object.defineProperty(data, 'value', {
    //   get: () => this.value,
    //   enumerable: true
    // })
    return {
      yeye: this,
      value: this.value
      // data
    }
  },
  mounted() {
    console.log(this.$refs.comp.value) /* component value */
  },
  template: `
    <div>
      <comp-one ref="comp">
        <span slot="header">this is header</span>
        <span slot="footer">this is footer</span>
        // slot-scope="props": 调用子组件 slot 的属性
        // props.value: 子组件的 slot 的 value
        <span slot="content" slot-scope="props" ref="span">{{props.value}} {{value}}</span>
      </comp-one>
      <input type="text" v-model="value" />
    </div>
  `
})
