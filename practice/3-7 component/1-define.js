import Vue from 'vue'

const component = {
  props: {
    active: {
      required: true,
      type: Boolean,
      default: true,
      validator(value) {
        return typeof value === 'boolean'
      }
    },
    propOne: String
  },
  data() { // child component data must function
    return {
      text: 0,
      propOned: this.propOne // Parent data is converted to subcomponent internal data, Children cannot directly modify parent data
    }
  },
  template: `
    <div>
      <input type="text" v-model="text"/>
      <span @click="handleChange">{{propOne}}</span>
      <span v-show="active">see me if active</span>
    </div>
  `,
  methods: {
    handleChange() {
      this.$emit('change') // The child throws an event to the parent to modify the parent data., Single data stream
    }
  }
}
// Vue.component('CompOne', component)

new Vue({
  el: '#root',
  template: `
    <div>
      <comp-one ref="comp1" :active="true" :prop-one="prop1" @change="handleChange"></comp-one>
      <comp-one :active="true" propOne="text2"></comp-one>
    </div>
  `,
  data() {
    return {
      prop1: 'text1'
    }
  },
  mounted() {
    console.log(this.$refs.comp1)
  },
  methods: {
    handleChange() {
      this.prop1 += 1
    }
  },
  components: {
    CompOne: component
  }
})
