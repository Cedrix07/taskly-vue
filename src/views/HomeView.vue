<script setup>
import TaskLists from '@/components/TaskLists.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';

const tasks = ref([]);

onMounted(async () => { 
  try {
    // Fetch tasks from the API
    const response = await axios.get('/api/tasks'); 

    // Sort tasks by due date first, then priority level
    tasks.value = response.data.sort((a, b) => {
      const dateA = new Date(a.due);
      const dateB = new Date(b.due);
      // First, compare due dates
      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      // If due dates are the same, compare priority (higher number = higher priority)
      return b.level - a.level;
    });

  }catch(error){
    console.error(error);
  }
});
</script>

<template>
   <TaskLists :tasks="tasks"/> 
</template>
