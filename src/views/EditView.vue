<script setup>
   import { ref, computed, onMounted } from 'vue';
   import axios from 'axios';
   import {useToast} from 'vue-toastification'
   import { useRoute, RouterLink, useRouter} from 'vue-router'
   import router from '@/router';

   // Initialize route for fetching the id in the url /:id 
   const route = useRoute();
   const toast = useToast(); // Initiallize toast for success & erorr message

    // Get today's date in YYYY-MM-DD format
    const currentDate = computed(() => {
        const today = new Date().toISOString().split('T')[0];
        return today;
    });

    //Create reactive variables to store form data
    const name = ref('');
    const status = ref('');
    const level = ref('')
    const due = ref('');

    // Fetch the id passed in the url 
    const taskId = route.params.id;

    // Fetch current data using onMounted and axios 
    onMounted(async ()=>{
        try{
            const response = await axios.get(`/api/tasks/${taskId}`);
            const task = response.data
            // Set the form fields to the task's current values
            name.value = task.name;
            level.value = task.level;
            status.value = task.status;
            due.value = task.due;
        }catch(error){
            console.log(error)
        }
    })
    
     // Define the form submission function
    const handleSubmit = (async ()=>{
        //Validate form inputs (Ensure no empty fields)
        if(!name.value || !level.value || !due.value){
            toast.error("Please fill all fields.")
            return
        }
         // Create a new task object
        const updateTaskData = {
            name: name.value,
            level: level.value,
            due: due.value,
            status: status.value
        };

        try {
        // Send a PUT request to update the task
        await axios.put(`/api/tasks/${taskId}`, updateTaskData);
        toast.success('Task updated successfully!');
        router.push('/tasks');  // Redirect to the task list page after updating
        } catch (error) {
        toast.error('Task update failed');
        console.error(error);
        }
    });
</script>

<template>
    <div class="row">
        <div class="col-7 mx-auto">
            <div class="card p-3 w-100">
                <h4 class="card-title text-center fw-bold">Edit Task</h4>
                <form @submit.prevent="handleSubmit">
                    <div class="form-group mb-3">
                        <label for="name" class="form-label">Task name: </label>
                        <input type="text" class="form-control" placeholder="Enter task name..." v-model="name">
                    </div>
                    <div class="form-group mb-3">
                        <label for="priority-level" class="form-label">Priority Level</label>
                        <select name="level" id="level" class="form-select" v-model="level">
                            <option value="" disabled selected>Open this select menu</option>
                            <option value="1">Low</option>
                            <option value="2">Medium</option>
                            <option value="3">High</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label for="status" class="form-label">Status</label>
                        <select name="status" id="status" class="form-select" v-model="status">
                            <option value="" disabled selected>Open this select menu</option>
                            <option value="pending">Pending</option>
                            <option value="completed">Completed</option>
                        </select>
                    </div>
                    <div class="form-group mb-3">
                        <label for="due" class="form-label">Due date: </label>
                        <input type="date" :min="currentDate" name="due" id="due" class="form-control" v-model="due">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Save Changes</button>
                </form>
            </div>
        </div>
    </div>
</template>