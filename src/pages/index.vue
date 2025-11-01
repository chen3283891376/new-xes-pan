<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import type { IFileData, IGetRes } from '@/interfaces/cloudpan';
import ShareDialog from '@/components/ShareDialog.vue';

const userId = '13159581';
const token = ref('');
const files = ref([] as IFileData['files']);
const headers = ref([
    { title: '文件名', key: 'name' },
    { title: '大小', key: 'size' },
    { title: '创建时间', key: 'time' },
    { title: '操作', key: 'actions', sortable: false },
]);

const showDialog = ref(false);
const shareDialogType = ref('mine');
const selectedFile = ref<any>(null);

const fetch_pan_data = async () => {
    const response = await fetch(`/api/get?key=cloudpan-${userId}`);
    const data: IGetRes = await response.json();
    if (data.status === 'error') {
        alert('很好，这是你第一次使用云盘，点击确定，我们将为您注册');
        await handle_register();
    } else {
        alert('欢迎回来，云盘已成功加载！');
        token.value = data.data.token;
        files.value = data.data.files;
    }
};
const handle_register = async () => {
    const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            key: `cloudpan-${userId}`,
            value: {
                files: [],
                token: '',
            },
        }),
    });
    const data: IFileData = await response.json();
    token.value = data.token;
    files.value = [];
    await fetch('/api/set', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            key: `cloudpan-${userId}`,
            value: {
                files: [],
                token: data.token,
            },
            token: data.token,
        }),
    });
};

function download_file(item: any) {
    window.open(item.link, '_blank');
}

async function delete_file(item: any) {
    if (confirm('确认删除该文件吗？')) {
        files.value = files.value.filter(i => i !== item);
        await fetch(`/api/set`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                key: `cloudpan-${userId}`,
                value: {
                    files: files.value,
                    token: token.value,
                },
                token: token.value,
            }),
        });
    }
}

function openShareDialog(item: any | null, type: string) {
    if (item) {
        selectedFile.value = item;
    }
    shareDialogType.value = type;
    showDialog.value = true;
}

function closeShareDialog() {
    showDialog.value = false;
}

onMounted(() => {
    fetch_pan_data();
});
</script>

<template>
    <v-container>
        <v-card v-if="token !== ''">
            <v-card-text>
                <v-data-table :headers="headers" :items="files">
                    <template #item.actions="{ item }">
                        <share-dialog
                            :file="selectedFile"
                            :showDialog="showDialog"
                            :shareType="shareDialogType"
                            @close="closeShareDialog"
                        ></share-dialog>
                        <v-icon-btn
                            color="medium-emphasis"
                            icon="mdi-download"
                            size="small"
                            @click="download_file(item)"
                        ></v-icon-btn>
                        <v-icon-btn
                            color="medium-emphasis"
                            icon="mdi-delete"
                            size="small"
                            @click="delete_file(item)"
                        ></v-icon-btn>
                        <v-icon-btn
                            color="medium-emphasis"
                            icon="mdi-share-outline"
                            size="small"
                            @click="openShareDialog(item, 'mine')"
                        ></v-icon-btn>
                    </template>

                    <template v-slot:top>
                        <v-toolbar flat>
                            <v-toolbar-title>欢迎来到New XES Pan</v-toolbar-title>
                            <v-btn
                                class="me-2"
                                prepend-icon="mdi-share"
                                text="添加分享"
                                border
                                @click="openShareDialog(null, 'others')"
                            ></v-btn>
                            <v-btn class="me-2" prepend-icon="mdi-plus" text="上传" border></v-btn>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-alert v-else> 加载中... </v-alert>
    </v-container>
</template>

<style scoped></style>
