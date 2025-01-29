<script setup>
   import { ref, computed } from 'vue';
   import axios from 'axios';
   import {useToast} from 'vue-toastification'
   import router from '@/router';

   const toast = useToast();
    // Get today's date in YYYY-MM-DD format
    const currentDate = computed(() => {
    const today = new Date().toISOString().split('T')[0];
    return today;
    });

    //Create reactive variables to store form data
    const name = ref('');
    const level = ref('');
    const due = ref('');
    const status = ref('pending')
     // Define the form submission function
    const handleSubmit = (async ()=>{
        //Validate form inputs (Ensure no empty fields)
        if(!name.value || !level.value || !due.value){
            toast.error("Please fill all fields.")
            return
        }
         // Create a new task object
        const newTaskData = {
            name: name.value,
            level: level.value,
            due: due.value,
            status: status.value
        };

        try{
            // Send a POST request to JSON Server
            // "/api/tasks" will be redirected to "http://localhost:5000/tasks" via Vite proxy
            const response = await axios.post("/api/tasks", newTaskData);
            // Toast success message
            toast.success('Task Added Successfully!')
            // Redirect to the task list page after a successful creatioN
            router.push(`/tasks`)
        }catch(error){
            toast.error('Task not Added.')
            console.error(error)
        }
    });
</script>

<template>
    <div class="row">
        <div class="col-7 mx-auto">
            <div class="card p-3 w-100">
                <h4 class="card-title text-center fw-bold">Create Task</h4>
                <form @submit.prevent="handleSubmit">
                    <input type="hidden" name="status" v-model="status">
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
                        <label for="due" class="form-label">Due date: </label>
                        <input type="date" :min="currentDate" name="due" id="due" class="form-control" v-model="due">
                    </div>
                    <button type="submit" class="btn btn-primary w-100">Create</button>
                </form>
            </div>
        </div>
    </div>
</template>