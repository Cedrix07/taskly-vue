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


    const errors = computed(()=>{
        const errs = [];

        if(!name.value){
            errs.name = 'Name is required!'
        }else if(!level.value){
            errs.level = 'Level is required!'
        }else if(!due.value){
            errs.due = 'Due date is required!'
        }

        return errs;
    });

    const isFormValid = computed(() => Object.keys(errors.value).length === 0);
  

    // Define the form submission function
    const handleSubmit = (async ()=>{
        //Validate form inputs (Ensure no empty fields)
        if(!isFormValid.value){
            toast.error('Please fill all required fields.')
            return;
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
                <form @submit.prevent="handleSubmit" class="needs-validation">
                    <!-- Task Name Input -->
                    <div class="mb-3">
                    <label for="name" class="form-label">Task Name:</label>
                    <input
                        type="text"
                        v-model="name"
                        id="name"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name, 'is-valid': name && !errors.name }"
                        placeholder="Enter task name..."
                    />
                    <div class="invalid-feedback">{{ errors.name }}</div>
                    </div>

                    <!-- Priority Level (Dropdown) -->
                    <div class="mb-3">
                    <label for="level" class="form-label">Priority Level:</label>
                    <select
                        v-model="level"
                        id="level"
                        class="form-select"
                        :class="{ 'is-invalid': errors.level, 'is-valid': level && !errors.level }"
                    >
                        <option value="">Select priority</option>
                        <option value="1">Low</option>
                        <option value="2">Medium</option>
                        <option value="3">High</option>
                    </select>
                    <div class="invalid-feedback">{{ errors.level }}</div>
                    </div>

                    <!-- Due Date -->
                    <div class="mb-3">
                    <label for="due" class="form-label">Due Date:</label>
                    <input
                        type="date"
                         :min="currentDate"
                        v-model="due"
                        id="due"
                        class="form-control"
                        :class="{ 'is-invalid': errors.due, 'is-valid': due && !errors.due }"
                    />
                    <div class="invalid-feedback">{{ errors.due }}</div>
                    </div>

                    <!-- Submit Button -->
                    <button type="submit" class="btn btn-primary w-100" :disabled="!isFormValid">Create Task</button>
                </form>
            </div>
        </div>
    </div>
</template>