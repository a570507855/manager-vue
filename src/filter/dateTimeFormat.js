import Vue from 'vue'
import {
  parseTime
} from '@/utils';

Vue.filter('dateTimeFormat', value => {
  return parseTime(value * 1000, "{y}-{m}-{d} {h}:{i}:{s}");
})
