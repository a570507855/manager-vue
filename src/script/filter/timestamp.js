import Vue from 'vue'
import {
  parseTime
} from '@/script/lib';

Vue.filter('timestamp', value => {
  return parseTime(value * 1000, '{y}-{m}-{d} {h}:{i}:{s}');
});