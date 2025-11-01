function sizeToByte(size: string): number {
    const unit = size.slice(-2).toLowerCase();
    const value = parseFloat(size.slice(0, -2));
    switch (unit) {
        case 'KB':
            return value * 1024;
        case 'MB':
            return value * 1024 * 1024;
        case 'GB':
            return value * 1024 * 1024 * 1024;
        case 'TB':
            return value * 1024 * 1024;
        default:
            return value;
    }
}

function byteToSize(byte: number): string {
    if (byte < 1024) {
        return `${byte} B`;
    } else if (byte < 1024 * 1024) {
        return `${(byte / 1024).toFixed(2)} KB`;
    } else if (byte < 1024 * 1024 * 1024) {
        return `${(byte / (1024 * 1024)).toFixed(2)} MB`;
    } else if (byte < 1024 * 1024 * 1024 * 1024) {
        return `${(byte / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    } else {
        return `${(byte / (1024 * 1024)).toFixed(2)} TB`;
    }
}

export { sizeToByte, byteToSize };
