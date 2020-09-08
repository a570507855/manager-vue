import Iframe from "./iframe";
const obj = {};
obj.install = function (Vue) {
  const iframeContrustor = Vue.extend(Iframe);
  const xiframe = new iframeContrustor();
  xiframe.$mount(document.createElement("div"));
  document.body.appendChild(xiframe.$el);
  Vue.prototype.$xiframe = xiframe;
}
export default obj;
