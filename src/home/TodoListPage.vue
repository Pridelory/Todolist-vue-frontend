<template>
    <div class="container" style="max-width: 600px">
        <!-- Heading -->
        <h2 class="text-center mt-5">Todolist App Demo</h2>

        <!-- Input -->
        <div class="d-flex mt-5">
            <input
                    type="text"
                    v-model="taskDTO.topic"
                    placeholder="Enter task"
                    class="w-100 form-control"
            />
            <button class="btn btn-warning rounded-0" @click="submitTask">
                SUBMIT
            </button>
        </div>

        <!-- Task table -->
        <table class="table table-bordered mt-5">
            <thead>
            <tr>
                <th scope="col"></th>
                <th scope="col">Topic</th>
                <th scope="col" style="width: 120px">Status</th>
                <th scope="col">Delete</th>
                <th scope="col" class="text-center">Update Time</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(task, index) in tasks" :key="index">
                <td>
                    <span style="display: none">{{task.id}}</span>
                </td>
                <td>
                    <span :class="{ 'line-through': task.status === 'finished' }">
                      {{ task.name }}
                    </span>
                </td>
                <td>
            <span
                    class="pointer noselect"
                    @click="changeStatus(index, task.id, task.name)"
                    :class="{
                'text-danger': task.status === 'to-do',
                'text-success': task.status === 'finished',
                'text-warning': task.status === 'in-progress',
              }"
            >
              {{ capitalizeFirstChar(task.status) }}
            </span>
                </td>
                <td class="text-center">
                    <div @click="deleteTask(index, task.id)">
                        <button class="fa fa-trash pointer">Delete</button>
                    </div>
                </td>
                <td class="text-center">
                    <div @click="editTask(index)">
                        <p class="fa fa-pen pointer">{{task.updateTime}}</p>
                    </div>
                </td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
    import config from 'config';
    import {userService} from '../_services';
    import {router} from "../_helpers";

    export default {
        name: "Todolist",
        props: {
            msg: String,
        },
        mounted() {
            this.getTodayTodolist();
        },
        data() {
            return {
                taskDTO: {
                    id: "",
                    topic: "",
                    status : 0
                },
                task: "",
                editedTask: null,
                statuses: ["to-do", "in-progress", "finished"],

                /* Status could be: 'to-do' / 'in-progress' / 'finished' */
                tasks: [],
            };
        },

        methods: {
            getTodayTodolist() {
                userService.getTodayTodolist().then(
                    res => {
                        var tasks = res.data;
                        console.log(tasks)
                        for (var i = 0; i < tasks.length; i++) {
                            this.tasks.push({
                                id: tasks[i].id,
                                name: tasks[i].topic,
                                status: this.statuses[tasks[i].status],
                                updateTime: tasks[i].updateTime
                            });
                        }
                    },
                    error => {
                        alert(222)
                    }
                )
            },
            /**
             * Capitalize first character
             */
            capitalizeFirstChar(str) {
                return str.charAt(0).toUpperCase() + str.slice(1);
            },

            /**
             * Change status of task by index
             */
            changeStatus(index, taskId, topic) {
                let newIndex = this.statuses.indexOf(this.tasks[index].status);
                if (++newIndex > 2) newIndex = 0;
                this.tasks[index].status = this.statuses[newIndex];
                this.taskDTO.id = taskId;
                this.taskDTO.topic = topic
                this.taskDTO.statusIndex = newIndex
                userService.update(this.taskDTO).then(
                    res => {
                        if (!res.success) {
                            //todo
                        }
                    },
                    error => {

                    }
                )
            },

            /**
             * Deletes task by index
             */
            deleteTask(index, taskId) {
                this.tasks.splice(index, 1);
                console.log(taskId)
                this.taskDTO.id = taskId
                userService.deleteTask(this.taskDTO).then(
                    res => {
                        if (!res.success) {
                            // todo
                        }
                    },
                    error => {
                        // todo
                    }
                )
            },

            /**
             * Edit task
             */
            editTask(index) {
                this.task = this.tasks[index].name;
                this.editedTask = index;
            },

            /**
             * Add / Update task
             */
            submitTask() {
                if (this.taskDTO.topic.length === 0) return;
                this.tasks.push({
                    id: "",
                    name: this.taskDTO.topic,
                    status: "todo",
                });
                userService.addTask(this.taskDTO).then(
                    res => {
                        if (!res.success) {
                            this.tasks.pop();
                        }
                        var len  = this.tasks.length
                        var theLastTask = this.tasks.slice(len - 1, len)
                        theLastTask[0].id = res.data
                    },
                    error => {
                        this.tasks.pop();
                    }
                )
                // /* We need to update the task */
                // if (this.editedTask != null) {
                //     this.tasks[this.editedTask].name = this.task;
                //     this.editedTask = null;
                // } else {
                //     /* We need to add new task */
                //     this.tasks.push({
                //         name: this.task,
                //         status: "todo",
                //     });
                // }
                //
                // this.task = "";
            },
        },
    };
</script>

<style scoped>
    .pointer {
        cursor: pointer;
    }

    .noselect {
        -webkit-touch-callout: none; /* iOS Safari */
        -webkit-user-select: none; /* Safari */
        -khtml-user-select: none; /* Konqueror HTML */
        -moz-user-select: none; /* Old versions of Firefox */
        -ms-user-select: none; /* Internet Explorer/Edge */
        user-select: none;
        /* Non-prefixed version, currently
                                         supported by Chrome, Edge, Opera and Firefox */
    }

    .line-through {
        text-decoration: line-through;
    }
</style>