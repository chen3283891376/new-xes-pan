<script setup lang="ts">
import { ref, watch, type Ref } from 'vue';
const file: Ref<File | undefined> = ref();
const dialog = ref(false);
const progress = ref(0);

interface UploadParams {
    host: string;
    vpc_host: string;
    headers: {};
    cdn: string;
    key: string;
    url: string;
}

const _get_oss_upload_param = async (filename: string, md5: string): Promise<UploadParams> => {
    const res = await fetch(
        `/xes/api/assets/get_oss_upload_params?scene=offline_python_assets&filename=${filename}&md5=${md5}`,
    );
    const data = await res.json();
    return data.data;
};

watch(file, value => {
    console.log(value);
    if (value) {
        if (value.size > 1024 * 1024 * 1024) {
            alert('不支持上传大于1G的文件');
            file.value = undefined;
            return;
        }
        dialog.value = true;
    }
});
</script>

<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:default="{ isActive }">
                <v-card>
                    <v-card-title>上传文件</v-card-title>
                    <v-card-text>
                        <v-progress-linear :value="progress" />
                    </v-card-text>
                </v-card>
            </template>
        </v-dialog>
        <v-file-upload density="default" v-model="file" />
    </v-container>
</template>

<style scoped></style>
