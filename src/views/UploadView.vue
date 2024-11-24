<template>
    <div class="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img style="cursor: pointer;" @click="goToMainPage" class="mx-auto h-10 w-auto" src="/src/assets/image.png"
                alt="XLLAMA" />
            <h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-white">
                Submit Your Product
            </h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-lg">
            <form class="space-y-6" @submit.prevent="handleSubmit">
                <!-- Product Name -->
                <div>
                    <label for="name" class="block text-sm/6 font-bold text-white">Product Name</label>
                    <div class="mt-2">
                        <input id="name" v-model="product.name" name="name" type="text" autocomplete="off" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Version -->
                <div>
                    <label for="version" class="block text-sm/6 font-bold text-white">Version</label>
                    <div class="mt-2">
                        <input id="version" v-model="product.version" name="version" type="text" autocomplete="off"
                            required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Price -->
                <div>
                    <label for="price" class="block text-sm/6 font-bold text-white">Price ($)</label>
                    <div class="mt-2">
                        <input id="price" v-model="product.price" name="price" type="number" min="0" step="0.01"
                            autocomplete="off" required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6" />
                    </div>
                </div>

                <!-- Description -->
                <div>
                    <label for="description" class="block text-sm/6 font-bold text-white">Description</label>
                    <div class="mt-2">
                        <textarea id="description" v-model="product.description" name="description" rows="5"
                            placeholder="Provide a detailed description of the product." required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"></textarea>
                    </div>
                </div>

                <!-- Highlights -->
                <div>
                    <label for="highlights" class="block text-sm/6 font-bold text-white">Highlights</label>
                    <div class="mt-2">
                        <textarea id="highlights" v-model="product.highlights" name="highlights" rows="3"
                            placeholder="Enter highlights separated by semicolons (e.g., Feature 1; Feature 2; Feature 3)"
                            required
                            class="block w-full rounded-md border-0 bg-white/5 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm/6"></textarea>
                    </div>
                </div>

                <!-- Upload Avatar -->
                <div>
                    <label class="block text-sm/6 font-bold text-white">Upload Avatar</label>
                    <div class="mt-2">
                        <p v-if="selectedAvatarFile" class="mb-2 text-sm text-white">Selected: {{ selectedAvatarFile
                            }}
                        </p>
                        <label for="avatar"
                            class="cursor-pointer rounded-md bg-indigo-600 py-1 px-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            style="width: 150px; display: inline-block;">
                            Choose File
                        </label>
                        <input id="avatar" name="avatar" ref="avatarFile" type="file" accept="image/*" class="hidden"
                            @change="handleAvatarFileChange" />
                    </div>
                </div>

                <!-- Upload Bot File -->
                <div>
                    <label class="block text-sm/6 font-bold text-white">Upload Bot File (.zip)</label>
                    <div class="mt-2">
                        <p v-if="selectedBotFile" class="mb-2 text-sm text-white">Selected: {{ selectedBotFile }}</p>
                        <label for="botFile"
                            class="cursor-pointer rounded-md bg-indigo-600 py-1 px-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                            style="width: 150px; display: inline-block;">
                            Choose File
                        </label>
                        <input id="botFile" name="botFile" ref="botFile" type="file" accept=".zip" class="hidden"
                            @change="handleBotFileChange" />
                    </div>
                </div>

                <!-- Submit Button -->
                <div>
                    <button type="submit"
                        class="flex w-full mx-auto justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500">
                        Submit
                    </button>
                </div>

            </form>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            product: {
                name: '',
                version: '',
                releaseDate: '',
                price: '',
                highlights: '',
                description: '',
            },
            selectedAvatarFile: '', // 存储头像文件名称
            selectedBotFile: '', // 存储 bot 文件名称
        };
    },
    methods: {
        handleAvatarFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedAvatarFile = file.name; // 更新头像文件名称
            } else {
                this.selectedAvatarFile = ''; // 清空文件名
            }
        },

        // 处理 bot 文件选择
        handleBotFileChange(event) {
            const file = event.target.files[0];
            if (file) {
                this.selectedBotFile = file.name; // 更新 bot 文件名称
            } else {
                this.selectedBotFile = ''; // 清空文件名
            }
        },
        goToMainPage() {
            this.$router.push('/'); // 跳转到主页
        },
        handleSubmit() {


            // 校验 Version 格式
            const versionPattern = /^\d+\.\d+$/; // 匹配 x.x 格式
            if (!versionPattern.test(this.product.version)) {
                alert('Version must be in the format x.x (e.g., 1.0)');
                return;
            }

            // 校验 Price
            if (!this.product.price || parseFloat(this.product.price) <= 0) {
                alert('Price must be a positive number.');
                return;
            }

            // 校验 Highlights
            if (!this.product.highlights.trim()) {
                alert('Highlights are required.');
                return;
            }

            // 将 Highlights 字符串分割为数组
            const highlightsArray = this.product.highlights
                .split(';') // 按分号分割
                .map(item => item.trim()) // 去掉每个条目的前后空格
                .filter(item => item); // 移除空字符串

            if (highlightsArray.length === 0) {
                alert('Highlights must include at least one valid item.');
                return;
            }


            // 校验 Description
            if (!this.product.description.trim()) {
                alert('Description is required.');
                return;
            }

            // 校验上传文件
            const avatarFile = this.$refs.avatarFile.files[0];
            const botFile = this.$refs.botFile.files[0];

            console.log('Avatar file:', avatarFile);
            if (!avatarFile) {
                alert('Avatar file is required.');
                return;
            }

            if (!botFile) {
                alert('Bot file is required.');
                return;
            }

            // 校验头像文件类型（必须是图片）
            const avatarFileType = avatarFile.type;
            if (!avatarFileType.startsWith('image/')) {
                alert('Avatar file must be an image (e.g., .jpg, .png).');
                return;
            }

            // 校验 bot 文件类型（必须是 .zip）
            const botFileName = botFile.name;
            if (!botFileName.endsWith('.zip')) {
                alert('Bot file must be a .zip file.');
                return;
            }

            // 提交数据
            alert('Form submitted successfully!');
            console.log('Submitted data:', {
                ...this.product,
                avatarFile,
                botFile,
            });

            
            const productDetails = {
                name: this.product.name,
                version: this.product.version,
                releaseDate: this.product.releaseDate,
                price: parseFloat(this.product.price),
                highlights: this.product.highlights,
                description: this.product.description
            };


            const formData = new FormData();
            formData.append('productDetails', JSON.stringify(productDetails));
            formData.append('avatarFile', this.$refs.avatarFile.files[0]);
            formData.append('botFile', this.$refs.botFile.files[0]);

            axios.post('/bots/submit', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                alert('Server response: ' + response.data);
                console.log('Server response:', response.data);
            }).catch(error => {
                console.error('An error occurred:', error);
            });

        },
    },
};
</script>
