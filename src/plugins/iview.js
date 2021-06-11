import Vue from "vue";
// 引入iview
import "view-design/dist/styles/iview.css";
import {
  Button,
  Radio,
  Spin,
  Icon,
  Carousel,
  CarouselItem,
  Table,
  Page,
  Modal,
  RadioGroup,
  Select,
  Option,
  Upload,
  Message,
  Switch,
  Checkbox,
  Input,
} from "view-design";

Vue.prototype.$Spin = Spin;
Vue.prototype.$Modal = Modal;
Vue.prototype.$Message = Message;
Vue.prototype.$Message.config({
  top: 100,
  duration: 3,
});
Vue.component("Input", Input);
Vue.component("Button", Button);
Vue.component("Radio", Radio);
Vue.component("Icon", Icon);
Vue.component("Carousel", Carousel);
Vue.component("CarouselItem", CarouselItem);
Vue.component("Table", Table);
Vue.component("Page", Page);
Vue.component("Modal", Modal);
Vue.component("RadioGroup", RadioGroup);
Vue.component("Select", Select);
Vue.component("Option", Option);
Vue.component("Upload", Upload);
Vue.component("i-switch", Switch);
Vue.component("i-checkbox", Checkbox);
Vue.component("i-Spin", Spin);
