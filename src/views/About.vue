<template>
  <h3>Transition</h3>
  <draggable
    class="list-group"
    tag="transition-group"
    :component-data="{
      tag: 'ul',
      type: 'transition-group',
      name: !drag ? 'flip-list' : null,
    }"
    v-model="allTasks"
    v-bind="dragOptions"
    @start="drag = true"
    @end="drag = false"
    item-key="order"
  >
    <template #item="{ element }">
      <li class="list-group-item">
        <i
          :class="element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'"
          @click="element.fixed = !element.fixed"
          aria-hidden="true"
        ></i>
        {{ element.description }}
      </li>
    </template>
  </draggable>
  <div>{{ list }}</div>
  <div>{{ allTasks }}</div>

</template>

<script>
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';

// const message = [
//   'vue.draggable',
//   'draggable',
//   'component',
//   'for',
//   'vue.js 2.0',
//   'based',
//   'on',
//   'Sortablejs',
// ];

export default {
  name: 'transition-example-2',
  display: 'Transitions',
  order: 7,
  components: {
    draggable,
  },
  data() {
    return {
      // list: message.map((name, index) => ({ name, order: index + 1 })),
      drag: false,
    };
  },
  methods: {
    sort() {
      this.allTasks = this.list.sort((a, b) => a.order - b.order);
    },
  },
  computed: {
    ...mapGetters('tasks', ['allTasks']),
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    },
  },
};
</script>

<style>
.button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
