// 核心云存储服务

const new_var = async ({ name, value }: { name: string, value: unknown }) => {
    const response = await fetch('/api/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            key: name,
            value: value
        })
    });
    const data = await response.json();
    return data;
}

const get_var = async (name: string) => {
    const response = await fetch(`/api/get?key=${name}`);
    const data = await response.json();
    return data;
}

const set_var = async (name: string, value: unknown, token: string) => {

}
