<script lang="ts" setup>
import { ref } from 'vue';
import CloudVar from '@/utils/cloudvar';

interface Folder {
    link: string;
}

const userId = ref<string | null>(null);
if (localStorage.getItem('userId') !== null) {
    userId.value = localStorage.getItem('userId') as string;
}
const token = ref('');
const folders = ref<Folder[]>([]);

const fetchFolders = async () => {
    if (!userId.value) return;
    const response = await CloudVar.get_var(`cloudpan-folders-${userId.value}`);
    if (response.status === 'error') {
        alert('很好，这是你第一次使用文件夹功能，点击确定，我们将为您初始化');
        await handleInit();
    } else {
        alert('文件夹数据已成功加载！');
        token.value = response.data.token;
        folders.value = response.data.folders;
    }
};

const handleInit = async () => {
    const data = await CloudVar.new_var({
        name: `cloudpan-folders-${userId.value}`,
        value: {
            folders: [],
            token: '',
        },
    });
    token.value = data.token;
    folders.value = [];
    await CloudVar.set_var(`cloudpan-folders-${userId.value}`, {
        folders: [],
        token: data.token,
    }, data.token);
};

const addFolder = async () => {
    const link = prompt('请输入XesChat网盘链接');
    if (link) {
        folders.value.push({ link });
        await CloudVar.set_var(`cloudpan-folders-${userId.value}`, {
            folders: folders.value,
            token: token.value,
        }, token.value);
    }
};
</script>

<template>
    <v-container>
        <v-alert type="warning" class="mb-3">
            本功能依赖于unybhgfd(刘行知)的XesChat的网盘功能，若没有安装可查看
            <a href="https://gitee.com/unybhgfd/xeschat_admin/releases/tag/v2025-11-24">XesChat Gitee的release</a>
            下载
        </v-alert>
        <v-card v-if="token !== ''">
            <v-card-text>
                <v-btn @click="addFolder" class="mb-3">添加XesChat给你的文件夹链接</v-btn>
                <v-card 
                    v-for="value in folders"
                    class="mb-3"
                >
                    <template v-slot:text>
                        <iframe class="w-100 h-100" :src="value.link"></iframe>
                    </template>
                </v-card>
            </v-card-text>
        </v-card>
        <v-card v-else>
            <v-card-text>
                <v-text-field
                    label="请输入您的用户ID（与云盘相同）"
                    v-model="userId"
                ></v-text-field>
                <v-btn color="primary" @click="fetchFolders()" :disabled="userId === null || userId === ''"
                    >加载文件夹</v-btn
                >
            </v-card-text>
        </v-card>
    </v-container>
</template>

<style scoped>
</style>