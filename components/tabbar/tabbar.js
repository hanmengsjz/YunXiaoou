// components/tabbar/tabbar.js
Component({
  properties: {
    index: Number
  },
  data: {
    active: 0
  },
  methods: {
    switch (event) {
      wx.switchTab({
        url: event.currentTarget.dataset.path
      })
    },
    onChange(event) {
      this.setData({
        active: event.detail
      })
    }
  },
  pageLifetimes: {
    show() {
      this.setData({
        active: this.data.index
      })
    }
  }
})