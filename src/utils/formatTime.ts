export const formatTime = (date: Date) => {
    try {
        if (!(date instanceof Date) || isNaN(date.getTime())) {
            return '';
        }

        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        }).format(date);
    } catch (error) {
        console.error('Error formatting time:', error);
        return '';
    }
}; 