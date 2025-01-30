<script setup>
  import { useRoute, RouterLink, useRouter} from 'vue-router'
  import { ref, computed, defineProps } from 'vue'
  import { useToast } from 'vue-toastification'
  import axios from 'axios'

  const toast = useToast();
  const route = useRoute();
  const router = useRouter();

  const props = defineProps({
    tasks: {
      type: Array,
      required: true
    }
  });

  const selectedPriorityLevel = ref(''); // Tracks the selected priority level
  const selectedStatus = ref(''); // Tracks the selected status

  // Computed property to filter tasks based on the selected priority level or slelected status
  const filteredTasks = computed(() => {
    return props.tasks.filter(task => {
      const matchesPriority = selectedPriorityLevel.value ? task.level === selectedPriorityLevel.value : true;
      const matchesStatus = selectedStatus.value ? task.status.toLowerCase() === selectedStatus.value.toLowerCase() : true;
      return matchesPriority && matchesStatus;
    });
  });

  // Task delete function
  const deleteTask = async (id) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete this task?`);
    if (confirmDelete) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        toast.success('Task deleted successfully');
        // Remove the deleted task from the tasks list
        const taskIndex = props.tasks.findIndex(task => task.id === id);
        if (taskIndex !== -1) {
          props.tasks.splice(taskIndex, 1);
        }
      } catch (error) {
        toast.error('Task deletion failed');
        console.error("Error deleting task:", error);
      }
    }
  };

  const changeTaskStatus = async (id, status) => {
  try {
    const response = await axios.put(`/api/tasks/${id}`, { status: status });

    toast.success('Task status changed successfully');

    // Update the task in the tasks list properly
    const taskIndex = props.tasks.findIndex(task => task.id === id);
    if (taskIndex !== -1) {
      props.tasks[taskIndex] = { ...props.tasks[taskIndex], status: status };
    }
  } catch (error) {
    toast.error('Task status change failed');
    console.error("Error changing task status:", error);
  }
};

// Priority level helper function
const priorityLevel = (level) => {
  switch (level) {
    case "1": return "Low";
    case "2": return "Medium";
    case "3": return "High";
    default: return "Unknown";
  }
};

// Priority level color coding
  const priorityColorCoding = (level) => {
    switch (level) {
      case "1": return "text-bg-success";
      case "2": return "text-bg-warning";
      case "3": return "text-bg-danger";
      default: return "text-bg-secondary";
    }
  };

  const isCompleted = (status) =>{
    return status === 'completed' || status === 'Completed' ? 'text-decoration-line-through text-muted' : '';
  }

  const statusColorCoding = (status) => {
    if(status === 'Pending' || status === 'pending'){
      return "text-bg-warning";
    }else{
      return "text-bg-success"
    }
  }
</script>
<template>  
    <div class="row mt-5">
        <div class="col-12 d-flex justify-content-between align-items-center mb-3">
            <h4>Task Lists ({{ filteredTasks.length }})</h4>
            <div class="d-flex gap-2">
              <div class="d-flex gap-2">
                <select name="status" id="status" class="form-select" v-model="selectedStatus">
                      <option value="" selected>Sort by status</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                </select>
                <select name="level" id="level" class="form-select" v-model="selectedPriorityLevel" @change="handlePriorityChange">
                      <option value="" selected>Sort by priority level</option>
                      <option value="1">Low</option>
                      <option value="2">Medium</option>
                      <option value="3">High</option>
                </select>
              </div>
              <RouterLink to="/tasks/create" class="btn btn-primary">
                <i class="pi pi-plus"></i>
                  Create task
              </RouterLink>
            </div>
            
        </div>
    </div>
    <div class="row g-2">
        <div v-if="filteredTasks.length > 0" class="col-12" v-for="task in filteredTasks" :key="task.id">
            <div class="card border-0 shadow p-3 d-flex flex-row justify-content-between align-items-center">
                <div>
                    <p :class="`fw-medium mb-0 fs-5 ${isCompleted(task.status)}`">{{ task.name }}</p>
                    <small class="fw-medium text-muted">Due: {{ task.due }}</small>
                    <small class="d-block fw-medium text-muted">Priority level: 
                        <span :class="`badge rounded-pill ${priorityColorCoding(task.level)}`">
                            {{ priorityLevel(task.level) }}
                        </span> 
                    </small>
                    <small class="d-block fw-medium text-muted">Status: 
                        <span :class="`badge rounded-pill ${statusColorCoding(task.status)}`">
                            {{ task.status }}
                        </span> 
                    </small>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-secondary" @click="changeTaskStatus(task.id, task.status === 'Pending' ? 'Completed' : 'Pending')">
                      <i :class="`pi pi-circle`"></i>
                    </button>
                    <button class="btn btn-danger" @click="deleteTask(task.id)"><i class="pi pi-trash"></i></button>
                    <RouterLink :to="`/tasks/edit/${task.id}`" class="btn btn-secondary"><i class="pi pi-pen-to-square"></i></RouterLink>
                </div>
            </div>
        </div>
        <div v-else class="col-12">
            <p class="fs-4 text-muted text-center mb-0">No tasks found.</p>
        </div>
    </div>

</template>