<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';
import SparkMD5 from 'spark-md5';
import { byteToSize } from '@/utils/converter';

interface UploadParam {
    host: string;
    vpc_host: string;
    headers: Record<string, string>;
    cdn: string;
    key: string;
    url: string;
}
const props = defineProps<{
    showDialog: boolean;
}>();

const selectedFile = ref<File | null>(null);
const progress = ref(0);
const uploadUrl = ref('');
const errorMsg = ref('');
const isUploading = computed(() => progress.value > 0 && progress.value < 100);
const emit = defineEmits<{
    finished: [{ name: string; size: string; link: string; time: string }];
}>();

const CHUNK_SIZE = 10 * 1024 * 1024;
const AUTHORIZATION = 'e7e380401dc9a31fce2117a60c99ba04';
const USER_AGENT =
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36 Edg/109.0.1518.61';

const calculateFileMD5 = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const spark = new SparkMD5.ArrayBuffer();
        const fileReader = new FileReader();
        let chunkIndex = 0;

        const loadNextChunk = () => {
            const start = chunkIndex * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            const chunk = file.slice(start, end);
            fileReader.readAsArrayBuffer(chunk);
        };

        fileReader.onload = e => {
            spark.append(e.target?.result as ArrayBuffer);
            chunkIndex++;

            progress.value = Math.floor(((chunkIndex * CHUNK_SIZE) / file.size) * 50);

            if (chunkIndex * CHUNK_SIZE < file.size) {
                loadNextChunk();
            } else {
                resolve(spark.end());
            }
        };

        fileReader.onerror = err => reject(`MD5计算失败：${(err as unknown as Error).message}`);
        loadNextChunk();
    });
};

const getOssUploadParams = async (filename: string, md5: string): Promise<UploadParam> => {
    try {
        const response = await fetch(
            `/xes/api/assets/get_oss_upload_params?scene=offline_python_assets&md5=${md5}&filename=${encodeURIComponent(filename)}`,
            {
                method: 'GET',
                headers: {
                    Authorization: AUTHORIZATION,
                    'User-Agent': USER_AGENT,
                    'Content-Type': 'application/json',
                },
            },
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`获取上传参数失败：${errorData.msg || response.statusText}`);
        }

        const data = await response.json();
        return data.data;
    } catch (err) {
        throw new Error(`接口请求失败：${(err as Error).message}`);
    }
};

const uploadFileToOss = async (file: File, params: UploadParam) => {
    return new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', params.host, true);

        Object.entries(params.headers).forEach(([key, value]) => {
            xhr.setRequestHeader(key, value);
        });
        xhr.upload.onprogress = e => {
            if (e.lengthComputable) {
                const uploadProgress = Math.floor((e.loaded / e.total) * 50);
                progress.value = 50 + uploadProgress;
            }
        };
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve();
            } else {
                reject(new Error(`上传失败：HTTP ${xhr.status} ${xhr.statusText}`));
            }
        };
        xhr.onerror = () => {
            reject(new Error(`网络错误：无法连接到OSS服务器`));
        };
        xhr.onabort = () => {
            reject(new Error(`上传已取消`));
        };
        xhr.send(file);
    });
};

const handleFileSelect = async () => {
    if (!selectedFile.value) return;

    const file = selectedFile.value;
    progress.value = 0;
    errorMsg.value = '';
    uploadUrl.value = '';

    try {
        const md5 = await calculateFileMD5(file);
        const uploadParams = await getOssUploadParams(file.name, md5);
        await uploadFileToOss(file, uploadParams);
        uploadUrl.value = uploadParams.url;

        setTimeout(() => {
            emit('finished', {
                name: file.name,
                size: byteToSize(file.size),
                link: uploadParams.url,
                time: new Date().toLocaleString(),
            });
        }, 3000);
    } catch (err) {
        errorMsg.value = (err as Error).message;
        progress.value = 0;
    } finally {
        selectedFile.value = null;
    }
};
</script>

<template>
    <v-dialog v-model="props.showDialog" width="1000px">
        <v-card>
            <v-card-text>
                <v-file-input
                    v-model="selectedFile"
                    label="选择文件"
                    accept="*"
                    @change="handleFileSelect"
                    :disabled="isUploading"
                    prepend-icon="mdi-cloud-upload"
                    density="compact"
                    class="mb-4"
                ></v-file-input>

                <v-progress-linear v-if="isUploading" :value="progress" color="success" height="8" rounded class="mb-4">
                </v-progress-linear>

                <v-alert
                    v-if="uploadUrl"
                    type="success"
                    density="compact"
                    closable
                    @close="uploadUrl = ''"
                    class="mb-4"
                >
                    <div class="d-flex align-center gap-2">
                        <span>上传成功！</span>
                    </div>
                    <v-textarea
                        v-model="uploadUrl"
                        readonly
                        density="compact"
                        rows="2"
                        class="mt-2"
                        style="resize: none"
                    ></v-textarea>
                </v-alert>

                <v-alert v-if="errorMsg" type="error" density="compact" closable @close="errorMsg = ''" class="mb-4">
                    <span>{{ errorMsg }}</span>
                </v-alert>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<style scoped></style>
