<template>
    <div class="flex bg-black/80 rounded-xl min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="/src/assets/image.png"
                alt="XLLAMA" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Update FAQ for Bot "{{ bot.name }}"
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Choose the number of QA pairs -->
                <div>
                    <label for="QAnumber" class="block text-sm/6 font-bold text-white">How many pairs of QA you want to add?</label>
                    <div class="mt-2">
                        <input id="QAnumber" v-model="QAnumber" name="QAnumber" type="number" min="1" autocomplete="off" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- QAs -->
                <div v-for="i in parseInt(QAnumber)" :key="i">
                    <label class="block text-base font-bold text-white">QA {{" " + i +":"}}</label>
                    <div class="mt-2">
                        <label for="question" class="block text-sm/6 font-bold text-white">Question</label>
                        <input v-model="QA[i-1].question" name="question" type="text" autocomplete="off" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                    <div class="mt-2">
                        <label for="answer" class="block text-sm/6 font-bold text-white">Answer</label>
                        <textarea v-model="QA[i-1].answer" name="answer" rows="3" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"></textarea>
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit"
                        class="flex w-full mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                        >
                        Submit
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import Swal from 'sweetalert2';

export default {
    props: {
        bot: {
            type: Object,
            required: true,
        },
    },  
    data() {
        return {
            QAnumber: '',
            QA: [{
                question: '',
                answer: ''
            }],
        };
    },
    methods: {
        handleSubmit() {

            const isValid = this.QA.every(item => item.question && item.answer);
            if (!isValid) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    confirmButtonText: 'OK',
                    text: 'Please fill out all questions and answers!',
                })
                return;
            }
            // 提交数据
            for(let i = 0; i < this.QA.length; i++) {
                const formData = new FormData();
                formData.append('bot', this.bot.id);
                formData.append('question', this.QA[i].question);
                formData.append('answer', this.QA[i].answer);

                axios.post('/bots/addFAQ', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }).then(() => {
                    this.QA[i].question = '';
                    this.QA[i].answer = '';
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        confirmButtonText: 'OK',
                        text: 'FAQ has been added successfully!',
                    }).then((result) => {
                        if(result.isConfirmed) {
                            this.$emit('FAQfinished');
                        }
                    });
                }).catch(error => {
                    console.error('An error occurred:', error);
                });
            }
        },
    },
    watch: {
        QAnumber(newValue) {
        const numberOfQAs = parseInt(newValue);
        const currentLength = this.QA.length;

        if (numberOfQAs > currentLength) {
            for (let i = currentLength; i < numberOfQAs; i++) {
            this.QA.push({ question: '', answer: '' });
            }
        } else {
            this.QA.splice(numberOfQAs);
        }
        }
    }
};
</script>
