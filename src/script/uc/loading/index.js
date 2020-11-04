import Loading from "./loading";
const obj = {};
obj.install = function (Vue) {
  const loadingContrustor = Vue.extend(Loading);
  const loading = new loadingContrustor();
  loading.$mount(document.createElement("div"));
  document.body.appendChild(loading.$el);
  Vue.prototype.$cloading = loading;
}
export default obj;