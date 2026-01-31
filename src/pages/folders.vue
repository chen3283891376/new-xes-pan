<script lang="ts" setup>
import { ref } from 'vue';

interface Folder {
    link: string;
}

const folders = ref<Folder[]>(JSON.parse(localStorage.getItem('folders') || '[]'));

function addFolder() {
    const link = prompt('请输入XesChat网盘链接');
    if (link) {
        folders.value.push({ link });
        localStorage.setItem('folders', JSON.stringify(folders.value));
    }
}
</script>

<template>
    <v-container>
        <v-alert type="warning" class="mb-3">
            本功能依赖于unybhgfd(刘行知)的XesChat的网盘功能，若没有安装可查看
            <a href="https://gitee.com/unybhgfd/xeschat_admin/releases/tag/v2025-11-24">XesChat Gitee的release</a>
            下载（哦对，这个功能依赖本地缓存存储，懒得搞云了，慎用吧）
        </v-alert>
        <v-btn @click="addFolder" class="mb-3">添加XesChat给你的文件夹链接</v-btn>
        <v-card 
            v-for="value in folders"
            class="mb-3"
        >
            <template v-slot:text>
                <iframe class="w-100 h-100" :src="value.link"></iframe>
            </template>
        </v-card>
    </v-container>
</template>

<style scoped>
</style>