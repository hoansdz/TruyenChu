const Utils = {
    isoStringToReadableString: (isoString) => {
        return new Date(isoString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).replace('lúc', 'Lúc');
    }
};

export default Utils;