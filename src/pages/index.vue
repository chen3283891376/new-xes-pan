<script lang="ts" setup>
import { onMounted, ref, type VNodeRef } from 'vue';
import type { IFileData, IGetRes, IFile } from '@/interfaces/cloudpan';
import ShareDialog from '@/components/ShareDialog.vue';
import UploadDialog from '@/components/UploadDialog.vue';

// const userId = prompt('请输入您的用户（没有就瞎写一个，要记住，相当于密码，太简单了会被别人猜到（因此安全性不高））');
// const userId = localStorage.getItem('userId') || '123456';
let userId: unknown;
if (localStorage.getItem('userId')) {
    userId = localStorage.getItem('userId');
} else {
    userId = prompt('请输入您的用户（没有就瞎写一个，要记住，相当于密码，太简单了会被别人猜到（因此安全性不高））');
    if (userId) {
        localStorage.setItem('userId', userId as string);
    }
}
const token = ref('');
const files = ref([] as IFileData['files']);
const headers = ref([
    { title: '文件名', key: 'name' },
    { title: '大小', key: 'size' },
    { title: '创建时间', key: 'time' },
    { title: '操作', key: 'actions', sortable: false },
]);

const showDialog = ref(false);
const showUploadDialog = ref(false);
const shareDialogType = ref('mine');
const selectedFile = ref<IFile | null>(null);

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

function downloadFile(item: IFile) {
    fetch(item.link, {
        headers: new Headers({
            Origin: location.origin,
        }),
        mode: 'cors',
    })
        .then(res => {
            if (res.status == 200) {
                return res.blob();
            }
            throw new Error(`status: ${res.status}.`);
        })
        .then(blob => {
            download_file(blob, item.name);
        });
}
function download_file(blob: Blob, filename: string) {
    const a = document.createElement('a');
    a.download = filename;
    const blobUrl = URL.createObjectURL(blob);
    a.href = blobUrl;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(blobUrl);
}

async function delete_file(item: IFile) {
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

function openShareDialog(item: IFile | null, type: string) {
    if (item) {
        selectedFile.value = item;
    }
    shareDialogType.value = type;
    showDialog.value = true;
}

function closeShareDialog() {
    showDialog.value = false;
}

async function upload_finished(fileInfo: IFile | null) {
    showUploadDialog.value = false;
    if (fileInfo) {
        files.value.push(fileInfo);

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

onMounted(() => {
    fetch_pan_data();
});
</script>

<template>
    <v-container>
        <upload-dialog :showDialog="showUploadDialog" @finished="upload_finished"></upload-dialog>
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
                            @click="downloadFile(item)"
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
                            <v-btn
                                class="me-2"
                                prepend-icon="mdi-plus"
                                text="上传"
                                border
                                @click="showUploadDialog = true"
                            ></v-btn>
                        </v-toolbar>
                    </template>
                </v-data-table>
            </v-card-text>
        </v-card>
        <v-alert v-else> 加载中... </v-alert>
    </v-container>
</template>

<style scoped></style>
