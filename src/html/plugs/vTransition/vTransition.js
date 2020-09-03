import Vue from 'vue'

function vTransition(props, self) {
  let vTransitionStr = props.duration + ' height ease-in-out,' + props.duration + ' padding-top ease-in-out, ' + props.duration + ' padding-bottom ease-in-out'
  return {
    'before-enter'(el) {
      el.style.transition = vTransitionStr
      if (!el.dataset) el.dataset = {}

      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom

      el.style.height = 0
      el.style.paddingTop = 0
      el.style.paddingBottom = 0

      self.$emit('transitionNewStart')
    },

    enter(el) {
      el.dataset.oldOverflow = el.style.overflow
      if (el.scrollHeight !== 0) {
        el.style.height = el.scrollHeight + 'px'
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      } else {
        el.style.height = ''
        el.style.paddingTop = el.dataset.oldPaddingTop
        el.style.paddingBottom = el.dataset.oldPaddingBottom
      }
      el.style.overflow = 'hidden'
      self.$emit('transiting', 'enter')
    },

    'after-enter'(el) {
      el.style.transition = ''
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow

      self.$emit('transitionNewEnd')
    },

    'before-leave'(el) {
      if (!el.dataset) el.dataset = {}
      el.dataset.oldPaddingTop = el.style.paddingTop
      el.dataset.oldPaddingBottom = el.style.paddingBottom
      el.dataset.oldOverflow = el.style.overflow

      el.style.height = el.scrollHeight + 'px'
      el.style.overflow = 'hidden'

      self.$emit('transitionNewStart')
    },

    leave(el) {
      if (el.scrollHeight !== 0) {
        el.style.transition = vTransitionStr
        el.style.height = 0
        el.style.paddingTop = 0
        el.style.paddingBottom = 0
      }
    },

    'after-leave'(el) {
      el.style.transition = ''
      el.style.height = ''
      el.style.overflow = el.dataset.oldOverflow
      el.style.paddingTop = el.dataset.oldPaddingTop
      el.style.paddingBottom = el.dataset.oldPaddingBottom

      self.$emit('transitionNewEnd')
    }
  }
}
// export default {
//   name: 'collapseTransition',
//   functional: true,
//   props: {
//     duration: {
//       type: String,
//       default: '0.7s'
//     },

//   },
//   // methods: {},
//   render(h, { children, props }) {

//     const data = {
//       on: vTransition(props)
//     }
//     return h('transition', data, children)
//   }
// }

export default Vue.component('collapseTransition', {
  props: {
    duration: {
      type: String,
      default: '0.7s'
    }
  },
  render: function(createElement) {
    let props = this.$props
    const data = {
      on: vTransition(props, this)
    }
    return createElement(
      'transition', // 标签名称
      data,
      this.$slots.default // 子节点数组
    )
  }
})
