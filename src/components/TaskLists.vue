<script setup>
  import { useRoute, RouterLink, useRouter} from 'vue-router'
  import { ref, computed, defineProps, watch } from 'vue'
  import { useToast } from 'vue-toastification'
  import axios from 'axios'

  // Get the toast instance
  const toast = useToast();
  // Get the current route
  const route = useRoute();
  // Get the router instance
  const router = useRouter();

  
  // Define the props to receive the tasks coming from the parent component
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
      const matchesStatus = selectedStatus.value ? task.status.toLowerCase() === selectedStatus.value.toLowerCase() : task.status === 'pending';
      return matchesPriority && matchesStatus;
    });
  });

  // Task delete function
  const deleteTask = async (task) => {
    const taksName = task.name;
    const id = task.id;
    const confirmDelete = window.confirm(`Are you sure you want to delete this task?`);
    if (confirmDelete) {
      try {
        await axios.delete(`/api/tasks/${id}`);
        toast.success(`Task ${taksName} deleted successfully`);
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

  const selectedTasks = ref([]);
  const selectAllTasks = ref(false);
  const emit = defineEmits(["updateTasks"]);
  // Bulk delete function
  const bulkDeleteTasks = async () => {
    if (selectedTasks.value.length === 0) {
      toast.warning("No tasks selected for deletion.");
      return;
    }
    const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedTasks.value.length} tasks?`);
    if (!confirmDelete) return;

    try {
      // Send delete request for each selected task
      await Promise.all(selectedTasks.value.map(id => axios.delete(`/api/tasks/${id}`)));
      // Emit event to update task list in the parent
      emit("updateTasks", props.tasks.filter(task => !selectedTasks.value.includes(task.id)));
      toast.success(`${selectedTasks.value.length} tasks deleted successfully`);
      selectedTasks.value = []; // Clear selection
    } catch (error) {
      toast.error("Failed to delete tasks.");
      console.error("Error deleting tasks:", error);
    }
  };

  watch(selectAllTasks, (newValue) => {
    if (newValue) {
      selectedTasks.value = filteredTasks.value.map((task) => task.id); // Select all
    } else {
      selectedTasks.value = []; // Deselect all
    }
  });

  watch(selectedTasks, (newSelected) => {
    if (newSelected.length === filteredTasks.value.length) {
      selectAllTasks.value = true; // Only select all if all tasks are selected
    } else if (newSelected.length === 0) {
      selectAllTasks.value = false; // Only deselect all if none are selected
    }
  });

  watch([selectedPriorityLevel, selectedStatus], () => {
    selectedTasks.value = []; // Clear selected tasks when filtering
    selectAllTasks.value = false; // Reset "Select All" checkbox
  });
  
  // Toggle task status between "pending" and "completed"
  const toggleTaskStatus = async (task) => {
    const newStatus = task.status.toLowerCase() === 'pending' ? 'completed' : 'pending';

    try {
      // Update task status on JSON Server
      await axios.patch(`/api/tasks/${task.id}`, { status: newStatus });

      // Update local task list
      task.status = newStatus;

      toast.success(`Task marked as ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update task status');
      console.error("Error updating task status:", error);
    }
  };


/** Helper code section **/

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

  const statusColorCoding = (status) => {
    if(status === 'Pending' || status === 'pending'){
      return "text-bg-warning";
    }else{
      return "text-bg-success"
    }
  }

  const taskStatusIcon = (status) => {
    return status === 'Pending' || status === 'pending' ? 'pi pi-times-circle' : 'pi pi-check-circle';
  }

</script>
<template>  
    <div class="row mt-5">
        <div class="col-12 d-flex justify-content-between align-items-center mb-3">
            <h4 class="mb-0">Task Lists ({{ filteredTasks.length }})</h4>
            <div class="d-flex gap-2">
              <button :class="`btn btn-outline-danger ${selectedTasks.length === 0 ? 'd-none' : ''}`" @click="bulkDeleteTasks">
                  <i class="pi pi-trash"></i> Delete Selected ({{ selectedTasks.length }})
                </button>
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
       
          <input type="checkbox" name="selected" :class="`ms-3 form-check-input ${filteredTasks.length === 0 ? 'd-none' : ''}`"  v-model="selectAllTasks" :value="filteredTasks.id">
         
        <div v-if="filteredTasks.length > 0" class="col-12" v-for="task in filteredTasks" :key="task.id">
            <div class="card border-0 shadow p-3 d-flex flex-row justify-content-between align-items-center">
                <div>
                    <div class="d-inline-flex align-items-center gap-2">
                      <input type="checkbox" name="selected" class="form-check-input" :value="task.id"
                      v-model="selectedTasks">
                      <p class="fw-medium mb-0 fs-5">{{ task.name }}</p>
                    </div>
                    <div>
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
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-success" @click="toggleTaskStatus(task)">
                      <i :class="`pi ${taskStatusIcon(task.status)}`"></i> 
                    </button>
                    <button class="btn btn-danger" @click="deleteTask(task)"><i class="pi pi-trash"></i></button>
                    <RouterLink :to="`/tasks/edit/${task.id}`" class="btn btn-secondary"><i class="pi pi-pen-to-square"></i></RouterLink>
                </div>
            </div>
        </div>
        <div v-else class="col-12">
            <p class="fs-4 text-muted text-center mb-0">No tasks found.</p>
        </div>
    </div>

</template>